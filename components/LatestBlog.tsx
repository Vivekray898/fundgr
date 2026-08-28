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
  return (
    <div className="mb-10 lg:mb-20">
      <Title>Neueste Blogartikel</Title>
      
      {/* Mobile: Horizontal Scroll */}
      <div className="lg:hidden overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] mt-3">
        <div className="flex gap-3">
          {blogs?.map((blog) => (
            <div key={blog?._id} className="rounded-xl overflow-hidden bg-white border border-rose-100 min-w-[260px] sm:min-w-[300px] snap-start flex-shrink-0">
              {blog?.mainImage && (
                <Link href={`/blog/${blog?.slug?.current}`}>
                  <Image
                    src={urlFor(blog?.mainImage).url()}
                    alt={blog?.title || "Blog"}
                    width={500}
                    height={300}
                    className="w-full h-40 object-cover"
                  />
                </Link>
              )}
              <div className="p-3">
                <div className="flex items-center gap-2 text-[10px]">
                  {blog?.blogcategories?.map((item, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-rose-50 text-rose-500 font-medium rounded-full"
                    >
                      {item?.title}
                    </span>
                  ))}
                  <span className="flex items-center gap-1 text-gray-500">
                    <Calendar size={12} />{" "}
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

      {/* Desktop: Grid */}
      <div className="hidden lg:grid grid-cols-2 xl:grid-cols-4 gap-5 mt-5">
        {blogs?.map((blog) => (
          <div key={blog?._id} className="rounded-xl overflow-hidden bg-white border border-rose-100 hover:shadow-lg transition-all">
            {blog?.mainImage && (
              <Link href={`/blog/${blog?.slug?.current}`}>
                <Image
                  src={urlFor(blog?.mainImage).url()}
                  alt={blog?.title || "Blog"}
                  width={500}
                  height={500}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
            )}
            <div className="p-4">
              <div className="flex items-center gap-2 text-xs">
                {blog?.blogcategories?.map((item, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-rose-50 text-rose-500 font-medium rounded-full"
                  >
                    {item?.title}
                  </span>
                ))}
                <span className="flex items-center gap-1 text-gray-500">
                  <Calendar size={14} />{" "}
                  {dayjs(blog.publishedAt).format("DD.MM.YYYY")}
                </span>
              </div>
              <Link
                href={`/blog/${blog?.slug?.current}`}
                className="text-base font-semibold tracking-wide mt-3 line-clamp-2 hover:text-rose-500 transition-colors"
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