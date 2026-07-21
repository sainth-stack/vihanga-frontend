import React, { useState, useEffect } from 'react'
import { Rating } from 'react-simple-star-rating'

export function RatingComponent({ readonly = false, value, onChange, isGoals = false, ratingScale = null }) {
  const [rating, setRating] = useState(value ? value : 0)
  const [hoverRating, setHoverRating] = useState(0)
  
  useEffect(() => {
    setRating(value ? value : 0);
  }, [value]);

  // Get rating scale data
  const getRatingScaleData = () => {
    if (ratingScale && ratingScale.length > 0) {
      // Make the name check case-insensitive and robust
      const scaleData = ratingScale.find(item => item.name && item.name.toLowerCase().includes("rating scale"));
      return scaleData ? scaleData.value : [];
    }
    return [];
  }

  const ratingScaleData = getRatingScaleData();
  const maxRating = ratingScaleData.length > 0 ? ratingScaleData.length : 5;
  const getMeaning = (ratingValue) => {
    const idx =Math.min(Math.floor(ratingValue),ratingScaleData.length-1)
    console.log(idx,ratingScaleData,'ratingValue')
    if (ratingScaleData.length > 0) {
      if (ratingScaleData.length) {
        return ratingScaleData[idx].meaning;
      }
    }
    return '';
  }

  // Map the library's 1-5 index to the actual number of stars
  const getStarIndex = (index) => {
    return Math.ceil((index / 5) * maxRating);
  }

  const handleRating = (rate) => {
    const mappedRating = getStarIndex(rate);
    setRating(mappedRating);
    onChange({ target: { value: mappedRating, name: "Feedback" } })
  }

  const onPointerEnter = (index) => {
    setHoverRating(getStarIndex(index));
  }

  const onPointerLeave = () => {
    setHoverRating(0);
  }

  const onPointerMove = (index) => {
    setHoverRating(getStarIndex(index));
  }

  return (
    <div style={{ position: 'relative' }}>
      <Rating
        initialValue={rating}
        onClick={handleRating}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerMove={onPointerMove}
        allowFraction
        readonly={readonly}
        iconsCount={maxRating}
      />
      {hoverRating > 0 && ratingScaleData.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '-30px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#333',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            pointerEvents: 'none'
          }}
        >
          {getMeaning(hoverRating - 1)}
        </div>
      )}
    </div>
  )
}