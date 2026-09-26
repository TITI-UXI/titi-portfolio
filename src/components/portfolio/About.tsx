const stats = [
  { value: "6+", label: "Years of experience" },
  { value: "40+", label: "Projects shipped" },
  { value: "12", label: "Countries worked with" },
];

export function About() {
  return (
    <section id="about" className="bg-inverse px-4 py-28 text-inverse-foreground sm:px-6">
      <div className="mx-auto w-full max-w-7xl">
        <p className="eyebrow mb-10 text-inverse-muted">About</p>

        <p className="max-w-4xl text-2xl font-medium leading-snug tracking-tight sm:text-4xl">
          I'm Iman Amanin — a developer who treats code like a craft. I build fast,
          precise interfaces for studios and founders who care about the last
          5%: the easing curve, the kerning, the detail nobody names but
          everybody feels.
        </p>

        <dl className="mt-20 grid grid-cols-1 gap-px border-t border-inverse-border sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border-b border-inverse-border py-8 sm:pr-8"
            >
              <dt className="eyebrow text-inverse-muted">{stat.label}</dt>
              <dd className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
