"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

const items = [
  {
    "id": 1,
    "name": "Alex Johnson",
    "title": "Sales Representative, Keller Williams",
    "quote": "Propr Marketing helped me secure two listings within 60 days. Their system is hands-down the best targeted marketing I've ever used."
  },
  {
    "id": 2,
    "name": "Michelle Tran",
    "title": "Broker, RE/MAX Hallmark",
    "quote": "The building-specific branding makes all the difference. Owners recognize me now—and when they're ready to sell, they call me first."
  },
  {
    "id": 3,
    "name": "Jason Patel",
    "title": "Real Estate Agent, Royal LePage",
    "quote": "Direct mail alone was great, but combining it with digital retargeting doubled my inquiries. The ecosystem approach really works."
  },
  {
    "id": 4,
    "name": "Sarah Thompson",
    "title": "Team Lead, Right at Home Realty",
    "quote": "Within weeks, I had investors calling to talk about listing. Propr Marketing made it easy for me to stand out in a competitive building."
  },
  {
    "id": 5,
    "name": "David Kim",
    "title": "Real Estate Broker, Century 21",
    "quote": "Having my own domain tied to a building gave me instant credibility. I secured a major listing just from one mailing campaign."
  },
  {
    "id": 6,
    "name": "Olivia Brown",
    "title": "Realtor, Bosley Real Estate",
    "quote": "The personalized landing pages gave me a professional edge. Clients love getting real-time updates and it’s boosted my referral business."
  },
  {
    "id": 7,
    "name": "Daniel Green",
    "title": "Agent, Sotheby's International Realty",
    "quote": "Before Propr Marketing, I was lost in the crowd. Now, I’m the first agent investors think of when they want to list."
  },
  {
    "id": 8,
    "name": "Priya Desai",
    "title": "Sales Representative, Homelife",
    "quote": "The quality of leads from Propr Marketing is unmatched. These aren't tire-kickers—they're serious sellers."
  },
  {
    "id": 9,
    "name": "Lucas Nguyen",
    "title": "Agent, eXp Realty",
    "quote": "Their process is turnkey. I focus on selling while Propr Marketing builds my lead pipeline month after month."
  },
  {
    "id": 10,
    "name": "Rachel Adams",
    "title": "Broker Associate, Chestnut Park Real Estate",
    "quote": "This system isn't just about getting more leads—it's about building a recognizable, trusted brand in the communities I work in."
  }
]

const Testimonials = ({
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className
}) => {
  const containerRef = React.useRef(null);
  const scrollerRef = React.useRef(null);

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty("--animation-direction", "forwards");
      } else {
        containerRef.current.style.setProperty("--animation-direction", "reverse");
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <section className="py-24 md:py-32 w-full flex flex-col items-center bg-[#ebe9e3]">
      <h2 className="text-3xl font-bold text-center mb-16">What our clients are saying</h2>
      <div
        ref={containerRef}
        className={cn(
          "scroller relative z-20 w-full overflow-hidden",
          className
        )}>
        <ul
          ref={scrollerRef}
          className={cn(
            "flex w-max min-w-full shrink-0 flex-nowrap gap-8 py-10",
            start && "animate-scroll",
            pauseOnHover && "hover:[animation-play-state:paused]"
          )}>
          {items.map((item, idx) => (
            <li
              className="relative w-[350px] max-w-full shrink-0 rounded-2xl border border-b-0 border-zinc-200 bg-[linear-gradient(180deg,#fafafa,#f5f5f5)] px-8 py-6 md:w-[450px] dark:border-zinc-700 dark:bg-[linear-gradient(180deg,#27272a,#18181b)]"
              key={item.id}>
              <blockquote>
              <div
                aria-hidden="true"
                className="user-select-none pointer-events-none absolute -top-0.5 -left-0.5 -z-1 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"></div>
              <span
                className="relative z-20 text-sm leading-[1.6] font-normal text-neutral-800 dark:text-gray-100">
                {item.quote}
              </span>
              <div className="relative z-20 mt-6 flex flex-row items-center">
                <span className="flex flex-col gap-1">
                  <span
                    className="text-sm leading-[1.6] font-normal text-neutral-500 dark:text-gray-400">
                    {item.name}
                  </span>
                  <span
                    className="text-sm leading-[1.6] font-normal text-neutral-500 dark:text-gray-400">
                    {item.title}
                  </span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
    </section>
  );
};

export default Testimonials;