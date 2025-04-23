"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function CondoHeroSection({ 
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

  return (
    <div className="w-full bg-background">
      {/* Hero Section - Two Column Layout */}
      <div className="container mx-auto px-6 py-8 max-w-screen-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-h-[500px]">
          {/* Left Column - Agent Information (Reversed) */}
          <div className="lg:col-span-4 h-full">
            <div className="bg-card border shadow-sm rounded-lg h-full flex flex-col">
              <div className="p-6 flex flex-col items-center">
                {/* Agent Avatar */}
                <div className="relative w-40 h-40 mb-4 overflow-hidden">
                  <img 
                    src={agent.image} 
                    alt={agent.name}
                    className="rounded-full object-cover w-full h-full border-4 border-background shadow-md" 
                  />
                </div>
                
                {/* Agent Details */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold">{agent.name}</h3>
                  <p className="text-muted-foreground">{agent.title}</p>
                </div>
                
                <div className="w-full space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 text-muted-foreground">
                      <polyline points="12 8 12 12 14 14" />
                      <path d="M3.05 11a9 9 0 1 1 .5 4" />
                    </svg>
                    <span className="text-sm">{agent.experience} experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 text-muted-foreground">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span className="text-sm">{agent.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 text-muted-foreground">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <span className="text-sm">{agent.email}</span>
                  </div>
                  
                  <p className="mt-4 text-sm text-muted-foreground">{agent.bio}</p>
                </div>
                
                <Button className="w-full mt-auto">
                  Contact Agent
                </Button>
              </div>
            </div>
          </div>
          
          {/* Right Column - Property Images (Reversed) */}
          <div className="lg:col-span-8 relative h-full overflow-hidden rounded-lg">
            <div className="relative h-full w-full">
              <img 
                src={condo.images[activeImageIndex]} 
                alt={`${condo.name} - ${activeImageIndex + 1}`} 
                className="h-full w-full object-cover"
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
      </div>
      
      {/* Condo Information Section */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column - Condo Details */}
          <div className="md:col-span-8">
            <h1 className="text-3xl font-bold tracking-tight">{condo.name}</h1>
            <p className="text-lg text-muted-foreground mt-1">{condo.address}</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-medium">
                {condo.neighborhood}
              </span>
              <span className="text-sm text-muted-foreground">{condo.city}</span>
            </div>
            
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
              
              <div className="mt-6 pt-6 border-t">
                <Button variant="outline" className="w-full" size="lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 size-4">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download Building Info
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
