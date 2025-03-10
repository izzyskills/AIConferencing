import React from "react";
import { Link } from "react-router-dom";

const footerLinks = [
  {
    title: "Products",
    links: [
      { text: "Drag And Drop", url: "#0", type: "internal" },
      { text: "Visual Studio X", url: "#0", type: "internal" },
      { text: "Easy Content", url: "#0", type: "internal" },
    ],
  },
  {
    title: "Resources",
    links: [
      { text: "Industries and tools", url: "#0", type: "internal" },
      { text: "Use cases", url: "#0", type: "internal" },
      { text: "Blog", url: "#0", type: "internal" },
      { text: "Online events", url: "#0", type: "internal" },
      { text: "Nostrud exercitation", url: "#0", type: "internal" },
    ],
  },
  {
    title: "Company",
    links: [
      { text: "Diversity & inclusion", url: "#0", type: "internal" },
      { text: "About us", url: "#0", type: "internal" },
      { text: "Press", url: "#0", type: "internal" },
      { text: "Customer stories", url: "#0", type: "internal" },
      { text: "Online communities", url: "#0", type: "internal" },
    ],
  },
  {
    title: "Support",
    links: [
      { text: "Documentation", url: "#0", type: "internal" },
      { text: "Tutorials & guides", url: "#0", type: "internal" },
      { text: "Webinars", url: "#0", type: "internal" },
      { text: "Open-source", url: "#0", type: "internal" },
    ],
  },
];

const socialLinks = [
  {
    ariaLabel: "Twitter",
    iconPath:
      "M13.063 9l3.495 4.475L20.601 9h2.454l-5.359 5.931L24 23h-4.938l-3.866-4.893L10.771 23H8.316l5.735-6.342L8 9h5.063Zm-.74 1.347h-1.457l8.875 11.232h1.36l-8.778-11.232Z",
    url: "https://twitter.com/yourprofile",
  },
  {
    ariaLabel: "Github",
    iconPath:
      "M16 8.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V22c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z",
    url: "https://github.com/yourprofile",
  },
  {
    ariaLabel: "Linkedin",
    iconPath:
      "M23.3 8H8.7c-.4 0-.7.3-.7.7v14.7c0 .3.3.6.7.6h14.7c.4 0 .7-.3.7-.7V8.7c-.1-.4-.4-.7-.8-.7zM12.7 21.6h-2.3V14h2.4v7.6h-.1zM11.6 13c-.8 0-1.4-.7-1.4-1.4 0-.8.6-1.4 1.4-1.4.8 0 1.4.6 1.4 1.4-.1.7-.7 1.4-1.4 1.4zm10 8.6h-2.4v-3.7c0-.9 0-2-1.2-2s-1.4 1-1.4 2v3.8h-2.4V14h2.3v1c.3-.6 1.1-1.2 2.2-1.2 2.4 0 2.8 1.6 2.8 3.6v4.2h.1z",
    url: "https://linkedin.com/in/yourprofile",
  },
];

const Footer = () => {
  return (
    <footer className="relative">
      <div className="max-w-7xl px-6 mx-auto md:px-4">
        <div className="border-gray-300 md:py-16 border-t mt-[-1px] py-12">
          {/* Top area: Blocks */}
          <div className="grid grid-cols-12 md:gap-20 mb-12 gap-8">
            {/* 1st block */}
            <div className="col-span-2 md:col-span-3">
              {/* Logo */}
              <Link aria-label="Cruip" className="inline-block" to="/">
                <svg
                  className="h-8 w-8"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      id="flogo_a"
                      x1="26%"
                      x2="100%"
                      y1="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#3ABAB4"></stop>
                      <stop offset="100%" stopColor="#7F9CF5"></stop>
                    </linearGradient>
                    <linearGradient
                      id="flogo_b"
                      x1="26%"
                      x2="100%"
                      y1="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#3ABAB4"></stop>
                      <stop
                        offset="100%"
                        stopColor="#3ABAB4"
                        stopOpacity="0"
                      ></stop>
                    </linearGradient>
                  </defs>
                  <path
                    d="M32 16h-8a8 8 0 10-16 0H0C0 7.163 7.163 0 16 0s16 7.163 16 16z"
                    fill="url(#flogo_a)"
                  ></path>
                  <path
                    d="M32 16c0 8.837-7.163 16-16 16S0 24.837 0 16h8a8 8 0 1016 0h8z"
                    fill="url(#flogo_b)"
                  ></path>
                </svg>
              </Link>
            </div>
            {/* 2nd, 3rd, 4th and 5th blocks */}
            <div className="col-span-10 md:grid-cols-4 grid-cols-2 gap-8 grid">
              {footerLinks.map((block) => (
                <div key={block.title} className="ceng1">
                  <h6 className="cf4hw cwaxc mb-2">{block.title}</h6>
                  <ul>
                    {block.links.map((link) => (
                      <li key={link.text} className="mb-1">
                        {link.type === "internal" ? (
                          <Link
                            to={link.url}
                            className="text-gray-600 dark:text-stone-400 duration-150 ease-in-out transition"
                          >
                            {link.text}
                          </Link>
                        ) : (
                          <a
                            href={link.url}
                            className="text-gray-600 dark:text-stone-400 duration-150 ease-in-out transition"
                          >
                            {link.text}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          {/* Bottom area */}
          <div className="flex justify-between items-center">
            {/* Social links */}
            <ul className="order-2 mb-0 ml-4 md:mb-4 flex">
              {socialLinks.map((social) => (
                <li key={social.ariaLabel} className="ml-4">
                  <a
                    aria-label={social.ariaLabel}
                    className="text-white bg-teal-500 cvvk7 capfz cj3dx csz0f justify-center items-center rounded-full duration-150 ease-in-out transition flex"
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="fill-current h-8 w-8"
                      viewBox="0 0 32 32"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d={social.iconPath}></path>
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
            {/* Copyrights note */}
            <div className="text-gray-600 c0atf ceng1 mr-4">
              © VidConf. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
