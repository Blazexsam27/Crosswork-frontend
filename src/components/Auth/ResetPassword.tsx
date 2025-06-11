import authService from "@/services/auth.service";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    authProvider: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordResetDone, setPasswordResetDone] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = window.location.pathname.split("/").pop();
    if (token && token?.length < 3) return;
    if (!validateForm()) return;

    // setup auth provider to default
    formData.authProvider = "local";
    const { password } = formData;

    // Simulate API call
    try {
      await authService.resetPassword(password, token);
      setPasswordResetDone(true);
    } catch (error) {
      console.error("password reset failed", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-sm shadow-xl mt-4">
      {passwordResetDone ? (
        <div className="flex justify-center my-6">
          Password reset successful Go to login page:
          <a href="/login" className="text-blue-500">
            Login
          </a>
        </div>
      ) : null}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Create an account</h2>
        <p className="mt-2 text-gray-600">Join our community of students</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="relative my-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type={`${showPassword ? "text" : "password"}`}
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-sm border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
            placeholder="Create a password"
          />
          {showPassword ? (
            <Eye
              className="absolute top-9 right-2"
              onClick={() => setShowPassword(!showPassword)}
            />
          ) : (
            <EyeOff
              className="absolute top-9 right-2"
              onClick={() => setShowPassword(!showPassword)}
            />
          )}
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>
        <div className="relative mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={`${!showConfirmPassword ? "text" : "password"}`}
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-sm border ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
            placeholder="Confirm your password"
          />
          {!showConfirmPassword ? (
            <Eye
              className="absolute top-9 right-2"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          ) : (
            <EyeOff
              className="absolute top-9 right-2"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          )}
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-sm hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
