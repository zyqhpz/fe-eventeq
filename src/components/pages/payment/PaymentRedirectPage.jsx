import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleXmark,
  faArrowLeft,
  faMoneyBill1,
  faCircleCheck,
  faCircleExclamation
} from '@fortawesome/free-solid-svg-icons'

import { Link, useLocation } from 'react-router-dom'

import { React } from 'react'

export default function PaymentRedirectPage () {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const statusId = queryParams.get('status_id')
  const billCode = queryParams.get('billcode')
  const orderId = queryParams.get('order_id')

  return (
    <div className="p-4 md:p-8 flex flex-col w-screen h-screen bg-gray-100">
      <ul className="menu menu-horizontal bg-orange-500 text-white hover:bg-base-200 hover:text-black rounded-box w-24">
        <li>
          <Link to="/" className="btn btn-ghost btn-sm rounded-btn">
            <FontAwesomeIcon icon={faArrowLeft} />
            Home
          </Link>
        </li>
      </ul>
      {/* Main page */}
      <div className="mt-4 flex flex-col md:flex-row w-full">
        <div className="flex flex-col w-auto bg-white mx-auto p-8 border-2 rounded-lg relative text-center shadow">
          <div className="flex flex-col md:flex-row md:justify-between mx-auto">
            <div className="flex flex-col">
              {statusId === '1' ? (
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="text-green-500 text-6xl mx-auto"
                />
              ) : statusId === '2' ? (
                <FontAwesomeIcon
                  icon={faCircleExclamation}
                  className="text-yellow-300 text-6xl mx-auto"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  className="text-red-500 text-6xl mx-auto"
                />
              )}
              <p className="my-4 text-lg font-bold text-gray-900">
                {statusId === '1'
                  ? 'Payment Success'
                  : statusId === '2'
                    ? 'Payment Pending'
                    : 'Payment Failed'}
              </p>

              <div className="flex flex-row w-full justify-between gap-4">
                <div className="flex flex-col">
                  <p className="text-md text-left font-semibold">Booking ID:</p>
                  <p className="text-md text-left font-semibold">Status:</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-md text-right">#{orderId}</p>
                  <p className="text-md text-right">
                    {statusId === '1'
                      ? 'Success'
                      : statusId === '2'
                        ? 'Pending'
                        : 'Fail'}
                  </p>
                </div>
              </div>
              {statusId === '1' && (
                <ul className="bg-orange-500 text-white hover:bg-base-200 hover:text-black rounded-md w-auto mx-auto py-1 px-2 mt-4">
                  <Link
                    to={'/listing/booking'}
                    className="btn btn-ghost btn-sm rounded-btn py-1 px-2"
                  >
                    Booking Page
                  </Link>
                </ul>
              )}
              {(statusId === '2' || statusId === '3') && (
                <ul className="bg-orange-500 text-white hover:bg-base-200 hover:text-black rounded-md w-auto mx-auto py-1 px-2 mt-4">
                  <Link
                    to={`https://dev.toyyibpay.com/${billCode}`}
                    className="btn btn-ghost btn-sm rounded-btn py-1 px-2"
                  >
                    <FontAwesomeIcon icon={faMoneyBill1} />
                    Pay Now
                  </Link>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
