import { buildContactLinks, sectionIntros } from "../../content/landing";
import { getSettings } from "../../lib/queries";
import { renderAccent } from "../../lib/accent";
import { sectionBgStyle } from "../../lib/sectionBg";
import ContactIcon from "../ContactIcon";
import ContactsForm from "../ContactsForm";
import WorkStatus from "../WorkStatus";

export default async function ContactsSection() {
  const settings = await getSettings();
  const contactLinks = buildContactLinks(settings);
  const d = sectionIntros.contacts;
  const bg = settings.contacts_bg_image;

  return (
    <section className="section contacts-section" id="contacts" style={sectionBgStyle(bg)}>
      <div className="container contacts-layout">
        <div>
          <span className="eyebrow">{settings.contacts_eyebrow || d.eyebrow}</span>
          <h2>{renderAccent(settings.contacts_title || d.title)}</h2>
          <p>{settings.contacts_subtitle || d.subtitle}</p>
          <div className="contact-status-card">
            <WorkStatus showHours workStart={settings.work_start} workEnd={settings.work_end} />
          </div>
          <div className="contact-actions">
            {contactLinks.map((link) => (
              <a
                href={link.href}
                key={link.label}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
              >
                <ContactIcon link={link} size={18} />
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <ContactsForm />
      </div>
    </section>
  );
}
