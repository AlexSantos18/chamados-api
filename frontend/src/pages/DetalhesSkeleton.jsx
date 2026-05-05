import React from 'react';

const DetalhesSkeleton = () => {
  return (
    <div className="px-1 py-4 md:py-5">
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">
        <div className="h-12 w-44 rounded-2xl bg-stone-200/70 dark:bg-white/10" />

        <section className="surface-card rounded-3xl p-6 md:p-8 dark:bg-slate-900 dark:border dark:border-white/10">
          <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr] xl:items-center">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-2xl bg-stone-200/80 dark:bg-white/10" />
              <div className="flex-1">
                <div className="h-4 w-32 rounded bg-stone-200/80 dark:bg-white/10" />
                <div className="mt-4 h-10 w-3/4 rounded bg-stone-200/80 dark:bg-white/10" />
                <div className="mt-4 flex gap-3">
                  <div className="h-7 w-24 rounded-full bg-stone-200/80 dark:bg-white/10" />
                  <div className="h-7 w-32 rounded-full bg-stone-200/80 dark:bg-white/10" />
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 rounded-2xl bg-stone-200/60 dark:bg-white/10" />
              ))}
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
          <div className="space-y-6"> {/* Adicionado dark mode para os skeletons */}
            <div className="surface-card h-36 rounded-3xl dark:bg-slate-900 dark:border dark:border-white/10" />
            <div className="surface-card h-80 rounded-3xl dark:bg-slate-900 dark:border dark:border-white/10" />
            <div className="surface-card h-72 rounded-3xl dark:bg-slate-900 dark:border dark:border-white/10" />
          </div>
          <div className="space-y-6"> {/* Adicionado dark mode para os skeletons */}
            <div className="surface-card h-36 rounded-3xl dark:bg-slate-900 dark:border dark:border-white/10" />
            <div className="surface-card h-44 rounded-3xl dark:bg-slate-900 dark:border dark:border-white/10" />
            <div className="surface-card h-36 rounded-3xl dark:bg-slate-900 dark:border dark:border-white/10" />
            <div className="surface-card h-40 rounded-3xl dark:bg-slate-900 dark:border dark:border-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalhesSkeleton;
