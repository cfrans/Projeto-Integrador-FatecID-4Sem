const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request(path, { method = "GET", body, auth = true, headers = {} } = {}) {
  const finalHeaders = { ...headers };

  if (body !== undefined && !(body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const fetchOptions = {
    method,
    body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  };

  // Só adiciona headers se não for FormData (FormData precisa do navegador definir Content-Type)
  if (!(body instanceof FormData)) {
    fetchOptions.headers = finalHeaders;
  } else {
    // Para FormData, adiciona apenas Authorization
    if (finalHeaders.Authorization) {
      fetchOptions.headers = { Authorization: finalHeaders.Authorization };
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, fetchOptions);

  if (res.status === 204) return null;

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) {
    let message = (data && typeof data === "object" && data.erro) || `Erro HTTP ${res.status}`;
    
    // Tratamento para Token Expirado ou Inválido (Erro 500 do JWT gerado pelo Spring sem filtro)
    if (res.status === 500 && typeof data === "object" && typeof data.message === "string" && data.message.includes("JWT expired")) {
      message = "Sua sessão expirou. Por favor, faça login novamente.";
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      window.location.href = "/";
    }

    throw new ApiError(message, res.status, data);
  }

  return data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};
