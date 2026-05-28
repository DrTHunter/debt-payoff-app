import Link from "next/link";

const topics = [
  {
    q: "What is a minimum payment?",
    a: "It’s the smallest amount your lender requires you to pay each month. Paying only the minimum is legal — but it keeps you in debt for years because most of it goes to interest, not your balance.",
  },
  {
    q: "What is interest?",
    a: "Interest is the fee you pay to borrow money. If your card charges 20% interest, a $1,000 balance grows by about $16 every month if you don’t pay it down. That’s why high-interest debt is so painful.",
  },
  {
    q: "Why does the order matter?",
    a: "Because you have limited money each month. Putting all your extra cash on ONE debt at a time gets it paid off faster, frees up that monthly payment, and gives you momentum.",
  },
  {
    q: "Why do small wins help?",
    a: "Money is emotional. When you pay off your first debt — even a small one — your brain says ‘I can do this!’ That feeling is what keeps people going. The math is slightly worse than avalanche, but the success rate is higher.",
  },
  {
    q: "Snowball vs. Avalanche — what’s the difference?",
    a: "Snowball pays the SMALLEST balance first (best for motivation). Avalanche pays the HIGHEST interest rate first (saves slightly more money). Pick whichever you’ll actually stick with. The calculator lets you try both.",
  },
  {
    q: "When should I talk to a professional?",
    a: "If you can’t make minimum payments, are being threatened with lawsuits or wage garnishment, or are considering bankruptcy — please talk to a non-profit credit counselor (look for an NFCC-certified agency). It’s usually free.",
  },
];

export default function EducationPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold text-brand-900">Learn the basics</h1>
      <p className="mt-3 text-lg text-brand-800/80">
        Short, plain-English answers. No jargon. No judgment.
      </p>

      <div className="mt-8 space-y-4">
        {topics.map((t) => (
          <details key={t.q} className="card group" >
            <summary className="cursor-pointer list-none flex justify-between items-center font-bold text-brand-900 text-lg">
              {t.q}
              <span className="text-brand-500 group-open:rotate-45 transition text-2xl leading-none">+</span>
            </summary>
            <p className="mt-3 text-brand-800/90 leading-relaxed">{t.a}</p>
          </details>
        ))}
      </div>

      <div className="card mt-10 bg-warm-50 border-warm-200">
        <h2 className="text-xl font-bold text-brand-900">Ready to try it?</h2>
        <p className="mt-2 text-brand-800/80">
          Plug your numbers into the calculator. You’ll see your debt-free date in seconds.
        </p>
        <Link href="/calculator" className="btn-primary mt-4 inline-flex">
          Open the calculator →
        </Link>
      </div>
    </div>
  );
}
