import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Link } from "react-router-dom";
import { ChevronRightCircle } from "lucide-react";

const HeroCard = () => {
  return (
    <div>
      <section>
        <div className="max-w-7xl md:px-6 mx-auto px-4">
          <div className="md:pb-16 md:pt-40 pb-10 pt-32">
            {/* Hero content */}
            <div className="grid-cols-12 items-center md:gap-12 lg:gap-20 md:grid">
              {/* Content */}
              <div className="md:col-span-7 md:text-left text-center md:mb-0 mb-8">
                <h1
                  className="font-red-hat-display lg:text-[5.5rem] leading-[1.11] font-black mb-4 md:text-[4-rem] text-[3.5rem] aos-init aos-animate"
                  data-aos="fade-down"
                >
                  AI-Driven Video Conferencing
                </h1>
                <p
                  className="text-gray-600 dark:text-neutral-100 text-xl aos-init aos-animate"
                  data-aos="fade-down"
                  data-aos-delay="150"
                >
                  Our platform provides meeting summaries, transcriptions, and
                  an AI assistant to enhance your meetings.
                </p>
                {/* CTA form */}
                <Button className="w-full md:min-w-40 sm:w-auto mt-2">
                  <Link to="/signup"> Sign up </Link>
                  <ChevronRightCircle className="w-6 h-6 ml-2" />
                </Button>
                {/* Success message */}
                {/* <p className="text-center md:text-left mt-2 opacity-75 text-sm">Thanks for subscribing!</p> */}
                <ul
                  className="text-gray-600 c0atf md:max-w-none max-w-lg sm:max-w-md mx-auto mb-[-2] mt-8 aos-init aos-animate"
                  data-aos="fade-down"
                  data-aos-delay="450"
                >
                  <li className="items-center mb-2 flex">
                    <svg
                      className="text-primary fill-current flex-shrink-0 mr-2 h-3 w-3"
                      viewBox="0 0 12 12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"></path>
                    </svg>
                    <span> AI-driven meeting summaries. </span>
                  </li>
                  <li className="items-center mb-2 flex">
                    <svg
                      className="text-primary fill-current flex-shrink-0 mr-2 h-3 w-3"
                      viewBox="0 0 12 12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"></path>
                    </svg>
                    <span> Real-time transcriptions. </span>
                  </li>
                  <li className="items-center mb-2 flex">
                    <svg
                      className="text-primary fill-current flex-shrink-0 mr-2 h-3 w-3"
                      viewBox="0 0 12 12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a 1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"></path>
                    </svg>
                    <span> AI assistant for meetings. </span>
                  </li>
                </ul>
              </div>
              {/* Mobile mockup */}
              <div
                className="md:text-right col-span-5 text-center aos-init aos-animate"
                data-aos="fade-up"
                data-aos-delay="450"
              >
                <div className="justify-center items-center inline-flex relative">
                  {/* Glow illustration */}
                  <svg
                    aria-hidden="true"
                    className="pointer-events-none cimtg absolute mr-12 mt-32 z-[-1]"
                    fill="none"
                    height="634"
                    viewBox="0 0 678 634"
                    width="678"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="240"
                      cy="394"
                      fill="url(#piphoneill_paint0_radial)"
                      fillOpacity=".4"
                      r="240"
                    ></circle>
                    <circle
                      cx="438"
                      cy="240"
                      fill="url(#piphoneill_paint1_radial)"
                      fillOpacity=".6"
                      r="240"
                    ></circle>
                    <defs>
                      <radialGradient
                        cx="0"
                        cy="0"
                        gradientTransform="rotate(90 -77 317) scale(189.054)"
                        gradientUnits="userSpaceOnUse"
                        id="piphoneill_paint0_radial"
                        r="1"
                      >
                        <stop stopColor="#667EEA"></stop>
                        <stop
                          offset="1"
                          stopColor="#667EEA"
                          stopOpacity=".01"
                        ></stop>
                      </radialGradient>
                      <radialGradient
                        cx="0"
                        cy="0"
                        gradientTransform="rotate(90 99 339) scale(189.054)"
                        gradientUnits="userSpaceOnUse"
                        id="piphoneill_paint1_radial"
                        r="1"
                      >
                        <stop stopColor="#9F7AEA"></stop>
                        <stop
                          offset="1"
                          stopColor="#9F7AEA"
                          stopOpacity=".01"
                        ></stop>
                      </radialGradient>
                    </defs>
                  </svg>
                  {/* Image inside mockup size: 290x624px (or 580x1248px for Retina devices) */}
                  <img
                    alt="Features illustration"
                    className="absolute "
                    height="674"
                    src="/images/mockup-image-01.png"
                    width="290"
                  />
                  {/* iPhone mockup */}
                  <img
                    alt="iPhone mockup"
                    aria-hidden="true"
                    className="pointer-events-none max-w-none md:max-w-full relative mr-0 mx-auto h-auto"
                    height="674"
                    src="/images/iphone-mockup.png"
                    width="344"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroCard;
