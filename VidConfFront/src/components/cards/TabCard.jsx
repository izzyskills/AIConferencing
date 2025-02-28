import React, { useState } from "react";
import { Button } from "../ui/button";

const categories = [
  {
    id: "1",
    label: "Getting Started",
    iconPath:
      "M5 16H4a4 4 0 01-4-4v-1h2v1a2 2 0 002 2h1v2zM13 10h-1.686l-1.207-1.207L14.37 4.63a2.121 2.121 0 00-3-3L7.207 5.793 5.99 4.576 5.98 3.02 3.038.079 0 3.117 3 6h1.586l1.207 1.207L4 9l3 3 1.793-1.793L10 11.414V13l3.01 3.01 2.98-2.979L13 10z",
  },
  {
    id: "2",
    label: "Collection list",
    iconPath: "M8 3l4 4H4zM8 13L4 9h8zM1 0h14v2H1zM1 14h14v2H1z",
  },
  {
    id: "3",
    label: "Element Hierarchy",
    iconPath:
      "M6 0H1a1 1 0 00-1 1v5a1 1 0 001 1h5a1 1 0 001-1V1a1 1 0 00-1-1zM5 5H2V2h3v3zM15 9h-5a1 1 0 00-1 1v5a1 1 0 001 1h5a1 1 0 001-1v-5a1 1 0 00-1-1zm-1 5h-3v-3h3v3zM6 9H1a1 1 0 00-1 1v5a1 1 0 001 1h5a1 1 0 001-1v-5a1 1 0 00-1-1zm-1 5H2v-3h3v3zM12.5 7a1 1 0 01-.707-.293l-2.5-2.5a1 1 0 010-1.414l2.5-2.5a1 1 0 011.414 0l2.5 2.5a1 1 0 010 1.414l-2.5 2.5A1 1 0 0112.5 7z",
  },
  {
    id: "4",
    label: "Styling Basics",
    iconPath:
      "M15.4.6c-.84-.8-2.16-.8-3 0L8.7 4.3c.73.252 1.388.68 1.916 1.244.469.515.83 1.119 1.065 1.775L15.4 3.6c.8-.84.8-2.16 0-3zM4.937 6.9c-1.2 1.2-1.4 5.7-1.4 5.7s4.4-.4 5.6-1.5a2.987 2.987 0 000-4.2 2.9 2.9 0 00-4.2 0z",
  },
  {
    id: "5",
    label: "Image Field",
    iconPath: "M11 16v-5h5V0H5v5H0v11h11zM2 7h7v7H2V7z",
  },
];

const videos = [
  {
    categories: ["1"],
    src: "/images/video-thumb.jpg",
    alt: "Video thumbnail 01",
    title: "Using index pages",
    duration: "2 Min",
  },
  {
    categories: ["1", "2"],
    src: "/images/video-thumb.jpg",
    alt: "Video thumbnail 01",
    title: "Working with content",
    duration: "4 Min",
  },
  {
    categories: ["1", "3"],
    src: "./images/video-thumb.jpg",
    alt: "Video thumbnail 01",
    title: "Using cover pages",
    duration: "7 Min",
  },
  {
    categories: ["1", "4"],
    src: "/images/video-thumb.jpg",
    alt: "Video thumbnail 01",
    title: "Intro to the style model",
    duration: "9 Min",
  },
  {
    categories: ["2", "5"],
    src: "/images/video-thumb.jpg",
    alt: "Video thumbnail 01",
    title: "Exploring collections",
    duration: "12 Min",
  },
  {
    categories: ["2", "3"],
    src: "/images/video-thumb.jpg",
    alt: "Video thumbnail 01",
    title: "Understand hierarchy",
    duration: "3 Min",
  },
  {
    categories: ["2", "4"],
    src: "/images/video-thumb.jpg",
    alt: "Video thumbnail 01",
    title: "Customisations",
    duration: "11 Min",
  },
  {
    categories: ["3", "5"],
    src: "/images/video-thumb.jpg",
    alt: "Video thumbnail 01",
    title: "Image galleries",
    duration: "6 Min",
  },
  {
    categories: ["5"],
    src: "/images/video-thumb.jpg",
    alt: "Video thumbnail 01",
    title: "Sorting images",
    duration: "4 Min",
  },
  {
    categories: ["5"],
    src: "/images/video-thumb.jpg",
    alt: "Video thumbnail 01",
    title: "Filters",
    duration: "9 Min",
  },
];

const TabCard = () => {
  const [category, setCategory] = useState("1");

  return (
    <section className="dark:border-border border-transparent relative border-t">
      {/* Background gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none dark:from-neutral-800 dark:to-neutral-900 bg-gradient-to-b dark:opacity-25 from-gray-100 to-transparent absolute to-white inset-0 h-128"
      ></div>
      {/* End background gradient */}
      <div className="max-w-7xl relative md:px-6 mx-auto px-4">
        <div className="md:py-20 py-12">
          {/* Section header */}
          <div className="text-center max-w-4xl md:pb-16 mx-auto pb-12">
            <h2 className="font-red-hat-display mb-4 text-4xl">
              Turn your ideas into reality in seconds
            </h2>
            <p className="text-gray-600 dark:text-stone-400 text-xl">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur excepteur sint occaecat
              cupidatat.
            </p>
          </div>
          <div>
            <div className="grid lg:grid-cols-3 lg:gap-6 gap-12">
              {/* Category buttons */}
              <div className="flex lg:flex-col lg:mx-0 lg:justify-start lg:col-span-1 justify-center -m-1 flex-wrap">
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    className={`flex items-center justify-center lg:w-full px-3 py-2 m-1 duration-150 ease-in-out transition rounded shadow-sm ${
                      category === cat.id ? "bg-primary" : "bg-white"
                    }`}
                    onClick={() => setCategory(cat.id)}
                  >
                    <svg
                      className="flex-shrink-0 w-4 h-4 mr-2"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        className={`fill-current ${
                          category === cat.id ? "text-white" : "text-primary"
                        }`}
                        d={cat.iconPath}
                      ></path>
                    </svg>
                    <span
                      className={`${
                        category === cat.id ? "text-white" : "text-gray-600"
                      }`}
                    >
                      {cat.label}
                    </span>
                  </Button>
                ))}
              </div>
              {/* Videos */}
              <div className="col-span-2 mx-auto max-w-4xl">
                <div className="grid grid-cols-2 gap-6">
                  {videos
                    .filter((video) => video.categories.includes(category))
                    .map((video) => (
                      <div key={video.title}>
                        <div className="relative">
                          <img
                            src={video.src}
                            alt={video.alt}
                            className="w-full"
                            height="264"
                            width="352"
                          />
                          <div className="absolute inset-0 flex flex-col">
                            <div className="flex flex-grow items-center justify-center">
                              <a
                                className="duration-150 ease-in-out transition"
                                href="#0"
                              >
                                <img
                                  alt="Play icon"
                                  height="72"
                                  src="/images/play-button.svg"
                                  width="72"
                                />
                              </a>
                            </div>
                            <div className="flex items-center justify-between w-full px-6 py-3 bg-white opacity-90 bottom-0">
                              <a className="text-gray-600" href="#0">
                                {video.title}
                              </a>
                              <div className="inline-flex px-3 py-1 text-white bg-gray-900 bg-opacity-50 rounded-full">
                                {video.duration}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TabCard;
