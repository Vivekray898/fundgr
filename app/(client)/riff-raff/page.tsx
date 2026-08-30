// app/(client)/riff-raff/page.tsx
import Container from "@/components/Container";
import Title from "@/components/Title";
import { urlFor } from "@/sanity/lib/image";
import { getAllBlogs, getBlogCategories } from "@/sanity/queries";
import dayjs from "dayjs";
import "dayjs/locale/de";
import { Calendar, User, Tag, ArrowRight, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

dayjs.locale("de");

interface BlogPost {
  _id: string;
  title?: string;
  slug?: { current: string };
  mainImage?: any;
  excerpt?: string;
  publishedAt?: string;
  blogcategories?: Array<{ title: string; slug?: { current: string } }>;
  author?: { name: string };
  isLatest?: boolean;
}

interface BlogCategory {
  _id: string;
  title: string;
  slug?: { current: string };
}

const BlogPage = async () => {
  const blogs: BlogPost[] = await getAllBlogs(12);
  const categories: BlogCategory[] = await getBlogCategories();

  // Get unique categories from blogs
  const uniqueCategories = categories?.filter((cat, index, self) => 
    index === self.findIndex((c) => c.title === cat.title)
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-900">
                <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                  Unser Blog
                </span>
              </h1>
              <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                {blogs?.length || 0} Artikel • Neueste Tipps & Inspirationen
              </p>
            </div>
            {/* Latest Badge */}
            {blogs?.some(b => b.isLatest) && (
              <div className="flex items-center gap-1 bg-rose-50 px-3 py-1.5 rounded-full">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-[10px] md:text-xs font-medium text-rose-600">
                  Neueste Beiträge
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Container className="px-3 md:px-4 py-4 md:py-6">
        {/* Search Bar - Mobile Friendly */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-4 md:mb-6">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text"
              placeholder="Blogartikel suchen..."
              className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Category Chips - Dynamic from Sanity */}
        {uniqueCategories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-3 md:pb-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <button className="px-4 py-1.5 md:px-5 md:py-2 bg-rose-500 text-white text-xs md:text-sm font-medium rounded-full whitespace-nowrap flex-shrink-0">
              Alle
            </button>
            {uniqueCategories.map((category) => (
              <button
                key={category._id}
                className="px-4 py-1.5 md:px-5 md:py-2 bg-white text-gray-600 text-xs md:text-sm font-medium rounded-full whitespace-nowrap border border-gray-200 hover:border-rose-300 hover:text-rose-500 transition-colors flex-shrink-0"
              >
                {category.title}
              </button>
            ))}
          </div>
        )}

        {/* Blog Grid */}
        {blogs?.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500">Noch keine Blog-Artikel vorhanden.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 md:gap-5">
            {blogs?.map((blog: BlogPost) => (
              <article 
                key={blog?._id} 
                className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg hover:shadow-rose-100/30 transition-all duration-300 active:scale-[0.98] md:active:scale-[0.99]"
              >
                {/* Image */}
                <Link href={`/riff-raff/${blog?.slug?.current}`} className="block overflow-hidden relative">
                  {blog?.mainImage ? (
                    <div className="relative w-full aspect-[16/10]">
                      <Image
                        src={urlFor(blog?.mainImage).url()}
                        alt={blog?.title || "Blog Image"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[16/10] bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
                      <span className="text-5xl">📝</span>
                    </div>
                  )}
                  {/* Latest Badge */}
                  {blog?.isLatest && (
                    <span className="absolute top-3 right-3 bg-rose-500 text-white text-[8px] md:text-[10px] font-medium px-2 py-1 rounded-full shadow-lg">
                      Neu
                    </span>
                  )}
                </Link>

                {/* Content */}
                <div className="p-3 md:p-5">
                  {/* Meta info */}
                  <div className="flex flex-wrap items-center gap-1.5 md:gap-3 text-[10px] md:text-xs text-gray-500 mb-1.5 md:mb-2">
                    {blog?.blogcategories && blog.blogcategories.length > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full">
                        <Tag className="w-2.5 h-2.5 md:w-3 md:h-3" />
                        {blog.blogcategories[0]?.title}
                      </span>
                    )}
                    {blog?.publishedAt && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5 md:w-3 md:h-3" />
                        {dayjs(blog.publishedAt).format("DD.MM.")}
                      </span>
                    )}
                    {blog?.author && (
                      <span className="inline-flex items-center gap-1">
                        <User className="w-2.5 h-2.5 md:w-3 md:h-3" />
                        <span className="truncate max-w-[60px] md:max-w-[100px]">
                          {blog.author.name}
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <Link 
                    href={`/riff-raff/${blog?.slug?.current}`}
                    className="block group-hover:text-rose-500 transition-colors"
                  >
                    <h2 className="text-sm md:text-lg font-bold text-gray-800 line-clamp-2 leading-snug">
                      {blog?.title}
                    </h2>
                  </Link>

                  {/* Excerpt - Hide on mobile */}
                  {blog?.excerpt && (
                    <p className="text-xs md:text-sm text-gray-600 mt-1.5 md:mt-2 line-clamp-2 md:line-clamp-3 hidden sm:block">
                      {blog.excerpt}
                    </p>
                  )}

                  {/* Read more */}
                  <Link
                    href={`/riff-raff/${blog?.slug?.current}`}
                    className="inline-flex items-center gap-1 mt-2 md:mt-3 text-[10px] md:text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors group-hover:gap-2"
                  >
                    <span>Weiterlesen</span>
                    <ArrowRight className="w-3 h-3 md:w-4 md:h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default BlogPage;