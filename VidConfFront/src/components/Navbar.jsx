import React from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import DarkMode from "@/components/DarkMode";
import { useLogout } from "@/adapters/Requests";
import useAuth from "@/hooks/useAuth";

const Navbar = () => {
  const { isLoggedIn } = useAuth();
  const logout = useLogout();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <Link
            to={isLoggedIn ? `/dashboard` : `/`}
            className="mr-6 hidden lg:flex"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
            </svg>
            <span className="sr-only">Acme Inc</span>
          </Link>
          {isLoggedIn ? (
            <div className="grid gap-2 py-6">
              <Button size="sm">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button onClick={handleLogout} variant="destructive" size="sm">
                {logout.isLoading ? "Logging out..." : "Logout"}
              </Button>
              <DarkMode />
            </div>
          ) : (
            <div className="grid gap-2 py-6">
              <Button variant="outline" size="sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button className="text-left" size="sm">
                <Link className="text-left" to="/signup">
                  Register
                </Link>
              </Button>
              <Link
                to="/"
                className="flex w-full items-center py-2 text-lg font-semibold"
              >
                Home
              </Link>
              <Link
                to="#"
                className="flex w-full items-center py-2 text-lg font-semibold"
              >
                About
              </Link>
            </div>
          )}
          <DarkMode />
        </SheetContent>
      </Sheet>
      <Link
        to={isLoggedIn ? `/dashboard` : `/`}
        className="mr-6 hidden lg:flex gap-2"
      >
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
        </svg>
        <span>Acme Inc</span>
      </Link>
      {isLoggedIn ? (
        <nav className="ml-auto hidden lg:flex gap-6">
          <Button variant="outline" size="sm">
            <Link to="/dashboard">Dashboard</Link>
          </Button>
          <Button onClick={handleLogout} variant="destructive" size="sm">
            {logout.isLoading ? "Logging out..." : "Logout"}
          </Button>
          <DarkMode />
        </nav>
      ) : (
        <nav className="ml-auto hidden lg:flex gap-6">
          <Link
            to="/"
            className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-popover hover:text-popover-foreground focus:bg-popover focus:text-popover-foreground data-[active]:bg-accent-foreground/50 data-[state=open]:bg-accent-foreground/50"
          >
            Home
          </Link>
          <Link
            to="#"
            className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-popover hover:text-popover-foreground focus:bg-popover focus:text-popover-foreground data-[active]:bg-accent-foreground/50 data-[state=open]:bg-accent-foreground/50"
          >
            About
          </Link>
          <Link to="/login">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm">Register</Button>
          </Link>
          <DarkMode />
        </nav>
      )}
    </header>
  );
};

export default Navbar;
