import React, { useEffect, useState } from 'react'

import { Link, useLocation, useParams } from 'react-router-dom'

import path from '../../utils/path'

export default function GetItem () {
  const { id } = useParams()

  const [booking, setBooking] = useState(null)
  const [items, setItems] = useState([])

  useEffect(() => {
    fetch(`${path.url}api/booking/active/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBooking(data)
        setItems(data.Items)
      })
      .catch((err) => console.log(err))
  }, [])

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          {items.map((item) => (
            <div className="flex flex-wrap flex-col" key={item.ItemID}>
              <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                <span className="font-regular text-xl text-gray-800">
                  <span className="font-semibold">{item.Name}</span>
                  <span className="text-sm pl-4">x{item.Quantity}</span>
                </span>
              </div>
              </div>
          ))}
        </div>
      </div>
    </div>
  )
}
