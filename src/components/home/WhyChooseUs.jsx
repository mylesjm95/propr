"use client";
import { Home, Award, MessageSquare } from 'lucide-react';

const WhyChooseUs = () => {
  return (
    <section className="py-24 md:py-32 bg-[#fbfbf9]">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-2xl md:text-3xl font-bold mt-20 mb-28 text-center">Building Trust, One Owner at a Time.</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-20">
          <div className="flex flex-col">
            <Home className="w-8 h-8 mb-4 text-[#d6d3c5]" />
            <h3 className="text-xl font-bold mb-4">Reach Real Owners, Build Real Trust</h3>
            <p className="text-gray-600">
              We connect you directly with property owners, helping you build lasting relationships—not just cold leads.
            </p>
          </div>
          
          <div className="flex flex-col">
            <Award className="w-8 h-8 mb-4 text-[#d6d3c5]" />
            <h3 className="text-xl font-bold mb-4">Become the Name They Know</h3>
            <p className="text-gray-600">
              With building-specific branding and consistent updates, you're not just another agent—you're the trusted expert they rely on.
            </p>
          </div>
          
          <div className="flex flex-col">
            <MessageSquare className="w-8 h-8 mb-4 text-[#d6d3c5]" />
            <h3 className="text-xl font-bold mb-4">Marketing That Feels Personal</h3>
            <p className="text-gray-600">
              Every letter, landing page, and follow-up is tailored to speak directly to the investor's needs, making you stand out for all the right reasons.
            </p>
          </div>
        </div>
        
        <div className="mt-24 md:mt-32"></div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
