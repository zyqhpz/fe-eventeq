import React, { useEffect, useState } from 'react'

import { useParams, Link } from 'react-router-dom'

import path from '../../utils/path'

import Navbar from '../../ui/Navbar'

import BookingDetailCard from '../../ui/booking/BookingUpcomingDetailCard'

export default function BookingItem () {
  const [openTab, setOpenTab] = useState(1)

  const [upcomingBooking, setUpcomingBooking] = useState([])
  const [activeBooking, setActiveBooking] = useState([])
  const [endedBooking, setEndedBooking] = useState([])

  const [loading, setLoading] = useState(true)

  if (openTab === 1) {
    document.title = 'Upcoming Booking'
  } else if (openTab === 2) {
    document.title = 'Active Booking'
  } else if (openTab === 3) {
    document.title = 'Ended Booking'
  }

  useEffect(() => {
    fetch(path.url + 'api/booking/6419d02a915009536af83de6/listing')
      .then((res) => res.json())
      .then((data) => {
        data.forEach(element => {
          if (element.Status === 0) {
            setUpcomingBooking(upcomingBooking => [...upcomingBooking, element])
          } else if (element.Status === 1) {
            setActiveBooking(activeBooking => [...activeBooking, element])
          } else if (element.Status === 2) {
            setEndedBooking(endedBooking => [...endedBooking, element])
          }
        })
        setLoading(false)
      })
  }, [])

  return (
    <div className="h-screen flex flex-col w-screen">
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
              </ul>
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                <div className="px-4 py-5 flex-auto">
                  <div className="tab-content tab-space">
                    <div
                      className={openTab === 1 ? 'block' : 'hidden'}
                      id="link1"
                    >
                        {/* Upcoming booking */}
                      <div>
                        <div className="flex flex-col gap-2">
                            {upcomingBooking.map((booking) => (
                                    <BookingDetailCard booking={booking} key={booking.ID}/>
                              // <div className="w-full lg:w-6/12 xl:w-4/12 px-4" key={booking.ID}>
                              //     {/* {booking.ID} */}
                              // </div>
                            ))}
                            </div>
                      </div>
                    </div>
                    <div
                      className={openTab === 2 ? 'block' : 'hidden'}
                      id="link2"
                    >
                        {/* Active booking */}
                      <p>
                        Completely synergize resource taxing relationships via
                        premier niche markets. Professionally cultivate
                        one-to-one customer service with robust ideas.
                        <br />
                        <br />
                        Dynamically innovate resource-leveling customer service
                        for state of the art customer service.
                      </p>
                    </div>
                    <div
                      className={openTab === 3 ? 'block' : 'hidden'}
                      id="link3"
                    >
                        {/* Ended booking */}
                      <p>
                        Efficiently unleash cross-media information without
                        cross-media value. Quickly maximize timely deliverables
                        for real-time schemas.
                        <br />
                        <br /> Dramatically maintain clicks-and-mortar solutions
                        without functional solutions.
                      </p>
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
