import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import MovieDetail from "./components/MovieDetail.jsx";
import WishlistPage from "./components/WishlistPage.jsx";
import SubscriptionPage from "./components/SubscriptionPage.jsx";
import Signup from "./components/Signup.jsx";
import Home from "./components/Home.jsx";
import ReviewForm from "./components/ReviewForm.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/subscriptionPage" element={<SubscriptionPage />} />
        <Route path="/movie/:id/review" element={<ReviewForm />} />

      </Routes>
    </Router>
  );
};

export default App;
