import Link from "next/link";
import SnowballIllustration from "@/components/SnowballIllustration";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-warm-50 to-white">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block bg-brand-100 text-brand-800 font-semibold px-4 py-1 rounded-full text-sm mb-4">
              You can do this 💪
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-brand-900 leading-tight">
              Pay off debt one small win at a time.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-brand-800/80">
              The Debt Snowball Method helps you knock out your smallest debts
              first — so you stay motivated and become debt free faster.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/calculator" className="btn-primary">
                Start my plan →
              </Link>
              <Link href="/education" className="btn-secondary">
                How does it work?
              </Link>
            </div>
            <p className="mt-4 text-sm text-brand-700/70">
              Free. No bank login. Your numbers stay private.
            </p>
          </div>
          <div className="flex justify-center">
            <SnowballIllustration />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-900">
          What is the Debt Snowball?
        </h2>
        <p className="text-center text-lg text-brand-800/80 mt-4 max-w-2xl mx-auto">
          In plain English: pay the <strong>smallest balance</strong> first while
          making minimum payments on the rest. When it’s gone, roll that money
          into the next debt. Your “snowball” grows bigger and bigger.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            {
              n: "1",
              t: "List your debts",
              d: "Write down every debt with its balance and minimum payment.",
            },
            {
              n: "2",
              t: "Pay smallest first",
              d: "Throw any extra money at the tiniest balance. Crush it.",
            },
            {
              n: "3",
              t: "Roll it forward",
              d: "When a debt is paid off, add that payment to the next one.",
            },
          ].map((s) => (
            <div key={s.n} className="card text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-brand-600 text-white text-xl font-bold flex items-center justify-center">
                {s.n}
              </div>
              <h3 className="mt-4 text-xl font-bold text-brand-900">{s.t}</h3>
              <p className="mt-2 text-brand-800/80">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why it works */}
      <section className="bg-brand-50">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-900">
              Why small wins matter
            </h2>
            <p className="mt-4 text-lg text-brand-800/80">
              Personal finance is 80% behavior. Paying off your smallest debt
              gives you a quick win — and that feeling keeps you going. It’s
              not just math. It’s momentum.
            </p>
            <ul className="mt-6 space-y-3 text-brand-800">
              <li className="flex gap-3"><span>✅</span> See real progress in weeks, not years</li>
              <li className="flex gap-3"><span>✅</span> Build a habit of crushing debts</li>
              <li className="flex gap-3"><span>✅</span> Free up cash to attack the next one</li>
            </ul>
            <Link href="/calculator" className="btn-primary mt-8 inline-flex">
              Build my snowball
            </Link>
          </div>
          <div className="card">
            <p className="text-sm uppercase tracking-wide text-brand-600 font-semibold">Example</p>
            <p className="mt-2 text-lg text-brand-900">
              Sara has 3 debts. She pays the $400 store card off in 2 months.
              Then she rolls that $50 payment into her $1,200 credit card.
              Then into her car loan. By month 18, she’s <strong>debt free</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-brand-900">
          Your first win is one click away.
        </h2>
        <p className="mt-4 text-lg text-brand-800/80">
          Try the free calculator. Takes about 2 minutes.
        </p>
        <Link href="/calculator" className="btn-primary mt-8 inline-flex text-xl">
          Start my plan →
        </Link>
      </section>
    </div>
  );
}
