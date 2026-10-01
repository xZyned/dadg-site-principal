"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="page-shell py-32" role="alert">
      <h1 className="text-2xl font-bold">
        Não foi possível carregar esta página
      </h1>
      <p className="my-4">Tente novamente em instantes.</p>
      <button
        className="rounded-xl bg-blue-700 px-5 py-3 text-white"
        onClick={reset}
      >
        Tentar novamente
      </button>
    </section>
  );
}
