import React from "react";
import { auth, provider, signInWithPopup, signOut } from "./firbase";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignupGoogle = () => {
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const user = result.user;
console.log(user);

      if (user) {
        let body = {
          name: user.displayName,
          email: user.email,
        };
        const res = await axios.post(
          "https://movies-app-jgjm.onrender.com/api/v1/user",
          body
        );

        localStorage.setItem("hasLoggedIn", "true");
        localStorage.setItem("userData", JSON.stringify(res));
        navigate(0);
      }
    } catch (error) {}
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleSignup}
        className="cursor-pointer w-full mt-3 px-4 py-2 bg-transparent text-white border border-white rounded-full hover:bg-gray-600"
      >
        Sign up with Google
      </button>
    </div>
  );
};

export default SignupGoogle;
