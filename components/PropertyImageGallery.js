'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function PropertyImageGallery({ media }) {
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  // Handle ESC key to close lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);
  
  // When lightbox is open, prevent background scrolling
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen]);

  if (!media || media.length === 0) {
    return (
      <div className="aspect-video w-full bg-gray-200 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  // Limit to first 5 images or fewer if less are available
  const displayImages = media.slice(0, Math.min(5, media.length));
  const hasMultipleImages = media.length > 1;

  const handleImageClick = (index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };
  
  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };
  
  const goToNextImage = () => {
    setLightboxIndex((prevIndex) => 
      prevIndex === media.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const goToPrevImage = () => {
    setLightboxIndex((prevIndex) => 
      prevIndex === 0 ? media.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="w-full h-full p-1">
      {/* Image Grid with 1 large + 4 small in 2x2 */}
      <div className="grid grid-cols-4 grid-rows-2 gap-4 h-full">
        {/* Main large image - takes up 2 rows, 2 columns */}
        <div 
          className="col-span-2 row-span-2 relative rounded-lg overflow-hidden cursor-pointer"
          onClick={() => handleImageClick(0)}
        >
          <Image
            src={`/image-proxy?url=${encodeURIComponent(media[0].MediaURL)}`}
            alt={`Property main image`}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
            priority
          />
          
          {/* Image counter indicator */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
            1 of {media.length}
          </div>
        </div>

        {/* Small images in 2x2 grid */}
        {displayImages.slice(1, 5).map((item, index) => {
          const actualIndex = index + 1; // Since we're starting from the second image
          return (
            <div 
              key={actualIndex}
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
              onClick={() => handleImageClick(actualIndex)}
            >
              <Image
                src={`/image-proxy?url=${encodeURIComponent(item.MediaURL)}`}
                alt={`Property image ${actualIndex + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 300px"
                className="object-cover"
              />
              
              {/* Show "See all photos" overlay on the last image if there are more than 5 */}
              {actualIndex === 4 && media.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-medium">+{media.length - 5} more</span>
                </div>
              )}
            </div>
          );
        })}
        
        {/* Fill in with empty placeholders if less than 5 images */}
        {[...Array(Math.max(0, 5 - displayImages.length))].map((_, i) => (
          <div 
            key={`placeholder-${i}`}
            className="bg-gray-100 aspect-square rounded-lg"
          />
        ))}
      </div>

      {/* View All Images button if there are more than 5 images */}
      {media.length > 5 && (
        <div className="mt-2 flex justify-end">
          <button
            onClick={() => {
              setLightboxIndex(0); 
              setIsLightboxOpen(true);
            }} 
            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            View all {media.length} photos
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Fullscreen Image Lightbox/Carousel */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          {/* Close button */}
          <button 
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white"
            aria-label="Close lightbox"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          {/* Main image */}
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-full h-full max-h-screen max-w-screen-lg p-4">
              <Image
                src={`/image-proxy?url=${encodeURIComponent(media[lightboxIndex].MediaURL)}`}
                alt={`Property image ${lightboxIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
            
            {/* Image counter indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
              {lightboxIndex + 1} of {media.length}
            </div>
          </div>
          
          {/* Previous button */}
          {media.length > 1 && (
            <button
              onClick={goToPrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-3 text-white"
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          
          {/* Next button */}
          {media.length > 1 && (
            <button
              onClick={goToNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-3 text-white"
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}
          
          {/* Thumbnail strip (optional) */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center p-4 space-x-2 overflow-x-auto">
            {media.slice(0, Math.min(10, media.length)).map((item, index) => (
              <div
                key={index}
                onClick={() => setLightboxIndex(index)}
                className={`relative h-16 w-16 flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 ${
                  lightboxIndex === index ? 'border-white' : 'border-transparent'
                }`}
              >
                <Image
                  src={`/image-proxy?url=${encodeURIComponent(item.MediaURL)}`}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  sizes="64px" 
                  className="object-cover"
                />
              </div>
            ))}
            {media.length > 10 && (
              <div className="flex items-center justify-center h-16 px-3 text-white">
                +{media.length - 10} more
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
