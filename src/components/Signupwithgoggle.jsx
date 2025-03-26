import React from "react";
import { auth, provider, signInWithPopup, signOut } from "./firbase";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignupGoogle = () => {
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("resultresult ", result);

      const user = result.user;

      if (user) {
        let body = {
          name: user.displayName,
          email: user.email,
        };
        const res = await axios.post(
          "https://movies-app-jgjm.onrender.com/api/v1/user",
          body
        );

        console.log("resresres ", res);
        localStorage.setItem("hasLoggedIn", "true");
        navigate(0);
      } else {
        console.error("Failed to create user");
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
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
