"use client";

import Link from "next/link";

const EducationalContent = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">We love this stuff so much we write about it every month</h2>
        <h3 className="text-xl text-center mb-16 text-gray-600">Propr Learn</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="#" className="group">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <h4 className="font-bold group-hover:text-blue-600 transition-colors">What is a cap rate and why does it matter?</h4>
          </Link>
          
          <Link href="#" className="group">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <h4 className="font-bold group-hover:text-blue-600 transition-colors">First-time homebuyer? Here's what you need to know</h4>
          </Link>
          
          <Link href="#" className="group">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <h4 className="font-bold group-hover:text-blue-600 transition-colors">The pros and cons of investing in rental properties</h4>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EducationalContent;
