import React, { useState } from "react";

const faqs = [
  {
    question: "What is included in the wedding package?",
    answer:
      "Our wedding package includes venue decoration, catering, sound and lighting, professional photography, and more.",
  },
  {
    question: "Can I customize my event package?",
    answer:
      "Yes! Our packages are fully customizable to suit your personal tastes and budget.",
  },
  {
    question: "Do you offer outdoor event options?",
    answer:
      "Absolutely! We have beautifully landscaped gardens and poolside venues perfect for open-air events.",
  },
  {
    question: "Is there an option for live entertainment?",
    answer:
      "Yes, we can arrange live bands, DJs, and cultural performances as part of your event.",
  },
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faqs container mx-auto py-20 px-4">
      <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Frequently Asked Questions</h2>
      <div className="space-y-6 max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl p-6 shadow-md transition-all"
          >
            <button
              className="flex justify-between items-center w-full text-left font-semibold text-lg text-gray-800"
              onClick={() => toggleFAQ(index)}
            >
              <span>{faq.question}</span>
              <svg
                className={`w-5 h-5 transform transition-transform duration-300 ${
                  activeIndex === index ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                activeIndex === index ? "max-h-40 mt-4 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
