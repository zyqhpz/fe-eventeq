import ItemCard from '../ui/ItemCard'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

import { useEffect, useState } from 'react'
import axios from 'axios'

import Select from 'react-select'

import path from '../utils/path'

import statesDistricts from '../../assets/data/states_districts'

export default function DisplayItems () {
  const [items, setItems] = useState([])
  const [itemsFiltered, setItemsFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const options = [
    { value: 'mixer', label: 'Mixer' },
    { value: 'speaker', label: 'Speaker' },
    { value: 'microphone', label: 'Microphone' }
  ]

  const jsonData = statesDistricts
  const states = Object.keys(jsonData)

  // redefine states array to include keys and values of each state
  const statesWithDistricts = states.map((state) => {
    return {
      value: state,
      label: state
    }
  })

  useEffect(() => {
    axios
      .get(path.url + 'api/itemsActiveWithUser')
      .then((res) => {
        setItems(res.data)
        setItemsFiltered(res.data)
        setLoading(false)
      })
      .catch(() => {})
  }, [])

  const handleSearchChange = (e) => {
    setSearch(e.target.value)

    // filter items by name and description (case insensitive) and return the filtered items array
    const filteredItems = items.filter((item) => {
      return (
        item.Name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.Description.toLowerCase().includes(e.target.value.toLowerCase())
      )
    })

    // set the items array to the filtered items array
    setItemsFiltered(filteredItems)

    // if the search bar is empty, get all items
    if (e.target.value === '') {
      setItemsFiltered(items)
    }
  }

  const handleCategoryChange = (e) => {
    // filter items by category and return the filtered items array
    const filteredItems = items.filter((item) => {
      return e.some((category) => {
        return item.Category === category.value
      })
    })

    // set the items array to the filtered items array
    setItemsFiltered(filteredItems)

    // // if the category filter is empty, get all items
    if (e.length === 0) {
      setItemsFiltered(items)
    }
  }

  const handleLocationChange = (e) => {
    // filter items by location and return the filtered items array
    const filteredItems = items.filter((item) => {
      return e.some((location) => {
        return item.OwnedBy.Location.State === location.value
      }
      )
    })

    // set the items array to the filtered items array
    setItemsFiltered(filteredItems)

    // if the location filter is empty, get all items
    if (e.length === 0) {
      setItemsFiltered(items)
    }
  }

  return (
    <div>
      {/* div for items list */}
      <div className="flex flex-col items-center justify-center px-2 md:px-12 lg:px-32 py-12">
        {/* Search bar and category filter */}
        <div className="flex justify-start w-full bg-orange-500 p-4 mb-4 shadow-lg">
          <h1 className="text-lg md:text-2xl font-bold text-white">
            Items For Booking
          </h1>
        </div>
        <div className="flex flex-col md:flex-row pb-8 gap-2 w-full justify-center">
          <div className="flex items-center border-2 border-grey-300 rounded-lg h-10">
            <input
              type="text"
              className="border-none rounded-l-lg pl-4 h-full w-full bg-white"
              placeholder="What to rent?"
              autoComplete="off"
              value={search}
              onChange={handleSearchChange}
            />
            <button className="px-2 rounded-none rounded-r-lg h-full bg-white">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="px-2" />
            </button>
          </div>
          <Select
            defaultValue={[]}
            isMulti
            name="category"
            options={options}
            className="basic-multi-select w-full md:max-w-[360px]"
            classNamePrefix="select"
            placeholder="Category"
            onChange={handleCategoryChange}
          />
          <Select
            defaultValue={[]}
            isMulti
            name="states"
            options={statesWithDistricts}
            className="basic-multi-select w-full md:max-w-[360px]"
            classNamePrefix="select"
            placeholder="Location"
            onChange={handleLocationChange}
          />
        </div>
        {loading ? (
          <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 items-center justify-center gap-4">
            {[...Array(10)].map((x, i) => (
              <div role="status" className="max-w-sm animate-pulse m-6" key={i}>
                <div className="h-44 w-52 bg-gray-200 rounded-md dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                  <div className="h-4 w-40 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                </div>
                <span className="sr-only">Loading...</span>
              </div>
            ))}
          </div>
        ) : (
          itemsFiltered.length === 0 ? (
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-gray-700">
                No items found
              </h1>
            </div>
          ) : (
            // For loop of items
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 items-center justify-center gap-4">
              {itemsFiltered.map((item) => (
                <ItemCard item={item} key={item.ID} className="m-2" />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
