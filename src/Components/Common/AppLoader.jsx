const AppLoader = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 via-white to-sky-50 px-6">
      <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-blue-200/50 blur-3xl" />

      <div className="relative w-full max-w-sm rounded-3xl border border-white/70 bg-white/85 p-8 shadow-[0_20px_70px_rgba(2,132,199,0.16)] backdrop-blur">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-sky-50">
          <img
            src="/ttm-logo.png"
            alt="TTM Painting logo"
            className="h-12 w-12 object-contain"
          />
        </div>

        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-800">Preparing your workspace</h2>
          <p className="mt-1 text-sm text-slate-500">Please wait a moment...</p>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-sky-100 border-t-sky-500" />
        </div>

        <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-sky-400" />
        </div>
      </div>
    </div>
  );
};

export default AppLoader;
