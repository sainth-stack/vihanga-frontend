import React, { useState } from "react";
import "./styles.scss";
import ReviewsForm from "./ReviewsForm";
import ReviewsTable from "./ReviewsTable";
export default function Reviews() {
  const [showReviewsForm, setShowReviewsForm] = useState(true);
  return (
    <div className="bg-light-primary rounded vh-100 p-4">
      {showReviewsForm ? <ReviewsForm setShowReviewsForm={setShowReviewsForm} /> : <ReviewsTable setShowReviewsForm={setShowReviewsForm} />}
    </div>
  );
}
