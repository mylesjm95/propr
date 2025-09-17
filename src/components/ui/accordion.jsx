import * as React from "react";

export function Accordion({ items }) {
  const [openIndex, setOpenIndex] = React.useState(null);

  const handleToggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={idx} className="border rounded-lg bg-white">
          <button
            className="w-full flex justify-between items-center p-4 text-left text-lg font-medium focus:outline-none"
            onClick={() => handleToggle(idx)}
            aria-expanded={openIndex === idx}
          >
            {item.question}
            <span className="ml-2">{openIndex === idx ? "-" : "+"}</span>
          </button>
          {openIndex === idx && (
            <div className="p-4 pt-0 text-gray-700 text-base border-t">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
