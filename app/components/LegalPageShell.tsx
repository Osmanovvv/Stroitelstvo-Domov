import Image from "next/image";
import Link from "next/link";
import SiteFooter from "./SiteFooter";

type LegalPageShellProps = {
  title: string;
  updated: string;
  children: React.ReactNode;
};

// Каркас юридических страниц (/privacy, /consent): минимальная шапка с возвратом
// на главную, контентная колонка и общий футер сайта.
export default function LegalPageShell({ title, updated, children }: LegalPageShellProps) {
  return (
    <>
      <main className="legal-page">
        <header className="legal-header">
          <div className="container legal-header-inner">
            <Link className="brand" href="/" aria-label="На главную">
              <span className="brand-logo-shell" aria-hidden="true">
                <Image
                  className="brand-logo"
                  src="/logo/svm-logo-mark-cutout.png"
                  alt=""
                  width={96}
                  height={96}
                />
              </span>
              <span>
                <strong>Кирпичные дома</strong>
                <small>Краснодар +70 км</small>
              </span>
            </Link>
            <Link className="legal-back" href="/">
              На главную
            </Link>
          </div>
        </header>
        <article className="legal-content">
          <h1>{title}</h1>
          <p className="legal-updated">Редакция от {updated}</p>
          {children}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
