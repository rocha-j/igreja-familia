import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { navigation } from '../../data/navigation';
import { useActiveSection } from '../../hooks/useActiveSection';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import type { Theme } from '../../hooks/useTheme';
import logoDark from '../../assets/logoDark.png';
import logoLight from '../../assets/logoLightIcon.png';
import { withBase } from '../../utils/url';
import './Header.css';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
}

function sectionIdFromHref(href: string) {
  return href.split('#')[1] ?? '';
}

const NAV_SECTION_IDS = navigation.map((item) => sectionIdFromHref(item.href));

export function Header({ theme, onToggleTheme }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeId = useActiveSection(NAV_SECTION_IDS);
  const isHome = useLocation().pathname === '/';

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Over the Hero photo the header is transparent and always sits on a dark image,
  // so it forces the dark treatment regardless of the site theme until scrolled.
  // Other pages have no photo hero, so the header always uses its solid, theme-following look there.
  const solid = scrolled || !isHome;
  const showLightMark = theme === 'light' && solid;

  return (
    <header className={`header ${solid ? 'is-scrolled' : ''}`}>
      <div className="container header__inner">
        <a href={withBase('/#hero')} className="header__logo">
          <img
            src={showLightMark ? logoLight : logoDark}
            alt="Igreja Família"
            className="header__logo-mark"
          />
          Igreja Família
        </a>

        <nav className="header__nav" aria-label="Navegação principal">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={withBase(item.href)}
              className={`header__link link-underline ${sectionIdFromHref(item.href) === activeId ? 'is-active' : ''}`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header__actions">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            type="button"
            className={`header__burger ${menuOpen ? 'is-open' : ''}`}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`header__mobile-menu ${menuOpen ? 'is-open' : ''}`}>
        <nav aria-label="Navegação mobile">
          {navigation.map((item, i) => (
            <a
              key={item.href}
              href={withBase(item.href)}
              style={{ transitionDelay: `${i * 40}ms` }}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
