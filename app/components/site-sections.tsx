import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  aside?: ReactNode;
  className?: string;
  titleClassName?: string;
  useGradientTitle?: boolean;
};

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  aside,
  className,
  titleClassName,
  useGradientTitle = true,
}: PageHeroProps) {
  return (
    <section className={cn("page-shell", className)}>
      <div className="glass-panel surface-outline relative overflow-hidden rounded-[32px] border border-white/60 px-6 py-8 sm:px-10 sm:py-12 dark:border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,143,214,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(9,66,125,0.12),transparent_30%)]" />
        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:items-center">
          <div>
            <span className="section-eyebrow">{eyebrow}</span>
            <h1 className={cn("section-title max-w-4xl antialiased leading-[1.1] pb-[0.14em]", titleClassName)}>
              {useGradientTitle ? (
                <span className="relative block">
                  <span className="block">{title}</span>
                  <span
                    aria-hidden="true"
                    className="brand-gradient-text brand-gradient-overlay pointer-events-none absolute inset-x-0 top-0 -bottom-[0.22em] block dark:hidden"
                  >
                    {title}
                  </span>
                </span>
              ) : (
                title
              )}
            </h1>
            <p className="section-subtitle mt-5 max-w-3xl">{description}</p>
            {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
          </div>
          {aside ? <div className="relative">{aside}</div> : null}
        </div>
      </div>
    </section>
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow ? <span className="section-eyebrow">{eyebrow}</span> : null}
      <h2 className="section-title !text-3xl sm:!text-4xl lg:!text-5xl">{title}</h2>
      {description ? <p className="section-subtitle mt-4">{description}</p> : null}
    </div>
  );
}

type InfoCardProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
};

export function InfoCard({ title, description, children, className }: InfoCardProps) {
  return (
    <article
      className={cn(
        "glass-panel surface-outline relative overflow-hidden rounded-[28px] border border-white/70 p-6 sm:p-7 dark:border-white/10",
        className
      )}
    >
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(9,66,125,0.28)] to-transparent" />
      <h3 className="text-lg font-semibold text-slate-950 sm:text-xl dark:text-slate-50">{title}</h3>
      {description ? <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300">{description}</p> : null}
      {children ? <div className="mt-5">{children}</div> : null}
    </article>
  );
}

type StatStripProps = {
  items: Array<{
    label: string;
    value: string;
  }>;
  className?: string;
};

export function StatStrip({ items, className }: StatStripProps) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-3", className)}>
      {items.map((item) => (
        <div
          key={`${item.label}-${item.value}`}
          className="rounded-[24px] border border-white/70 bg-white/78 px-5 py-4 shadow-[0_18px_40px_rgba(7,48,89,0.08)] dark:border-white/10 dark:bg-slate-900/72"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{item.label}</p>
          <p className="mt-2 text-base font-semibold text-slate-950 sm:text-lg dark:text-white">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
