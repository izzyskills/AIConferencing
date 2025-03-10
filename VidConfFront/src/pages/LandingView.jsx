import React from "react";
import CarouselCard from "@/components/cards/CarouselCard";
import FeaturesCard from "@/components/cards/FeaturesCard";
import HeroCard from "@/components/cards/HeroCard";
import ProcessCard from "@/components/cards/ProcessCard";
import StatsCard from "@/components/cards/StatsCard";
import TabCard from "@/components/cards/TabCard";
import TestimonialsCard from "@/components/cards/TestomonialsCard";
import Footer from "@/components/Footer";

const LandingView = () => {
  return (
    <div>
      <div
        aria-hidden="true"
        className="pointer-events-none max-w-7xl relative mx-auto z-[-1] h-0"
      >
        <svg
          className="translate-x-1/2 dark:opacity-40 transform absolute right-0 mr-[-16] top-0"
          fill="none"
          height="502"
          width="800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="400"
            cy="102"
            fill="url(#heroglow_paint0_radial)"
            fillOpacity=".6"
            r="400"
          ></circle>
          <circle
            cx="209"
            cy="289"
            fill="url(#heroglow_paint1_radial)"
            fillOpacity=".4"
            r="170"
          ></circle>
          <defs>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="rotate(90 149 251) scale(315.089)"
              gradientUnits="userSpaceOnUse"
              id="heroglow_paint0_radial"
              r="1"
            >
              <stop stopColor="#3ABAB4"></stop>
              <stop offset="1" stopColor="#3ABAB4" stopOpacity=".01"></stop>
            </radialGradient>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="rotate(90 -40 249) scale(133.913)"
              gradientUnits="userSpaceOnUse"
              id="heroglow_paint1_radial"
              r="1"
            >
              <stop stopColor="#667EEA"></stop>
              <stop offset="1" stopColor="#667EEA" stopOpacity=".01"></stop>
            </radialGradient>
          </defs>
        </svg>
      </div>
      <HeroCard />
      <StatsCard />
      <ProcessCard />
      <TestimonialsCard />
      <Footer />
    </div>
  );
};

export default LandingView;
