import React, { useState, useEffect } from 'react'

export default function BookingUpcomingCountdown ({ StartDate }) {
  // convert date string DD/MM/YYYY to Date object
  const bookingStartDate = new Date()
  const dateParts = StartDate.split('/') // Assuming booking.EndDate is in the format "DD/MM/YYYY"

  // Create a new Date object with the extracted date components
  bookingStartDate.setDate(parseInt(dateParts[0] - 1, 10) + 1)
  bookingStartDate.setMonth(parseInt(dateParts[1], 10) - 1) // Months in JavaScript are zero-based
  bookingStartDate.setFullYear(parseInt(dateParts[2], 10))

  // set HH:MM:SS to 00:00:00
  bookingStartDate.setHours(0, 0, 0, 0)

  // Set the date we're counting down to
  const targetDate = new Date(bookingStartDate)

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
    <div className="grid grid-flow-col gap-5 text-center auto-cols-max scale-75 md:scale-100">
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-5xl">
          <span style={{ '--value': remainingTime.days }}></span>
        </span>
        days
      </div>
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-5xl">
          <span style={{ '--value': remainingTime.hours }}></span>
        </span>
        hours
      </div>
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-5xl">
          <span style={{ '--value': remainingTime.minutes }}></span>
        </span>
        min
      </div>
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-5xl">
          <span style={{ '--value': remainingTime.seconds }}></span>
        </span>
        sec
      </div>
    </div>
  )
}
