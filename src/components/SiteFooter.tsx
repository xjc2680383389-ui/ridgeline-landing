import { CERTS, FOOTER_GROUPS } from '../data/site';

export function SiteFooter() {
  return (
    <footer className="site-footer on-dark">
      <div className="hazard" aria-hidden="true" />
      <div className="container">
        <div className="site-footer__brand">
          <div>
            <p className="wordmark wordmark--footer">
              <span className="wordmark__latin">Ridgeline</span>
              <span className="wordmark__zh">脊线 · 实测装备</span>
            </p>
            <p className="site-footer__statement t-lede">
              成都 · 科园南路 9 号 · 材料室对外开放参观，每月最后一个周三需要提前预约。
            </p>
          </div>
          <a className="btn btn--ghost site-footer__cta" href="#preorder">
            预订 2026 秋季线
          </a>
        </div>

        <div className="tick-rule" aria-hidden="true" />

        <div className="site-footer__groups">
          {FOOTER_GROUPS.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="site-footer__group-title">{group.title}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={link}>
                    <a className="site-footer__link" href="#catalog">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="site-footer__bottom">
          <ul className="certs" role="list">
            {CERTS.map((cert) => (
              <li key={cert} className="certs__item t-data">
                {cert}
              </li>
            ))}
          </ul>
          <p className="site-footer__legal t-micro">
            © 2026 脊线户外运动用品（成都）有限公司 · 本页全部数值为自有材料室实测，方法标准号见实测区 ·
            蜀 ICP 备 2011042713 号
          </p>
        </div>
      </div>
    </footer>
  );
}
