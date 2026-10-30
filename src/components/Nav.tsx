export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 px-6 md:px-12">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-7xl items-center justify-between py-6 md:py-8"
      >
        <a
          href="#top"
          className="text-sm font-light tracking-[0.5em] text-mist outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-ice/70"
        >
          NEBULA
        </a>
        <a
          href="#universe"
          className="group relative text-xs uppercase tracking-[0.3em] text-dim outline-none transition-colors hover:text-ice focus-visible:ring-2 focus-visible:ring-ice/70"
        >
          Enter
          <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-ice transition-all duration-500 group-hover:w-full" />
        </a>
      </nav>
    </header>
  );
}

