import Link from "next/link";
import { buildLegalInfo } from "../content/landing";
import { getSettings } from "../lib/queries";

export default async function SiteFooter() {
  const settings = await getSettings();
  const legal = buildLegalInfo(settings);
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <div className="site-footer-info">
          <span>
            © {year} {legal.operatorName}
          </span>
          <small>
            ИНН: {legal.inn} · ОГРНИП: {legal.ogrn}
          </small>
        </div>
        <nav className="site-footer-links" aria-label="Юридическая информация">
          <Link href="/privacy">Политика обработки персональных данных</Link>
          <Link href="/consent">Согласие на обработку персональных данных</Link>
        </nav>
      </div>
    </footer>
  );
}
