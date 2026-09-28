import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — TINA" },
      { name: "description", content: "Get in touch with TINA for freelance and collaboration projects." },
      { property: "og:title", content: "Contact — TINA" },
      { property: "og:description", content: "Get in touch with TINA for freelance and collaboration projects." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const DIRECT_LINKS = [
  { label: "Email", value: "titi.uxui@gmail.com", href: "mailto:titi.uxui@gmail.com" },
  { label: "WhatsApp", value: "titiuxi", href: "https://wa.me/" },
  { label: "Telegram", value: "@titi-uxi", href: "https://t.me/titi_uxi" },
  { label: "Instagram", value: "@titi-uxi", href: "https://instagram.com/titi-uxi" },
];

function LocalTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Tehran",
      }).format(new Date());
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{time || "\u00a0"}</span>;
}

function ContactPage() {
  const [sent, setSent] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");
    const subject = encodeURIComponent(`Project inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:titi.uxui@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <main className="min-h-screen bg-canvas px-4 pb-32 pt-32 text-foreground sm:px-6 sm:pt-40">
      <div className="mx-auto w-full max-w-7xl">
        <p className="eyebrow text-ink-soft">Contact</p>
        <h1 className="display-xl mt-6 max-w-5xl">Let's start a conversation</h1>

        <div className="mt-20 grid gap-20 lg:grid-cols-[1.4fr_1fr]">
          <form onSubmit={submit} className="space-y-10" aria-label="Contact form">
            <div>
              <label htmlFor="name" className="eyebrow text-ink-soft">
                Your name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Jane Doe"
                className="mt-3 w-full border-b border-border bg-transparent pb-3 text-xl outline-none transition-colors placeholder:text-ink-soft/50 focus:border-foreground"
              />
            </div>
            <div>
              <label htmlFor="email" className="eyebrow text-ink-soft">
                Your email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="jane@studio.com"
                className="mt-3 w-full border-b border-border bg-transparent pb-3 text-xl outline-none transition-colors placeholder:text-ink-soft/50 focus:border-foreground"
              />
            </div>
            <div>
              <label htmlFor="message" className="eyebrow text-ink-soft">
                About the project
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                placeholder="Tell me what you're building…"
                className="mt-3 w-full resize-none border-b border-border bg-transparent pb-3 text-xl outline-none transition-colors placeholder:text-ink-soft/50 focus:border-foreground"
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-foreground px-10 py-4 text-sm font-medium text-canvas transition-opacity hover:opacity-80"
            >
              {sent ? "Opening your mail app…" : "Send message"}
            </button>
          </form>

          <aside className="space-y-12">
            <div>
              <p className="eyebrow mb-3 text-ink-soft">Local time</p>
              <p className="text-2xl font-medium tabular-nums">
                <LocalTime />
              </p>
              <p className="mt-1 text-sm text-ink-soft">Rasht, Iran (IRST)</p>
            </div>
            <div>
              <p className="eyebrow mb-4 text-ink-soft">Reach me directly</p>
              <ul className="space-y-4">
                {DIRECT_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noreferrer"
                      className="group flex items-baseline justify-between border-b border-border pb-3 transition-opacity hover:opacity-60"
                    >
                      <span className="text-sm text-ink-soft">{link.label}</span>
                      <span className="text-lg font-medium">{link.value}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
