"use client";

import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import FaqImage from "@/components/home/FaqImage";

const FeaturedSolutions = () => {
  return (
    <>
      <section className="py-24 md:py-32 bg-[#fbfbf9]">
        <div className="container mx-auto px-4 max-w-[90%]">
          <h2 className="text-4xl md:text-5xl font-normal mb-16 text-center max-w-[50%] mx-auto">Marketing That Puts You in a League of Your Own</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Two Cards */}
            <div className="grid grid-rows-12 gap-6 h-[900px]">
              {/* Top Card - 2/3 Height */}
              <div className="row-span-8 p-8 md:p-10 rounded-xl shadow-[0_17px_37px_0_rgba(41,42,45,.02),0_67px_67px_0_rgba(41,42,45,.02),0_150px_90px_0_rgba(41,42,45,.012),0_267px_107px_0_rgba(41,42,45,0),0_417px_117px_0_rgba(41,42,45,0)]" style={{ background: "linear-gradient(28.01deg, #dadae0 16.6%, #ebebe6 82.01%)" }}>
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="inline-block text-gray-700 font-semibold mb-2">Propr Search</div>
                    <h3 className="text-3xl font-normal mb-4">You Don't Need More Leads—You Need the Right Ones.</h3>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 mb-4">
                      We help realtors dominate the buildings they work in by combining data-driven direct mail with personalized landing pages and building-specific branding. It's a complete, done-for-you system—designed to make you the agent every investor knows and trusts.
                    </p>
                    <Button size="lg" className="px-6 py-3 bg-black hover:bg-gray-800 rounded-md w-full md:w-auto mt-2">
                      Explore properties
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Bottom Card - 1/3 Height */}
              <div className="row-span-4 bg-white p-8 rounded-xl shadow-[0_17px_37px_0_rgba(41,42,45,.02),0_67px_67px_0_rgba(41,42,45,.02),0_150px_90px_0_rgba(41,42,45,.012),0_267px_107px_0_rgba(41,42,45,0),0_417px_117px_0_rgba(41,42,45,0)]">
                <div className="flex flex-col h-full">
                  <div className="mb-3">
                    <h3 className="text-3xl font-normal mb-5">The Numbers That Make the Market Listen</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Our campaigns outperform industry averages and drive real action. With a 2.7%–4.4% direct mail response rate, 10–20 direct calls per 500 letters, and 5–10% of recipients signing up for building updates, we don't just promise results—we deliver them.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Tall Video */}
            <div className="relative h-[900px] rounded-2xl overflow-hidden shadow-[0_17px_37px_0_rgba(41,42,45,.02),0_67px_67px_0_rgba(41,42,45,.02),0_150px_90px_0_rgba(41,42,45,.012),0_267px_107px_0_rgba(41,42,45,0),0_417px_117px_0_rgba(41,42,45,0)]">
              <video 
                src="https://nmlvymyayzfkrxbvqkib.supabase.co/storage/v1/object/public/website-content//6963496-hd_1920_1080_25fps%20(1).mp4"
                alt="Property solutions" 
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
    </>
  )
};

export default FeaturedSolutions;
