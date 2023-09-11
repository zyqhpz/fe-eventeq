import React, { useState, useEffect } from 'react'

import { Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure
} from '@chakra-ui/react'

import QRcode from 'qrcode.react'

import BookingCountdown from './BookingCountdown'
import BookingOverdueCountdown from './BookingOverdueCountdown'
import BookingEndedDetailCard from './BookingEndedDetailCard'

export default function InBookingDetailCard ({ booking }) {
  const [isOverdue, setIsOverdue] = useState(false)

  useEffect(() => {
    const bookingEndDate = new Date()
    const dateParts = booking.EndDate.split('/') // Assuming booking.EndDate is in the format "DD/MM/YYYY"

    bookingEndDate.setDate(parseInt(dateParts[0], 10) + 1)
    bookingEndDate.setMonth(parseInt(dateParts[1], 10) - 1) // Months in JavaScript are zero-based
    bookingEndDate.setFullYear(parseInt(dateParts[2], 10))
    bookingEndDate.setHours(0, 0, 0, 0)

    const targetDate = new Date(bookingEndDate)

    const currentTime = new Date()
    const difference = targetDate.getTime() - currentTime.getTime()

    if (difference <= 0) {
      // Target date has passed
      setIsOverdue(true)
    }
  }, [])

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

  // view QR
  const [viewQRBookingID, setViewQRBookingID] = useState('')

  function viewQR (booking) {
    setViewQRBookingID(booking.ID)
  }

  // Upcoming
  const StatusZero = () => {
    return (
      <div className="w-full p-4">
        <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
          <div className="flex-auto p-4">
            <div className="flex flex-wrap">
              <div className="relative w-full pr-4 max-w-full flex-grow flex-1 p-4">
                <span className="bg-gray-100 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                  Upcoming
                </span>
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
                  <BookingCountdown EndDate={booking.StartDate} />
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="flex flex-col bg-gray-100 rounded px-4 py-2 text-base">
                    {booking.Items.map((item) => (
                      <div
                        className="flex flex-wrap flex-col"
                        key={item.ItemID}
                      >
                        <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                          <span className="font-regular md:text-xl text-gray-800">
                            Item {++count}:{' '}
                            <span className="font-semibold">{item.Name}</span>
                            <span className="text-sm pl-4">
                              x{item.Quantity}
                            </span>
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
            <p className="mt-4 flex flex-row justify-between items-end">
              <div className="flex flex-col">
                <span className="font-semibold text-xs md:text-sm text-gray-800">
                  Booked By: &nbsp;
                  <span className="font-bold">
                    {booking.BookedBy.FirstName} {booking.BookedBy.LastName}
                  </span>
                </span>
                <span className="font-semibold text-xs md:text-sm text-gray-800">
                  Created On: {createdDateStr}
                </span>
              </div>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Active
  const StatusOne = () => {
    return (
      <div className="w-full p-4">
        <div className="relative flex flex-col min-w-0 break-words rounded mb-6 xl:mb-0 shadow-lg bg-white">
          <div className="flex-auto p-4">
            <div className="flex flex-wrap">
              <div className="relative w-full pr-4 max-w-full flex-grow flex-1 p-4">
                <span className="bg-orange-100 text-orange-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                  Hand Over Item
                </span>
                <div className="flex flex-row items-center justify-between">
                  <span className="flex flex-row items-baseline font-semibold text-xl text-gray-800">
                    Booking Date: {booking.StartDate} - {booking.EndDate}
                    <p className="text-base font-regular">
                      &nbsp;
                      {DurationCalculator(booking.StartDate, booking.EndDate)}
                    </p>
                  </span>
                  <BookingCountdown EndDate={booking.EndDate} />
                </div>
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-col">
                    {booking.Items.map((item) => (
                      <div
                        className="flex flex-wrap flex-col"
                        key={item.ItemID}
                      >
                        <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                          <span className="font-regular text-xl text-gray-800">
                            Item {++count}:{' '}
                            <span className="font-semibold">{item.Name}</span>
                            <span className="text-sm pl-4">
                              x{item.Quantity}
                            </span>
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
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-gray-800">
                  Booked By: &nbsp;
                  <span className="font-bold">
                    {booking.BookedBy.FirstName} {booking.BookedBy.LastName}
                  </span>
                </span>
                <span className="font-semibold text-sm text-gray-800">
                  Created On: {createdDateStr}
                </span>
              </div>
              {booking.Status === 2 ? (
                <button
                  className="mr-4 flex flex-row items-center"
                  onClick={() => {
                    viewQR(booking)
                  }}
                >
                  <span className="font-bold text-lg bg-orange-500 px-6 py-2 text-white">
                    Get Item Now
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                  </span>
                </button>
              ) : (
                <></>
              )}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Get Item
  const { isOpen, onOpen, onClose } = useDisclosure()
  const StatusTwo = () => {
    return (
      <div className="w-full p-4">
        <div
          className={
            'relative flex flex-col min-w-0 break-words rounded mb-6 xl:mb-0 shadow-lg ' +
            (booking.Status === 2 && isOverdue
              ? 'bg-red-200'
              : booking.Status === 2 && !isOverdue
                ? 'bg-orange-200'
                : 'bg-white')
          }
        >
          <div className="flex-auto p-4">
            <div className="flex flex-wrap">
              <div className="relative w-full pr-4 max-w-full flex-grow flex-1 p-4">
                <span className="bg-orange-100 text-orange-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                  {booking.Status === 2 && isOverdue
                    ? 'Active Booking (Overdue)'
                    : booking.Status === 2 && !isOverdue
                      ? 'Active Booking'
                      : 'Get Item'}
                </span>
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
                  <div>
                    {
                      // If booking is overdue, display overdue countdown
                      isOverdue ? (
                        <BookingOverdueCountdown EndDate={booking.EndDate} />
                      ) : (
                        // Else, display normal countdown
                        <BookingCountdown EndDate={booking.EndDate} />
                      )
                    }
                  </div>
                </div>
                <div className="flex flex-col md:flex-row mt-2 md:mt-0 md:items-center md:justify-between">
                  <div className="flex flex-col bg-gray-50 rounded px-4 py-2 text-base">
                    {booking.Items.map((item) => (
                      <div
                        className="flex flex-wrap flex-col"
                        key={item.ItemID}
                      >
                        <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                          <span className="font-regular md:text-xl text-gray-800">
                            Item {++count}:{' '}
                            <span className="font-semibold">{item.Name}</span>
                            <span className="text-sm pl-4">
                              x{item.Quantity}
                            </span>
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
            <p className="md:mt-4 flex flex-col md:flex-row justify-between items-end gap-2">
              <div className="flex flex-col">
                <span className="font-semibold text-xs md:text-sm text-gray-800">
                  Booked By: &nbsp;
                  <span className="font-bold">
                    {booking.BookedBy.FirstName} {booking.BookedBy.LastName}
                  </span>
                </span>
                <span className="font-semibold text-xs md:text-sm text-gray-800">
                  Created On: {createdDateStr}
                </span>
              </div>
              <button
                className="mr-4 flex flex-row items-center font-bold text-sm md:text-lg"
                onClick={() => {
                  onOpen()
                  viewQR(booking)
                }}
              >
                <span className="bg-orange-500 px-6 py-2 text-white">
                  Get Item Now
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </span>
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  }

  const StatusElse = () => {
    return <BookingEndedDetailCard booking={booking} isOwner={true} />
  }

  return (
    <div>
      {booking.Status === 0 ? (
        <StatusZero />
      ) : booking.Status === 1 ? (
        <StatusOne />
      ) : booking.Status === 2 ? (
        <>
            <StatusTwo />
            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>QR Code</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <p className="py-4">
                    Show this <strong>QR Code</strong> to client for final
                    verification
                    </p>
                    <div className="flex justify-center">
                    <QRcode
                        value={viewQRBookingID}
                        size={240}
                        includeMargin={true}
                    />
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                    Close
                    </Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
        </>
      ) : (
        <StatusElse />
      )}
    </div>
  )
}
