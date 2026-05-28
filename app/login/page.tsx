import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-6 py-12 text-brand-800">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
