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
      <div className="bg-background">
        {/* Condo Information Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column - Condo Details */}
            <div className="md:col-span-8">
              
              {/* Key Facts */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Key Facts</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Property Type</p>
                    <p className="font-medium">{condo.propertyType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Year Built</p>
                    <p className="font-medium">{condo.yearBuilt}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Developer</p>
                    <p className="font-medium">{condo.developer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Architect</p>
                    <p className="font-medium">{condo.architect}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Stories</p>
                    <p className="font-medium">{condo.stories}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Suites</p>
                    <p className="font-medium">{condo.suites}</p>
                  </div>
                </div>
              </div>
              
              {/* Amenities Section */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {condo.amenities.map((amenity, index) => (
                    <span key={index} className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Column - Listings */}
            <div className="md:col-span-4">
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Listings</h2>
                
                <Tabs defaultValue="sale" className="w-full">
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="sale">For Sale ({listings.forSale})</TabsTrigger>
                    <TabsTrigger value="rent">For Rent ({listings.forRent})</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="sale" className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Average Price</p>
                      <p className="text-2xl font-bold">{listings.averagePrice}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Price Per Sq.Ft.</p>
                      <p className="text-lg font-medium">{listings.averagePricePerSqft}</p>
                    </div>
                    <Button className="w-full mt-4">View All Listings</Button>
                  </TabsContent>
                  
                  <TabsContent value="rent" className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Average Rent</p>
                      <p className="text-2xl font-bold">{listings.averageRent}</p>
                    </div>
                    <Button className="w-full mt-4">View All Rentals</Button>
                  </TabsContent>
                </Tabs>
                
                {/* Agent Information */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-16 h-16 overflow-hidden">
                      <img 
                        src={agent.image}
                        alt={agent.name}
                        className="rounded-full object-cover w-full h-full" 
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{agent.name}</h3>
                      <p className="text-sm text-muted-foreground">{agent.title}</p>
                    </div>
                  </div>
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
