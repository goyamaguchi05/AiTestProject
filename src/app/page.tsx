export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
      <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-10 shadow-2xl shadow-slate-950/30 backdrop-blur">
        <p className="mb-3 text-sm uppercase tracking-[0.28rem] text-cyan-400">Docker Dev Environment</p>
        <h1 className="text-4xl font-bold text-white sm:text-5xl">Next.js + TypeScript + Tailwind</h1>
        <p className="mt-5 max-w-xl text-lg text-slate-300">
          この環境は Docker 上で動く開発コンテナです。ソース変更はホストから監視され、即座に反映されます。
        </p>
      </div>
    </main>
  );
}
