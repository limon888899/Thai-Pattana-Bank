const services = [
  {
    title: "Everyday Banking",
    icon: "💳",
    text: "Designed for daily life with secure savings, flexible payment tools, and personalized guidance for every stage of your financial journey.",
  },
  {
    title: "Business Growth",
    icon: "📈",
    text: "From working capital to treasury support, we help Thai businesses manage cash flow, invest with confidence, and expand responsibly.",
  },
  {
    title: "Wealth Advisory",
    icon: "🌱",
    text: "Private consultations and portfolio insight to protect capital, plan for the future, and create sustainable financial momentum.",
  },
];

const highlights = [
  "Institutional-grade security",
  "24/7 customer support",
  "Expert relationship banking",
  "Designed for modern Thailand",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Thai Pattana Global Commercial Bank PCL" className="h-10 w-10" />
            <div>
              <div className="font-display text-lg leading-tight text-slate-900">Thai Pattana Global</div>
              <div className="text-[9px] font-medium uppercase tracking-[0.16em] text-slate-500">Commercial Bank PCL</div>
            </div>
          </div>

          <div className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            <a href="#about" className="group transition hover:text-sky-900"><span aria-hidden="true" className="bank-icon mr-1">🏛️</span>About</a>
            <a href="#services" className="group transition hover:text-sky-900"><span aria-hidden="true" className="bank-icon mr-1">💼</span>Services</a>
            <a href="#security" className="group transition hover:text-sky-900"><span aria-hidden="true" className="bank-icon mr-1">🔒</span>Security</a>
            <a href="#insights" className="group transition hover:text-sky-900"><span aria-hidden="true" className="bank-icon mr-1">📊</span>Insights</a>
          </div>

          <div className="flex items-center gap-3">
            <a href="/login" className="group hidden rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 sm:inline-flex">
              <span aria-hidden="true" className="bank-icon mr-2">🔐</span>Member Login
            </a>
            <a href="/admin" className="group hidden rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 sm:inline-flex">
              <span aria-hidden="true" className="bank-icon mr-2">🛠️</span>Admin Access
            </a>
            <a href="#services" className="group rounded-full bg-[#0c2340] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#122d59]">
              <span aria-hidden="true" className="bank-icon mr-2">✦</span>Explore Services
            </a>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-[#f7f3eb]">
        <div className="absolute inset-0">
          <img
            src="/chao-phraya-skyline.jpg"
            alt="Bangkok skyline in the evening"
            className="bank-skyline h-full w-full object-cover opacity-35"
          />
        </div>
        <div className="bank-hero-overlay absolute inset-0 bg-gradient-to-r from-[#0c2340]/95 via-[#0c2340]/80 to-[#0c2340]/50" />

        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 md:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-28">
          <div className="max-w-xl">
            <span className="inline-flex rounded-full border border-[#d7b56d]/60 bg-[#d7b56d]/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f4d899]">
              Trusted in Thailand
            </span>
            <h1 className="mt-6 font-display text-4xl leading-tight text-white md:text-6xl">
              Banking designed for a brighter future.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-200">
              Thai Pattana Global Commercial Bank PCL helps individuals, families, and businesses grow with confidence through secure, modern financial services rooted in trust.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href="#services" className="group rounded-full bg-[#d7b56d] px-7 py-3.5 text-center text-sm font-semibold text-[#0c2340] transition hover:bg-[#e4c77d]">
                <span aria-hidden="true" className="bank-icon mr-2">💬</span>Open a conversation
              </a>
              <a href="#about" className="group rounded-full border border-white/30 bg-white/5 px-7 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-white/10">
                <span aria-hidden="true" className="bank-icon mr-2">📖</span>Learn more
              </a>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-sm">
            <div className="rounded-[24px] bg-white p-6 text-slate-900 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">Client advisory</p>
                  <h2 className="mt-2 font-display text-2xl text-[#0c2340]">Smart financial planning</h2>
                </div>
                <div className="rounded-full bg-[#f4ecd8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#0c2340]">
                  2026
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Portfolio value</span>
                    <span>+12.4%</span>
                  </div>
                  <div className="mt-3 font-display text-3xl text-[#0c2340]">฿2.84M</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-2xl bg-[#0c2340] p-4 text-white">
                    <p className="text-slate-300">Savings</p>
                    <p className="mt-2 font-display text-2xl text-[#f4d899]">฿480K</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-slate-500">Support</p>
                    <p className="mt-2 font-display text-2xl text-[#0c2340]">24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#f8fafc]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 py-8 text-center md:grid-cols-4 md:px-8">
          {[
            { value: "฿48B+", label: "Assets under guidance" },
            { value: "190K+", label: "Client relationships" },
            { value: "26", label: "Branches across Thailand" },
            { value: "99.9%", label: "Service reliability" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60">
              <div className="font-display text-3xl text-[#0c2340]">{item.value}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="mx-auto max-w-6xl px-6 py-24 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a67c2e]">About our approach</span>
            <h2 className="mt-4 font-display text-4xl text-[#0c2340]">A financial partner built on trust and long-term value.</h2>
          </div>
          <div className="space-y-5 text-lg leading-8 text-slate-600">
            <p>
              We bring together modern banking products with a deeply human approach — helping clients protect savings, move capital confidently, and plan for generations ahead.
            </p>
            <p>
              From personal accounts to tailored business advisory, Thai Pattana Global Commercial Bank PCL supports the ambition of a stronger, more connected Thailand.
            </p>
          </div>
        </div>
      </section>

      <section id="services" className="bg-[#0c2340] px-6 py-24 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d7b56d]">What we offer</span>
            <h2 className="mt-4 font-display text-4xl text-white">Banking services shaped around real life and long-term ambition.</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {services.map((service) => (
              <div key={service.title} className="rounded-[28px] border border-white/10 bg-white/5 p-7 text-white shadow-lg backdrop-blur-sm">
                <div aria-hidden="true" className="bank-icon mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d7b56d] text-lg font-bold text-[#0c2340]">{service.icon}</div>
                <h3 className="font-display text-2xl text-white">{service.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">{service.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="security" className="mx-auto max-w-6xl px-6 py-24 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a67c2e]">Security and trust</span>
            <h2 className="mt-4 font-display text-4xl text-[#0c2340]">Protected by modern controls and a human-first approach.</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {highlights.map((item, index) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium text-slate-700">
                  <span aria-hidden="true" className="bank-icon mr-2">{["🛡️", "☎️", "🤝", "🇹🇭"][index]}</span>{item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-[#f7f3eb] p-8 shadow-xl ring-1 ring-slate-200">
            <div className="rounded-[24px] bg-white p-6 shadow-md ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Risk oversight</span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">secure</span>
              </div>
              <div className="mt-6 font-display text-5xl text-[#0c2340]">99.97%</div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Continuous monitoring, proactive compliance, and secure digital infrastructure designed to maintain confidence at every touchpoint.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="insights" className="bg-slate-100 px-6 py-24 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a67c2e]">Insights</span>
            <h2 className="mt-4 font-display text-4xl text-[#0c2340]">Ideas that help you plan with confidence.</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              "How Thai households can build stronger financial resilience.",
              "What smarter treasury planning looks like for growing businesses.",
              "Why long-term planning matters more than short-term gains.",
            ].map((item) => (
              <article key={item} className="rounded-[28px] bg-white p-7 shadow-sm ring-1 ring-slate-200">
                <div className="mb-6 h-10 w-10 rounded-full bg-[#d7b56d]/20 text-lg leading-10 text-center text-[#0c2340]">→</div>
                <p className="text-lg leading-8 text-slate-700">{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="px-6 py-24 md:px-8">
        <div className="mx-auto max-w-4xl rounded-[32px] bg-[#0c2340] px-8 py-12 text-center text-white shadow-2xl md:px-12">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d7b56d]">Begin your banking journey</span>
          <h2 className="mt-4 font-display text-4xl text-white">Let’s shape a stronger financial future together.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">
            Speak with our team to learn how Thai Pattana Global Commercial Bank PCL can support your personal goals, your business, and your long-term plans.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a href="mailto:hello@thaipattana.example" className="rounded-full bg-[#d7b56d] px-7 py-3.5 text-sm font-semibold text-[#0c2340] transition hover:bg-[#e4c77d]">
              hello@thaipattana.example
            </a>
            <a href="tel:+6625550199" className="rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">
              +66 2 555 0199
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 px-6 py-12 text-slate-300 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Thai Pattana Global Commercial Bank PCL" className="h-9 w-9" />
            <div>
              <div className="font-display text-base text-white">Thai Pattana Global</div>
              <div className="text-[9px] uppercase tracking-[0.12em] text-slate-400">Commercial Bank PCL</div>
            </div>
          </div>
          <div className="text-sm text-slate-400">
            © 2026 Thai Pattana Global Commercial Bank PCL. Designed for a confident tomorrow.
          </div>
        </div>
      </footer>
    </main>
  );
}
