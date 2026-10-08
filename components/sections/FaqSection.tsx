import type { FaqItem } from "@/lib/schema";

/** Visible Q&A block. Pair with <FAQSchema> only on pages that render this exact content. */
export function FaqSection({ items, heading = "Frequently Asked Questions", id = "faq" }: { items: FaqItem[]; heading?: string; id?: string }) {
  return (
    <section className="wc-faq" aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`}>{heading}</h2>
      {items.map((item) => (
        <div key={item.question} className="wc-faq__item">
          <h3>{item.question}</h3>
          <p>{item.answer}</p>
        </div>
      ))}
    </section>
  );
}
