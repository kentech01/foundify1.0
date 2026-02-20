import React, { useState } from "react";
import { Footer } from "../components/Footer";
import SignInModal from "../components/signIn/SignInModal";
import { Nav } from "../components/landingpage/Nav";

// app/terms/page.tsx (or components/Terms.tsx)
function Terms() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  return (
    <>
      <Nav handleOpenSignInModal={() => setIsSignInModalOpen(true)} />
      <div className="min-h-screen bg-white pt-20 pb-12 px-4 leading-relaxed text-slate-800">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 md:p-8">
          <header className="mb-10 border-b-2 border-slate-100 pb-6 text-center">
            <h1 className="mb-2 text-4xl font-bold text-slate-900 md:text-4xl">
              Terms &amp; Privacy Policy — Foundify.app
            </h1>
            <p className="m-0 text-sm text-slate-500">
              Effective date: 20.02.2026
            </p>
          </header>

          <section className="mb-8">
            <h2 className="mb-3 border-b border-slate-200 pb-2 text-xl font-semibold text-slate-900">
              Who we are
            </h2>
            <p className="text-base text-slate-700">
              Foundify is a service by{" "}
              <a
                href="https://thrio.co"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-sky-600 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-sm"
              >
                thrio.co
              </a>
              . We help founders create pitch decks, landing pages, invoices, contracts, and more.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 border-b border-slate-200 pb-2 text-xl font-semibold text-slate-900">
              What we collect
            </h2>
            <p className="text-base text-slate-700">
              Account info (email, name via Google login), your inputs (startup details, etc.), and basic usage data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 border-b border-slate-200 pb-2 text-xl font-semibold text-slate-900">
              How we use it
            </h2>
            <p className="mb-4 text-base text-slate-700">
              To deliver your outputs, save your history, and improve the service.{" "}
              <strong>We do not sell or rent your data.</strong>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 border-b border-slate-200 pb-2 text-xl font-semibold text-slate-900">
              Your rights
            </h2>
            <p className="text-base text-slate-700">
              Request a copy or deletion of your data, remove your account anytime, or contact{" "}
              <a
                href="mailto:hello@thrio.co"
                className="font-medium text-sky-600 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-sm"
              >
                hello@thrio.co
              </a>{" "}
              with questions.
            </p>
          </section>

          <section className="mb-2">
            <h2 className="mb-3 border-b border-slate-200 pb-2 text-xl font-semibold text-slate-900">
              Terms of use
            </h2>
            <p className="text-base text-slate-700">
              You must be 16+, use the service legally, and review AI-generated content before sharing. You own your data; we may update or limit the service as needed.
            </p>
          </section>
        </div>
      </div>
      <Footer />
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSignInSuccess={() => setIsSignInModalOpen(false)}
      />
    </>
  );
}

export default Terms;
