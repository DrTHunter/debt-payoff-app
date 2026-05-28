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
              Two proven strategies — one free calculator 💪
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-brand-900 leading-tight">
              Crush your debt with Snowball <span className="text-brand-600">or</span> Avalanche.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-brand-800/80">
              Pick the strategy that fits your personality — pay the{" "}
              <strong>smallest balance first</strong> for quick wins, or attack
              the <strong>highest interest rate first</strong> to save the most money.
              Our calculator runs both in seconds.
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

      {/* Side-by-side method comparison */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-900">
          Two methods. One goal: debt freedom.
        </h2>
        <p className="text-center text-lg text-brand-800/80 mt-4 max-w-2xl mx-auto">
          Both strategies use the same "roll-over" principle — when a debt is paid off,
          that payment gets thrown at the next one. The only difference is the <em>order</em>.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {/* Snowball */}
          <div className="card border-2 border-brand-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">❄️</span>
              <h3 className="text-2xl font-extrabold text-brand-900">Debt Snowball</h3>
            </div>
            <p className="text-brand-800/80 mb-6">
              Pay off debts <strong>smallest balance first</strong>. The quick wins build
              momentum and keep you motivated.
            </p>
            <ol className="space-y-3 text-brand-800">
              {[
                "List all debts from smallest to largest balance.",
                "Make minimum payments on everything except the smallest.",
                "Throw every extra dollar at the smallest debt.",
                "Once it is gone, roll that full payment into the next one.",
              ].map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
            <div className="mt-6 bg-brand-50 rounded-xl p-4">
              <p className="text-sm font-semibold text-brand-700 uppercase tracking-wide">Best for</p>
              <p className="mt-1 text-brand-900">People who need motivation and visible progress to stay on track.</p>
            </div>
          </div>

          {/* Avalanche */}
          <div className="card border-2 border-amber-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🏔️</span>
              <h3 className="text-2xl font-extrabold text-brand-900">Debt Avalanche</h3>
            </div>
            <p className="text-brand-800/80 mb-6">
              Pay off debts <strong>highest interest rate first</strong>. This is the
              mathematically optimal path — you pay the least interest overall.
            </p>
            <ol className="space-y-3 text-brand-800">
              {[
                "List all debts from highest to lowest interest rate.",
                "Make minimum payments on everything except the highest-rate debt.",
                "Throw every extra dollar at the highest-rate debt.",
                "Once it is gone, roll that full payment into the next one.",
              ].map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
            <div className="mt-6 bg-amber-50 rounded-xl p-4">
              <p className="text-sm font-semibold text-amber-700 uppercase tracking-wide">Best for</p>
              <p className="mt-1 text-brand-900">People who are disciplined and want to minimize the total interest paid.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick comparison table */}
      <section className="bg-brand-50">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-900 mb-10">
            Snowball vs. Avalanche at a glance
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-brand-800">
              <thead>
                <tr className="border-b-2 border-brand-200">
                  <th className="py-3 pr-6 font-semibold text-brand-700 w-1/3"></th>
                  <th className="py-3 pr-6 font-bold text-brand-900 text-center">❄️ Snowball</th>
                  <th className="py-3 font-bold text-brand-900 text-center">🏔️ Avalanche</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100">
                {[
                  ["Payoff order", "Smallest balance first", "Highest rate first"],
                  ["Interest saved", "Good", "Best — saves the most"],
                  ["Motivation boost", "High — quick early wins", "Moderate — bigger debts take longer"],
                  ["Time to first payoff", "Fastest", "Depends on your debts"],
                  ["Best if you…", "Need momentum to stay motivated", "Are disciplined and want max savings"],
                ].map(([label, snowball, avalanche]) => (
                  <tr key={label}>
                    <td className="py-4 pr-6 font-semibold text-brand-700">{label}</td>
                    <td className="py-4 pr-6 text-center">{snowball}</td>
                    <td className="py-4 text-center">{avalanche}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-brand-700/70 mt-6 text-sm">
            Our calculator shows <strong>both methods side by side</strong> — including total interest paid,
            total principal paid, and exactly how much you save switching methods.
          </p>
        </div>
      </section>

      {/* Why it works */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-900">
              The best strategy? The one you stick with.
            </h2>
            <p className="mt-4 text-lg text-brand-800/80">
              Personal finance is 80% behavior. The Snowball keeps you motivated
              with quick wins. The Avalanche saves you more money over time.
              Either way, the roll-over principle is the engine that gets you
              out of debt fast.
            </p>
            <ul className="mt-6 space-y-3 text-brand-800">
              <li className="flex gap-3"><span>✅</span> See real progress in weeks, not years</li>
              <li className="flex gap-3"><span>✅</span> Know exactly how much interest you will pay</li>
              <li className="flex gap-3"><span>✅</span> Compare both methods instantly — side by side</li>
              <li className="flex gap-3"><span>✅</span> Free up cash to attack the next debt</li>
            </ul>
            <Link href="/calculator" className="btn-primary mt-8 inline-flex">
              Compare both methods →
            </Link>
          </div>
          <div className="space-y-4">
            <div className="card border-l-4 border-brand-500">
              <p className="text-sm uppercase tracking-wide text-brand-600 font-semibold">Snowball example</p>
              <p className="mt-2 text-brand-900">
                Sara has 3 debts. She pays the $400 store card off in 2 months.
                Then she rolls that payment into her $1,200 credit card.
                Then into her car loan. By month 18, she is <strong>debt free</strong>.
              </p>
            </div>
            <div className="card border-l-4 border-amber-400">
              <p className="text-sm uppercase tracking-wide text-amber-600 font-semibold">Avalanche example</p>
              <p className="mt-2 text-brand-900">
                Marcus attacks his 24% credit card first, even though it is not the smallest.
                He pays <strong>$340 less in interest</strong> than the Snowball route —
                and finishes just one month later.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">
            See your numbers in 2 minutes.
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Enter your debts once. We will calculate both Snowball and Avalanche
            instantly — with total interest paid, total principal, and money saved.
          </p>
          <Link href="/calculator" className="inline-flex mt-8 bg-white text-brand-700 font-extrabold text-xl px-8 py-4 rounded-2xl hover:bg-brand-50 transition-colors">
            Start my free plan →
          </Link>
          <p className="mt-4 text-sm text-white/60">No account needed. No bank login. 100% private.</p>
        </div>
      </section>
    </div>
  );
}