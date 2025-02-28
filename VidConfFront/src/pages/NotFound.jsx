import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
export default function NotFound() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (auth?.userId) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }, 2000);
    return () => clearTimeout(timer); // Clear the timeout if the component unmounts
  }, [auth, navigate]);

  return (
    <>
      <section className="pt-28  px-4 md:px-10 lg:px-20 flex w-full">
        <div className="center">
          <h1 className="text-center text-accent text-6xl">
            Page Does not Exist. Redirecting...
          </h1>
        </div>
      </section>
    </>
  );
}
