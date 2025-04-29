"use client";

import HeroSection from "@/components/home/HeroSection";
import FeaturedSolutions from "@/components/home/FeaturedSolutions";
import CustomerExperience from "@/components/home/CustomerExperience";
import EmblaCarousel from "@/components/home/EmblaCarousel";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import FaqSection from "@/components/home/FaqSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Featured Solutions Section */}
      <FeaturedSolutions />
      
      {/* Customer Experience Section */}
      <CustomerExperience />
      
      {/* Testimonials/Features Carousel Section */}
      <section className="py-20 md:py-32 bg-[#e4e0d6] overflow-hidden">
        <div className="container mx-auto px-4 max-w-[90%]">
          <div className="mx-auto mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">More Than Mail. A Complete Marketing Ecosystem.</h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
                From mailbox to inbox to mobile, our system connects every touchpoint to help you win trust—and listings.
            </p>
          </div>
          
          <EmblaCarousel />
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <WhyChooseUs />
      
      {/* Testimonials Section */}
      <Testimonials />
      
      {/* FAQ Section */}
      <FaqSection />
    </div>
  );
}
