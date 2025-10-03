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

const FAQChat = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! 👋 I’m your FAQ assistant. Pick a question below:" },
  ]);

  const handleQuestionClick = (faq) => {
    // Add user question
    const userMsg = { from: "user", text: faq.question };
    // Add bot answer
    const botMsg = { from: "bot", text: faq.answer };

    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  return (
    <div className="fixed bottom-20 right-6 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-3 bg-blue-600 text-white rounded-t-2xl">
        <h3 className="font-semibold">FAQs Assistant</h3>
        <button onClick={onClose} className="cursor-pointer">✖</button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg max-w-[75%] ${
              msg.from === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* FAQ choices always visible */}
      <div className="border-t border-gray-200 p-2 space-y-2 max-h-40 overflow-y-auto">
        {faqs.map((faq, idx) => (
          <button
            key={idx}
            onClick={() => handleQuestionClick(faq)}
            className="w-full text-left px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-blue-50 text-gray-700 text-sm transition"
          >
            {faq.question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FAQChat;
