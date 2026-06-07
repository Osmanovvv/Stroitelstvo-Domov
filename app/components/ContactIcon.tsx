import Image from "next/image";
import type { ContactLink } from "../content/landing";

type ContactIconProps = {
  link: ContactLink;
  size: number;
};

export default function ContactIcon({ link, size }: ContactIconProps) {
  if (link.icon) {
    const Icon = link.icon;
    return <Icon size={size} />;
  }

  if (link.logo) {
    return (
      <Image
        className="social-logo"
        src={link.logo}
        alt=""
        width={size}
        height={size}
        loading="eager"
        unoptimized
        aria-hidden="true"
      />
    );
  }

  return null;
}
