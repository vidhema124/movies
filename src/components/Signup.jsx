import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";

const Signup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.otpless = async (otplessUser) => {
      console.log("Received otplessUser:", otplessUser); // Debugging log

      if (!otplessUser || !otplessUser.identities || otplessUser.identities.length === 0) {
        toast.error("User data not received properly!");
        return;
      }

      const identity = otplessUser.identities.find(id => id.identityType === "MOBILE"); // Extract mobile identity

      const userData = {
        name: identity?.name || "Guest",
        phone: identity?.identityValue || "",
        verified: identity?.verified || false,
        userId: otplessUser.userId,
        token: otplessUser.token,
        channel: identity?.channel || "Unknown",
        deviceType: identity?.identityType || "Unknown",
      };

      console.log("Sending to API:", userData); // Debugging log

      try {
        const response = await fetch("https://movies-app-jgjm.onrender.com/api/v1/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        const data = await response.json();
        console.log("API Response:", response.status, data); // Debugging log

        if (response.ok) {
          toast.success("Login successful!");
          localStorage.setItem("hasLoggedIn", "true");
          localStorage.setItem("userData", JSON.stringify(data));
          navigate("/");
        } else {
          toast.error(data.message || "Signup failed!");
        }
      } catch (error) {
        console.error("API Error:", error);
        toast.error("Something went wrong while saving data!");
      }
    };
  }, [navigate]);

  return (
    <div className="mt-14">
      <Toaster position="top-center" richColors />
      <div className="bg-white" id="otpless-login-page"></div>
    </div>
  );
};

export default Signup;
