// app/(client)/riff-raff/[slug]/page.tsx
import Container from "@/components/Container";
import Title from "@/components/Title";
import { SINGLE_BLOG_QUERY_RESULT } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import {
  getBlogCategories,
  getOthersBlog,
  getSingleBlog,
} from "@/sanity/queries";
import dayjs from "dayjs";
import "dayjs/locale/de";
import { Calendar, ChevronLeft, User, Tag, Clock, ArrowRight } from "lucide-react";
import { PortableText } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

// Set German locale for dayjs
dayjs.locale("de");

// Define interface for blog categories
interface BlogCategory {
  title: string | null;
  slug: string | null;
}

const SingleBlogPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const blog: SINGLE_BLOG_QUERY_RESULT = await getSingleBlog(slug);
  if (!blog) return notFound();

  return (
    <div className="py-6 sm:py-10 bg-white">
      <Container className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-10">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Back Button */}
          <Link 
            href="/riff-raff" 
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-rose-500 transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Zurück zum Blog</span>
          </Link>

          {/* Main Image */}
          {blog?.mainImage && (
            <div className="rounded-xl overflow-hidden mb-6">
              <Image
                src={urlFor(blog?.mainImage).url()}
                alt={blog.title || "Blog Image"}
                width={800}
                height={500}
                className="w-full max-h-[400px] object-cover"
              />
            </div>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs sm:text-sm text-gray-500 mb-4">
            {blog?.blogcategories && blog.blogcategories.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="w-4 h-4 text-rose-400" />
                {blog.blogcategories.map((item: BlogCategory, index: number) => (
                  <span key={index} className="font-medium text-rose-600">
                    {item?.title || "Uncategorized"}
                    {index < (blog.blogcategories?.length || 1) - 1 && ", "}
                  </span>
                ))}
              </div>
            )}
            {blog?.author && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4 text-rose-400" />
                <span>{blog.author.name}</span>
              </div>
            )}
            {blog?.publishedAt && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-rose-400" />
                <span>{dayjs(blog.publishedAt).format("DD. MMMM YYYY")}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {blog?.title}
          </h1>

          {/* Body Content */}
          <div className="prose prose-rose max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-a:text-rose-500 hover:prose-a:text-rose-600 prose-strong:text-gray-800 prose-li:text-gray-600">
            {blog.body && (
              <PortableText
                value={blog.body}
                components={{
                  block: {
                    normal: ({ children }) => (
                      <p className="my-4 text-base/7 first:mt-0 last:mb-0">
                        {children}
                      </p>
                    ),
                    h2: ({ children }) => (
                      <h2 className="my-6 text-2xl font-bold text-gray-800 first:mt-0 last:mb-0">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="my-5 text-xl font-semibold text-gray-800 first:mt-0 last:mb-0">
                        {children}
                      </h3>
                    ),
                    h4: ({ children }) => (
                      <h4 className="my-4 text-lg font-semibold text-gray-800 first:mt-0 last:mb-0">
                        {children}
                      </h4>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="my-4 border-l-4 border-rose-300 pl-4 text-gray-600 italic first:mt-0 last:mb-0">
                        {children}
                      </blockquote>
                    ),
                  },
                  types: {
                    image: ({ value }: any) => (
                      <div className="my-6 rounded-xl overflow-hidden">
                        <Image
                          alt={value.alt || "Blog image"}
                          src={urlFor(value).width(800).url()}
                          className="w-full rounded-xl"
                          width={800}
                          height={500}
                        />
                        {value.alt && (
                          <p className="text-sm text-gray-400 text-center mt-2">
                            {value.alt}
                          </p>
                        )}
                      </div>
                    ),
                  },
                  list: {
                    bullet: ({ children }) => (
                      <ul className="list-disc pl-5 space-y-1 text-gray-600">
                        {children}
                      </ul>
                    ),
                    number: ({ children }) => (
                      <ol className="list-decimal pl-5 space-y-1 text-gray-600">
                        {children}
                      </ol>
                    ),
                  },
                  listItem: {
                    bullet: ({ children }) => (
                      <li className="my-1">{children}</li>
                    ),
                    number: ({ children }) => (
                      <li className="my-1">{children}</li>
                    ),
                  },
                  marks: {
                    strong: ({ children }) => (
                      <strong className="font-semibold text-gray-800">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic text-gray-600">{children}</em>
                    ),
                    link: ({ value, children }) => (
                      <Link
                        href={value.href}
                        className="text-rose-500 hover:text-rose-600 underline underline-offset-2 transition-colors"
                        target={value.href.startsWith("http") ? "_blank" : undefined}
                        rel={value.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      >
                        {children}
                      </Link>
                    ),
                  },
                }}
              />
            )}
          </div>

          {/* Back to Blog */}
          <div className="mt-8 pt-6 border-t border-rose-100">
            <Link
              href="/riff-raff"
              className="inline-flex items-center gap-2 text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Zurück zum Blog</span>
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <BlogSidebar slug={slug} />
      </Container>
    </div>
  );
};

const BlogSidebar = async ({ slug }: { slug: string }) => {
  const categories = await getBlogCategories();
  const blogs = await getOthersBlog(slug, 5);

  // Count blogs per category
  const categoryCounts: { [key: string]: number } = {};
  categories?.forEach((item: any) => {
    const catTitle = item?.blogcategories?.[0]?.title;
    if (catTitle) {
      categoryCounts[catTitle] = (categoryCounts[catTitle] || 0) + 1;
    }
  });

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div className="border border-rose-100 rounded-xl p-4 sm:p-5 bg-white">
        <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Tag className="w-4 h-4 text-rose-500" />
          Blog-Kategorien
        </h3>
        <div className="space-y-2">
          {Object.entries(categoryCounts).map(([title, count], index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm hover:bg-rose-50 rounded-lg px-2 py-1.5 transition-colors"
            >
              <span className="text-gray-600">{title}</span>
              <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                {count}
              </span>
            </div>
          ))}
          {Object.keys(categoryCounts).length === 0 && (
            <p className="text-sm text-gray-400">Keine Kategorien vorhanden</p>
          )}
        </div>
      </div>

      {/* Latest Blogs */}
      <div className="border border-rose-100 rounded-xl p-4 sm:p-5 bg-white">
        <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-rose-500" />
          Neueste Beiträge
        </h3>
        <div className="space-y-3">
          {blogs?.map((blog: any, index: number) => (
            <Link
              href={`/riff-raff/${blog?.slug?.current}`}
              key={index}
              className="flex items-center gap-3 group p-2 rounded-lg hover:bg-rose-50 transition-colors"
            >
              {blog?.mainImage && (
                <Image
                  src={urlFor(blog?.mainImage).url()}
                  alt={blog?.title || "Blog"}
                  width={60}
                  height={60}
                  className="w-14 h-14 rounded-lg object-cover border border-rose-100 group-hover:border-rose-300 transition-colors flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 line-clamp-2 group-hover:text-rose-500 transition-colors">
                  {blog?.title}
                </p>
                {blog?.publishedAt && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {dayjs(blog.publishedAt).format("DD. MMM YYYY")}
                  </p>
                )}
              </div>
              <ArrowRight className="w-4 h-4 text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </Link>
          ))}
          {(!blogs || blogs.length === 0) && (
            <p className="text-sm text-gray-400">Keine weiteren Beiträge</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleBlogPage;