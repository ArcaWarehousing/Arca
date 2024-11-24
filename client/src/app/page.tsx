"use client";

import React from "react";
import { domAnimation, LazyMotion, m } from "framer-motion";
import Nav2 from "./components/nav/navbar2";
import Footer from "./components/footer";
import MoreFeatures from "./components/MoreFeatures";
import Features from "./components/features";
import Search from "./components/searchitems/search";
import SearchBar from "./components/landingbar";

const LandingPage: React.FC = () => {
  const handleSearch = (query: string) => {
    console.log("search");
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative min-h-screen bg-[#18284B] text-gray-900">
        <Nav2 />

        <section className="py-12 bg-[#18284B] relative z-10">
          <div className="container mx-auto px-6 text-center">
            <m.h1
              className="text-8xl text-white font-bold mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Revolutionizing Supply Chain Management
            </m.h1>

            <m.p
              className="text-2xl text-white"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Please enter your location to connect with a warehouse provider
            </m.p>
          </div>

          <div className="pt-6">
            <SearchBar onSearch={handleSearch} />
          </div>
        </section>
        <section className="py-12 bg-[#18284B] relative z-10">
          <div className="container mx-auto px-6 flex items-center">
            {/* Image Container */}
            <div className="flex-shrink-0 mr-10">
              <m.img
                src="boxes.png"
                alt="ARCA"
                className="rounded-lg shadow-lg w-96 h-96" // Increased size
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              />
            </div>

            {/* Text Container */}
            <div className="flex-grow">
              <m.h2
                className="text-3xl text-white font-bold mb-4 text-left" // Left-align text
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Discover Our Latest Features
              </m.h2>
              <m.p
                className="text-xl text-white text-left" // Left-align text
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                Explore the new capabilities we have introduced to enhance your
                experience. Our latest updates focus on improving functionality
                and delivering a more seamless user interface. Learn more about
                how these changes can benefit you and stay ahead in the
                industry.
              </m.p>
            </div>
          </div>
        </section>

        <Features />
      </div>

      <MoreFeatures />

      <Footer />
    </LazyMotion>
  );
};

export default LandingPage;
