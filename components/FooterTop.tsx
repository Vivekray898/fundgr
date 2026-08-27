// components/FooterTop.tsx
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import React from "react";
import { getFooterData } from "@/sanity/queries/footer";

interface ContactItemData {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const iconMap = {
  mapPin: MapPin,
  phone: Phone,
  clock: Clock,
  mail: Mail,
};

// Default data
const defaultData: ContactItemData[] = [
  {
    title: "Visit Us",
    subtitle: "New Orlean, USA",
    icon: <MapPin className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />,
  },
  {
    title: "Call Us",
    subtitle: "+12 958 648 597",
    icon: <Phone className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />,
  },
  {
    title: "Working Hours",
    subtitle: "Mon - Sat: 10:00 AM - 7:00 PM",
    icon: <Clock className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />,
  },
  {
    title: "Email Us",
    subtitle: "FundGrube-Bestpreis@gmail.com",
    icon: <Mail className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />,
  },
];

const FooterTop = async () => {
  const footerData = await getFooterData();
  
  // Map Sanity data to component data
  const data: ContactItemData[] = footerData?.contactInfo?.items?.length > 0
    ? footerData.contactInfo.items.map((item) => {
        const IconComponent = iconMap[item.icon as keyof typeof iconMap] || MapPin;
        return {
          title: item.title,
          subtitle: item.subtitle,
          icon: (
            <IconComponent className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />
          ),
        };
      })
    : defaultData;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 border-b">
      {data?.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-3 group hover:bg-gray-50 p-4 transition-colors hoverEffect"
        >
          {item?.icon}
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-black hoverEffect">
              {item?.title}
            </h3>
            <p className="text-gray-600 text-sm mt-1 group-hover:text-gray-900 hoverEffect">
              {item?.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FooterTop;