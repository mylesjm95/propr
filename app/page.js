"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Two Column Layout with Background */}
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
                src="https://nmlvymyayzfkrxbvqkib.supabase.co/storage/v1/object/public/website-content//6963496-hd_1920_1080_25fps%20(1).mp4"
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

      {/* Featured Solutions Section */}
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
                    <h3 className="text-3xl font-normal mb-4">You Don’t Need More Leads—You Need the Right Ones.</h3>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 mb-4">
                      We help realtors dominate the buildings they work in by combining data-driven direct mail with personalized landing pages and building-specific branding. It’s a complete, done-for-you system—designed to make you the agent every investor knows and trusts.
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
                  <div className="mb-4">
                    <div className="inline-block text-gray-700 font-semibold mb-1">Propr Analytics</div>
                    <h3 className="text-3xl font-normal mb-2">Financial planning and investment management</h3>
                    <p className="text-gray-600 text-lg">
                      Get personalized financial analysis and guidance from our advanced analytics platform.
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

      {/* Customer Experience Section - Reversed Layout */}
      <section className="py-24 md:py-32 bg-[#fbfbf9]">
        <div className="container mx-auto px-4 max-w-[90%]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Video (Reversed) */}
            <div className="relative h-[900px] rounded-2xl overflow-hidden shadow-[0_17px_37px_0_rgba(41,42,45,.02),0_67px_67px_0_rgba(41,42,45,.02),0_150px_90px_0_rgba(41,42,45,.012),0_267px_107px_0_rgba(41,42,45,0),0_417px_117px_0_rgba(41,42,45,0)]">
              <video 
                src="https://nmlvymyayzfkrxbvqkib.supabase.co/storage/v1/object/public/website-content//6963496-hd_1920_1080_25fps%20(1).mp4"
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
                    <div className="inline-block text-gray-700 font-semibold mb-1">Propr Connect</div>
                    <h3 className="text-3xl font-normal mb-2">Connect with top-rated real estate professionals</h3>
                    <p className="text-gray-600 text-lg">
                      Find and collaborate with verified agents, brokers, and advisors who match your specific needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials/Features Carousel Section */}
      <section className="py-20 md:py-32 bg-[#e4e0d6] overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-[85%] mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Leave the real estate journey to us</h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl">
              We simplify every aspect of buying, selling, and investing in real estate so you can focus on what matters most.
            </p>
          </div>
          
          <div className="relative">
            <div className="flex space-x-8 overflow-x-auto pb-8 pl-[5%] pr-[20%] scrollbar-hide">
              {/* Feature Card 1 */}
              <div className="bg-white p-8 rounded-xl shadow-[0_17px_37px_0_rgba(41,42,45,.02),0_67px_67px_0_rgba(41,42,45,.02),0_150px_90px_0_rgba(41,42,45,.012),0_267px_107px_0_rgba(41,42,45,0),0_417px_117px_0_rgba(41,42,45,0)] min-w-[380px] flex-shrink-0">
                <div className="flex justify-between items-start mb-10">
                  <span className="text-5xl font-bold text-gray-200">01</span>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-800">
                    <path d="M21 7L9 19L3.5 13.5L4.91 12.09L9 16.17L19.59 5.59L21 7Z" fill="currentColor"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Find the perfect property</h3>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  Our AI-powered search helps you discover properties that match your exact criteria, from location to amenities.
                </p>
                <div className="flex items-center text-gray-500">
                  <span className="text-sm font-medium">Extensive listings database</span>
                  <div className="w-1 h-1 bg-gray-400 rounded-full mx-3"></div>
                  <span className="text-sm font-medium">AI-assisted matching</span>
                </div>
              </div>
              
              {/* Feature Card 2 */}
              <div className="bg-white p-8 rounded-xl shadow-[0_17px_37px_0_rgba(41,42,45,.02),0_67px_67px_0_rgba(41,42,45,.02),0_150px_90px_0_rgba(41,42,45,.012),0_267px_107px_0_rgba(41,42,45,0),0_417px_117px_0_rgba(41,42,45,0)] min-w-[380px] flex-shrink-0">
                <div className="flex justify-between items-start mb-10">
                  <span className="text-5xl font-bold text-gray-200">02</span>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-800">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM15.88 8.29L10 14.17L8.12 12.29C7.73 11.9 7.1 11.9 6.71 12.29C6.32 12.68 6.32 13.31 6.71 13.7L9.3 16.29C9.69 16.68 10.32 16.68 10.71 16.29L17.3 9.7C17.69 9.31 17.69 8.68 17.3 8.29C16.91 7.9 16.27 7.9 15.88 8.29Z" fill="currentColor"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Make informed decisions</h3>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  Access comprehensive market data, neighborhood insights, and investment analysis to guide your decisions.
                </p>
                <div className="flex items-center text-gray-500">
                  <span className="text-sm font-medium">Real-time market data</span>
                  <div className="w-1 h-1 bg-gray-400 rounded-full mx-3"></div>
                  <span className="text-sm font-medium">Investment analysis</span>
                </div>
              </div>
              
              {/* Feature Card 3 */}
              <div className="bg-white p-8 rounded-xl shadow-[0_17px_37px_0_rgba(41,42,45,.02),0_67px_67px_0_rgba(41,42,45,.02),0_150px_90px_0_rgba(41,42,45,.012),0_267px_107px_0_rgba(41,42,45,0),0_417px_117px_0_rgba(41,42,45,0)] min-w-[380px] flex-shrink-0">
                <div className="flex justify-between items-start mb-10">
                  <span className="text-5xl font-bold text-gray-200">03</span>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-800">
                    <path d="M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.9 10 8V16C10 17.1 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z" fill="currentColor"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Secure your financing</h3>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  Get personalized mortgage options and financial planning tools to make your real estate purchase a reality.
                </p>
                <div className="flex items-center text-gray-500">
                  <span className="text-sm font-medium">Competitive rates</span>
                  <div className="w-1 h-1 bg-gray-400 rounded-full mx-3"></div>
                  <span className="text-sm font-medium">Pre-approval assistance</span>
                </div>
              </div>
              
              {/* Feature Card 4 */}
              <div className="bg-white p-8 rounded-xl shadow-[0_17px_37px_0_rgba(41,42,45,.02),0_67px_67px_0_rgba(41,42,45,.02),0_150px_90px_0_rgba(41,42,45,.012),0_267px_107px_0_rgba(41,42,45,0),0_417px_117px_0_rgba(41,42,45,0)] min-w-[380px] flex-shrink-0">
                <div className="flex justify-between items-start mb-10">
                  <span className="text-5xl font-bold text-gray-200">04</span>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-800">
                    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Close with confidence</h3>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  Navigate the closing process seamlessly with step-by-step guidance and support from our team of experts.
                </p>
                <div className="flex items-center text-gray-500">
                  <span className="text-sm font-medium">Digital transaction management</span>
                  <div className="w-1 h-1 bg-gray-400 rounded-full mx-3"></div>
                  <span className="text-sm font-medium">Expert support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Tools Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Leave the calculations to us</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Real estate analysis can be overwhelming. Our tools do the heavy lifting so you can focus on what matters.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-blue-600">
                  <path d="m21 7-9-5-9 5v10l9 5 9-5V7z"></path>
                  <path d="M3 7v10"></path>
                  <path d="m12 12 9-5"></path>
                  <path d="m12 12 0 10"></path>
                  <path d="m12 12-9-5"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">3D Property Viewer</h3>
              <p className="text-gray-600">Experience properties like never before with our immersive 3D walkthrough technology.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-blue-600">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Market Analytics</h3>
              <p className="text-gray-600">Make data-driven decisions with our advanced real-time market analysis tools.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-blue-600">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Matching</h3>
              <p className="text-gray-600">Our AI algorithm connects you with properties that match your preferences perfectly.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-16 text-center">Choose a partner that gets you</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col">
              <h3 className="text-xl font-bold mb-4">We've been in your shoes before</h3>
              <p className="text-gray-600">
                Propr was built with homebuyers and investors in mind. Whether navigating mortgage options or maximizing investment returns, we help guide you through every step of your real estate journey.
              </p>
            </div>
            
            <div className="flex flex-col">
              <h3 className="text-xl font-bold mb-4">We meet you where you're at</h3>
              <p className="text-gray-600">
                Whether you're a first-time homebuyer or a seasoned investor, we provide personalized strategies that fit your unique needs and goals.
              </p>
            </div>
            
            <div className="flex flex-col">
              <h3 className="text-xl font-bold mb-4">Big opportunities, transparent pricing</h3>
              <p className="text-gray-600">
                We believe you shouldn't need deep pockets to benefit from smart real estate decisions. We take a holistic approach to property search, considering all factors to help you find the perfect match.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-16 text-center">What our clients are saying</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold">Sarah K.</h4>
                  <p className="text-gray-500 text-sm">First-time Homebuyer</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Propr's tools made my first home purchase so much easier. The 3D tours saved me countless hours of in-person viewings, and their market analysis gave me confidence in my decision."
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold">Michael T.</h4>
                  <p className="text-gray-500 text-sm">Property Investor</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I've been using Propr for all my investment properties. Their analytics platform has helped me identify opportunities that I would have missed otherwise. The ROI calculations are spot on."
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 md:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold">Lisa J.</h4>
                  <p className="text-gray-500 text-sm">Homeowner</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The neighborhood insights feature was a game-changer. Propr showed me data about schools, crime rates, and future development plans that helped me choose the perfect location for my family."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Educational Content Section */}
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
      
      {/* Newsletter Section */}
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
    </div>
  );
}
