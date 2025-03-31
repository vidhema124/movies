import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ImCross } from "react-icons/im";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const StarRating = ({ rating, onRatingChange }) => {
  return (
    <div className="flex ">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`cursor-pointer text-3xl  transition-all ${star <= rating ? "text-orange-500 scale-110" : "text-gray-300"
            }`}
          onClick={() => onRatingChange && onRatingChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const ReviewForm = ({ reviews }) => {
  const [rating, setRating] = useState(0);
  const [user, setUser] = useState(null);
  const [review, setReview] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (storedUser) setUser(storedUser.data.message || storedUser.message);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("User not logged in!");

console.log(user);

    const reviewData = {
      userId: user._id,
      name: user.name,
      rating,
      review,
    };

    try {
      await axios.post(
        `https://movies-app-jgjm.onrender.com/api/v1/review/${id}`,
        reviewData
      );
      toast.success("Thank you for your review.");
      setIsOpen(false);
      setRating(0);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review.");
    }
  };

  return (
    <div className="max-w-lg self-start w-full bg-white shadow-lg rounded-lg p-6 mt-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 mt-5">
          Movie Reviews
        </h3>
        <div>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-gray-400 mt-5 text-white px-4 py-1 rounded-lg hover:bg-amber-600"
          >
            Write a Review
          </button>
          {isOpen && (
            <div className="z-40 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-100 h-100 md:w-150">
                <div className="flex justify-between">
                  {" "}
                  <h2 className="text-black text-lg font-bold mb-4">
                    Write a Review
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className=" text-black py-2 rounded-lg"
                  >
                    <ImCross />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-black ">
                  <StarRating rating={rating} onRatingChange={setRating} />
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Write your review here..."
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    rows="4"
                  ></textarea>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setIsOpen(false)}
                      className=" bg-blue-600 text-white py-2 px-2 mr-2 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className=" bg-blue-600 text-white py-2 px-2  rounded-lg transition-all"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className=" text-black max-h-[300px] overflow-auto scrollbar-hide ">
        <h3 className="text-lg  font-semibold text-gray-700">User Reviews</h3>
        {reviews.length > 0 ? (
          <div className="space-y-1  ">
            {reviews.map((reviewItem, index) => (
              <div
                key={index}
                className="my-0 mt-3 text-sm rounded-lg shadow-sm"
              >
                <h4 className=" font-semibold">{reviewItem.name}</h4>
                <div>
                  <StarRating rating={reviewItem.rating} className="text-sm" />

                  <p className="text-gray-700">{reviewItem.review}</p>
                </div>
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
