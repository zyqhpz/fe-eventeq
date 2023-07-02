import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import BookingCountdown from './BookingCountdown'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarXmark } from '@fortawesome/free-solid-svg-icons'

export default function BookingUpcomingDetailCard ({ booking }) {
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

  return (
    <div className="w-full p-4">
      <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
        <div className="flex-auto p-4">
          <div className="flex flex-wrap">
            <div className="relative w-full pr-4 max-w-full flex-grow flex-1 p-4">
              <span className="bg-gray-100 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                Upcoming
              </span>
              <div className="flex flex-row items-center justify-between">
                <span className="flex flex-row items-baseline font-semibold text-xl text-gray-800">
                  Booking Date: {booking.StartDate} - {booking.EndDate}
                  <p className="text-base font-regular">
                    &nbsp;
                    {DurationCalculator(booking.StartDate, booking.EndDate)}
                  </p>
                </span>
                <BookingCountdown EndDate={booking.StartDate} />
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
            <button
              className="mr-4 flex flex-row items-center"
              onClick={() => {
                console.log('Cancel Booking')
              }}
            >
              <span className="font-bold text-lg bg-red-500 px-6 py-2 text-white">
                <FontAwesomeIcon icon={faCalendarXmark} className="mr-2" />
                Cancel Booking
              </span>
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
