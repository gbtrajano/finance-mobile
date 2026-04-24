"use client";
import { loginAction } from "./actions";
import { useActionState } from "react";

const LoginPage = () => {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen bg-[#090b11] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#11141d] rounded-2xl p-8 shadow-2xl border border-gray-800">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Bem-vindo de volta</h1>
          {state?.error && (
            <p className="text-red-500 text-sm font-bold animate-pulse">
              {state.error}
            </p>
          )}
        </div>

        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2">
              E-mail
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="seu@email.com"
              className="w-full bg-[#090b11] border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:border-[#00d084] transition-colors"
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
              className="w-full bg-[#090b11] border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:border-[#00d084] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#00d084] hover:bg-[#00b372] disabled:opacity-50 disabled:cursor-not-allowed text-[#090b11] font-bold py-3 rounded-lg transition-all"
          >
            {isPending ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
