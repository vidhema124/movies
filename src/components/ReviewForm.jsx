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
          onClick={() => onRatingChange && onRatingChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const ReviewForm = ({reviews}) => {
  const [rating, setRating] = useState(0);
  const [user, setUser] = useState(null);
  const [review, setReview] = useState("");

  const { id } = useParams();
console.log(reviews,"reviewsreviews");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (storedUser) setUser(storedUser.message);
  }, []);


 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("User not logged in!");

    const reviewData = {
      userId: user._id,
      name: user.name,
      rating,
      review
    };

    try {
      await axios.post(
        `https://movies-app-jgjm.onrender.com/api/v1/review/${id}`,
        reviewData
      );
      alert("Review submitted successfully!");
      setRating(0);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error.response?.data?.message || "Failed to submit review.");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Movie Reviews</h3>

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

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700">User Reviews</h3>
        {reviews.length > 0 ? (
          <div className="space-y-4 mt-4">
            {reviews.map((reviewItem, index) => (
              <div key={index} className="p-4 border rounded-lg shadow-sm bg-gray-100">
                <h4 className="font-semibold">{reviewItem.name}</h4>
                <StarRating rating={reviewItem.rating} />
                <p className="text-gray-700">{reviewItem.review}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-2">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewForm;
