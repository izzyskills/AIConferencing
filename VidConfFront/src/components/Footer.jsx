import { MountainIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative">
      <div className="max-w-7xl px-6 mx-auto md:px-4">
        <div className="border-gray-300 md:py-16 border-t mt-[-1px] py-12">
          {/* Top area: Blocks */}
          <div className="flex justify-between items-center mb-12">
            {/* Logo */}
            <Link aria-label="Cruip" className="inline-block" to="/">
              <MountainIcon className="text-primary" />
            </Link>
            {/* Links */}
            <div className="flex space-x-4">
              <Link
                to="/"
                className="text-gray-600 dark:text-stone-400 duration-150 ease-in-out transition"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-gray-600 dark:text-stone-400 duration-150 ease-in-out transition"
              >
                About Us
              </Link>
            </div>
          </div>
          {/* Bottom area */}
          <div className="flex justify-between items-center">
            {/* Social links */}
            <ul className="order-2 mb-0 ml-4 md:mb-4 flex">
              <li className="ml-4">
                <a
                  aria-label="Twitter"
                  className="text-primary-foreground bg-primary justify-center items-center rounded-full duration-150 ease-in-out transition flex"
                  href="https://twitter.com/yourprofile"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="fill-current h-8 w-8"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M13.063 9l3.495 4.475L20.601 9h2.454l-5.359 5.931L24 23h-4.938l-3.866-4.893L10.771 23H8.316l5.735-6.342L8 9h5.063Zm-.74 1.347h-1.457l8.875 11.232h1.36l-8.778-11.232Z"></path>
                  </svg>
                </a>
              </li>
              <li className="ml-4">
                <a
                  aria-label="Github"
                  className="text-primary-foreground bg-primary justify-center items-center rounded-full duration-150 ease-in-out transition flex"
                  href="https://github.com/yourprofile"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="fill-current h-8 w-8"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16 8.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V22c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z"></path>
                  </svg>
                </a>
              </li>
              <li className="ml-4">
                <a
                  aria-label="Linkedin"
                  className="text-primary-foreground bg-primary  justify-center items-center rounded-full duration-150 ease-in-out transition flex"
                  href="https://linkedin.com/in/yourprofile"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="fill-current h-8 w-8"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M23.3 8H8.7c-.4 0-.7.3-.7.7v14.7c0 .3.3.6.7.6h14.7c.4 0 .7-.3.7-.7V8.7c-.1-.4-.4-.7-.8-.7zM12.7 21.6h-2.3V14h2.4v7.6h-.1zM11.6 13c-.8 0-1.4-.7-1.4-1.4 0-.8.6-1.4 1.4-1.4.8 0 1.4.6 1.4 1.4-.1.7-.7 1.4-1.4 1.4zm10 8.6h-2.4v-3.7c0-.9 0-2-1.2-2s-1.4 1-1.4 2v3.8h-2.4V14h2.3v1c.3-.6 1.1-1.2 2.2-1.2 2.4 0 2.8 1.6 2.8 3.6v4.2h.1z"></path>
                  </svg>
                </a>
              </li>
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
