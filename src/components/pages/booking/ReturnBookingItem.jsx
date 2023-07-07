import React, { useEffect, useState } from 'react'

import { Link, useLocation, useParams } from 'react-router-dom'

import BookingCountdown from '../../ui/booking/BookingCountdown'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import crc32 from 'crc-32'

import QrReader from 'react-qr-scanner'

import path from '../../utils/path'

import { useToast } from '@chakra-ui/react'

export default function ReturnItem () {
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

  const [itemQR, setItemQR] = useState(null)
  const [openQRScanner, setOpenQRScanner] = useState(false)
  const [QRerror, setQRerror] = useState(false)

  const [allItemsReady, setAllItemsReady] = useState(false)
  const [finalScan, setFinalScan] = useState(false)

  const handleQRScan = (data) => {
    if (data) {
      if (data.text === booking.ID) {
        window.modalQR.close()
        setOpenQRScanner(false)

        if (allItemsReady) {
          setFinalScan(true)
        }
      } else if (data.text === itemQR.ItemID) {
        window.modalQR.close()
        setOpenQRScanner(false)

        const scanned = itemQR.Scanned + 1
        const remaining = itemQR.Quantity - scanned

        if (remaining >= 0) {
          itemQR.Scanned = scanned
          itemQR.RemainingToScan = remaining
        }

        if (scanned >= itemQR.Quantity) {
          itemQR.Status = 'Ready'

          // check if all items are ready
          let ready = 0
          items.forEach((item) => {
            if (item.Status === 'Ready') {
              ready++
            }
          })

          if (ready === items.length) {
            setAllItemsReady(true)
          }
        }

        setItems([...items])
        setItemQR(null)
      } else {
        window.modalQR.close()
        setOpenQRScanner(false)
        WrongQRCode('Wrong QR code detected')
      }
    } else {
      setQRerror(true)
    }
  }

  // Error feedback if QR code is not match
  const toast = useToast()
  const WrongQRCode = (message) => {
    return toast({
      title: 'QR Code Error.',
      description: message,
      status: 'error',
      position: 'top-right',
      duration: 6000,
      isClosable: true
    })
  }

  const handleQRError = (err) => {
    console.error(err)
  }

  const SuccessUpdate = (message) => {
    return toast({
      title: 'Item Scanned.',
      description: message,
      status: 'success',
      position: 'top-right',
      duration: 3000,
      isClosable: true
    })
  }

  return (
    <div className="p-8 flex flex-col w-screen">
      <ul className="menu menu-horizontal bg-orange-500 text-white hover:bg-base-200 hover:text-black rounded-box w-24">
        <li>
          <Link
            to={'/listing/booking/'}
            className="btn btn-ghost btn-sm rounded-btn"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back
          </Link>
        </li>
      </ul>
      {/* Main page */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="mt-4 flex flex-col md:flex-row w-full">
          {/* Left side */}
          <div className="w-full md:w-2/3">
            <div className="w-full">
              <h1 className="flex flex-col md:flex-row text-lg md:text-2xl font-bold items-baseline md:gap-2">
                <span>List of Booked Items</span>
                <span className="text-sm font-normal">
                  Booking ID: {crc32.str(booking.ID).toString(16)}
                </span>
              </h1>
              <div className="flex flex-wrap">
                <div className="flex flex-col w-full md:w-11/12 md:p-4 gap-2 overflow-x-auto">
                  <table
                    className="w-full text-xs md:text-sm text-left text-gray-500"
                    id="bookingSummaryTable"
                  >
                    <thead className="text-sm md:text-md text-gray-700 uppercase bg-gray-50">
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
                              </div>
                              <div className="flex flex-col">
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
                                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-xl uppercase"
                                  onClick={() => {
                                    setItemQR(item)
                                    setOpenQRScanner(true)
                                    window.modalQR.showModal()
                                  }}
                                >
                                  open QR scanner
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
          </div>
          {/* right side */}
          <div className="w-full md:w-1/2 pr-3">
            <div className="flex flex-col gap-2 relative w-full">
              <h1 className="text-lg md:text-2xl font-bold">
                Booking Time Remaining
              </h1>
              <div className="flex flex-row">
                <BookingCountdown EndDate={booking.EndDate} />
              </div>
              <div className="flex flex-col gap-2">
                {allItemsReady ? (
                  finalScan ? (
                    <span className="text-sm font-semibold">
                      *Ready to confirm return
                    </span>
                  ) : (
                    <button
                      className="btn btn-ghost btn-md rounded-btn bg-orange-500 text-white md:w-1/3"
                      onClick={() => {
                        setOpenQRScanner(true)
                        window.modalQR.showModal()
                      }}
                    >
                      Scan Final QR Code
                    </button>
                  )
                ) : (
                  <div className="flex flex-row gap-2">
                    <span className="text-sm font-semibold">
                      *Please scan all items before confirming return
                    </span>
                  </div>
                )}
                <button
                  className={
                    finalScan
                      ? 'btn btn-ghost btn-md rounded-btn bg-orange-500 text-white md:w-1/3'
                      : 'btn btn-ghost btn-md rounded-btn bg-orange-500 text-white md:w-1/3 opacity-50 cursor-not-allowed'
                  }
                  onClick={() => {
                    if (finalScan) {
                      fetch(`${path.url}api/booking/active/${id}/return`, {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                          bookingId: id
                        })
                      })
                        .then((res) => res.json())
                        .then((data) => {
                          if (data.status === 'success') {
                            SuccessUpdate('Item has been returned.')

                            // put delay to allow success message to show
                            setTimeout(() => {
                              window.location.href = '/listing/booking'
                            }, 3000)
                          } else {
                            alert('Error: ' + data.message)
                          }
                        })
                        .catch((err) => console.log(err))
                    }
                  }}
                >
                  Confirm Return Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <dialog id="modalQR" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">Scan Item&apos;s QR code</h3>
          <p className="py-4">
            {/* Press ESC key or click the button below to close */}
            <div className="w-full h-full">
              <span>QR Scanner</span>
              <center>
                <div style={{ marginTop: 10 }}>
                  {openQRScanner ? (
                    <QrReader
                      delay={300}
                      onError={handleQRError}
                      onScan={handleQRScan}
                      style={{ height: 320, width: 320 }}
                      constraints={{
                        audio: false,
                        video: { facingMode: 'environment' }
                      }}
                    />
                  ) : (
                    <span></span>
                  )}
                </div>
              </center>
              {QRerror ? (
                <div
                  className="flex p-4 mb-4 text-sm text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800"
                  role="alert"
                >
                  <svg
                    aria-hidden="true"
                    className="flex-shrink-0 inline w-5 h-5 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Info</span>
                  <div>
                    <span className="font-medium">Scanning..</span> Point the
                    camera at the QR code.
                  </div>
                </div>
              ) : (
                <span></span>
              )}
            </div>
          </p>
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </div>
        </form>
      </dialog>
    </div>
  )
}
