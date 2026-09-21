import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'wouter';

const navigation = [
  { label: 'Projects', href: '/projects' },
  { label: 'Team', href: '/team' },
  { label: 'Media', href: '/media' },
  { label: 'Resources', href: '/resources' },
];

export function SiteHeader({ light = false }: { light?: boolean }) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  return (
    <header className={`site-header ${light ? 'light' : ''}`}>
      <Link href="/" className="site-brand" data-testid="link-home">
        <span className="site-mark" aria-hidden="true" />
        <span className="site-wordmark">Convalt<br />Energy</span>
      </Link>
      <nav className={`site-nav ${open ? 'open' : ''}`} aria-label="Main navigation">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={location.startsWith(item.href) ? 'page' : undefined}
            data-testid={`link-nav-${item.label.toLowerCase()}`}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <Link href="/press" data-testid="link-nav-press" onClick={() => setOpen(false)}>Press</Link>
        <Link href="/contact" className="header-contact" data-testid="link-nav-contact" onClick={() => setOpen(false)}>
          Start a conversation <ArrowUpRight size={13} strokeWidth={1.5} />
        </Link>
      </nav>
      <button
        type="button"
        className="menu-toggle"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
        data-testid="button-toggle-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={21} strokeWidth={1.5} /> : <Menu size={21} strokeWidth={1.5} />}
      </button>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>Convalt Energy / New York + everywhere energy matters</span>
      <span>© {new Date().getFullYear()} Convalt Energy</span>
      <span className="site-footer-links">
        <Link href="/resources" data-testid="link-footer-resources">View our approach <ArrowUpRight size={12} /></Link>
        <a href="https://www.linkedin.com/company/convalt-energy/" target="_blank" rel="noreferrer" data-testid="link-footer-linkedin">LinkedIn <ArrowUpRight size={12} /></a>
        <Link href="/contact" data-testid="link-footer-contact">Contact <ArrowUpRight size={12} /></Link>
      </span>
    </footer>
  );
}
