import { domAnimation, LazyMotion, m } from "framer-motion";
import { ReactNode } from "react";

// Example SVG components
const CreateRevenueStreamsIcon: React.FC = () => (
  // <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //   {/* Add SVG path data here */}
  //   <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" fill="#000"/>
  // </svg>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5.00488 9.00281C5.55717 9.00281 6.00488 9.45052 6.00488 10.0028C7.63965 10.0028 9.14352 10.5632 10.3349 11.5023L12.5049 11.5028C13.8375 11.5028 15.0348 12.0821 15.8588 13.0025L19.0049 13.0028C20.9972 13.0028 22.7173 14.1681 23.521 15.8542C21.1562 18.9748 17.3268 21.0028 13.0049 21.0028C10.2142 21.0028 7.85466 20.3996 5.944 19.3449C5.80557 19.7284 5.43727 20.0028 5.00488 20.0028H2.00488C1.4526 20.0028 1.00488 19.5551 1.00488 19.0028V10.0028C1.00488 9.45052 1.4526 9.00281 2.00488 9.00281H5.00488ZM6.00589 12.0028L6.00488 17.0248L6.05024 17.0573C7.84406 18.3177 10.183 19.0028 13.0049 19.0028C16.0089 19.0028 18.8035 17.8472 20.84 15.8734L20.9729 15.7398L20.8537 15.6394C20.3897 15.2764 19.8205 15.0512 19.2099 15.0097L19.0049 15.0028L16.8934 15.0028C16.9664 15.3244 17.0049 15.6591 17.0049 16.0028V17.0028H8.00488V15.0028L14.7949 15.0018L14.7605 14.9233C14.38 14.1297 13.593 13.5681 12.6693 13.5081L12.5049 13.5028L9.57547 13.5027C8.66823 12.5773 7.40412 12.0031 6.00589 12.0028ZM4.00488 11.0028H3.00488V18.0028H4.00488V11.0028ZM18.0049 5.00281C19.6617 5.00281 21.0049 6.34595 21.0049 8.00281C21.0049 9.65966 19.6617 11.0028 18.0049 11.0028C16.348 11.0028 15.0049 9.65966 15.0049 8.00281C15.0049 6.34595 16.348 5.00281 18.0049 5.00281ZM18.0049 7.00281C17.4526 7.00281 17.0049 7.45052 17.0049 8.00281C17.0049 8.55509 17.4526 9.00281 18.0049 9.00281C18.5572 9.00281 19.0049 8.55509 19.0049 8.00281C19.0049 7.45052 18.5572 7.00281 18.0049 7.00281ZM11.0049 2.00281C12.6617 2.00281 14.0049 3.34595 14.0049 5.00281C14.0049 6.65966 12.6617 8.00281 11.0049 8.00281C9.34803 8.00281 8.00488 6.65966 8.00488 5.00281C8.00488 3.34595 9.34803 2.00281 11.0049 2.00281ZM11.0049 4.00281C10.4526 4.00281 10.0049 4.45052 10.0049 5.00281C10.0049 5.55509 10.4526 6.00281 11.0049 6.00281C11.5572 6.00281 12.0049 5.55509 12.0049 5.00281C12.0049 4.45052 11.5572 4.00281 11.0049 4.00281Z"></path></svg>
);

const FindIdealStorageIcon: React.FC = () => (
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22 20V7L20 3H4L2 7.00353V20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20ZM4 9H20V19H4V9ZM5.236 5H18.764L19.764 7H4.237L5.236 5ZM15 11H9V13H15V11Z"></path></svg>);

const SecureTransactionsIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 10V20H19V10H6ZM18 8H20C20.5523 8 21 8.44772 21 9V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V9C3 8.44772 3.44772 8 4 8H6V7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7V8ZM16 8V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V8H16ZM7 11H9V13H7V11ZM7 14H9V16H7V14ZM7 17H9V19H7V17Z"></path></svg>
);

const Features: React.FC = () => (
  <section className="py-12">
    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <FeatureCard
        title="Create Revenue Streams"
        description="Monetize unused warehouse space to optimize storage capacity."
        icon={<CreateRevenueStreamsIcon />}
        delay={0.8}
      />
      <FeatureCard
        title="Find Ideal Storage"
        description="Connect with providers offering competitive pricing and high security."
        icon={<FindIdealStorageIcon />}
        delay={1.0}
      />
      <FeatureCard
        title="Secure Transactions"
        description="Verify parties and notarize contracts for safe exchanges."
        icon={<SecureTransactionsIcon />}
        delay={1.2}
      />
    </div>
  </section>
);

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  delay,
}) => (
  <LazyMotion features={domAnimation}>
    <m.div
      className="p-6 bg-[#fafaf9] rounded-lg border border-gray-200"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 mr-4">
          {icon}
        </div>
        
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <p>{description}</p>
    </m.div>
  </LazyMotion>
);

export default Features;
