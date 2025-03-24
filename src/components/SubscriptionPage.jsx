import React from "react";

const SubscriptionPage = () => {
  const plans = [
    { name: "1 Month", price: "₹149", benefits: ["Watch unlimited movies", "HD Streaming", "Cancel anytime"] },
    { name: "3 Months", price: "₹399", benefits: ["All 1-month benefits", "Save ₹48", "Exclusive discounts"] },
    { name: "12 Months", price: "₹999", benefits: ["All 3-month benefits", "Best value", "Priority support"] }
  ];

  const handleSubscribe = (plan) => {
    alert(`Proceeding to payment for ${plan.name} plan`);
    // Redirect to payment gateway
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Choose Your Plan</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg p-6 shadow-lg text-center transform transition hover:scale-105 hover:shadow-xl"
          >
            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <p className="text-2xl font-bold text-orange-400 my-2">{plan.price}</p>
            <ul className="text-sm mb-4">
              {plan.benefits.map((benefit, i) => (
                <li key={i} className="flex items-center justify-center">
                  ✅ {benefit}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe(plan)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Subscribe Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPage;
