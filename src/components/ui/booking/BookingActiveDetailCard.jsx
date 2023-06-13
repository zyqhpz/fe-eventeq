import React, { useState, useEffect } from 'react'

import { Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import GetItem from './GetItem'

export default function BookingActiveDetailCard ({ booking }) {
  let count = 0

  const createdDate = new Date(booking.CreatedAt)
  const createdDateStr = createdDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // convert date string DD/MM/YYYY to Date object
  const bookingEndDate = new Date()
  const dateParts = booking.EndDate.split('/') // Assuming booking.EndDate is in the format "DD/MM/YYYY"

  // Create a new Date object with the extracted date components
  bookingEndDate.setDate(parseInt(dateParts[0], 10) + 1)
  bookingEndDate.setMonth(parseInt(dateParts[1], 10) - 1) // Months in JavaScript are zero-based
  bookingEndDate.setFullYear(parseInt(dateParts[2], 10))

  // set HH:MM:SS to 00:00:00
  bookingEndDate.setHours(0, 0, 0, 0)

  // Set the date we're counting down to
  const targetDate = new Date(bookingEndDate) // Specify your target date here

  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime())

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(calculateRemainingTime())
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  function calculateRemainingTime () {
    const currentTime = new Date()
    const difference = targetDate.getTime() - currentTime.getTime()

    if (difference <= 0) {
      // Target date has passed
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      }
    }

    // Calculate remaining time in days, hours, minutes, and seconds
    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)

    return {
      days,
      hours,
      minutes,
      seconds
    }
  }

  const bookingDurationInDays = Math.floor(
    (new Date(booking.EndDate) - new Date(booking.StartDate)) /
      (1000 * 60 * 60 * 24)
  )

  const bookingDuration =
    bookingDurationInDays > 1
      ? `(${bookingDurationInDays} days)`
      : `(${bookingDurationInDays} day)`

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

  return (
    <div className="w-full p-4">
      <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
        <div className="flex-auto p-4">
          <div className="flex flex-wrap">
            <div className="relative w-full pr-4 max-w-full flex-grow flex-1 p-4">
              <h5 className="text-orange-500 uppercase font-bold text-xs">
                Active
              </h5>
              <div className="flex flex-row items-center justify-between">
                <span className="flex flex-row items-baseline font-semibold text-xl text-gray-800">
                  Booking Date: {booking.StartDate} - {booking.EndDate}
                  <p className="text-base font-regular">
                    &nbsp;
                    {DurationCalculator(booking.StartDate, booking.EndDate)}
                  </p>
                </span>
                {/* Countdown: &nbsp; */}
                <div className="flex flex-row gap-4 m-4">
                  <div className="flex flex-col items-center">
                    <p className="font-bold">{remainingTime.days}</p>
                    <p className="font-regular text-md">Days</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="font-bold">{remainingTime.hours}</p>
                    <p className="font-regular text-md">Hours</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="font-bold">{remainingTime.minutes}</p>
                    <p className="font-regular text-md">Minutes</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="font-bold">{remainingTime.seconds}</p>
                    <p className="font-regular text-md">Seconds</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col">
                  {booking.Items.map((item) => (
                    <div className="flex flex-wrap flex-col" key={item.ItemID}>
                      <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                        <span className="font-regular text-xl text-gray-800">
                          Item {++count}:{' '}
                          <span className="font-semibold">{item.Name}</span>
                          <span className="text-sm pl-4">x{item.Quantity}</span>
                        </span>
                      </div>
                      <div></div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 w-1/5 justify-end">
                  <p className="font-regular text-md flex flex-row justify-between">
                    <span>Subtotal:</span>
                    <span>RM {booking.SubTotal}</span>
                  </p>
                  <p className="font-regular text-md flex flex-row justify-between">
                    <span>Service Fee:</span>
                    <span>RM {booking.ServiceFee}</span>
                  </p>
                  <p className="font-semibold text-md flex flex-row justify-between">
                    <span>Grand Total:</span>
                    <span>RM {booking.GrandTotal}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-4 flex flex-row justify-between items-end">
            <span className="font-semibold text-sm text-gray-800">
              Created On: {createdDateStr}
            </span>
            <Link
              className="mr-4 flex flex-row items-center"
              to={{
                pathname: '/listing/booking/active/' + booking.ID,
                state: {
                  data: booking,
                  string: 'hello'
                }
              }}
            >
              <span className="font-bold text-lg bg-orange-500 px-6 py-2 text-white">
                Get Item Now
                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
