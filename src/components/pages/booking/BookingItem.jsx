import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import ItemBookingCard from '../../ui/booking/ItemBookingCard'

import Datepicker from 'react-tailwindcss-datepicker'

import path from '../../utils/path'

import { useToast } from '@chakra-ui/react'

export default function BookingItem () {
  const { ownerId } = useParams()
  const userId = localStorage.getItem('userId')
  const tempItemId = localStorage.getItem('tempItemId')
  const [user, setUser] = useState(null)
  const [owner, setOwner] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [bookingItems, setBookingItems] = useState([])
  const [quantity, setQuantity] = useState(0)

  const [duration, setDuration] = useState(1)

  const [subTotal, setSubTotal] = useState(0)
  const [serviceFee, setServiceFee] = useState(0) // 7% of subTotal
  const [grandTotal, setGrandTotal] = useState(0) // subTotal + serviceFee

  const [bookingButtonIsDisabled, setBookingButtonIsDisabled] = useState(true)

  const backPath = '/listing/item/' + tempItemId

  const removeTempItemId = () => {
    localStorage.removeItem('tempItemId')
  }

  const handleAddQuantity = (updatedItemQuantity, itemID) => {
    handleAddBooking(updatedItemQuantity, itemID)
  }

  const handleMinusQuantity = (updatedItemQuantity, itemID) => {
    removeBookingItem(updatedItemQuantity, itemID)
  }

  useEffect(() => {
    fetch(path.url + 'api/itemsForBooking/' + ownerId)
      .then((res) => res.json())
      .then((data) => {
        setOwner(data)
        setItems(data.Items)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetch(path.url + 'api/user/id/' + userId)
      .then((res) => res.json())
      .then((data) => {
        setUser(data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const handleAddBooking = (itemQuantity, itemID) => {
    // get item details
    const itemSelected = items.filter((item) => item.ID === itemID)
    const bookingItem = {
      id: itemSelected[0].ID,
      name: itemSelected[0].Name,
      price: itemSelected[0].Price,
      quantity: itemQuantity
    }
    // check if item already exist in bookingItems
    const itemExist = bookingItems.find((item) => item.id === bookingItem.id)
    if (itemExist) {
      const newBookingItems = bookingItems.map((item) =>
        item.id === bookingItem.id
          ? { ...item, quantity: bookingItem.quantity }
          : item
      )
      setBookingItems(newBookingItems)
    } else {
      setBookingItems([...bookingItems, bookingItem])
    }
    setQuantity(quantity + 1)
  }

  const removeBookingItem = (itemQuantity, itemID) => {
    // if item quantity is 0, remove item from bookingItems, else update quantity
    if (itemQuantity === 0) {
      const newBookingItems = bookingItems.filter((item) => item.id !== itemID)
      setBookingItems(newBookingItems)
    } else {
      const newBookingItems = bookingItems.map((item) =>
        item.id === itemID ? { ...item, quantity: itemQuantity } : item
      )
      setBookingItems(newBookingItems)
    }
    setQuantity(quantity - 1)
  }

  useEffect(() => {
    // calculate subtotal when duration changes
    const subTotal = bookingItems.reduce(
      (acc, item) => (acc + item.price * item.quantity) * (duration === 0 ? 1 : duration),
      0
    )
    setSubTotal(subTotal)
    // calculate service fee (7%) and round to 2 decimal places
    const serviceFee = Math.round(((subTotal * 7) / 100) * 100) / 100
    setServiceFee(serviceFee)
    // calculate grand total
    const grandTotal = subTotal + serviceFee
    setGrandTotal(grandTotal)
  }, [bookingItems, duration])

  // disable booking button if no item is selected
  useEffect(() => {
    if (bookingItems.length === 0) {
      setBookingButtonIsDisabled(true)
    } else {
      setBookingButtonIsDisabled(false)
    }
  }, [bookingItems])

  // date picker state
  const [dateValue, setDateValue] = useState({
    startDate: null,
    endDate: null
  })

  const handleDateValueChange = (newValue) => {
    if (newValue.startDate !== null || newValue.endDate !== null) {
      // get current date in MY GMT+8
      const date = new Date()
      const dateMY = date.toLocaleString('en-US', {
        timeZone: 'Asia/Kuala_Lumpur'
      })

      const parts = dateMY.split(', ')
      const dateParts = parts[0].split('/')

      const year = dateParts[2]
      const month = dateParts[0].padStart(2, '0')
      const day = dateParts[1].padStart(2, '0')

      const timeParts = parts[1].split(':')

      // combine hour, minute, second into one string in HH:mm:ss format
      const currentTimestamps = timeParts[0] + ':' + timeParts[1] + ':' + timeParts[2]

      const formattedDate = `${year}-${month}-${day}`

      // add 1 day to formattedDate
      const formattedDatePlusOne = new Date(formattedDate)
      formattedDatePlusOne.setDate(formattedDatePlusOne.getDate() + 1)

      // return error if selected date is before dateMY
      if (new Date(newValue.startDate) <= new Date(formattedDate) || new Date(newValue.endDate) <= new Date(formattedDate)) {
        ErrorBooking('Please select a date after today.')
        newValue = {
          startDate: null,
          endDate: null
        }
        setDateValue(newValue)
      } else if (
        currentTimestamps > '03:00:00 PM' &&
        new Date(newValue.startDate).getTime() === new Date(formattedDatePlusOne).getTime()
      ) {
        // check if currentTimestamps is after 12pm
        ErrorBooking('Booking must be made before 3pm for next day booking.')
        newValue = {
          startDate: null,
          endDate: null
        }
        setDateValue(newValue)
      } else {
        const startDate = new Date(newValue.startDate)
        const endDate = new Date(newValue.endDate)

        const duration = (endDate - startDate) / (1000 * 3600 * 24) + 1
        setDuration(duration)
        setDateValue(newValue)
      }
    } else {
      setDuration(1)
    }
  }

  // Error feedback if booking failed
  const toast = useToast()
  const ErrorBooking = (message) => {
    return toast({
      title: 'Booking failed.',
      description: message,
      status: 'error',
      position: 'top-right',
      duration: 9000,
      isClosable: true
    })
  }

  const SuccessBooking = (title, description) => {
    return toast({
      title,
      description,
      status: 'success',
      position: 'top-right',
      duration: 9000,
      isClosable: true
    })
  }

  const handleSubmit = () => {
    // set dates to ISO format for database
    dateValue.startDate = dateValue.startDate
      ? new Date(dateValue.startDate).toLocaleDateString('en-GB')
      : null
    dateValue.endDate = dateValue.endDate
      ? new Date(dateValue.endDate).toLocaleDateString('en-GB')
      : null

    console.log(dateValue)

    const booking = {
      user_id: userId,
      owner_id: ownerId,
      start_date: dateValue.startDate,
      end_date: dateValue.endDate,
      items: bookingItems,
      sub_total: subTotal,
      service_fee: serviceFee,
      grand_total: grandTotal
    }

    if (booking.start_date === null || booking.end_date === null) {
      ErrorBooking('Please select a booking period.')
    } else {
      fetch(path.url + 'api/booking/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(booking)
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'success') {
            SuccessBooking('Redirect to Payment.', 'Redirecting to payment page...')

            // set delay to allow toast to show before redirecting
            setTimeout(() => {
              // window.location.href = '/listing/booking'
              window.location.href = 'https://dev.toyyibpay.com/' + data.bill_code
            }, 1000)
          } else {
            ErrorBooking(data.message)
          }
        })
        .catch((err) => {
          console.log(err)
        }
        )
    }
  }

  return (
    <div className="p-4 md:p-8 flex flex-col w-screen">
      <ul className="menu menu-horizontal bg-orange-500 text-white hover:bg-base-200 hover:text-black rounded-box w-24">
        <li>
          <Link
            to={backPath}
            className="btn btn-ghost btn-sm rounded-btn"
            onClick={removeTempItemId}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back
          </Link>
        </li>
      </ul>
      {/* Main page */}
      <div className="mt-4 flex flex-col md:flex-row w-full">
        {/* Left side */}
        <div className="w-full md:w-2/3">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="w-full">
              <div>
                <h1 className="text-xl md:text-3xl font-medium">
                  List of Items Provided by{' '}
                  <span className="font-bold">
                    {owner.FirstName + ' ' + owner.LastName}
                  </span>
                </h1>
                <span className="hidden md:block">
                  {/* This is BookingItem page for owner {ownerId} and user {userId} */}
                </span>
              </div>
              <div className="flex flex-wrap">
                <div className="flex flex-col md:w-11/12 md:p-4 gap-2">
                  {items.map((item) => (
                    <ItemBookingCard
                      key={item.ID}
                      item={item}
                      handleAddQuantity={handleAddQuantity}
                      handleMinusQuantity={handleMinusQuantity}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* right side */}
        <div className="w-full md:w-1/2 md:pr-3">
          <div className="flex flex-col-reverse md:flex-col gap-2 relative w-full">
            <div className='mt-4 md:mt-0'>
              <h1 className="text-lg md:text-2xl font-bold">Booking Summary</h1>
              <table
                className="w-full text-sm text-left text-gray-500 dark:text-gray-400"
                id="bookingSummaryTable"
              >
                <thead className="text-sm md:text-base text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-2 md:px-6 py-3">
                      Item
                    </th>
                    <th scope="col" className="px-2 md:px-6 py-3">
                      Price per day
                    </th>
                    <th scope="col" className="px-2 md:px-6 py-3">
                      Quantity
                    </th>
                    <th scope="col" className="px-2 md:px-6 py-3">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookingItems.length === 0 ? (
                    <tr>
                      <td className="px-6 py-4" colSpan={4}>
                        No item selected
                      </td>
                    </tr>
                  ) : (
                    bookingItems.map((item) => (
                      <tr className="bg-white border-b" key={item.id}>
                        <th
                          scope="row"
                          className="px-2 md:px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                        >
                          {item.name}
                        </th>
                        <td className="px-2 md:px-6 py-4">RM {item.price}</td>
                        <td className="px-2 md:px-6 py-4">{item.quantity}</td>
                        <td className="px-2 md:px-6 py-4">
                          RM {item.price * item.quantity}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot>
                  <tr className="font-semibold text-gray-900 bg-gray-50">
                    <th
                      scope="row"
                      colSpan={3}
                      className="px-2 md:px-6 py-3 text-md"
                    >
                      Booking Day(s)
                    </th>
                    <td className="px-2 md:px-6 py-3">{duration} day(s)</td>
                  </tr>
                  <tr className="font-semibold text-gray-900 bg-gray-50">
                    <th
                      scope="row"
                      colSpan={3}
                      className="px-2 md:px-6 py-3 text-md"
                    >
                      Subtotal
                    </th>
                    <td className="px-2 md:px-6 py-3">RM {subTotal}</td>
                  </tr>
                  <tr className="font-semibold text-gray-900 bg-gray-50">
                    <th
                      scope="row"
                      colSpan={3}
                      className="px-2 md:px-6 py-3 text-md"
                    >
                      Service Fee (7%)
                    </th>
                    <td className="px-2 md:px-6 py-3">RM {serviceFee}</td>
                  </tr>
                  <tr className="font-semibold text-gray-900 bg-gray-50">
                    <th
                      scope="row"
                      colSpan={2}
                      className="px-2 md:px-6 py-3 text-md"
                    >
                      Grand Total
                    </th>
                    <td className="px-2 md:px-6 py-3">{quantity}</td>
                    <td className="px-2 md:px-6 py-3">RM {grandTotal}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="flex flex-col gap-2 mt-8 md:mt-4 w-full md:w-1/2">
              <div>
                <h1 className="text-lg font-bold">Booking Period</h1>
              </div>
              <label className="flex flex-row ml-4 gap-10">
                <span className="text-gray-700">Start Date</span>
                <span className="text-gray-700">End Date</span>
              </label>
              <Datepicker
                startFrom={new Date()}
                primaryColor={'orange'}
                value={dateValue}
                onChange={handleDateValueChange}
                showShortcuts={true}
                separator="to"
                displayFormat={'DD/MM/YYYY'}
                configs={{
                  shortcuts: {
                    next3Days: {
                      text: 'Next 3 days',
                      period: {
                        start: new Date(),
                        end: new Date().setDate(new Date().getDate() + 3)
                      }
                    },
                    next7Days: {
                      text: 'Next 7 days',
                      period: {
                        start: new Date(),
                        end: new Date().setDate(new Date().getDate() + 7)
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <button
              className="btn bg-orange-500 hover:bg-orange-600 text-white"
              disabled={bookingButtonIsDisabled}
              onClick={handleSubmit}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
