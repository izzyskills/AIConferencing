import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

const items = [
  {
    src: "./images/carousel-item-01.jpg",
    alt: "Carousel item 01",
    label: "Creative Services",
  },
  {
    src: "./images/carousel-item-02.jpg",
    alt: "Carousel item 02",
    label: "Creative Services",
  },
  {
    src: "./images/carousel-item-03.jpg",
    alt: "Carousel item 03",
    label: "Creative Services",
  },
  {
    src: "./images/carousel-item-04.jpg",
    alt: "Carousel item 04",
    label: "Creative Services",
  },
  {
    src: "./images/carousel-item-05.jpg",
    alt: "Carousel item 05",
    label: "Creative Services",
  },
];

const CarouselCard = () => {
  return (
    <section className="border-transparent border-t dark:border-foreground">
      <div className="md:py-20 px-12">
        <div className="max-w-7xl md:px-6 mx-auto px-4">
          {/* Section header */}
          <div className="text-center max-w-4xl md:pb-16 mx-auto pb-12">
            <h1 className="font-red-hat-display mb-4">
              From rough design files, to powerful products
            </h1>
            <p className="text-gray-600">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur excepteur sint occaecat
              cupidatat.
            </p>
          </div>
        </div>
        {/* Carousel built with Swiper.js */}
        <Swiper
          spaceBetween={30}
          pagination={{ clickable: true }}
          navigation={true}
          loop={true}
          centeredSlides={true}
          modules={[Navigation, Pagination]}
          className="mySwiper"
          slideActiveClass="swiper-slide-active"
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
        >
          {items.map((item, index) => (
            <SwiperSlide key={index}>
              <img
                src={item.src}
                alt={item.alt}
                className="transition-opacity duration-300"
                height="460"
                width="540"
              />
              <div className="transition-opacity duration-300 absolute flex-col inset-0 flex">
                <div className="flex flex-grow">
                  <a
                    className="text-white bg-primary inline-flex self-center mx-auto"
                    href="#"
                  >
                    Learn more
                  </a>
                </div>
                <div className="absolute bottom-0 right-0 p-6">
                  <a
                    className="text-white bg-opacity-50 rounded-full duration-150 bg-gray-900 text-center px-3 py-2"
                    href="#"
                  >
                    {item.label}
                  </a>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default CarouselCard;
