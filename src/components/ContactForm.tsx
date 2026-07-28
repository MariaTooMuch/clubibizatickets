"use client";

import { useState, type FormEvent } from "react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div role="status" className="rounded-sm border border-ink-100 p-8 text-center">
        <h2 className="text-2xl">Thank you.</h2>
        <p className="mt-3 font-sans text-sm text-ink-600">
          Your enquiry has been received. A member of our team will be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="font-sans text-sm text-ink-700">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="mt-2 w-full rounded-sm border border-ink-200 bg-sand-50 px-4 py-3 font-sans text-sm text-ink-900 focus:border-terracotta-600 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="email" className="font-sans text-sm text-ink-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-2 w-full rounded-sm border border-ink-200 bg-sand-50 px-4 py-3 font-sans text-sm text-ink-900 focus:border-terracotta-600 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="interest" className="font-sans text-sm text-ink-700">
          I&apos;m interested in
        </label>
        <select
          id="interest"
          name="interest"
          className="mt-2 w-full rounded-sm border border-ink-200 bg-sand-50 px-4 py-3 font-sans text-sm text-ink-900 focus:border-terracotta-600 focus:outline-none"
        >
          <option>Buying a property</option>
          <option>Selling a property</option>
          <option>Investment opportunities</option>
          <option>Relocation support</option>
          <option>Developer partnership</option>
          <option>Something else</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="font-sans text-sm text-ink-700">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="mt-2 w-full rounded-sm border border-ink-200 bg-sand-50 px-4 py-3 font-sans text-sm text-ink-900 focus:border-terracotta-600 focus:outline-none"
        />
      </div>

      <button type="submit" className="btn-primary w-full sm:w-auto">
        Send Enquiry
      </button>
    </form>
  );
}
