// app/(client)/riff-raff/page.tsx
import Container from "@/components/Container";
import Title from "@/components/Title";
import { urlFor } from "@/sanity/lib/image";
import { getAllBlogs } from "@/sanity/queries";
import dayjs from "dayjs";
import "dayjs/locale/de";
import { Calendar, User, Tag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// Set German locale for dayjs
dayjs.locale("de");

const BlogPage = async () => {
  const blogs = await getAllBlogs(12);

  return (
    <div className="py-6 sm:py-10 bg-white">
      <Container>
        <div className="mb-6 sm:mb-10">
          <Title className="text-2xl sm:text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              Unser Blog
            </span>
          </Title>
          <p className="text-gray-500 text-sm sm:text-base mt-1">
            Entdecken Sie die neuesten Artikel, Tipps und Inspirationen
          </p>
        </div>

        {blogs?.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl">
            <p className="text-gray-500">Noch keine Blog-Artikel vorhanden.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {blogs?.map((blog) => (
              <article 
                key={blog?._id} 
                className="group rounded-xl overflow-hidden border border-rose-100 bg-white hover:shadow-lg hover:shadow-rose-100/50 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <Link href={`/riff-raff/${blog?.slug?.current}`} className="block overflow-hidden">
                  {blog?.mainImage ? (
                    <Image
                      src={urlFor(blog?.mainImage).url()}
                      alt={blog?.title || "Blog Image"}
                      width={600}
                      height={400}
                      className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                      <span className="text-4xl">📝</span>
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="p-4 sm:p-5">
                  {/* Meta info */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-500 mb-2">
                    {blog?.blogcategories && blog.blogcategories.length > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full">
                        <Tag className="w-3 h-3" />
                        {blog.blogcategories[0]?.title}
                      </span>
                    )}
                    {blog?.publishedAt && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {dayjs(blog.publishedAt).format("DD. MMM YYYY")}
                      </span>
                    )}
                    {blog?.author && (
                      <span className="inline-flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {blog.author.name}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <Link 
                    href={`/riff-raff/${blog?.slug?.current}`}
                    className="block group-hover:text-rose-500 transition-colors"
                  >
                    <h2 className="text-base sm:text-lg font-bold text-gray-800 line-clamp-2">
                      {blog?.title}
                    </h2>
                  </Link>

                  {/* Excerpt */}
                  {blog?.excerpt && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                      {blog.excerpt}
                    </p>
                  )}

                  {/* Read more */}
                  <Link
                    href={`/riff-raff/${blog?.slug?.current}`}
                    className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors group-hover:gap-2"
                  >
                    <span>Weiterlesen</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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