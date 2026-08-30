// components/LatestBlog.tsx
import React from "react";
import Title from "./Title";
import { getLatestBlogs } from "@/sanity/queries";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import dayjs from "dayjs";

const LatestBlog = async () => {
  const blogs = await getLatestBlogs();
  
  if (!blogs || blogs.length === 0) return null;
  
  return (
    <div className="mb-8 lg:mb-16">
      <Title>Neueste Blogartikel</Title>
      
      {/* Mobile: Compact Horizontal Scroll */}
      <div className="lg:hidden overflow-x-auto pb-3 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] mt-2">
        <div className="flex gap-2.5">
          {blogs?.map((blog) => (
            <div 
              key={blog?._id} 
              className="rounded-lg overflow-hidden bg-white border border-gray-100 flex-shrink-0 w-[160px] snap-start shadow-sm hover:shadow-md transition-shadow"
            >
              {blog?.mainImage && (
                <Link href={`/blog/${blog?.slug?.current}`} className="block relative">
                  <Image
                    src={urlFor(blog?.mainImage).url()}
                    alt={blog?.title || "Blog"}
                    width={200}
                    height={120}
                    className="w-full h-24 object-cover"
                  />
                </Link>
              )}
              <div className="p-2.5">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  {blog?.blogcategories?.slice(0, 2).map((item, index) => (
                    <span
                      key={index}
                      className="text-[8px] px-1.5 py-0.5 bg-rose-50 text-rose-500 font-medium rounded-full"
                    >
                      {item?.title}
                    </span>
                  ))}
                  <span className="flex items-center gap-0.5 text-[8px] text-gray-400">
                    <Calendar size={10} />
                    {dayjs(blog.publishedAt).format("DD.MM.")}
                  </span>
                </div>
                <Link
                  href={`/blog/${blog?.slug?.current}`}
                  className="text-[11px] font-medium tracking-wide line-clamp-2 hover:text-rose-500 transition-colors leading-tight"
                >
                  {blog?.title}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tablet: Slightly larger cards */}
      <div className="hidden md:grid lg:hidden grid-cols-2 gap-3 mt-3">
        {blogs?.slice(0, 4).map((blog) => (
          <div 
            key={blog?._id} 
            className="rounded-lg overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            {blog?.mainImage && (
              <Link href={`/blog/${blog?.slug?.current}`} className="block relative">
                <Image
                  src={urlFor(blog?.mainImage).url()}
                  alt={blog?.title || "Blog"}
                  width={400}
                  height={200}
                  className="w-full h-32 object-cover"
                />
              </Link>
            )}
            <div className="p-3">
              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                {blog?.blogcategories?.slice(0, 2).map((item, index) => (
                  <span
                    key={index}
                    className="text-[9px] px-2 py-0.5 bg-rose-50 text-rose-500 font-medium rounded-full"
                  >
                    {item?.title}
                  </span>
                ))}
                <span className="flex items-center gap-1 text-[9px] text-gray-400">
                  <Calendar size={11} />
                  {dayjs(blog.publishedAt).format("DD.MM.YYYY")}
                </span>
              </div>
              <Link
                href={`/blog/${blog?.slug?.current}`}
                className="text-xs font-semibold tracking-wide line-clamp-2 hover:text-rose-500 transition-colors leading-snug"
              >
                {blog?.title}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Grid */}
      <div className="hidden lg:grid grid-cols-2 xl:grid-cols-4 gap-5 mt-4">
        {blogs?.slice(0, 4).map((blog) => (
          <div 
            key={blog?._id} 
            className="rounded-xl overflow-hidden bg-white border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            {blog?.mainImage && (
              <Link href={`/blog/${blog?.slug?.current}`} className="block relative overflow-hidden">
                <Image
                  src={urlFor(blog?.mainImage).url()}
                  alt={blog?.title || "Blog"}
                  width={500}
                  height={300}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>
            )}
            <div className="p-4">
              <div className="flex items-center gap-2 text-xs flex-wrap">
                {blog?.blogcategories?.slice(0, 2).map((item, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-rose-50 text-rose-500 font-medium rounded-full text-[10px]"
                  >
                    {item?.title}
                  </span>
                ))}
                <span className="flex items-center gap-1 text-gray-400 text-[10px]">
                  <Calendar size={12} />
                  {dayjs(blog.publishedAt).format("DD.MM.YYYY")}
                </span>
              </div>
              <Link
                href={`/blog/${blog?.slug?.current}`}
                className="text-sm font-semibold tracking-wide mt-2 line-clamp-2 hover:text-rose-500 transition-colors"
              >
                {blog?.title}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestBlog;