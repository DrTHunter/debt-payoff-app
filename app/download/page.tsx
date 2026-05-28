"use client";
import { downloadTrackerTemplate } from "@/lib/excel";

export default function DownloadPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold text-brand-900">
        Get the Excel Tracker
      </h1>
      <p className="mt-3 text-lg text-brand-800/80">
        Prefer pen, paper, or a spreadsheet? Download our free tracker and fill it in
        every month. Print it. Tape it to your fridge. Whatever works.
      </p>

      <div className="card mt-8 text-center">
        <div className="text-6xl">📊</div>
        <h2 className="mt-4 text-2xl font-bold text-brand-900">
          Debt Snowball Tracker
        </h2>
        <p className="mt-2 text-brand-800/80">
          Includes 3 sheets: My Debts, Monthly Tracker, and My Wins.
        </p>
        <button onClick={downloadTrackerTemplate} className="btn-primary mt-6 text-lg">
          ⬇ Download Excel Debt Snowball Tracker
        </button>
        <p className="mt-3 text-xs text-brand-700/70">.xlsx — opens in Excel, Numbers, or Google Sheets</p>
      </div>

      <div className="card mt-8">
        <h3 className="text-lg font-bold text-brand-900">What’s inside</h3>
        <ul className="mt-3 space-y-2 text-brand-800">
          <li>• <strong>My Debts</strong> — name, balance, minimum payment, interest rate, extra payment, notes</li>
          <li>• <strong>Monthly Tracker</strong> — date, debt name, payment amount, remaining balance, paid off?, notes</li>
          <li>• <strong>My Wins</strong> — celebrate every milestone 🎉</li>
        </ul>
      </div>
    </div>
  );
}
