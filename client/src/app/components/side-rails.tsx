import { useEffect, useState } from "react";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import { apiClient } from "@/utils/api";

interface Social {
  github?: string;
  linkedin?: string;
  twitter?: string;
}

// Fixed rail of social icons, pinned to the left edge on large screens.
export function SocialRail() {
  const [social, setSocial] = useState<Social>({});
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    apiClient
      .get("/profile")
      .then((r) => {
        setSocial(r.data.profile?.socialLinks ?? {});
        setEmail(r.data.profile?.email ?? "");
      })
      .catch(() => {});
  }, []);

  const links = [
    social.github && { href: social.github, icon: Github, label: "GitHub" },
    social.linkedin && { href: social.linkedin, icon: Linkedin, label: "LinkedIn" },
    social.twitter && { href: social.twitter, icon: Twitter, label: "Twitter" },
    email && { href: `mailto:${email}`, icon: Mail, label: "Email" },
  ].filter(Boolean) as { href: string; icon: typeof Github; label: string }[];

  if (links.length === 0) return null;

  return (
    <div className="hidden lg:flex fixed bottom-0 left-6 xl:left-10 z-40 flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-5">
        {links.map(({ href, icon: Icon, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="text-muted-foreground hover:text-primary hover:-translate-y-1 transition-all"
          >
            <Icon size={18} />
          </a>
        ))}
      </div>
      <div className="rail-line" />
    </div>
  );
}

// Fixed rail with the contact email rotated vertically, pinned to the right edge.
export function EmailRail() {
  const [email, setEmail] = useState<string>("abhishekdhakal1826@gmail.com");

  useEffect(() => {
    apiClient
      .get("/profile")
      .then((r) => setEmail(r.data.profile?.email ?? email))
      .catch(() => {});
  }, []);

  return (
    <div className="hidden lg:flex fixed bottom-0 right-6 xl:right-10 z-40 flex-col items-center gap-6">
      <a
        href={`mailto:${email}`}
        className="text-muted-foreground hover:text-primary transition-colors font-mono text-xs tracking-wide"
        style={{ writingMode: "vertical-rl" }}
      >
        {email}
      </a>
      <div className="rail-line" />
    </div>
  );
}
