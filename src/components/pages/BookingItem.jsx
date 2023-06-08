import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import ItemBookingCard from '../ui/ItemBookingCard'

import path from '../utils/path'
import { parse } from 'postcss'

export default function BookingItem () {
  const { ownerId } = useParams()
  const userId = localStorage.getItem('userId')
  const tempItemId = localStorage.getItem('tempItemId')
  const [user, setUser] = useState(null)
  const [owner, setOwner] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [bookingItems, setBookingItems] = useState([])

  const [currentQuantity, setCurrentQuantity] = useState(0)

  const [quantity, setQuantity] = useState(0)

  const backPath = '/listing/item/' + tempItemId

  const removeTempItemId = () => {
    localStorage.removeItem('tempItemId')
  }

  // const handleQuantityChange = (updatedQuantity, itemID) => {
  //   setQuantity(updatedQuantity)
  //   if (currentQuantity < updatedQuantity) {
  //     handleAddBooking()
  //   } else {
  //     removeBookingItem(itemID)
  //   }
  //   setCurrentQuantity(updatedQuantity)
  // }

  const handleAddQuantity = (updatedQuantity, itemID) => {
    setQuantity(updatedQuantity)
    setCurrentQuantity(updatedQuantity)
    handleAddBooking(itemID)
  }

  const handleMinusQuantity = (updatedQuantity, itemID) => {
    removeBookingItem(itemID)
    setQuantity(updatedQuantity)
    setCurrentQuantity(updatedQuantity)
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

  const handleAddBooking = (itemID) => {
    // get item details
    const itemSelected = items.filter((item) => item.ID === itemID)

    const bookingItem = {
      ID: itemSelected[0].ID,
      Name: itemSelected[0].Name,
      Price: itemSelected[0].Price,
      Quantity: quantity
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
  }

  const removeBookingItem = (id) => {
    // if item quantity is 0, remove item from bookingItems, else update quantity
    if (quantity === 0) {
      const newBookingItems = bookingItems.filter((item) => item.ID !== id)
      setBookingItems(newBookingItems)
    } else {
      const newBookingItems = bookingItems.map((item) =>
        item.ID === id ? { ...item, Quantity: quantity } : item
      )
      setBookingItems(newBookingItems)
    }
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
                      // handleQuantityChange={handleQuantityChange}
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
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Item
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price per day (RM)
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Total (RM)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b">
                  {bookingItems.length === 0 ? (
                    <tr>
                      <td className="px-6 py-4">No item selected</td>
                    </tr>
                  ) : (
                    bookingItems.map((item) => (
                      <tr
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                        key={item.ID}
                      >
                        <th className="px-6 py-4">{item.Name}</th>
                        <td className="px-6 py-4">{item.Price}</td>
                        <td className="px-6 py-4">{item.Quantity}</td>
                        <td className="px-6 py-4">
                          {item.Price * item.Quantity}
                        </td>
                      </tr>
                    ))
                  )}
                </tr>
              </tbody>
              <tfoot>
                <tr className="font-semibold text-gray-900 bg-gray-50">
                  <th scope="row" className="px-6 py-3 text-md">
                    Subtotal
                  </th>
                  <td className="px-6 py-3"></td>
                  <td className="px-6 py-3"></td>
                  <td className="px-6 py-3">21,000</td>
                </tr>
                <tr className="font-semibold text-gray-900 bg-gray-50">
                  <th scope="row" className="px-6 py-3 text-md">
                    Service Fee
                  </th>
                  <td className="px-6 py-3"></td>
                  <td className="px-6 py-3"></td>
                  <td className="px-6 py-3">21,000</td>
                </tr>
                <tr className="font-semibold text-gray-900 bg-gray-50">
                  <th scope="row" className="px-6 py-3 text-md">
                    Total
                  </th>
                  <td className="px-6 py-3"></td>
                  <td className="px-6 py-3">{quantity}</td>
                  <td className="px-6 py-3">21,000</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
