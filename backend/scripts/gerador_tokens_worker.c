/*
 * Gerador de Tokens de Campanha -- Worker CLI (sem UI)
 *
 * Uso:
 *   ./gerador_tokens_worker <arquivo.csv> <id_campanha>
 *
 * Compilar no Windows (MinGW):
 *   gcc -Wall -O2 -o gerador_tokens_worker.exe gerador_tokens_worker.c
 *
 * Compilar no Linux:
 *   gcc -Wall -O2 -o gerador_tokens_worker gerador_tokens_worker.c -lpthread
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <ctype.h>

/* Detecta o sistema operacional para usar a API correta de threads */
#ifdef _WIN32
#include <windows.h>
#else
#ifndef _POSIX_C_SOURCE
#define _POSIX_C_SOURCE 200809L
#endif
#include <pthread.h>
#include <unistd.h>
#endif

/* -------------------------------------------------------
 * Constantes do programa
 * ------------------------------------------------------- */
#define TAM_NOME      64
#define TAM_EMAIL    128
#define TAM_DEPTO     64
#define TAM_TOKEN     64
#define CHAVE_SECRETA "ChaveSecreta"
#define ITERACOES     1

/* -------------------------------------------------------
 * Struct Usuario: armazena os dados de cada pessoa
 * ------------------------------------------------------- */
struct Usuario {
    int  matricula;
    char nome[TAM_NOME];
    char sobrenome[TAM_NOME];
    char email[TAM_EMAIL];
    char departamento[TAM_DEPTO];
    char token[TAM_TOKEN];
};

/* -------------------------------------------------------
 * Struct No: um no da lista encadeada.
 * ------------------------------------------------------- */
struct No {
    struct Usuario usuario;
    struct No     *proximo;
};

/* -------------------------------------------------------
 * Struct de argumentos para cada thread worker.
 * ------------------------------------------------------- */
struct ArgThread {
    struct No *inicio;
    int        quantidade;
    int        id_campanha;
};

/* =======================================================
 * FUNCOES DA LISTA ENCADEADA
 * ======================================================= */

void inserir_na_lista(struct No **cabeca, struct Usuario u)
{
    struct No *novo = (struct No *)malloc(sizeof(struct No));
    if (novo == NULL) {
        fprintf(stderr, "Erro: sem memoria!\n");
        exit(1);
    }
    novo->usuario = u;
    novo->proximo = NULL;

    if (*cabeca == NULL) {
        *cabeca = novo;
        return;
    }

    struct No *atual = *cabeca;
    while (atual->proximo != NULL) {
        atual = atual->proximo;
    }
    atual->proximo = novo;
}

void liberar_lista(struct No *cabeca)
{
    struct No *atual = cabeca;
    while (atual != NULL) {
        struct No *prox = atual->proximo;
        free(atual);
        atual = prox;
    }
}

/* =======================================================
 * LEITURA DO CSV
 * ======================================================= */
int ler_csv(struct No **cabeca, const char *nome_arquivo)
{
    FILE *arquivo = fopen(nome_arquivo, "r");
    if (arquivo == NULL) {
        fprintf(stderr, "ERRO: Nao foi possivel abrir '%s'\n", nome_arquivo);
        return 0;
    }

    char linha[512];
    int  total = 0;

    fgets(linha, sizeof(linha), arquivo); /* descarta o cabecalho */

    while (fgets(linha, sizeof(linha), arquivo)) {
        linha[strcspn(linha, "\r\n")] = '\0';
        if (strlen(linha) == 0) continue;

        struct Usuario u;
        memset(&u, 0, sizeof(u));

        char mat_str[16];
        int campos = sscanf(linha,
            "%15[^,],%63[^,],%127[^,],%63[^,\r\n]",
            mat_str, u.nome, u.email, u.departamento);

        if (campos < 4) continue;

        u.matricula = atoi(mat_str);
        inserir_na_lista(cabeca, u);
        total++;
    }

    fclose(arquivo);
    return total;
}

/* =======================================================
 * ALGORITMO DJB2
 * ======================================================= */
unsigned long long djb2(const char *str)
{
    unsigned long long hash = 5381;
    int c;
    while ((c = (unsigned char)*str++) != 0) {
        hash = ((hash << 5) + hash) ^ (unsigned long long)c;
    }
    return hash;
}

void gerar_token(struct Usuario *u, int id_campanha)
{
    char               base[512];
    char               buf[32];
    unsigned long long hash;
    int                i;

    snprintf(base, sizeof(base), "%d%s%s%d%s",
             u->matricula, u->email, u->departamento,
             id_campanha, CHAVE_SECRETA);

    hash = djb2(base);

    for (i = 0; i < ITERACOES; i++) {
        snprintf(buf, sizeof(buf), "%llu", hash);
        hash = djb2(buf);
    }

    snprintf(u->token, TAM_TOKEN, "%016llX", hash);
}

