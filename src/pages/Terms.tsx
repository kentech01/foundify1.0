import React from "react";
import { Header } from "../components/Header";
import { FooterModern } from "../components/FooterModern";

// app/terms/page.tsx (or components/Terms.tsx)
function Terms() {
  return (
    <>
      <div className="min-h-screen bg-white py-8 px-4 leading-relaxed text-slate-800">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 md:p-8">
          <header className="mb-12 border-b-2 border-slate-100 pb-8 text-center">
            <h1 className="mb-2 text-4xl font-bold text-slate-900 md:text-4xl">
              Terms &amp; Privacy Policy — Foundify.app
            </h1>
            <p className="m-0 text-sm text-slate-500">
              Effective date: 01.08.2025
            </p>
          </header>

          <section className="mb-12">
            <h2 className="mb-4 border-b border-slate-200 pb-2 text-2xl font-semibold text-slate-900 md:text-[1.5rem]">
              Who we are
            </h2>
            <p className="mb-4 text-base text-slate-900">
              Foundify.app is a service by{" "}
              <a
                href="https://thrio.co"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-sky-600 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-sm"
              >
                thrio.co
              </a>
              . We help startup founders quickly generate AI-powered pitch
              decks, shareable links, and landing pages.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 mt-4 border-b border-slate-200 pb-2 text-2xl font-semibold text-slate-900 md:text-[1.5rem]">
              What we collect
            </h2>
            <p className="mb-4 text-base text-slate-900">
              When you use Foundify, we collect:
            </p>
            <ul className="ml-6 list-disc space-y-3">
              <li className="text-base text-slate-900">
                <strong className="font-semibold text-slate-900">
                  Your input:
                </strong>{" "}
                startup name, idea, target market, etc.
              </li>
              <li className="text-base text-slate-900">
                <strong className="font-semibold text-slate-900">
                  Your account info:
                </strong>{" "}
                email, name via Google/Facebook login
              </li>
              <li className="text-base text-slate-900">
                <strong className="font-semibold text-slate-900">
                  Usage data:
                </strong>{" "}
                device type, browser, time on page
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 border-b border-slate-200 pb-2 text-2xl font-semibold text-slate-900 md:text-[1.5rem]">
              How we use it
            </h2>
            <p className="mb-4 text-base text-slate-900">
              We use your data to:
            </p>
            <ul className="ml-6 list-disc space-y-3">
              <li className="text-base text-slate-900">
                Generate and deliver your pitch results (PDF, link, or page)
              </li>
              <li className="text-base text-slate-900">
                Save your pitch history under your account
              </li>
              <li className="text-base text-slate-900">
                Improve the service and provide support if needed
              </li>
            </ul>

            <p className="mt-6 rounded-md border-l-4 border-sky-500 bg-slate-50 p-4 font-medium">
              <strong>We do not sell or rent your data.</strong>
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 border-b border-slate-200 pb-2 text-2xl font-semibold text-slate-900 md:text-[1.5rem]">
              Your rights
            </h2>
            <p className="mb-4 text-base text-slate-900">You can:</p>
            <ul className="ml-6 list-disc space-y-3">
              <li className="text-base text-slate-900">
                Request a copy or deletion of your data
              </li>
              <li className="text-base text-slate-900">
                Remove your account anytime
              </li>
              <li className="text-base text-slate-900">
                Contact us at{" "}
                <a
                  href="mailto:hello@thrio.co"
                  className="font-medium text-sky-600 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-sm"
                >
                  hello@thrio.co
                </a>{" "}
                for questions or concerns
              </li>
            </ul>
          </section>

          <section className="mb-2">
            <h2 className="mb-4 border-b border-slate-200 pb-2 text-2xl font-semibold text-slate-900 md:text-[1.5rem]">
              Terms of use
            </h2>
            <p className="mb-4 text-base text-slate-900">
              By using Foundify, you agree to:
            </p>
            <ul className="ml-6 list-disc space-y-3">
              <li className="text-base text-slate-900">
                Be 16+ years old to use Foundify
              </li>
              <li className="text-base text-slate-900">
                Use the service ethically and legally
              </li>
              <li className="text-base text-slate-900">
                Review AI-generated content before using it publicly (all pitch
                content is AI-generated)
              </li>
              <li className="text-base text-slate-900">
                Own your inputs and outputs; we only use anonymized data to
                improve the tool
              </li>
              <li className="text-base text-slate-900">
                Accept that we may limit access or modify the service without
                notice
              </li>
            </ul>
          </section>
        </div>
      </div>
      <FooterModern />
    </>
  );
}

export default Terms;
