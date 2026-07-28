"use client";

import { useState } from "react";
import type { Faq } from "@/data/types";

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-ink-100 border-y border-ink-100">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={faq.question}>
            <h3>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-6 py-5 text-left font-serif text-lg text-ink-900"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                {faq.question}
                <span aria-hidden="true" className="shrink-0 font-sans text-xl text-terracotta-600">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h3>
            {isOpen && (
              <div id={`faq-panel-${index}`} className="pb-5 font-sans text-sm leading-relaxed text-ink-600">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
