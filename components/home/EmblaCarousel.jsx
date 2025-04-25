"use client";

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

// Feature Card Component
const FeatureCard = ({ icon, title, description, index }) => {
  // Generate different silvery gradients based on the index
  const gradients = [
    "linear-gradient(135deg, #e6e6e6 0%, #f5f5f5 50%, #d9e1e8 100%)",
    "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 50%, #e2e8f0 100%)",
    "linear-gradient(135deg, #d8dee9 0%, #e5e9f0 50%, #eceff4 100%)",
    "linear-gradient(135deg, #dfe6e9 0%, #b2bec3 50%, #dfe6e9 100%)",
    "linear-gradient(135deg, #e2e8f0 0%, #94a3b8 50%, #e2e8f0 100%)",
    "linear-gradient(135deg, #cfd9df 0%, #e2ebf0 50%, #cfd9df 100%)",
    "linear-gradient(135deg, #e0e0e0 0%, #c9d6df 50%, #e0e0e0 100%)"
  ];
  
  const gradientStyle = {
    background: gradients[index % gradients.length],
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  return (
  <div className="w-[280px] h-[400px] bg-white flex-shrink-0 rounded-[20px] overflow-hidden flex flex-col shadow-[0_17px_37px_0_rgba(41,42,45,.02)]">
    {/* Gradient area at the top */}
    <div className="h-[200px] relative" style={gradientStyle}>
      {/* Icon removed as requested */}
    </div>
    
    {/* Content area */}
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600 text-sm line-clamp-2 mb-4">{description}</p>
      
      {/* Button */}
      <div className="mt-auto">
        <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
          Learn More
        </button>
      </div>
    </div>
  </div>
);
}

const EmblaCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false, // Changed from true to false for click-to-drag
    loop: false
  });
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  // Features data
  const features = [
    {
      icon: "M21 7L9 19L3.5 13.5L4.91 12.09L9 16.17L19.59 5.59L21 7Z",
      title: "Direct Mail",
      description: "We locate property investors at their real addresses, not their investment buildings, and send targeted direct mail."
    },
    {
      icon: "M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM15.88 8.29L10 14.17L8.12 12.29C7.73 11.9 7.1 11.9 6.71 12.29C6.32 12.68 6.32 13.31 6.71 13.7L9.3 16.29C9.69 16.68 10.32 16.68 10.71 16.29L17.3 9.7C17.69 9.31 17.69 8.68 17.3 8.29C16.91 7.9 16.27 7.9 15.88 8.29Z",
      title: "Unaddressed Mail",
      description: "Deliver targeted marketing materials to specific neighborhoods or properties without requiring individual addresses."
    },
    {
      icon: "M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.9 10 8V16C10 17.1 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z",
      title: "Retargeting Ads",
      description: "Connect with prospects across the web with targeted ads that follow them after they've visited your property pages."
    },
    {
      icon: "M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z",
      title: "Landing Pages",
      description: "Every property gets its own branded landing page with your name and contact info, establishing you as the expert."
    },
    {
      icon: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 7c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm6 5H6v-.99c.2-.72 3.3-2.01 6-2.01s5.8 1.29 6 2v1z",
      title: "QR Code Tracking",
      description: "Track engagement and conversion through custom QR codes that connect your print materials to your digital presence."
    },
    {
      icon: "M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z",
      title: "Email Campaigns",
      description: "Engage with prospects through targeted email campaigns that deliver personalized property insights directly to their inbox."
    },
    {
      icon: "M22 12C22 6.49 17.51 2 12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM15 12C15 13.66 13.66 15 12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12Z",
      title: "Social Network Ads",
      description: "Reach potential buyers and sellers where they spend their time with targeted ads across major social media platforms."
    },
  ];

  // Callbacks for handling carousel events
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  // Initialize and update carousel
  useEffect(() => {
    if (!emblaApi) return;
    
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    
    emblaApi.on('select', onSelect);
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div className="overflow-visible" ref={emblaRef}>
        <div className="flex space-x-10">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
      
      {/* Pagination Dots */}
      <div className="flex justify-center mt-8 space-x-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={`h-3 w-3 rounded-full transition-all ${
              index === selectedIndex 
                ? 'bg-gray-800 w-6' 
                : 'bg-gray-300'
            }`}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default EmblaCarousel;
