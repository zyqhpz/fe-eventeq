import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import ItemBookingCard from '../ui/ItemBookingCard'

import Datepicker from 'react-tailwindcss-datepicker'

import path from '../utils/path'

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

  const [subTotal, setSubTotal] = useState(0)
  const [serviceFee, setServiceFee] = useState(0) // 7% of subTotal
  const [grandTotal, setGrandTotal] = useState(0) // subTotal + serviceFee

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
      }).catch((err) => {
        console.log(err)
      })
  }, [])

  const handleAddBooking = (itemQuantity, itemID) => {
    // get item details
    const itemSelected = items.filter((item) => item.ID === itemID)
    const bookingItem = {
      ID: itemSelected[0].ID,
      Name: itemSelected[0].Name,
      Price: itemSelected[0].Price,
      Quantity: itemQuantity
    }
    // check if item already exist in bookingItems
    const itemExist = bookingItems.find((item) => item.ID === bookingItem.ID)
    if (itemExist) {
      const newBookingItems = bookingItems.map((item) =>
        item.ID === bookingItem.ID
          ? { ...item, Quantity: bookingItem.Quantity }
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
      const newBookingItems = bookingItems.filter((item) => item.ID !== itemID)
      setBookingItems(newBookingItems)
    } else {
      const newBookingItems = bookingItems.map((item) =>
        item.ID === itemID ? { ...item, Quantity: itemQuantity } : item
      )
      setBookingItems(newBookingItems)
    }
    setQuantity(quantity - 1)
  }

  useEffect(() => {
    // calculate subtotal
    const subTotal = bookingItems.reduce(
      (acc, item) => acc + item.Price * item.Quantity,
      0
    )
    setSubTotal(subTotal)
    // calculate service fee (7%) and round to 2 decimal places
    const serviceFee = Math.round((subTotal * 7) / 100 * 100) / 100
    setServiceFee(serviceFee)
    // calculate grand total
    const grandTotal = subTotal + serviceFee
    setGrandTotal(grandTotal)
  }, [bookingItems])

  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11)
  })

  const handleValueChange = (newValue) => {
    console.log('newValue:', newValue)
    setValue(newValue)
  }

  return (
    <div className="p-8 flex flex-col w-screen">
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
      <div className="mt-4 flex flex-row w-full">
        {/* Left side */}
        <div className="w-2/3">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="w-full">
              <div>
                <h1 className="text-3xl font-medium">
                  List of Items Provided by{' '}
                  <span className="font-bold">
                    {owner.FirstName + ' ' + owner.LastName}
                  </span>
                </h1>
                {/* This is BookingItem page for owner {ownerId} and user {userId} */}
              </div>
              <div className="flex flex-wrap">
                <div className="flex flex-col w-11/12 p-4 gap-2">
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
          <h1 className="text-2xl font-bold">Booking Summary</h1>
          <div className="relative overflow-x-auto w-full">
            <table
              className="w-full text-sm text-left text-gray-500 dark:text-gray-400"
              id="bookingSummaryTable"
            >
              <thead className="text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Item
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price per day
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3">
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
                    <tr className="bg-white border-b" key={item.ID}>
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {item.Name}
                      </th>
                      <td className="px-6 py-4">RM {item.Price}</td>
                      <td className="px-6 py-4">{item.Quantity}</td>
                      <td className="px-6 py-4">
                        RM {item.Price * item.Quantity}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className="font-semibold text-gray-900 bg-gray-50">
                  <th scope="row" colSpan={3} className="px-6 py-3 text-md">
                    Subtotal
                  </th>
                  <td className="px-6 py-3">RM {subTotal}</td>
                </tr>
                <tr className="font-semibold text-gray-900 bg-gray-50">
                  <th scope="row" colSpan={3} className="px-6 py-3 text-md">
                    Service Fee (7%)
                  </th>
                  <td className="px-6 py-3">RM {serviceFee}</td>
                </tr>
                <tr className="font-semibold text-gray-900 bg-gray-50">
                  <th scope="row" colSpan={2} className="px-6 py-3 text-md">
                    Grand Total
                  </th>
                  <td className="px-6 py-3">{quantity}</td>
                  <td className="px-6 py-3">RM {grandTotal}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <Datepicker
            startFrom={new Date()}
            primaryColor={'orange'}
            value={value}
            onChange={handleValueChange}
            showShortcuts={true}
            separator="to"
            displayFormat={'DD/MM/YYYY'}
            configs={{
              shortcuts: {
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
    </div>
  )
}
