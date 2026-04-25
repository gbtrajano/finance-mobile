"use client";
import { loginAction } from "./actions";
import { useActionState, useEffect } from "react";

const LoginPage = () => {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  // Initialize session flag so the Home page knows this tab is "authorized"
  useEffect(() => {
    sessionStorage.setItem("tab_session_active", "true");
  }, []);

  return (
    <div className="min-h-screen bg-[#090b11] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#11141d] rounded-2xl p-8 shadow-2xl border border-gray-800">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">LOGIN</h1>
          {state?.error && (
            <p className="text-red-500 text-sm font-bold animate-pulse">
              {state.error}
            </p>
          )}
        </div>

        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2">
              Usuário
            </label>
            <input
              name="username"
              type="text"
              required
              placeholder="Digite seu usuário"
              className="w-full bg-[#090b11] border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2">
              Senha
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-[#090b11] border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-500 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all hover:cursor-pointer"
          >
            {isPending ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
