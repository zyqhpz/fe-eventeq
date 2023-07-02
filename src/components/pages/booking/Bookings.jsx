import React, { useEffect, useState, lazy } from 'react'

import { useParams, Link } from 'react-router-dom'

import path from '../../utils/path'

import Navbar from '../../ui/Navbar'

import BookingUpcomingDetailCard from '../../ui/booking/BookingUpcomingDetailCard'
import BookingActiveDetailCard from '../../ui/booking/BookingActiveDetailCard'
import BookingEndedDetailCard from '../../ui/booking/BookingEndedDetailCard'
import InBookingDetailCard from '../../ui/booking/InBookingDetailCard'

export default function BookingItem () {
  const [openTab, setOpenTab] = useState(1)

  const [upcomingBooking, setUpcomingBooking] = useState([])
  const [activeBooking, setActiveBooking] = useState([])
  const [endedBooking, setEndedBooking] = useState([])
  const [itemInBooking, setItemInBooking] = useState([])

  const [loading, setLoading] = useState(true)

  const userId = localStorage.getItem('userId')

  useEffect(() => {
    fetch(path.url + 'api/booking/' + userId + '/upcoming/listing')
      .then((res) => res.json())
      .then((data) => {
        if (data !== null) {
          setUpcomingBooking(data)
        }
        setLoading(false)
      })
  }, [])

  // check userId is exist
  if (!userId) {
    window.location.href = '/'
  }

  if (openTab === 0) {
    document.title = 'Item In Booking'
    loadItemInBooking()
  } else if (openTab === 1) {
    document.title = 'Upcoming Booking'
  } else if (openTab === 1) {
    document.title = 'Upcoming Booking'
  } else if (openTab === 2) {
    document.title = 'Active Booking'
    loadActiveBooking()
  } else if (openTab === 3) {
    document.title = 'Ended Booking'
    loadEndedBooking()
  }

  function loadActiveBooking () {
    if (activeBooking.length === 0) {
      fetch(path.url + 'api/booking/' + userId + '/active/listing')
        .then((res) => res.json())
        .then((data) => {
          if (data !== null) {
            setActiveBooking(data)
          }
        })
    }
  }

  function loadEndedBooking () {
    if (endedBooking.length === 0) {
      fetch(path.url + 'api/booking/' + userId + '/ended/listing')
        .then((res) => res.json())
        .then((data) => {
          if (data !== null) {
            setEndedBooking(data)
          }
        })
    }
  }

  function loadItemInBooking () {
    if (itemInBooking.length === 0) {
      fetch(path.url + 'api/booking/' + userId + '/inBooking/listing')
        .then((res) => res.json())
        .then((data) => {
          if (data !== null) {
            setItemInBooking(data)
          }
        })
    }
  }

  return (
    <div className="h-screen flex flex-col w-screen overflow-auto">
      <Navbar />
      <div className="bg-gray-100 h-full max-w-full">
        <div>
          <div className="flex flex-wrap px-48 p-12">
            <h1 className="text-2xl font-bold">Booking Details</h1>
            <div className="w-full">
              <ul
                className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
                role="tablist"
              >
                <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                  <a
                    className={
                      'text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ' +
                      (openTab === 1
                        ? 'text-white bg-orange-500'
                        : 'text-orange-500 bg-white')
                    }
                    onClick={(e) => {
                      e.preventDefault()
                      setOpenTab(1)
                    }}
                    data-toggle="tab"
                    href="#link1"
                    role="tablist"
                  >
                    Upcoming
                  </a>
                </li>
                <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                  <a
                    className={
                      'text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ' +
                      (openTab === 2
                        ? 'text-white bg-orange-500'
                        : 'text-orange-500 bg-white')
                    }
                    onClick={(e) => {
                      e.preventDefault()
                      setOpenTab(2)
                    }}
                    data-toggle="tab"
                    href="#link2"
                    role="tablist"
                  >
                    Active
                  </a>
                </li>
                <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                  <a
                    className={
                      'text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ' +
                      (openTab === 3
                        ? 'text-white bg-orange-500'
                        : 'text-orange-500 bg-white')
                    }
                    onClick={(e) => {
                      e.preventDefault()
                      setOpenTab(3)
                    }}
                    data-toggle="tab"
                    href="#link3"
                    role="tablist"
                  >
                    Ended
                  </a>
                </li>
                <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                  <a
                    className={
                      'text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ' +
                      (openTab === 0
                        ? 'text-white bg-orange-500'
                        : 'text-orange-500 bg-white')
                    }
                    onClick={(e) => {
                      e.preventDefault()
                      setOpenTab(0)
                    }}
                    data-toggle="tab"
                    href="#link0"
                    role="tablist"
                  >
                    Item In Booking
                  </a>
                </li>
              </ul>
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                <div className="px-4 py-5 flex-auto">
                  <div className="tab-content tab-space">
                    <div
                      className={openTab === 1 ? 'block' : 'hidden'}
                      id="link1"
                    >
                      {/* Upcoming booking */}
                      <div className="flex flex-col gap-2">
                        {upcomingBooking.length === 0 && !loading ? (
                          <div className="flex flex-col items-center justify-center">
                            <p className="text-2xl font-bold">
                              No upcoming booking
                            </p>
                            <Link
                              to="/"
                              className="text-orange-500 hover:text-orange-600"
                            >
                              Book now!
                            </Link>
                          </div>
                        ) : (
                          upcomingBooking.map((booking) => (
                            <BookingUpcomingDetailCard
                              booking={booking}
                              key={booking.ID}
                            />
                          ))
                        )}
                      </div>
                    </div>
                    <div
                      className={openTab === 2 ? 'block' : 'hidden'}
                      id="link2"
                    >
                      {/* Active booking */}
                      <div className="flex flex-col gap-2">
                        {activeBooking.length === 0 && !loading ? (
                          <div className="flex flex-col items-center justify-center">
                            <p className="text-2xl font-bold">
                              No active booking
                            </p>
                            <Link
                              to="/"
                              className="text-orange-500 hover:text-orange-600"
                            >
                              Book now!
                            </Link>
                          </div>
                        ) : (
                          activeBooking.map((booking) => (
                            <BookingActiveDetailCard
                              booking={booking}
                              key={booking.ID}
                            />
                          ))
                        )}
                      </div>
                    </div>
                    <div
                      className={openTab === 3 ? 'block' : 'hidden'}
                      id="link3"
                    >
                      {/* Ended booking */}
                      <div className="flex flex-col gap-2">
                        {endedBooking.length === 0 && !loading ? (
                          <div className="flex flex-col items-center justify-center">
                            <p className="text-2xl font-bold">
                              No booking history
                            </p>
                            <Link
                              to="/"
                              className="text-orange-500 hover:text-orange-600"
                            >
                              Book now!
                            </Link>
                          </div>
                        ) : (
                          endedBooking.map((booking) => (
                            <BookingEndedDetailCard
                              booking={booking}
                              key={booking.ID}
                            />
                          ))
                        )}
                      </div>
                    </div>
                    <div
                      className={openTab === 0 ? 'block' : 'hidden'}
                      id="link0"
                    >
                      {/* Item in booking */}
                      <div className="flex flex-col gap-2">
                        {itemInBooking.length === 0 && !loading ? (
                          <div className="flex flex-col items-center justify-center">
                            <p className="text-2xl font-bold">
                              No item in booking
                            </p>
                            <Link
                              to="/user/manage/item"
                              className="text-orange-500 hover:text-orange-600"
                            >
                              Add item now!
                            </Link>
                          </div>
                        ) : (
                          itemInBooking.map((booking) => (
                            <InBookingDetailCard
                              booking={booking}
                              key={booking.ID} />
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
