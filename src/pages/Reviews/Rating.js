import React, { useState } from 'react'
import { Rating } from 'react-simple-star-rating'

export function RatingComponent({ readonly = false, value, onChange, isGoals = false }) {
  const [rating, setRating] = useState(value ? value : 0)
  const handleRating = (rate) => {
    setRating(rate);
    onChange({ target: { value: rate, name: "Feedback" } })
  }
  const onPointerEnter = () => {}
  const onPointerLeave = () =>{}
  const onPointerMove = (value, index) => {}

  return (
    <div>
      <Rating
        initialValue={rating}
        onClick={handleRating}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerMove={onPointerMove}
        allowFraction
        readonly={readonly}
      />
    </div>
  )
}