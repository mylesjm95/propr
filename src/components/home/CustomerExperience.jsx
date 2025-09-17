"use client";

import { Button } from "@/components/ui/button";

const CustomerExperience = () => {
  return (
    <section className="py-24 md:py-32 bg-[#fbfbf9]">
      <div className="container mx-auto px-4 max-w-[90%]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Video (Reversed) */}
          <div className="relative h-[900px] rounded-2xl overflow-hidden shadow-[0_17px_37px_0_rgba(41,42,45,.02),0_67px_67px_0_rgba(41,42,45,.02),0_150px_90px_0_rgba(41,42,45,.012),0_267px_107px_0_rgba(41,42,45,0),0_417px_117px_0_rgba(41,42,45,0)]">
            <video 
              src="https://nmlvymyayzfkrxbvqkib.supabase.co/storage/v1/object/public/website-content//7347606-uhd_2560_1440_25fps.mp4"
              alt="Real estate experiences" 
              className="absolute w-full h-full object-cover rounded-2xl"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
          
          {/* Right Column - Two Cards (Reversed) */}
          <div className="grid grid-rows-12 gap-6 h-[900px]">
            {/* Top Card - 2/3 Height */}
            <div className="row-span-8 bg-[#e3ded7] p-8 md:p-10 rounded-xl shadow-[0_17px_37px_0_rgba(41,42,45,.02),0_67px_67px_0_rgba(41,42,45,.02),0_150px_90px_0_rgba(41,42,45,.012),0_267px_107px_0_rgba(41,42,45,0),0_417px_117px_0_rgba(41,42,45,0)]">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="inline-block text-gray-700 font-semibold mb-2">Propr Insights</div>
                  <h3 className="text-4xl font-normal mb-4">Everything You Need to Own Your Market—Done for You.</h3>
                </div>
                
                <div>
                  <p className="text-gray-600 text-lg mb-4">
                    We identify investor-owned units, send personalized letters to their real addresses, build your building-specific landing page, and track the results—all under your name. You show up where it counts, looking like the expert you are. We do the work. You get the listings.
                  </p>
                  <Button className="text-white bg-black hover:bg-gray-800 font-medium px-4 py-2 rounded-md">
                    Learn more
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Bottom Card - 1/3 Height */}
            <div className="row-span-4 bg-white p-8 rounded-xl shadow-[0_17px_37px_0_rgba(41,42,45,.02),0_67px_67px_0_rgba(41,42,45,.02),0_150px_90px_0_rgba(41,42,45,.012),0_267px_107px_0_rgba(41,42,45,0),0_417px_117px_0_rgba(41,42,45,0)]">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <h3 className="text-3xl font-normal mb-6">Why Top Agents Choose Propr Marketing</h3>
                  <div className="text-gray-600 text-lg flex flex-col gap-2">
                    <p className="flex items-start">
                      <span className="text-black mr-2">✔️</span> Reach investors directly at their real address
                    </p>
                    <p className="flex items-start">
                      <span className="text-black mr-2">✔️</span> Own a building-specific domain and landing page
                    </p>
                    <p className="flex items-start">
                      <span className="text-black mr-2">✔️</span> Get exclusive rights to your chosen building
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerExperience;
