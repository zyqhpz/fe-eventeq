import ItemCard from '../ui/ItemCard'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

import { useEffect, useState } from 'react'
import axios from 'axios'

import Select from 'react-select'

import path from '../utils/path'
import EventCard from '../ui/EventCard'

export default function DisplayEvents () {
  const [events, setEvents] = useState([])
  const [eventsFiltered, setEventsFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState([])

  useEffect(() => {
    axios
      .get(path.url + 'api/eventsActiveWithUser')
      .then((res) => {
        setEvents(res.data)
        setEventsFiltered(res.data)
        setLoading(false)
      })
      .catch(() => {})
  }, [])

  const handleSearchChange = (e) => {
    setSearch(e.target.value)

    // filter items by name and description (case insensitive) and return the filtered items array
    const filteredItems = events.filter((event) => {
      return (
        event.Name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        event.Description.toLowerCase().includes(e.target.value.toLowerCase())
      )
    })

    // set the items array to the filtered items array
    setEventsFiltered(filteredItems)

    // if the search bar is empty, get all items
    if (e.target.value === '') {
      setEventsFiltered(events)
    }
  }

  return (
    <div>
      {/* div for items list */}
      <div className="flex flex-col items-center justify-center px-2 md:px-12 lg:px-32 py-12">
        {/* Search bar and category filter */}
        <div className="flex justify-start w-full bg-orange-500 p-4 mb-4 shadow-lg">
          <h1 className="text-lg md:text-2xl font-bold text-white">
            Events Happening Soon
          </h1>
        </div>
        <div className="flex flex-col md:flex-row pb-8 gap-2 w-full justify-center">
          <div className="flex items-center border-2 border-grey-300 rounded-lg h-10">
            <input
              type="text"
              className="border-none rounded-l-lg pl-4 h-full w-full bg-white"
              placeholder="Search event here"
              autoComplete="off"
              value={search}
              onChange={handleSearchChange}
            />
            <button className="px-2 rounded-none rounded-r-lg h-full bg-white">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="px-2" />
            </button>
          </div>
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
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 items-center justify-center gap-4">
            {events.map((event) => {
              // event.StartDate is a string in DD/MM/YYYY format
              const eventStartDate = new Date(
                event.StartDate.substring(6, 10),
                event.StartDate.substring(3, 5) - 1,
                event.StartDate.substring(0, 2)
              )
              const currentDate = new Date()

              // console.log(eventStartDate)
              // console.log(currentDate)

              // Compare event start date with the current date
              if (eventStartDate > currentDate) {
                return <EventCard key={event.ID} event={event} />
              } else {
                return null // Don't render the card if the event has passed
              }
            })}
          </div>
        )}
      </div>
    </div>
  )
}
