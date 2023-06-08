import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

import path from '../utils/path'

export default function ItemBookingCard ({ item, handleAddQuantity, handleMinusQuantity }) {
  const [count, setCount] = useState(0)

  function increment () {
    if (count === item.Quantity) return
    // handleQuantityChange(count + 1, item.ID)
    handleAddQuantity(count + 1, item.ID)
    setCount(count + 1)
  }

  function decrement () {
    if (count === 0) return
    // handleQuantityChange(count - 1, item.ID)
    handleMinusQuantity(count - 1, item.ID)
    setCount(count - 1)
  }

  return (
    <div className="flex flex-row items-center w-full gap-10 justify-between p-3 lg:p-5 space-y-6 bg-white rounded-lg shadow-lg">
      {/* LEFT SIDE */}
      <div className="group relative flex flex-row items-center m-4 gap-8">
        <div>
          <img
            src={path.url + 'api/item/image/' + item.Images[0]}
            alt=""
            className="h-32 w-42 rounded-md object-cover"
          />
        </div>
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
            {item.Name}
          </h3>
          <p className="text-gray-700 text-lg">{item.Description}</p>
          <p className="text-gray-500">
            <strong>RM</strong> {item.Price} /day
          </p>
        </div>
      </div>
      {/* RIGHT SIDE */}
      <div className="flex w-1/3 items-center justify-between">
        <div className="h-10">
          <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1 items-center">
            <p>Quantity: </p>
            <div className="flex flex-row w-full h-10 bg-white rounded-lg relative">
              <div className="flex flex-row items-center ml-4">
                <button
                  className="w-10 h-10 rounded-none rounded-l-lg text-md text-center justify-center bg-gray-200 text-gray-600 hover:bg-orange-400"
                  onClick={decrement}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <input
                  type="number"
                  className="text-center w-12 h-10 input rounded-none bg-gray-100 font-semibold text-md flex items-center text-gray-700 outline-none"
                  name="item-count"
                  value={count}
                  readOnly
                />
                <button
                  className="w-10 h-10 rounded-none rounded-r-lg text-md text-center justify-center bg-gray-200 text-gray-600 hover:bg-orange-400"
                  onClick={increment}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
