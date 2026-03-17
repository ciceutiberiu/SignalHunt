import { cn } from "@/lib/utils/helpers";
import React from "react";

interface FeatureItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface FeaturesSectionProps {
  features: FeatureItem[];
  title?: string;
  subtitle?: string;
}

export function FeaturesSectionWithHoverEffects({
  features,
  title,
  subtitle,
}: FeaturesSectionProps) {
  return (
    <div className="max-w-7xl mx-auto px-4">
      {title && (
        <div className="text-center mb-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10">
        {features.map((feature, index) => (
          <Feature key={feature.title} {...feature} index={index} />
        ))}
      </div>
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-neutral-200",
        (index === 0 || index === 4) && "lg:border-l border-neutral-200",
        index < 4 && "lg:border-b border-neutral-200"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-orange-50 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-orange-50 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 group-hover/feature:bg-orange-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
