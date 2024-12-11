"use client";
import React from "react";
import { domAnimation, LazyMotion, m } from "framer-motion";
import Nav2 from "../components/nav/navbar2";
import Footer from "../components/footer";
import MoreFeatures from "../components/moreFeatures";
import Features from "../components/features";

const LandingPage: React.FC = () => {
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-white text-gray-900">
        <Nav2 />
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6 text-center">
            <m.h1
              className="text-8xl font-extrabold mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Who we are
            </m.h1>
            <m.h2
              className="text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Arca Solutions
            </m.h2>
            <m.p
              className="text-2xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              At Arca Solutions, our goal is to revolutionize the supply chain
              by addressing inefficiencies in the warehouse market. We achieve
              this through the Intermanus Exchange, a platform that offers
              unparalleled benefits to both warehouse owners and those seeking
              storage solutions. or warehouse owners, we provide the opportunity
              to create a new revenue stream and optimize storage capacity by
              monetizing your unused warehouse space.
            </m.p>
            <m.p
              className="text-2xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Our platform ensures security and trust by verifying all parties
              and notarizing contracts, offering a safe and reliable exchange.
              For those seeking storage solutions, we offer a comprehensive and
              user-friendly platform to find the best providers tailored to your
              specific needs. Whether you require competitive pricing, cold
              storage, high security, or proximity to transportation hubs, our
              platform connects you with the ideal warehouse facility. Once
              matched, you can negotiate directly with the provider to finalize
              a solution that meets your requirements.
            </m.p>
            <m.p
              className="text-2xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Join us at Arca Solutions and experience the future of supply
              chain management.
            </m.p>
            <m.p
              className="text-2xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Team: Austin Wu, Douglas, Boris, Cris, Carlo, Asim, and Sid
            </m.p>
            <m.p
              className="text-2xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Contact info: arcawarehousing@gmail.com
            </m.p>
          </div>
        </section>

        <Footer />
      </div>
    </LazyMotion>
  );
};

export default LandingPage;
