import { useEffect, useState } from 'react';
import { NAV } from '../data/site';
import { useModal } from '../hooks/useModal';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { usePreorder } from '../state/PreorderContext';

const NAV_IDS = NAV.map((item) => item.id);

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useScrollSpy(NAV_IDS);
  const { units } = usePreorder();
  const panelRef = useModal<HTMLDivElement>(menuOpen, () => setMenuOpen(false));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const mq = window.matchMedia('(min-width: 901px)');
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [menuOpen]);

  return (
    <header className="site-header" data-scrolled={scrolled || undefined}>
      <div className="site-header__inner container">
        <a className="wordmark" href="#top" aria-label="脊线 RIDGELINE 首页">
          <span className="wordmark__latin">Ridgeline</span>
          <span className="wordmark__zh">脊线 · 实测装备</span>
        </a>

        <nav className="site-nav" aria-label="主导航">
          <ul>
            {NAV.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="site-nav__link"
                  data-active={active === item.id || undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <a className="btn btn--sm preorder-cta" href="#preorder">
            <span>预订</span>
            {units > 0 && (
              <span className="preorder-cta__count t-data" aria-label={`清单 ${units} 件`}>
                {units}
              </span>
            )}
          </a>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? '关闭目录' : '打开目录'}</span>
            <span className="nav-toggle__bars" aria-hidden="true" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="site-menu" id="site-menu" ref={panelRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label="站点目录">
          <div className="hazard" aria-hidden="true" />
          <nav aria-label="移动端导航">
            <ul>
              {NAV.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setMenuOpen(false)}
                    data-active={active === item.id || undefined}
                  >
                    <span className="site-menu__label">{item.label}</span>
                    <span className="site-menu__arrow" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <p className="site-menu__note">
            每个卖点都标注测试方法与实测值。写不出方法的，我们就不写。
          </p>
        </div>
      )}
    </header>
  );
}
