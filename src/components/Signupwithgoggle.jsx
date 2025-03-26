import React, { useState } from "react";
import { auth, provider, signInWithPopup, signOut } from "./firbase";
import { useNavigate } from "react-router-dom";

const Signupgoggle = () => {
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem("hasLoggedIn", "true");
      console.log("User Signed Up:", result.user);
      
      navigate(0); 
    
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       localStorage.removeItem("hasLoggedIn");
//       navigate(0); // Refresh the page to reflect logout
//     } catch (error) {
//       console.error("Error during logout:", error);
//     }
//   };

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

export default Signupgoggle;
