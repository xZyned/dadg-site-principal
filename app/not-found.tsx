import Link from "next/link";
export default function NotFound() {
  return (
    <section className="page-shell py-32">
      <h1 className="text-2xl font-bold">Página não encontrada</h1>
      <Link href="/" className="underline">
        Voltar ao início
      </Link>
    </section>
  );
}
