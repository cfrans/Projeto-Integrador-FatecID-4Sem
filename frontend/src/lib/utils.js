import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function validarForcaSenha(senha) {
  if (!senha || senha.length < 6) return 'A senha deve ter no mínimo 6 caracteres.';
  if (!/[!@#$%^&*(),.?":{}|<>\-_+=\/[\]\\]/.test(senha)) return 'A senha deve conter pelo menos um caractere especial (ex: ! @ # $ %).';
  
  for (let i = 0; i < senha.length - 2; i++) {
    const c1 = senha.charCodeAt(i);
    const c2 = senha.charCodeAt(i + 1);
    const c3 = senha.charCodeAt(i + 2);
    if (c1 + 1 === c2 && c2 + 1 === c3) {
      return 'A senha não pode conter sequências crescentes de 3 caracteres (ex: 123, abc).';
    }
  }

  return null;
}
