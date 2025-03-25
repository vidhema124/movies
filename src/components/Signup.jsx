import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";

const Signup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.otpless = async (otplessUser) => {
      if (
        !otplessUser ||
        !otplessUser.identities ||
        otplessUser.identities.length === 0
      ) {
        toast.error("User data not received properly!");
        return;
      }

      const identity = otplessUser.identities.find(
        (id) => id.identityType === "MOBILE"
      );
      const userData = {
        name: identity.name || "Guest",
        phone: identity.identityValue || "",
        verified: identity.verified || false,
        channel: identity.channel || "Unknown",
        deviceType: identity.identityType || "Unknown",
        ip: otplessUser.network?.ip || "Unknown",
        timezone: otplessUser.network?.timezone,
        ipLocation: {
          city: {
            name: otplessUser.network?.ipLocation?.city?.name,
          },
          subdivisions: {
            name: otplessUser.network?.ipLocation?.subdivisions?.name,
            code: otplessUser.network?.ipLocation?.subdivisions?.code,
          },
          country: {
            name: otplessUser.network?.ipLocation?.country?.name,
            code: otplessUser.network?.ipLocation?.country?.code,
          },
          continent: {
            code: otplessUser.network?.ipLocation?.continent?.code,
          },
          latitude: otplessUser.network?.ipLocation?.latitude,
          longitude: otplessUser.network?.ipLocation?.longitude,
          postalCode: otplessUser.network?.ipLocation?.postalCode,
        },
      };

      try {
        const response = await fetch(
          "https://movies-app-jgjm.onrender.com/api/v1/user",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              
            },
            body: JSON.stringify(userData),
          }
        );

        const data = await response.json();

        if (response.ok) {
          toast.success("Login successful!");
          localStorage.setItem("hasLoggedIn", "true");
          localStorage.setItem("userData", JSON.stringify(data));
          navigate("/");
        } else {
          toast.error(data.message || "Signup failed!");
        }
      } catch (error) {
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
