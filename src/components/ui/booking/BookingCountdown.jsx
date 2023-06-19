import React, { useState, useEffect } from 'react'

export default function BookingCountdown ({ EndDate }) {
  // convert date string DD/MM/YYYY to Date object
  const bookingEndDate = new Date()
  const dateParts = EndDate.split('/') // Assuming booking.EndDate is in the format "DD/MM/YYYY"

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

  return (
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
  )
}
