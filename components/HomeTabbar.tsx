"use client";
import Link from "next/link";

interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
  productTypes?: Array<{ title: string; value: string }>;
}

const HomeTabbar = ({ selectedTab, onTabSelect, productTypes = [] }: Props) => {
  // Add "All" option at the beginning
  const allProductTypes = [{ title: "All", value: "all" }, ...productTypes];

  return (
    <div className="flex items-center gap-5 justify-between">
      {/* Scrollable Tabs Container */}
      <div className="flex-1 min-w-0 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex items-center gap-1.5 md:gap-3 w-max">
          {allProductTypes?.map((item) => (
            <button
              onClick={() => onTabSelect(item?.title)}
              key={item?.title}
              className={`flex-shrink-0 border border-shop_light_green/30 px-4 py-1.5 md:px-6 md:py-2 rounded-full hover:bg-shop_light_green hover:border-shop_light_green hover:text-white hoverEffect text-sm whitespace-nowrap ${
                selectedTab === item?.title 
                  ? "bg-shop_light_green text-white border-shop_light_green" 
                  : "bg-shop_light_green/10"
              }`}
            >
              {item?.title}
            </button>
          ))}
        </div>
      </div>

      {/* See All Button */}
      <Link
        href={"/shop"}
        className="flex-shrink-0 border border-darkColor px-4 py-1 rounded-full hover:bg-shop_light_green hover:text-white hover:border-shop_light_green hoverEffect text-sm"
      >
        See all
      </Link>
    </div>
  );
};

export default HomeTabbar;