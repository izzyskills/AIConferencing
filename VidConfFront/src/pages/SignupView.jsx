import React from "react";
import UserAuthForm from "@/components/Forms/UserAuthForm";
import singupImage from "../assets/undraw_sign-up_qamz.svg";
import { MountainIcon } from "lucide-react";

const SignupView = () => {
  return (
    <div className="container relative   flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-2">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <UserAuthForm />
        </div>
      </div>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-primary dark:border-r lg:flex">
        <div className="absolute inset-0">
          <img
            src={singupImage}
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 opacity-50" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <MountainIcon className="h-8 w-8 mr-2" />
          VidConf Inc
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Our platform has revolutionized the way we manage projects,
              making collaboration seamless and efficient.&rdquo;
            </p>
            <footer className="text-sm">Alex Johnson</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default SignupView;
