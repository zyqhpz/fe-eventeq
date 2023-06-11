import React, { useState, useEffect } from 'react'

export default function BookingDetailCard ({ booking }) {
  let count = 0

  const createdDate = new Date(booking.CreatedAt)
  const createdDateStr = createdDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // convert date string DD/MM/YYYY to Date object
  const bookingStartDate = new Date()
  const dateParts = booking.StartDate.split('/') // Assuming booking.StartDate is in the format "DD/MM/YYYY"

  // Create a new Date object with the extracted date components
  bookingStartDate.setDate(parseInt(dateParts[0], 10))
  bookingStartDate.setMonth(parseInt(dateParts[1], 10) - 1) // Months in JavaScript are zero-based
  bookingStartDate.setFullYear(parseInt(dateParts[2], 10))

  // set HH:MM:SS to 00:00:00
  bookingStartDate.setHours(0, 0, 0, 0)

  // Set the date we're counting down to
  const targetDate = new Date(bookingStartDate) // Specify your target date here

  const [remainingTime, setRemainingTime] = useState(
    calculateRemainingTime()
  )

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

  return (
    <div className="w-full p-4">
      <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
        <div className="flex-auto p-4">
          <div className="flex flex-wrap">
            <div className="relative w-full pr-4 max-w-full flex-grow flex-1 p-4">
              <h5 className="text-gray-500 uppercase font-bold text-xs">
                Upcoming
              </h5>
              <div className="flex flex-row items-center justify-between">
                <span className="font-semibold text-xl text-gray-800">
                  Booking Date: {booking.StartDate}
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
          <p className="text-sm text-gray-500 mt-4 flex flex-col">
            <span className="font-semibold text-sm text-gray-800">
              Created On: {createdDateStr}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
