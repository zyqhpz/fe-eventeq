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

  const backPath = '/listing/item/' + tempItemId

  const removeTempItemId = () => {
    localStorage.removeItem('tempItemId')
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
                <h1 className="text-3xl font-bold">
                  List of Items Provided by{' '}
                  {owner.FirstName + ' ' + owner.LastName}
                </h1>
                This is BookingItem page for owner {ownerId} and user {userId}
              </div>
              <div className="flex flex-wrap">
                <div className="flex flex-col w-3/4 p-4">
                  {items.map((item) => (
                    <ItemBookingCard key={item.ID} item={item} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* right side */}
        <div className="w-1/3">
          <div className="flex flex-row items-center justify-end gap-2">
            <img
              className="mask mask-squircle h-10 w-10 object-cover"
              src="https://images.unsplash.com/photo-1457449940276-e8deed18bfff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            />
            <h1 className="text-lg font-regular">
              {user.FirstName + ' ' + user.LastName}
            </h1>
          </div>
          <h1 className="text-3xl font-bold">Booking Summary</h1>
          <div className="flex flex-col w-full p-4">
            <div className="flex flex-row justify-between">
              <p className="text-xl font-bold">Item Name 1</p>
              <p className="text-xl font-bold">2</p>
              <p className="text-xl font-bold">RM 0.00</p>
            </div>
            <div className="flex flex-row justify-between">
              <p className="text-xl font-bold">Total</p>
              <p className="text-xl font-bold">RM 0.00</p>
            </div>
            <div className="flex flex-row justify-between">
              <p className="text-xl font-bold">Deposit</p>
              <p className="text-xl font-bold">RM 0.00</p>
            </div>
            <div className="flex flex-row justify-between"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