/* =======================================================
 * MODO MULTI-THREAD (paralelo)
 * ======================================================= */
#ifdef _WIN32
DWORD WINAPI thread_worker(LPVOID arg)
#else
void *thread_worker(void *arg)
#endif
{
    struct ArgThread *a     = (struct ArgThread *)arg;
    struct No        *atual = a->inicio;
    int               i;

    for (i = 0; i < a->quantidade && atual != NULL; i++) {
        gerar_token(&atual->usuario, a->id_campanha);
        atual = atual->proximo;
    }

#ifdef _WIN32
    return 0;
#else
    return NULL;
#endif
}

void processar_paralelo(struct No *cabeca, int total, int id_campanha)
{
    int nucleos, num_threads, por_thread, resto;
    int t, k;
    struct No        *cursor;
    struct ArgThread *args;

#ifdef _WIN32
    SYSTEM_INFO info;
    GetSystemInfo(&info);
    nucleos = (int)info.dwNumberOfProcessors;
#else
    nucleos = (int)sysconf(_SC_NPROCESSORS_ONLN);
    if (nucleos < 1) nucleos = 1;
#endif

    num_threads = (nucleos <= 2) ? nucleos : nucleos - 1;
    if (num_threads < 1) num_threads = 1;

    por_thread = total / num_threads;
    resto      = total % num_threads;

    args = (struct ArgThread *)calloc(num_threads, sizeof(struct ArgThread));

#ifdef _WIN32
    HANDLE *handles = (HANDLE *)calloc(num_threads, sizeof(HANDLE));
#else
    pthread_t *tids = (pthread_t *)calloc(num_threads, sizeof(pthread_t));
#endif

    cursor = cabeca;

    for (t = 0; t < num_threads; t++) {
        args[t].inicio      = cursor;
        args[t].quantidade  = por_thread + (t < resto ? 1 : 0);
        args[t].id_campanha = id_campanha;

        for (k = 0; k < args[t].quantidade && cursor != NULL; k++)
            cursor = cursor->proximo;

#ifdef _WIN32
        handles[t] = CreateThread(NULL, 0, thread_worker, &args[t], 0, NULL);
        if (handles[t] == NULL) {
            fprintf(stderr, "Erro ao criar thread %d\n", t);
            exit(1);
        }
#else
        if (pthread_create(&tids[t], NULL, thread_worker, &args[t]) != 0) {
            fprintf(stderr, "Erro ao criar thread %d\n", t);
            exit(1);
        }
#endif
    }

    /* Aguarda todas as threads terminarem */
#ifdef _WIN32
    WaitForMultipleObjects(num_threads, handles, TRUE, INFINITE);
    for (t = 0; t < num_threads; t++) CloseHandle(handles[t]);
    free(handles);
#else
    for (t = 0; t < num_threads; t++) pthread_join(tids[t], NULL);
    free(tids);
#endif

    free(args);
}

/* =======================================================
 * SALVAR CSV DE SAIDA
 * ======================================================= */
void salvar_csv(struct No *cabeca, int id_campanha)
{
    char       nome_arquivo[64];
    struct No *atual;

    snprintf(nome_arquivo, sizeof(nome_arquivo),
             "disparos_campanha_%d.csv", id_campanha);

    FILE *arquivo = fopen(nome_arquivo, "w");
    if (arquivo == NULL) {
        fprintf(stderr, "Erro ao criar arquivo de saida!\n");
        return;
    }

    fprintf(arquivo, "matricula,email,departamento,id_campanha,token_unico\n");

    atual = cabeca;
    while (atual != NULL) {
        fprintf(arquivo, "%d,%s,%s,%d,%s\n",
                atual->usuario.matricula,
                atual->usuario.email,
                atual->usuario.departamento,
                id_campanha,
                atual->usuario.token);
        atual = atual->proximo;
    }

    fclose(arquivo);
}

/* =======================================================
 * MAIN -- CLI Worker (sem menus, sem interacao)
 *
 * Uso: ./gerador_lotes_worker <arquivo.csv> <id_campanha>
 * ======================================================= */
int main(int argc, char *argv[])
{
    if (argc < 3) {
        fprintf(stderr, "Uso: %s <arquivo.csv> <id_campanha>\n", argv[0]);
        return 1;
    }

    const char *arquivo_csv = argv[1];
    int         id_campanha = atoi(argv[2]);

#ifdef _WIN32
    SetConsoleOutputCP(65001);
#endif

    struct No *lista = NULL;
    int        total = ler_csv(&lista, arquivo_csv);

    if (total == 0) {
        fprintf(stderr, "ERRO: nenhum usuario carregado de '%s'.\n",
                arquivo_csv);
        return 1;
    }

    processar_paralelo(lista, total, id_campanha);
    salvar_csv(lista, id_campanha);
    liberar_lista(lista);

    return 0;
}
