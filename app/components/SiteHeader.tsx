import Link from "next/link";

export function SiteHeader({ inverse = false }: { inverse?: boolean }) {
  return (
    <header className={`site-header shell ${inverse ? "site-header-inverse" : ""}`}>
      <Link className="brand" href="/" aria-label="College by College home">
        <span className="brand-cluster" aria-hidden="true"><i /><i /><i /></span>
        <span className="brand-wordmark">College <i>by</i> College</span>
      </Link>
      <nav aria-label="Primary navigation">
        <Link href="/#notebook">Notebook</Link>
        <Link href="/#explore">Explore</Link>
        <Link href="/#findings">Findings</Link>
        <Link href="/about">About the project</Link>
      </nav>
    </header>
  );
}
