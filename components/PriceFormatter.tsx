import { twMerge } from "tailwind-merge";

interface Props {
  amount: number | undefined;
  className?: string;
  currency?: "EUR" | "USD" | "GBP";
}

const PriceFormatter = ({ 
  amount, 
  className,
  currency = "EUR" 
}: Props) => {
  if (amount === undefined || amount === null) {
    return <span className={twMerge("text-sm font-semibold text-gray-700", className)}>€0,00</span>;
  }

  const formattedPrice = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return (
    <span
      className={twMerge("text-sm font-semibold text-gray-700", className)}
    >
      {formattedPrice}
    </span>
  );
};

export default PriceFormatter;