"use client";

import { Button } from "@/components/ui/button";

const Newsletter = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Subscribe to our newsletter</h2>
            <p className="text-gray-600 mb-8">
              Join 20k+ people getting insights on real estate trends, market updates, investment strategies, and more.
            </p>
            
            <div className="flex max-w-md">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-r-md rounded-l-none">
                Subscribe
              </Button>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="max-w-sm mx-auto bg-gray-200 rounded-xl h-80"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
