import React, { useState } from "react";
import { Alert, AlertDescription } from "../ui/alert";
import { X } from "lucide-react";
import authService from "@/services/auth.service";

function ForgotPass() {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({
    email: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    try {
      await authService.forgotPassword(formData.email);
      setShowAlert(true);
    } catch (error) {
      console.error("Error occured", error);
    }
  };

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

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-sm shadow-xl mt-14">
      {showAlert && (
        <Alert className="w-max flex gap-8 justify-between border-green-600 bg-green-50 my-2 fixed right-5  top-20 ">
          <AlertDescription>
            You will receive an email if the email is valid for resetting the
            password
          </AlertDescription>
          <span>
            <X
              className="w-4 h-4 cursor-pointer mt-1"
              onClick={() => setShowAlert(!showAlert)}
            />
          </span>
        </Alert>
      )}

      <div className="text-center mb-8 ">
        <h2 className="text-3xl font-bold text-gray-900">Forgot Password ?</h2>
        <p className="mt-2 text-gray-600">
          Please provide your associated email
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-sm border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-sm hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default ForgotPass;
