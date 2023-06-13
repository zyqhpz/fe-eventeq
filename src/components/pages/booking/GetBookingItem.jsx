import React, { useEffect, useState } from 'react'

import { Link, useLocation, useParams } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import QRcode from 'qrcode.react'

import path from '../../utils/path'

export default function GetItem () {
  const { id } = useParams()

  const [booking, setBooking] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${path.url}api/booking/active/${id}`)
      .then((res) => res.json())
      .then((data) => {
        // add new variable in item object to store scanned quantity
        data.Items.forEach((item) => {
          item.RemainingToScan = item.Quantity
          item.Scanned = 0
          item.Status = 'Pending'
        })

        setBooking(data)
        setItems(data.Items)
        setLoading(false)
      })
      .catch((err) => console.log(err))
  }, [])

  const handleScanningItem = (item) => {
    const scanned = item.Scanned + 1
    const remaining = item.Quantity - scanned

    if (remaining >= 0) {
      item.Scanned = scanned
      item.RemainingToScan = remaining
    }

    if (scanned >= item.Quantity) {
      item.Status = 'Ready'
    }

    setItems([...items])
    console.log(items)
  }

  return (
    <div className="p-8 flex flex-col w-screen">
      <ul className="menu menu-horizontal bg-orange-500 text-white hover:bg-base-200 hover:text-black rounded-box w-24">
        <li>
          <Link
            to={'/listing/booking/'}
            className="btn btn-ghost btn-sm rounded-btn"
            onClick={() => {}}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back
          </Link>
        </li>
      </ul>
      {/* Main page */}
      <div className="mt-4 flex flex-row w-full">
        {/* Left side */}
        <div className="w-2/3">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="w-full">
              <h1 className="text-2xl font-bold">
                List of Booked Items{' '}
                <span className="text-sm font-normal">
                  Booking ID: {booking.ID}
                </span>
              </h1>
              <div className="flex flex-wrap">
                <div className="flex flex-col w-11/12 p-4 gap-2">
                  <table
                    className="w-full text-sm text-left text-gray-500"
                    id="bookingSummaryTable"
                  >
                    <thead className="text-md text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Item
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Remaining to Scan
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Scanned
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr
                          key={item.ItemID}
                          className="bg-white hover:bg-gray-50 text-base"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="inline-flex w-10 h-10">
                                <img
                                  className="w-10 h-10 object-cover rounded-sm"
                                  alt={item.Name + ' image'}
                                  src={
                                    path.url +
                                    'api/item/image/' +
                                    item.Images[0]
                                  }
                                />
                                <QRcode
                                  id="myqr"
                                  value={item.ID}
                                  size={320}
                                  includeMargin={true}
                                />
                              </div>
                              <div>
                                <p className="font-bold">
                                  {item.Name}&nbsp;&nbsp;
                                  <span className="font-normal text-sm">
                                    x{item.Quantity}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="">{item.RemainingToScan}</p>
                          </td>
                          <td className="px-6 py-4">
                            {/* <p className="">{item.Scanned}</p> */}
                            <div className="flex flex-row gap-4 items-center">
                              <p>{item.Scanned}</p>
                              {item.Scanned >= item.Quantity ? (
                                <span></span>
                              ) : (
                                <button
                                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-xl"
                                  onClick={() => handleScanningItem(item)}
                                >
                                  Click To Scan
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {item.Status === 'Ready' ? (
                              <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                                Ready
                              </span>
                            ) : (
                              <span className="px-2 py-1 font-semibold leading-tight text-yellow-700 bg-yellow-300 rounded-full">
                                Pending
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* right side */}
        <div className="w-1/2 pr-3">
          <div className="flex flex-row items-center justify-end gap-2">
            <img
              className="mask mask-squircle h-10 w-10 object-cover"
              src="https://images.unsplash.com/photo-1457449940276-e8deed18bfff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            />
            <h1 className="text-lg font-regular">
              {/* {user.FirstName + ' ' + user.LastName} */}
            </h1>
          </div>
          <div className="flex flex-col gap-2 relative overflow-x-auto w-full">
            <h1 className="text-2xl font-bold">Booking Time Remaining</h1>
          </div>
        </div>
      </div>
    </div>
  )
}
