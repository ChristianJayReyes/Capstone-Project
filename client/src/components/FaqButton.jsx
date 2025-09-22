import React from "react";
import { HelpCircle } from "lucide-react";
import Faqs from '../components/Faqs';
import { useState } from "react";

const FaqButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {/* Mini Chat Window */}
      {open && <Faqs onClose={() => setOpen(false)} />}
    </>
  );
};

export default FaqButton;