import React, { useEffect, useState } from 'react'

import { useParams, Link } from 'react-router-dom'

import axios from 'axios'

import path from '../../utils/path'

import Navbar from '../../ui/Navbar'

export default function BookingItem () {
  const [openTab, setOpenTab] = useState(1)

  return (
    <div className="h-screen flex flex-col w-screen">
      <Navbar />
      <div className="bg-gray-100 h-full max-w-full">
        <div>
          <div className="flex flex-wrap px-36 p-12">
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
                      <p>
                        Collaboratively administrate empowered markets via
                        plug-and-play networks. Dynamically procrastinate B2C
                        users after installed base benefits.
                        <br />
                        <br /> Dramatically visualize customer directed
                        convergence without revolutionary ROI.
                      </p>
                    </div>
                    <div
                      className={openTab === 2 ? 'block' : 'hidden'}
                      id="link2"
                    >
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
