"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const EMAIL_CORRETO = "gabriel@teste.com";
  const SENHA_CORRETA = "admin123";

  if (email === EMAIL_CORRETO && password === SENHA_CORRETA) {
    const cookieStore = await cookies();

    cookieStore.set("auth_token", "sessao_valida", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    redirect("/");
  } else {
    return { error: "E-mail ou senha inválidos!" };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  redirect("/login");
}
