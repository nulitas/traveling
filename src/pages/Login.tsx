import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { Mail, Lock, Loader2, Eye, EyeOff, Globe } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

import { useLoginMutation } from "@/services/authApi";
import { setCredentials } from "@/store/modules/authSlice";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (isAuthenticated || localStorage.getItem("authToken")) {
      navigate("/articles");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const userData = await login({ identifier, password }).unwrap();
      dispatch(setCredentials(userData));
      setIdentifier("");
      setPassword("");
      navigate("/articles");
    } catch (err: unknown) {
      let errorMessage =
        "An unexpected error occurred. Please try again later.";

      if (err && typeof err === "object") {
        const errorData = err as { message?: string };
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <ToastContainer />
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-900 mb-4">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="identifier"
                  className="text-sm font-medium text-gray-900"
                >
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="identifier"
                    type="email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    disabled={isLoading}
                    placeholder="name@example.com"
                    className="block w-full pl-10 pr-3 py-2.5 text-gray-900 rounded-lg border border-gray-300 
                             focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                             disabled:opacity-50 disabled:cursor-not-allowed
                             placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="block w-full pl-10 pr-12 py-2.5 text-gray-900 rounded-lg border border-gray-300 
                             focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white 
                         bg-gray-900 rounded-lg hover:bg-gray-800 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <Link
                to="/register"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Don't have an account?{" "}
                <span className="font-semibold">Create one</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
