import React from "react";
import Footer from "@/components/Footer";
import israelPic from "../assets/israelpic.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const teamMembers = [
  {
    id: 1,
    imgSrc: israelPic,
    alt: "Team Member 01",
    name: "Israel",
    role: "CEO & Founder",
    description:
      "Israel is the visionary behind our platform, leading the team with his expertise in AI and video conferencing technologies.",
  },
  {
    id: 2,
    imgSrc: "/images/team-member-02.jpg",
    alt: "Team Member 02",
    name: "Uturu Favour",
    role: "CTO",
    description:
      "Favour is the technical genius who ensures our platform runs smoothly and efficiently, constantly innovating and improving our technology.",
  },
  {
    id: 3,
    imgSrc: "/images/team-member-03.jpg",
    alt: "Team Member 03",
    name: "Omojoye Ayo",
    role: "COO",
    description:
      "Ayo oversees the day-to-day operations, making sure everything is on track and our users are happy.",
  },
];

const AboutView = () => {
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
      <section className="relative">
        <div className="max-w-7xl relative px-6 mx-auto">
          <div className="pb-20">
            <div className="text-center">
              <h1 className="font-red-hat-display text-[3.5rem] leading-[1.11] font-black mb-4">
                About Us
              </h1>
              <p className="text-gray-600 text-xl mb-8">
                We are a team of passionate individuals dedicated to
                revolutionizing the way you conduct meetings. Our AI-driven
                video conferencing platform provides meeting summaries,
                transcriptions, and an AI assistant to enhance your meetings.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="relative">
        <div className="max-w-7xl relative px-6 mx-auto">
          <div className="pb-20">
            <div className="text-center">
              <h2 className="font-red-hat-display text-[2.63rem] leading-[1.24] mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 mb-8">
                Our mission is to make meetings more efficient and productive by
                leveraging the power of artificial intelligence. We aim to
                provide tools that help you save time, improve communication,
                and achieve better outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="relative">
        <div className="max-w-7xl relative px-6 mx-auto">
          <div className="pb-20">
            <div className="text-center">
              <h2 className="font-red-hat-display text-[2.63rem] leading-[1.24] mb-4">
                Our Team
              </h2>
              <div className="grid md:grid-cols-3 grid-cols-1 gap-8">
                {teamMembers.map((member) => (
                  <div key={member.id} className="text-center">
                    <Avatar className="mx-auto mb-4 w-40 h-40">
                      <AvatarImage src={member.imgSrc} alt={member.alt} />
                      <AvatarFallback>{member.name}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-red-hat-display text-xl font-bold mb-2">
                      {member.name}
                    </h3>
                    <p className="text-primary mb-2">{member.role}</p>
                    <p className="text-gray-600">{member.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="relative">
        <div className="max-w-7xl relative px-6 mx-auto">
          <div className="pb-20">
            <div className="text-center">
              <h2 className="font-red-hat-display text-[2.63rem] leading-[1.24] mb-4">
                Contact Us
              </h2>
              <p className="text-gray-600 mb-8">
                We'd love to hear from you! Whether you have a question about
                our platform, need support, or just want to say hello, feel free
                to reach out to us.
              </p>
              <div className="flex justify-center space-x-4">
                <a
                  href="https://twitter.com/yourprofile"
                  className="text-gray-600 hover:text-primary transition duration-150 ease-in-out"
                  aria-label="Twitter"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.897-.959-2.178-1.559-3.594-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124-4.087-.205-7.719-2.165-10.148-5.144-.422.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.229-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14.002-7.496 14.002-13.986 0-.21 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/yourprofile"
                  className="text-gray-600 hover:text-primary transition duration-150 ease-in-out"
                  aria-label="Github"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.76-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.467-2.381 1.235-3.221-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.983-.399 3.005-.404 1.022.005 2.048.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.241 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.803 5.62-5.475 5.92.43.37.814 1.102.814 2.222v3.293c0 .322.218.694.825.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com/in/yourprofile"
                  className="text-gray-600 hover:text-primary transition duration-150 ease-in-out"
                  aria-label="Linkedin"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.5c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.5h-3v-5.5c0-1.381-1.119-2-2.5-2s-2.5 1.119-2.5 2v5.5h-3v-10h3v1.5c.553-.832 1.5-1.5 2.5-1.5 1.933 0 3.5 1.567 3.5 3.5v6.5z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutView;
