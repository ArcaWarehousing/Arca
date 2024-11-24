import React from "react";
import Image from "next/image"

const MoreFeatures: React.FC = () => (
  <section className="py-12 bg-white">
    <div className="container  mx-auto px-6">
      <div className=" grid grid-cols-3 gap-6">
        <FeatureCard
          title="Storage Capacity"
          description="Various sizes available to suit your needs."
          icon="https://via.placeholder.com/150x100"
          larger={true}
          width={"2"}
        />
        <FeatureCard
          title="Security"
          description="High-tech surveillance systems for maximum protection."
          icon="https://via.placeholder.com/150x100"
          width={"1"}
        />

        <FeatureCard
          title="Proximity"
          description="Strategically located near transportation hubs."
          icon="https://via.placeholder.com/150x100"
          width={"1"}
        />
        <FeatureCard
          title="Price"
          description="Competitive pricing options for cost-effective solutions."
          icon="https://via.placeholder.com/150x100"
          larger={true}
          width={"2"}
        />
      </div>
    </div>
  </section>
);

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  larger?: boolean;
  width?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  larger,
  width = "1/2",
}) => (
  <div
    className={`p-6 bg-[#fafaf9] rounded-lg border border-gray-200 col-span-${width}`}
  >
    <div className="text-center">
      <h3 className={`text-${larger ? "4xl" : "3xl"} font-bold mb-2`}>
        {title}
      </h3>
      <p className="text-lg">{description}</p>
    </div>
    <div className="flex items-center mb-4">
      <img src={icon} alt="Icon" className=" h-auto rounded-lg shadow-lg" />
    </div>
  </div>
);

export default MoreFeatures;
