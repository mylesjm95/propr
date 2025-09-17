"use client";

import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-16 md:py-32 lg:py-40 relative overflow-hidden bg-[#e4e0d6]">
      {/* Background that extends to the top of the page */}
      <div className="absolute inset-0 bg-[#e4e0d6] -z-10"></div>
      
      <div className="container mx-auto px-4 max-w-[90%]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left column - Text content */}
          <div className="flex flex-col">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal text-gray-900 mb-6">
                Be the Go-To Realtor in Your Building
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 mb-8">
                Combine targeted direct mail with personalized landing pages to establish authority and generate quality leads.
            </p>
            
            <div className="mt-4">
              <Button size="lg" className="text-lg px-8 py-6 bg-black hover:bg-gray-800 rounded-md">
                Check Availability
              </Button>
            </div>
          </div>
          
          {/* Right column - Video with rounded corners */}
          <div className="relative h-[350px] md:h-[450px] rounded-2xl overflow-hidden shadow-xl">
            <video 
              src="https://nmlvymyayzfkrxbvqkib.supabase.co/storage/v1/object/public/website-content//11300218-uhd_2560_1440_24fps.mp4"
              alt="Modern real estate" 
              className="absolute w-full h-full object-cover rounded-2xl"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
