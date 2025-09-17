import * as React from "react";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = React.useState(null);

  const handleToggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const faqItems = [
    {
      question: "How does Propr Marketing work?",
      answer:
        "We combine targeted direct mail with personalized landing pages and digital follow-up campaigns. We identify investor-owned units, send mail to their real residences, and drive traffic to your building-specific landing page — helping you generate real calls, sign-ups, and listings.",
    },
    {
      question: "Can more than one agent market the same building?",
      answer:
        "No. We guarantee building exclusivity. When you claim a building, you're the only agent we work with for that address — giving you a major first-mover advantage.",
    },
    {
      question: "How many buildings can I market at once?",
      answer:
        "You can start with one building and add more as you grow. Many agents begin with one or two buildings to establish their presence, then expand to dominate a neighborhood.",
    },
    {
      question: "Do you provide the mailing lists?",
      answer:
        "Yes. Using proprietary data mining, we generate a custom list of investor-owned units for your target building. You don't have to do anything — we handle it.",
    },
    {
      question: "What's included in a campaign?",
      answer:
        "Each campaign includes a custom-designed letter package, building-specific landing page, QR code tracking, and optional digital ads to retarget your audience online.",
    },
    {
      question: "How soon can I start seeing results?",
      answer:
        "Many agents receive direct calls within days of the mail hitting homes, and building update sign-ups begin almost immediately. Campaign performance builds over time with consistent exposure.",
    },
    {
      question: "Can I customize my mailers and landing page?",
      answer:
        "Yes. We'll use your branding, headshot, logo, and preferred messaging tone to make everything feel personalized and professional — while following our proven framework for results.",
    },
    {
      question: "How do I track my campaign's performance?",
      answer:
        "We provide basic reporting on QR code scans, website sign-ups, and overall campaign engagement. For larger campaigns, additional reporting and analytics are available.",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-[#fbfbf9]">
      <div className="container mx-auto px-4 max-w-[90%]">
        <h2 className="text-4xl md:text-5xl font-normal mb-12 text-left">Your Partner in Success</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left: FAQ Accordion */}
          <div className="order-2 md:order-1">
            <div className="space-y-4">
              {faqItems.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`border-b border-gray-300 transition-all duration-300 ${
                    openIndex === idx 
                      ? 'shadow-none' 
                      : 'hover:border-gray-400'
                  }`}
                >
                  <button
                    className="w-full flex justify-between items-center py-5 text-left text-lg font-medium focus:outline-none"
                    onClick={() => handleToggle(idx)}
                    aria-expanded={openIndex === idx}
                  >
                    <span className="text-lg md:text-xl">{item.question}</span>
                    <span className={`ml-2 transition-transform duration-300 text-xl ${openIndex === idx ? 'transform rotate-180' : ''}`}>
                      {openIndex === idx ? '−' : '+'}
                    </span>
                  </button>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ${
                      openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="pb-5 text-gray-700 text-base">
                      {item.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right: Image and CTA */}
          <div className="order-1 md:order-2">
            <div className="rounded-2xl overflow-hidden shadow-[0_17px_37px_0_rgba(41,42,45,.02),0_67px_67px_0_rgba(41,42,45,.02),0_150px_90px_0_rgba(41,42,45,.012)]">
              <img
                src="/file.svg" 
                alt="FAQ Illustration"
                className="w-full h-auto object-cover aspect-square md:aspect-auto md:h-[500px] bg-[#e3ded7] p-6 rounded-2xl"
              />
            </div>
            <div className="mt-8 rounded-xl w-full">
              <h3 className="text-2xl font-normal mb-3">Still have questions?</h3>
              <p className="text-gray-600 mb-4">
                We're here to help. Contact our team for personalized assistance with your real estate marketing needs.
              </p>
              <button className="w-full bg-black hover:bg-gray-800 text-white py-3 px-4 rounded-md transition duration-300">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
