import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons'

const StarRating = ({ maxStars, handleRating }) => {
  const [rating, setRating] = useState(5)

  const handleStarClick = (value) => {
    setRating(value)
    handleRating(value)
  }

  const getRatingLabel = () => {
    switch (rating) {
      case 5:
        return <span className="text-amber-600">Amazing</span>
      case 4:
        return <span className="text-amber-600">Good</span>
      case 3:
        return 'Fair'
      case 2:
        return 'Poor'
      case 1:
        return 'Terrible'
      default:
        return ''
    }
  }

  return (
    <div>
      <div className="flex flex-row place-items-center">
        {[...Array(maxStars)].map((_, index) => (
          <span
            key={index}
            className={`star ${
              index < rating
                ? 'text-amber-400'
                : 'text-gray-400 hover:text-amber-400'
            }`}
            onClick={() => handleStarClick(index + 1)}
          >
            <FontAwesomeIcon
              icon={index < rating ? faStar : faStarRegular}
              className="inline"
            />
          </span>
        ))}
      <p className="text-sm ml-4">
        {getRatingLabel()}
      </p>
      </div>
    </div>
  )
}

export default StarRating
