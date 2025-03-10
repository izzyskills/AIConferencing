import React from "react";

const items = [
  { value: "10%", description: "Time saved", delay: "0" },
  { value: "99%", description: "Accurate transcriptions", delay: "100" },
  { value: "24/7", description: "AI assistance", delay: "200" },
];

const StatsCard = () => {
  return (
    <section className="relative">
      {/* Background gradient (light version only) */}
      <div
        aria-hidden="true"
        className="pointer-events-none bg-gradient-to-t from-gray-100 to-transparent absolute bottom-0 right-0 left-0 z-[-10] h-128"
      ></div>
      {/* End background gradient (light version only) */}
      <div className="max-w-7xl relative px-6 mx-auto">
        <div className="pb-20">
          <div
            className="grid md:grid-cols-3 grid-cols-2 text-center gap-6"
            data-aos-id-stats=""
          >
            {items.map((item, index) => (
              <div
                key={index}
                className="shadow-2xl bg-card text-card-foreground px-1 py-8 aos-init aos-animate"
                data-aos="fade-down"
                data-aos-anchor="[data-aos-id-stats]"
                data-aos-delay={item.delay}
              >
                <div className="font-red-hat-display text-[2.63rem] leading-[1.24] mb-1">
                  {item.value}
                </div>
                <div className="text-gray-600">{item.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsCard;
