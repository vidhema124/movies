import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const StarRating = ({ rating, onRatingChange }) => {
  return (
    <div className="flex space-x-2 my-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`cursor-pointer text-3xl transition-all ${
            star <= rating ? "text-orange-500 scale-110" : "text-gray-300"
          }`}
          onClick={() => onRatingChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const ReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [user, setUser] = useState(null);
 // const [movie, setMovie] = useState(null);
 const { id } = useParams();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (storedUser) setUser(storedUser.message); // Extract user data
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("User not logged in!");
  
    const reviewData = {
      userId: user._id,  // Correct user ID
      name: user.name,
      review,
      rating,
    };
  
    try {
      await axios.post(
        `https://movies-app-jgjm.onrender.com/api/v1/review/${id}`, // Use movie ID in URL
        reviewData
      );
      alert("Review submitted successfully!");
      setRating(0);
      setReview("");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error.response?.data?.message || "Failed to submit review.");
    }
  };
  

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        Leave a Review
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <StarRating rating={rating} onRatingChange={setRating} />

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review here..."
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
          rows="4"
        ></textarea>

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition-all"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
