import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { logout } from "@/store/modules/authSlice";
import { Globe, Menu, X, LogOut, FileText, Grid, User } from "lucide-react";
import ConfirmationModal from "./ConfirmationModal";
export default function Navbar({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { path: "/articles", label: "Articles", icon: FileText },
    { path: "/category", label: "Category", icon: Grid },
    { path: "/profile", label: "Profile", icon: User },
  ];

  const handleLogoutConfirm = () => {
    dispatch(logout());
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav
        className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-shadow ${
          isScrolled ? "shadow-sm" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Mobile Menu Button */}
            <div className="flex items-center gap-2">
              {isMobile && (
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 transition-colors"
                >
                  <span className="sr-only">
                    {isOpen ? "Close menu" : "Open menu"}
                  </span>
                  {isOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
              )}
              <Link
                to="/articles"
                className="flex items-center gap-2 py-2 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <Globe className="h-6 w-6" />
                <span className="text-lg font-semibold">Traveling</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:gap-2">
              <div className="flex items-center gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                        ${
                          location.pathname === link.path
                            ? "text-gray-900 bg-gray-100"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }
                      `}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
              <div className="w-px h-6 mx-2 bg-gray-200" />
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`
            md:hidden transition-all duration-300 ease-in-out overflow-hidden
            ${isOpen ? "max-h-96 border-t border-gray-200" : "max-h-0"}
          `}
        >
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${
                      location.pathname === link.path
                        ? "text-gray-900 bg-gray-100"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 mt-2 px-3 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        title="Log Out"
        message="Are you sure you want to Log Out? This action cannot be undone."
        isOpen={isLogoutModalOpen}
        onConfirm={handleLogoutConfirm}
        onClose={() => setIsLogoutModalOpen(false)}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
