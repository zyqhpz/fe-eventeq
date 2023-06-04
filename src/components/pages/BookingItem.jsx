import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import ItemBookingCard from '../ui/ItemBookingCard'

import path from '../utils/path'

export default function BookingItem () {
  const { ownerId } = useParams()
  const userId = localStorage.getItem('userId')
  const tempItemId = localStorage.getItem('tempItemId')
  const [owner, setOwner] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="p-8 flex flex-col w-screen">
      <ul className="menu menu-horizontal bg-orange-500 text-white hover:bg-base-200 hover:text-black rounded-box w-24">
        <li>
          <Link to={backPath} className="btn btn-ghost btn-sm rounded-btn" onClick={removeTempItemId}>
            <FontAwesomeIcon icon={faArrowLeft} />
            Back
          </Link>
        </li>
      </ul>
      <div className="mt-4">
        {loading ? (
          <div>Loading...</div>
        ) : (
        <div>
          <div>
          <h1 className="text-3xl font-bold">List of Items Provided by {owner.FirstName + ' ' + owner.LastName}</h1>
          This is BookingItem page for owner {ownerId} and user {userId}
          </div>
          <div className="flex flex-wrap">
            <div className="flex flex-col w-2/4 p-4">
            {items.map((item) => (
              <ItemBookingCard key={item.ID} item={item} />
            ))}
            </div>
        </div>
        </div>
        )}
      </div>
    </div>
  )
}
