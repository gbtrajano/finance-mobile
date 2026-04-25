"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get("username");
  const password = formData.get("password");

  const USUARIO_CORRETO = "gabriel";
  const SENHA_CORRETA = "amoajhey";

  if (username === USUARIO_CORRETO && password === SENHA_CORRETA) {
    const cookieStore = await cookies();

    cookieStore.set("auth_token", "sessao_valida", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    redirect("/");
  } else {
    return { error: "Usuário ou senha inválidos!" };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  redirect("/login");
}
