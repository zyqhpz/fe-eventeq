import React, { useState, useEffect } from 'react'

export default function BookingOverdueCount ({ EndDate }) {
  const bookingEndDate = new Date()
  const dateParts = EndDate.split('/') // Assuming booking.EndDate is in the format "DD/MM/YYYY"

  bookingEndDate.setDate(parseInt(dateParts[0], 10) + 1)
  bookingEndDate.setMonth(parseInt(dateParts[1], 10) - 1) // Months in JavaScript are zero-based
  bookingEndDate.setFullYear(parseInt(dateParts[2], 10))
  bookingEndDate.setHours(0, 0, 0, 0)

  const targetDate = new Date(bookingEndDate)

  const [elapsedTime, setElapsedTime] = useState(calculateElapsedTime())

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(calculateElapsedTime())
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  function calculateElapsedTime () {
    const currentTime = new Date()
    const difference = currentTime.getTime() - targetDate.getTime()

    if (difference <= 0) {
      // Booking is not yet overdue
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      }
    }

    // Calculate elapsed time in days, hours, minutes, and seconds
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
          <span style={{ '--value': elapsedTime.days }}></span>
        </span>
        days
      </div>
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-5xl">
          <span style={{ '--value': elapsedTime.hours }}></span>
        </span>
        hours
      </div>
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-5xl">
          <span style={{ '--value': elapsedTime.minutes }}></span>
        </span>
        min
      </div>
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-5xl">
          <span style={{ '--value': elapsedTime.seconds }}></span>
        </span>
        sec
      </div>
    </div>
  )
}
