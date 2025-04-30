"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ContactAgentButton } from "@/components/condo/ContactAgentButton";

function CondoHeroSection ({
  condoAddress,
  condo = {
    name: "Liberty Lakeview Towers",
    address: "65-87 East Liberty St & 6 Pirandello St",
    neighborhood: "Liberty Village",
    city: "Toronto",
    propertyType: "Condo",
    yearBuilt: "2014",
    developer: "CanAlfa Group",
    architect: "Page + Steele Architects",
    stories: 23,
    suites: 378,
    amenities: ["Concierge", "Gym", "Party Room", "Rooftop Deck", "Visitor Parking"],
    images: [
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2070",
      "https://images.unsplash.com/photo-1451976426598-a7593bd6d0b2?q=80&w=2070",
      "https://images.unsplash.com/photo-1512699355324-f07e3106ddi?q=80&w=2070",
    ]
  },
  listings = {
    forSale: 12,
    forRent: 8,
    averagePrice: "$750,000",
    averagePricePerSqft: "$920",
    averageRent: "$2,800",
  },
  agent = {
    name: "Sarah Johnson",
    title: "Senior Real Estate Agent",
    experience: "10+ years",
    email: "sarah.johnson@propr.com",
    phone: "(416) 555-1234",
    specialization: "Luxury Condos",
    bio: "Sarah specializes in Liberty Village properties with over 10 years of experience in the Toronto real estate market.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1974"
  }
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const decodedAddress = decodeURIComponent(condoAddress);

  return (
    <>
      {/* Hero Section with dark background */}
      <section className="pt-32 pb-16 md:py-32 lg:py-40 relative overflow-hidden bg-[#292a2d]">
        {/* Background that extends to the top of the page */}
        <div className="absolute inset-0 bg-[#292a2d] -z-10"></div>
        
        <div className="container mx-auto px-4 max-w-[90%]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left column - Text content */}
            <div className="flex flex-col">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal text-white mb-6">
                {decodedAddress}
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                {condo.propertyType} in {condo.neighborhood} • {condo.suites} Suites • Built {condo.yearBuilt}
              </p>
              
              <div className="mt-4">
                <Button size="lg" className="text-lg px-8 py-6 bg-white text-[#292a2d] hover:bg-gray-200 rounded-md">
                  View Listings
                </Button>
              </div>
            </div>
            
            {/* Right column - Image with rounded corners */}
            <div className="relative h-[350px] md:h-[450px] rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={condo.images[activeImageIndex]}
                alt={`${condo.name} - ${activeImageIndex + 1}`}
                className="absolute w-full h-full object-cover rounded-2xl"
              />
              
              {/* Image Navigation */}
              <div className="absolute inset-x-0 bottom-4 flex justify-center space-x-2">
                {condo.images.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "h-2 w-2 rounded-full transition-all",
                      activeImageIndex === index ? "bg-white w-6" : "bg-white/60"
                    )}
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
              
              {/* Image Navigation Arrows */}
              <div className="absolute inset-y-0 left-4 flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-black/30 border-none text-white hover:bg-black/50"
                  onClick={() => setActiveImageIndex((prev) => (prev === 0 ? condo.images.length - 1 : prev - 1))}
                  aria-label="Previous image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                </Button>
              </div>
              <div className="absolute inset-y-0 right-4 flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-black/30 border-none text-white hover:bg-black/50"
                  onClick={() => setActiveImageIndex((prev) => (prev === condo.images.length - 1 ? 0 : prev + 1))}
                  aria-label="Next image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Content Sections */}
      <div className="bg-[#fbfbf9]">
        {/* Condo Information Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column - Condo Details */}
            <div className="md:col-span-8 flex flex-col">
              
              {/* Key Facts */}
              <div className="h-full">
                <div className="p-8 md:p-10 rounded-lg shadow-sm h-full" style={{ background: "linear-gradient(28.01deg, #dadae0 16.6%, #ebebe6 82.01%)" }}>
                  <div className="flex flex-col h-full">
                    <div className="inline-block text-gray-700 font-semibold mb-2">Building Information</div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8 mb-6">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Property Type</p>
                        <p className="text-lg font-medium">{condo.propertyType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Year Built</p>
                        <p className="text-lg font-medium">{condo.yearBuilt}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Developer</p>
                        <p className="text-lg font-medium">{condo.developer}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Architect</p>
                        <p className="text-lg font-medium">{condo.architect}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Stories</p>
                        <p className="text-lg font-medium">{condo.stories}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Suites</p>
                        <p className="text-lg font-medium">{condo.suites}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mt-4 mb-6">
                      Located in the heart of {condo.neighborhood}, {condo.name} offers modern urban living with exceptional amenities and convenient access to the city's best attractions.
                    </p>
                    
                    {/* Amenities Section inside card */}
                    <div className="mt-auto">
                      <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                      <div className="flex flex-wrap gap-2">
                        {condo.amenities.map((amenity, index) => (
                          <span key={index} className="bg-white/60 text-gray-800 px-3 py-1 rounded-full text-sm">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Listings */}
            <div className="md:col-span-4">
              <div className="p-8 md:p-10 rounded-lg shadow-sm bg-[#e3dfcf] flex flex-col items-center text-center h-full">
                {/* Agent Information */}
                <div className="w-full flex flex-col items-center">
                  <div className="flex items-center mb-6 gap-4">
                    <div className="relative w-16 h-16 overflow-hidden">
                      <img 
                        src={agent.image}
                        alt={agent.name}
                        className="rounded-full object-cover w-full h-full border-2 border-white" 
                      />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-medium">{agent.name}</h3>
                      <p className="text-sm text-gray-700">{agent.title}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mt-2 w-full">
                    
                    <div className="flex items-center gap-2 w-full">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 text-gray-700 flex-shrink-0">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <span className="text-sm overflow-hidden text-ellipsis">{agent.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 w-full">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 text-gray-700 flex-shrink-0">
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                      <span className="text-sm overflow-hidden text-ellipsis">{agent.email}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 border-t border-gray-300 pt-4 w-full">
                    <p className="text-sm text-gray-700">{agent.bio}</p>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <ContactAgentButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CondoHeroSection;
