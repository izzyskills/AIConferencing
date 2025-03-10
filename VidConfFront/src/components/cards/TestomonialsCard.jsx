import React from "react";

const testimonials = [
  {
    id: 1,
    imgSrc: "/images/testimonial-01.jpg",
    alt: "Testimonial 01",
    quote:
      "The AI-driven meeting summaries have saved us so much time. We can now focus on what really matters.",
    name: "Andy Croll",
    company: "Appy.com",
  },
  {
    id: 2,
    imgSrc: "/images/testimonial-02.jpg",
    alt: "Testimonial 02",
    quote:
      "Real-time transcriptions are a game-changer. Our meetings are more efficient and productive.",
    name: "Patricia Lepisov",
    company: "Nobi Bank",
  },
  {
    id: 3,
    imgSrc: "/images/testimonial-03.jpg",
    alt: "Testimonial 03",
    quote:
      "The AI assistant is incredibly helpful. It feels like having an extra team member in every meeting.",
    name: "Zhenya Ritz",
    company: "Sync",
  },
  {
    id: 4,
    imgSrc: "/images/testimonial-04.jpg",
    alt: "Testimonial 04",
    quote:
      "This platform has transformed the way we conduct meetings. The AI features are simply amazing.",
    name: "Lisa Champ",
    company: "Appicu",
  },
];

const TestimonialsCard = () => {
  return (
    <section className="relative">
      <div className="max-w-7xl px-6 mx-auto md:px-4">
        <div className="cq8p6 border-transparent md:py-20 border-t py-12">
          {/* Testimonials */}
          <div className="grid grid-cols-2 max-w-none md:max-w-3xl items-start gap-12 md:gap-8 mx-auto">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="text-center">
                <div className="inline-flex relative flex-col mb-4">
                  <img
                    alt={testimonial.alt}
                    className="rounded-full"
                    height="56"
                    src={testimonial.imgSrc}
                    width="56"
                  />
                  <svg
                    className="absolute right-0 top-0 mr-[-8] mt-1"
                    height="12"
                    width="27"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      className="text-purple-500 fill-current"
                      d="M2.785 5.334C2.538 5.5-.2 2.944.011 2.646.826 1.483 2.183.836 3.62.5 5.064.158 6.582.117 7.92-.02c.017-.002.098.153.088.166-1.763 2.018-3.223 3.836-5.221 5.188zm3.676 6.519c-.862.184-1.937-3.403-1.07-3.711 3.422-1.22 7.078-1.671 10.728-1.766 3.655-.096 7.304.162 10.866.32.044.002.06.177.018.187-6.938 1.634-13.691 3.504-20.542 4.97z"
                    ></path>
                  </svg>
                </div>
                <blockquote className="text-gray-600 c0atf czz36">
                  “ {testimonial.quote} “
                </blockquote>
                <div className="font-red-hat-display cu5hn mt-2">
                  <cite className="cl4eo"> —{testimonial.name} </cite>,
                  <a
                    className="text-primary duration-150 ease-in-out transition"
                    href="#0"
                  >
                    {testimonial.company}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCard;
