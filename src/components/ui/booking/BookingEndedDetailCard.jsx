import React, { useState, useEffect } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons'

import path from '../../utils/path'

import StarRating from './StarRating'

export default function BookingEndedDetailCard ({ booking }) {
  let count = 0

  const createdDate = new Date(booking.CreatedAt)
  const createdDateStr = createdDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const DurationCalculator = (start, end) => {
    const startDateString = start
    const endDateString = end

    // Extract day, month, and year components from the start and end date strings
    const [startDay, startMonth, startYear] = startDateString.split('/')
    const [endDay, endMonth, endYear] = endDateString.split('/')

    // Create Date objects by providing the components in the correct order (year, month, day)
    const startDate = new Date(startYear, startMonth - 1, startDay)
    const endDate = new Date(endYear, endMonth - 1, endDay)

    // Calculate the time difference in milliseconds
    const timeDiff = endDate.getTime() - startDate.getTime()

    // Calculate the duration in days, hours, minutes, and seconds
    const duration = {
      days: Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1
    }

    return duration.days > 1
      ? `(${duration.days} days)`
      : `(${duration.days} day)`
  }

  const ReturnDate = (date) => {
    const returnDate = new Date(date)
    const returnDateStr = returnDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    })

    return returnDateStr
  }

  // Rating state and handler
  const [haveRating, setHaveRating] = useState(false)
  const [selectedStars, setSelectedStars] = useState(5)
  const [review, setReview] = useState('')
  const [stars, setStars] = useState(0)
  const [isReviewEmpty, setIsReviewEmpty] = useState(true)

  // use UseEffect to check if the booking has rating
  useEffect(() => {
    if (booking.Feedback.Rating !== 0 && booking.Feedback.Review !== '') {
      setHaveRating(true)
      setStars(booking.Feedback.Rating)
    }
  }, [booking.Feedback.Rating, booking.Feedback.Review])

  function handleRating (rating) {
    setSelectedStars(rating)
  }

  function handleSubmitRating () {
    if (review === '') {
      // Set isReviewEmpty to true and apply red border to the textarea
      setIsReviewEmpty(true)
      return
    }

    // get value from input name #bookingId
    const bookingId = document.querySelector('#bookingId').value

    const rating = {
      bookingId,
      rating: selectedStars,
      review
    }

    fetch(path.url + 'api/booking/giveRating', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rating)
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (data.status === 'success') {
          window.location.reload()
        }
      })
      .catch((err) => console.log(err))
  }

  // if review is empty, disable the submit button
  useEffect(() => {
    if (review === '') {
      setIsReviewEmpty(true)
    } else {
      setIsReviewEmpty(false)
    }
  }, [review])

  // useEffect to clear the review state when the modal is closed
  useEffect(() => {
    const modal = document.getElementById('giveRatingModal')
    modal.addEventListener('close', () => {
      handleRating(5)
      setReview('')
    })
  }, [])

  return (
    <div className="w-full p-4">
      <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
        <div className="flex-auto p-4">
          <div className="flex flex-wrap">
            <div className="relative w-full pr-4 max-w-full flex-grow flex-1 p-4">
              {booking.Status === 3 ? (
                <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                  Ended
                </span>
              ) : booking.Status === 6 ? (
                <span className="bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                  Unpaid
                </span>
              ) : (
                <span className="bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                  Cancelled
                </span>
              )}
              <div className="flex flex-col md:flex-row items-center justify-between">
                <span className="hidden md:flex flex-row items-baseline font-semibold text-xl text-gray-800">
                  Booking Date: {booking.StartDate} - {booking.EndDate}
                  <p className="text-base font-regular">
                    &nbsp;
                    {DurationCalculator(booking.StartDate, booking.EndDate)}
                  </p>
                </span>
                <span className="md:hidden flex items-baseline font-semibold md:text-xl text-gray-800">
                  <span className="bg-indigo-100 text-indigo-800 text-sm font-bold mt-2 mr-2 px-2 py-0.5 rounded">
                    {booking.StartDate} - {booking.EndDate}
                  </span>
                </span>
                <div className="hidden md:block">
                  {booking.Status === 3 ? (
                    <div>
                      <span>Item Returned On: </span>
                      <span className="font-semibold">
                        {ReturnDate(booking.UpdatedAt)}
                      </span>
                    </div>
                  ) : booking.Status === 4 ? (
                    <div>
                      <span>Cancelled On: </span>
                      <span className="font-semibold">
                        {ReturnDate(booking.UpdatedAt)}
                      </span>
                    </div>
                  ) : booking.Status === 5 ? (
                    <div>
                      <span className="font-semibold">Item Not Retrieved</span>
                    </div>
                  ) : (
                    <div className='flex flex-col text-right'>
                      <span className="font-semibold">Late Payment</span>
                      <span className='text-xs md:text-sm'><span className='text-red-500'>*</span>Payment must be made 6 hours before booking start date</span>
                    </div>
                  )}
                </div>
                <div className="block md:hidden bg-indigo-100 text-indigo-800 text-sm font-bold mt-2 mr-2 px-2 py-0.5 rounded">
                  {booking.Status === 3 ? (
                    <div>
                      <span>Item Returned On: </span>
                      <span className="font-semibold">
                        {ReturnDate(booking.UpdatedAt)}
                      </span>
                    </div>
                  ) : booking.Status === 4 ? (
                    <div>
                      <span>Cancelled On: </span>
                      <span className="font-semibold">
                        {ReturnDate(booking.UpdatedAt)}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="font-semibold">Item Not Retrieved</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col md:flex-row mt-2 md:mt-0 md:items-center md:justify-between">
                <div className="flex flex-col bg-gray-50 rounded px-4 py-2 text-base">
                  {booking.Items.map((item) => (
                    <div className="flex flex-wrap flex-col" key={item.ItemID}>
                      <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                        <span className="font-regular md:text-xl text-gray-800">
                          Item {++count}:{' '}
                          <span className="font-semibold">{item.Name}</span>
                          <span className="text-sm pl-4">x{item.Quantity}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-col w-full md:w-1/5 justify-end text-sm md:text-base">
                  <p className="font-regular flex flex-row justify-between">
                    <span>Subtotal:</span>
                    <span>RM {booking.SubTotal}</span>
                  </p>
                  <p className="font-regular flex flex-row justify-between">
                    <span>Service Fee:</span>
                    <span>RM {booking.ServiceFee}</span>
                  </p>
                  <p className="font-semibold flex flex-row justify-between">
                    <span>Grand Total:</span>
                    <span>RM {booking.GrandTotal}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-4 flex flex-col md:flex-row justify-between items-end gap-2 md:gap-0">
            <span className="font-semibold text-xs text-gray-800">
              Created On: {createdDateStr}
            </span>
            {booking.Status === 3 && haveRating === true ? (
              <p className="font-regular flex flex-row justify-between text-sm items-center gap-2">
                <span>Rating:</span>
                <span className="text-base font-semibold">
                  {/* stars is over 5, make it repeat the component based on the stars value */}
                  {Array.from({ length: stars }, (_, index) => (
                    <FontAwesomeIcon
                      key={index}
                      icon={faStar}
                      className="text-amber-400"
                    />
                  ))}
                  {/* stars is less than 5, make it repeat the component based on the stars value */}
                  {Array.from({ length: 5 - stars }, (_, index) => (
                    <FontAwesomeIcon
                      key={index}
                      icon={faStarRegular}
                      className="text-gray-400"
                    />
                  ))}
                </span>
              </p>
            ) : booking.Status === 3 && haveRating === false ? (
              <button
                className="flex flex-row items-center font-bold text-xs md:text-sm"
                onClick={() => {
                  document.getElementById('giveRatingModal').showModal()

                  // append value to input name #bookingId
                  const bookingId = document.querySelector('#bookingId')
                  bookingId.value = booking.ID
                }}
              >
                <span className="bg-orange-500 px-2 py-1 text-white">
                  Give Rating
                  <FontAwesomeIcon icon={faStar} className="ml-2" />
                </span>
              </button>
            ) : null}
          </p>
        </div>
      </div>
      <dialog
        id="giveRatingModal"
        className={`modal modal-bottom sm:modal-middle ${
          isReviewEmpty ? 'active' : ''
        }`}
      >
        <form method="dialog" className="modal-box">
          <h3 className="text-lg font-semibold">Give Rating</h3>
          {/* get the id from */}
          <input
            type="hidden"
            name="bookingId"
            id="bookingId"
          />
          <div className="flex flex-col mt-4">
            <label
              htmlFor="rating"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Rating
            </label>
            <StarRating maxStars={5} handleRating={handleRating} />
          </div>
          <div className="flex flex-col mt-4">
            <label
              htmlFor="review"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Review
            </label>
            <textarea
              id="review"
              rows="4"
              className={`block p-2.5 w-full text-sm ${
                isReviewEmpty ? 'border-red-500 ' : 'border '
              }text-gray-900 bg-gray-50 rounded-lg border-gray-300`}
              placeholder="Share more thoughts on the item to help other renters."
              value={review}
              onChange={(e) => {
                setReview(e.target.value)
              }}
            ></textarea>
          </div>
          <div className="modal-action">
            <button
              className={`btn btn-warning ${
                isReviewEmpty ? 'disabled opacity-50' : 'btn-primary'
              }`}
              onClick={() => {
                handleSubmitRating()
              }}
              style={{ pointerEvents: isReviewEmpty ? 'none' : 'auto' }}
            >
              Submit
            </button>

            <button className="btn">
              Cancel
            </button>
          </div>
        </form>
      </dialog>
    </div>
  )
}
