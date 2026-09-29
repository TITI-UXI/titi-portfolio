import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import gsap from "gsap";
import { Magnetic } from "@/components/motion/Magnetic";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — TINA" },
      { name: "description", content: "Let's start a project together — get in touch with TINA for freelance and collaboration work." },
      { property: "og:title", content: "Contact — TINA" },
      { property: "og:description", content: "Let's start a project together — get in touch with TINA for freelance and collaboration work." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const FIELDS = [
  { name: "name", label: "What's your name?", placeholder: "John Doe *", required: true, type: "text" },
  { name: "email", label: "What's your email?", placeholder: "john@doe.com *", required: true, type: "email" },
  { name: "organization", label: "What's the name of your organization?", placeholder: "John & Doe ®", required: false, type: "text" },
  { name: "services", label: "What services are you looking for?", placeholder: "Web Design, Web Development ...", required: false, type: "text" },
] as const;

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/titi-uxi" },
  { label: "Telegram", href: "https://t.me/titi_uxi" },
  { label: "GitHub", href: "https://github.com/TITI_UXI" },
  { label: "LinkedIn", href: "https://linkedin.com/" },
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
  return <span className="tabular-nums">{time ? `${time} IRST` : "\u00a0"}</span>;
}

function SendButton({ label }: { label: string }) {
  const fillRef = useRef<HTMLSpanElement>(null);
  const place = (e: MouseEvent<HTMLButtonElement>, scale: number) => {
    const fill = fillRef.current;
    if (!fill) return;
    const r = e.currentTarget.getBoundingClientRect();
    gsap.set(fill, { left: e.clientX - r.left, top: e.clientY - r.top });
    gsap.to(fill, { scale, duration: 0.6, ease: "power3.out", overwrite: true });
  };
  return (
    <button
      type="submit"
      onMouseEnter={(e) => place(e, 1)}
      onMouseLeave={(e) => place(e, 0)}
      className="relative flex h-44 w-44 items-center justify-center overflow-hidden rounded-full bg-cta-slate text-lg font-medium text-hero-foreground md:h-52 md:w-52"
    >
      <span
        ref={fillRef}
        aria-hidden
        className="pointer-events-none absolute h-[300%] w-[300%] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-cta-accent"
      />
      <span className="relative">{label}</span>
    </button>
  );
}

const inputClass =
  "mt-3 w-full border-0 bg-transparent text-xl text-hero-foreground outline-none placeholder:text-surface-muted md:text-2xl";

function ContactPage() {
  const [sent, setSent] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const d = new FormData(event.currentTarget);
    const get = (k: string) => String(d.get(k) ?? "");
    const subject = encodeURIComponent(`Project inquiry from ${get("name")}`);
    const body = encodeURIComponent(
      `${get("message")}\n\nOrganization: ${get("organization")}\nServices: ${get("services")}\n\n— ${get("name")} (${get("email")})`,
    );
    window.location.href = `mailto:titi.uxui@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <main className="min-h-screen bg-hero text-hero-foreground">
      <div className="relative mx-auto max-w-7xl px-8 pb-24 pt-24 md:px-16 md:pt-32">
        <header className="flex items-start justify-between gap-8">
          <h1 className="max-w-3xl text-5xl font-normal leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
            Let's start a project together
          </h1>
          <div className="flex shrink-0 flex-col items-center">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border border-white/10 shadow-2xl md:h-32 md:w-32">
              <img
                src="/portrait.jpg"
                alt="Developer Portrait"
                className="pointer-events-none h-full w-full select-none object-cover object-[center_20%]"
              />
            </div>
            <span aria-hidden className="mt-6 text-3xl text-surface-soft">↘</span>
          </div>
        </header>

        <div className="mt-20 grid gap-16 lg:grid-cols-[3fr_2fr] lg:gap-0">
          <form onSubmit={submit} aria-label="Contact form" className="relative border-t border-white/10 pb-28">
            {FIELDS.map((f, i) => (
              <div key={f.name} className="flex gap-6 border-b border-white/10 py-7 md:gap-10 md:py-9">
                <span className="pt-1 text-sm text-surface-muted">0{i + 1}</span>
                <div className="flex-1">
                  <label htmlFor={f.name} className="text-xl md:text-2xl">{f.label}</label>
                  <input id={f.name} name={f.name} type={f.type} required={f.required} placeholder={f.placeholder} className={inputClass} />
                </div>
              </div>
            ))}
            <div className="flex gap-6 border-b border-white/10 py-7 md:gap-10 md:py-9">
              <span className="pt-1 text-sm text-surface-muted">05</span>
              <div className="flex-1">
                <label htmlFor="message" className="text-xl md:text-2xl">Your message</label>
                <textarea id="message" name="message" required rows={4} placeholder="Hello, can you help me with ... *" className={`${inputClass} resize-none`} />
              </div>
            </div>
            <div className="absolute bottom-28 right-4 z-10 translate-y-1/2 sm:right-12">
              <Magnetic strength={0.45}>
                <SendButton label={sent ? "Sent!" : "Send it!"} />
              </Magnetic>
            </div>
          </form>

          <aside className="space-y-12 lg:pl-20">
            <div>
              <p className="mb-3 text-xs uppercase tracking-widest text-surface-soft">Contact details</p>
              <ul className="space-y-2 text-lg">
                <li><a href="mailto:titi.uxui@gmail.com" className="transition-opacity hover:opacity-60">titi.uxui@gmail.com</a></li>
                <li><a href="https://t.me/titi_uxi" target="_blank" rel="noreferrer" className="transition-opacity hover:opacity-60">Message on Telegram</a></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs uppercase tracking-widest text-surface-soft">Location</p>
              <p className="text-lg">Rasht, Iran</p>
              <p className="mt-1 text-lg text-surface-soft">Local time <LocalTime /></p>
            </div>
            <div>
              <p className="mb-3 text-xs uppercase tracking-widest text-surface-soft">Socials</p>
              <ul className="space-y-2 text-lg">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" className="transition-opacity hover:opacity-60">{s.label}</a>
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
