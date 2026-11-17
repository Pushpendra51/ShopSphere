import { useState } from "react";
import API from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [resetUrl, setResetUrl] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/auth/forgot-password", { email });
      alert(data.message);
      setResetUrl(data.resetUrl);
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={submitHandler} className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">Forgot Password</h1>

        <input
          type="email"
          placeholder="Enter your registered email"
          className="w-full border px-4 py-3 rounded-lg mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="w-full bg-indigo-600 text-white py-3 rounded-xl">
          Generate Reset Link
        </button>

        {resetUrl && (
          <p className="mt-4 text-sm text-indigo-600 break-all">
            {resetUrl}
          </p>
        )}
      </form>
    </div>
  );
}

export default ForgotPassword;
