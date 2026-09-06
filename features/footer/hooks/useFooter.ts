// src/features/footer/hooks/useFooter.ts
import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/sanity';

export interface FooterData {
  aboutText: string;
  socialLinks: Array<{
    platform: string;
    url: string;
  }>;
  quickLinks: Array<{
    label: string;
    href: string;
  }>;
  companyLinks: Array<{
    label: string;
    href: string;
  }>;
  newsletter: {
    title: string;
    description: string;
    placeholder: string;
    buttonText: string;
  };
  copyright: string;
  currencyOptions: string[];
  languageOptions: string[];
}

export function useFooter() {
  const query = `*[_type == "footer"][0] {
    aboutText,
    socialLinks,
    quickLinks,
    companyLinks,
    newsletter,
    copyright,
    currencyOptions,
    languageOptions
  }`;

  return useQuery({
    queryKey: ['footer'],
    queryFn: async () => {
      const data = await client.fetch(query);
      return data as FooterData | null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}