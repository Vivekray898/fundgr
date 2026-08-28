"use client";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
  productTypes?: Array<{ title: string; value: string }>;
}

const HomeTabbar = ({ selectedTab, onTabSelect, productTypes = [] }: Props) => {
  // Add "All" option at the beginning
  const allProductTypes = [{ title: "All", value: "all" }, ...productTypes];
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Check scroll position for arrow visibility
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScroll();
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [allProductTypes]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex items-center gap-3 justify-between">
      {/* Scrollable Tabs Container with Arrow Buttons */}
      <div className="flex-1 min-w-0 relative flex items-center gap-2">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="hidden lg:flex flex-shrink-0 items-center justify-center w-8 h-8 rounded-full bg-white border border-rose-200 shadow-md hover:bg-rose-50 hover:border-rose-400 transition-all duration-200 z-10"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 text-rose-500" />
          </button>
        )}

        {/* Scroll Container */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div className="flex items-center gap-1.5 md:gap-3 w-max">
            {allProductTypes?.map((item) => (
              <button
                onClick={() => onTabSelect(item?.title)}
                key={item?.title}
                className={`flex-shrink-0 border border-rose-200/50 px-4 py-1.5 md:px-6 md:py-2 rounded-full hover:from-rose-500 hover:to-pink-500 hover:border-rose-500 hover:text-white hoverEffect text-sm whitespace-nowrap transition-all duration-200 ${
                  selectedTab === item?.title 
                    ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-rose-500 shadow-md shadow-rose-200" 
                    : "bg-gradient-to-r from-rose-50/30 to-pink-50/30 text-gray-700 hover:from-rose-500 hover:to-pink-500"
                }`}
              >
                {item?.title}
              </button>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="hidden lg:flex flex-shrink-0 items-center justify-center w-8 h-8 rounded-full bg-white border border-rose-200 shadow-md hover:bg-rose-50 hover:border-rose-400 transition-all duration-200 z-10"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 text-rose-500" />
          </button>
        )}
      </div>

      {/* See All Button */}
      <Link
        href={"/shop"}
        className="flex-shrink-0 border border-rose-200 px-4 py-1 rounded-full hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 hover:text-white hover:border-rose-500 hoverEffect text-sm text-gray-700 transition-all duration-200"
      >
        See all
      </Link>
    </div>
  );
};

export default HomeTabbar;