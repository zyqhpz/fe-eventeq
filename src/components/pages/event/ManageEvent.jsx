import Footer from '../../ui/Footer'
import Navbar from '../../ui/Navbar'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'

import ProcessingButton from '../../ui/button/ProcessingButton'

import { React, useEffect, useState, useMemo } from 'react'

import Datepicker from 'react-tailwindcss-datepicker'

import { useToast } from '@chakra-ui/react'

import axios from 'axios'
import path from '../../utils/path'
import LoadingButton from '../../ui/button/LoadingButton'

import statesDistricts from '../../../assets/data/states_districts'

export default function ManageEvent () {
  const [events, setEvents] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [selectedState, setSelectedState] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')

  const [allFieldsFilled, setAllFieldsFilled] = useState(false)

  const [dateDisplay, setDateDisplay] = useState('')

  const jsonData = statesDistricts
  const states = Object.keys(jsonData)

  const handleStateChange = (e) => {
    setSelectedState(e.target.value)
    setSelectedDistrict('')
  }

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value)
  }

  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const userId = localStorage.getItem('userId')

  // date picker state
  const [dateValue, setDateValue] = useState({
    startDate: null,
    endDate: null
  })

  const [duration, setDuration] = useState(1)

  const handleDateValueChange = (newValue) => {
    // calculate duration
    if (newValue.startDate !== null || newValue.endDate !== null) {
      const startDate = new Date(newValue.startDate)
      const endDate = new Date(newValue.endDate)

      const duration = (endDate - startDate) / (1000 * 3600 * 24) + 1
      setDuration(duration)
    } else {
      setDuration(1)
    }

    setDateValue(newValue)
    console.log(newValue)
  }

  useEffect(() => {
    if (
      name &&
      description &&
      status &&
      selectedState &&
      selectedDistrict &&
      dateValue
    ) {
      setAllFieldsFilled(true)
    } else {
      setAllFieldsFilled(false)
    }
  }, [name, description, status, selectedState, selectedDistrict, dateValue])

  useEffect(() => {
    axios
      .get(path.url + 'api/event/user/' + userId)
      .then((res) => {
        if (res.data === null) {
          setEvents([])
        } else {
          setEvents(res.data)
        }
        setLoading(false)
      })
      .catch(() => {})
  }, [])

  // clear all states when modal is closed
  useEffect(() => {
    if (!showModal) {
      setName('')
      setDescription('')
      setStatus(0)
      setSelectedState('')
      setSelectedDistrict('')
      setStartDate('')
      setEndDate('')
      setDateValue({
        startDate: null,
        endDate: null
      })
      setDuration(1)
    }
  }, [showModal])

  // Success feedback for item insertion
  const InsertSuccess = () => {
    return toast({
      title: 'Event added.',
      description: 'Event has been added successfully.',
      status: 'success',
      position: 'top-right',
      duration: 9000,
      isClosable: true
    })
  }

  // Success feedback for item insertion
  const UpdateSuccess = () => {
    return toast({
      title: 'Event updated.',
      description: 'Event has been updated successfully.',
      status: 'success',
      position: 'top-right',
      duration: 9000,
      isClosable: true
    })
  }

  const handleSubmit = async (event) => {
    // set dates to ISO format for database
    dateValue.startDate = dateValue.startDate
      ? new Date(dateValue.startDate).toLocaleDateString('en-GB')
      : null
    dateValue.endDate = dateValue.endDate
      ? new Date(dateValue.endDate).toLocaleDateString('en-GB')
      : null

    console.log(dateValue)

    setStartDate(dateValue.startDate)
    setEndDate(dateValue.endDate)

    event.preventDefault()
    const formData = new FormData()
    formData.append('userID', userId)
    formData.append('name', name)
    formData.append('description', description)
    formData.append('status', status)
    formData.append('state', selectedState)
    formData.append('district', selectedDistrict)
    formData.append('start_date', dateValue.startDate)
    formData.append('end_date', dateValue.endDate)

    axios
      .post(path.url + 'api/event/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      })
      .then((response) => {
        if (response.data.status === 'success') {
          window.addNewEventModal.close()
          InsertSuccess()
          // set interval to 2 seconds
          setInterval(() => {
            window.location.reload()
          }, 2000)
        }
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  function editEvent (event) {
    window.editEventModal.showModal()
    setShowModal(true)
    setName(event.Name)
    setDescription(event.Description)
    setSelectedState(event.Location.State)
    setSelectedDistrict(event.Location.District)
    setStatus(event.Status)

    const endDateParts = event.EndDate.split('/')
    const endDateFormatted = `${endDateParts[2]}-${endDateParts[1]}-${endDateParts[0]}`

    const startDateParts = event.StartDate.split('/')
    const startDateFormatted = `${startDateParts[2]}-${startDateParts[1]}-${startDateParts[0]}`

    const newValue = {
      startDate: new Date(startDateFormatted).toLocaleDateString('en-US',
        {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric'
        }
      ),
      endDate: new Date(endDateFormatted).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      })
    }

    console.log(newValue)

    setStartDate(event.StartDate)
    setEndDate(event.EndDate)

    setDateValue(newValue)
    handleDateValueChange(newValue)

    setAllFieldsFilled(true)

    localStorage.setItem('eventID', event.ID)
  }

  const handleEditSubmit = async (event) => {
    const eventID = localStorage.getItem('eventID')

    dateValue.startDate = dateValue.startDate
      ? new Date(dateValue.startDate).toLocaleDateString('en-GB')
      : null
    dateValue.endDate = dateValue.endDate
      ? new Date(dateValue.endDate).toLocaleDateString('en-GB')
      : null

    console.log(dateValue)

    setStartDate(dateValue.startDate)
    setEndDate(dateValue.endDate)

    console.log(dateValue.startDate)
    console.log(dateValue.endDate)

    event.preventDefault()
    const formData = new FormData()
    formData.append('userID', userId)
    formData.append('name', name)
    formData.append('description', description)
    formData.append('status', status)
    formData.append('state', selectedState)
    formData.append('district', selectedDistrict)
    formData.append('start_date', dateValue.startDate)
    formData.append('end_date', dateValue.endDate)

    axios
      .put(path.url + 'api/event/update/' + eventID, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      })
      .then((response) => {
        if (response.data.status === 'success') {
          window.editEventModal.close()
          UpdateSuccess()
          // set interval to 2 seconds
          setInterval(() => {
            window.location.reload()
          }, 2000)
        }
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  return (
    <div className="ManageItem">
      <Navbar />
      <div className="bg-gray-100 w-screen h-screen overflow-auto">
        <div className="flex flex-col items-center min-w-none w-full h-full py-10">
          {loading ? (
            <LoadingButton />
          ) : (
            <div className="p-4 w-full md:w-2/3">
              <div className="flex flex-row justify-between mb-10">
                <h1 className="text-lg md:text-2xl font-bold">Manage Event</h1>
                <button
                  className="text-white bg-orange-500 hover:bg-orange-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  onClick={() => {
                    window.addNewEventModal.showModal()
                    setShowModal(true)
                    setStatus('')
                  }}
                >
                  Add Event
                </button>
              </div>
              <table
                className="hidden md:block w-full text-sm text-left text-gray-500 dark:text-gray-400"
                id="itemsTable"
              >
                <thead className="text-sm md:text-base text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-2 md:px-6 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-2 md:px-6 py-3">
                      Description
                    </th>
                    <th scope="col" className="px-2 md:px-6 py-3">
                      Location
                    </th>
                    <th scope="col" className="px-2 md:px-6 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-2 md:px-6 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-2 md:px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {events.length === 0 ? (
                    <tr>
                      <td className="px-6 py-4" colSpan={4}>
                        No events found
                      </td>
                    </tr>
                  ) : (
                    events.map((event) => (
                      <tr
                        key={event.ID}
                        className="bg-white border-b md:text-base hover:bg-gray-100"
                      >
                        <td className="px-2 md:px-6 py-4 whitespace-nowrap">
                          {event.Name}
                        </td>
                        <td className="px-2 md:px-6 py-4">
                          {event.Description}
                        </td>
                        <td className="px-2 md:px-6 py-4 whitespace-nowrap">
                          {event.Location.District}, {event.Location.State}
                        </td>
                        <td className="px-2 md:px-6 py-4 whitespace-nowrap">
                          {event.StartDate}
                          {' - '}
                          {event.EndDate}
                        </td>
                        <td className="px-2 md:px-6 py-4 whitespace-nowrap">
                          {event.Status === 0 ? (
                            <span className="bg-green-100 text-green-800  text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                              Found
                            </span>
                          ) : (
                            <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                              In Search
                            </span>
                          )}
                        </td>
                        <td className="px-2 py-4">
                          <button
                            className="text-white bg-orange-500 hover:bg-orange-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            onClick={() => {
                              editEvent(event)
                            }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="md:hidden flex flex-col gap-4">
                {events.length === 0 ? (
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-gray-500 text-sm">No events found</p>
                    <button
                      className="text-white bg-orange-500 hover:bg-orange-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-5"
                      onClick={() => {
                        window.addNewEventModal.showModal()
                        setShowModal(true)
                      }}
                    >
                      Add Event
                    </button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <dialog id="addNewEventModal" className="modal">
        <div method="dialog" className="modal-box max-w-none md:w-2/3 md:h-3/5">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => {
              window.addNewEventModal.close()
              setShowModal(false)
            }}
          >
            ✕
          </button>
          <h3 className="font-bold text-lg">Add New Event</h3>
          <hr className="my-4" />
          <div>
            <div>
              <form onSubmit={handleSubmit} className="gap-2">
                <div className="grid gap-4 mb-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      placeholder="Type event name"
                      autoComplete="off"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Date
                    </label>
                    <Datepicker
                      startFrom={new Date()}
                      primaryColor={'orange'}
                      value={dateValue}
                      onChange={handleDateValueChange}
                      showShortcuts={false}
                      separator="until"
                      displayFormat={'DD/MM/YYYY'}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Location
                    </label>
                    <div className="flex flex-row w-full gap-2">
                      <select
                        id="state"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-1/2 p-2.5"
                        value={selectedState}
                        onChange={handleStateChange}
                      >
                        <option hidden defaultChecked>
                          -- Select State --
                        </option>
                        {states.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>

                      {selectedState && (
                        <select
                          id="district"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-1/2 p-2.5"
                          value={selectedDistrict}
                          onChange={handleDistrictChange}
                        >
                          <option hidden defaultChecked>
                            -- Select District --
                          </option>
                          {jsonData[selectedState].map((district) => (
                            <option key={district} value={district}>
                              {district}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="status"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="" hidden defaultChecked>
                        Select status
                      </option>
                      <option value="0">Found</option>
                      <option value="1">In search</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="description"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows="4"
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Write event description here"
                      name="description"
                      autoComplete="off"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                {allFieldsFilled ? (
                  <input
                    type="submit"
                    className="bg-orange-400 hover:bg-orange-500 border-orange-800 border-2 border-opacity-30 p-4 m-auto block mt-4 rounded-lg text-white font-bold"
                    value="Add new event"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-red-500 text-sm">
                      <FontAwesomeIcon
                        icon={faCircleXmark}
                        className="text-red-500 mr-2"
                      />
                      Please fill in all fields
                    </p>
                    <input
                      type="submit"
                      className="bg-gray-400 hover:bg-orange-500 border-orange-800 border-2 border-opacity-30 p-4 m-auto block mt-4 rounded-lg text-white font-bold pointer-events-none"
                      value="Add new event"
                      disabled
                    />
                  </div>
                )}
              </form>
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gray-400 opacity-50 z-40"></div>
                  <ProcessingButton />
                </div>
              ) : (
                <></>
              )}
            </div>
            <br />
          </div>
        </div>
      </dialog>
      <dialog id="editEventModal" className="modal">
        <div method="dialog" className="modal-box max-w-none md:w-2/3">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => {
              window.editEventModal.close()
              setShowModal(false)
              localStorage.removeItem('eventID')
            }}
          >
            ✕
          </button>
          <h3 className="font-bold text-lg">Update Event</h3>
          <hr className="my-4" />
          <div>
            <form onSubmit={handleEditSubmit} className="gap-2">
              <div className="grid gap-4 mb-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Type event name"
                    autoComplete="off"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Date
                  </label>
                  <Datepicker
                    startFrom={new Date()}
                    primaryColor={'orange'}
                    value={dateValue}
                    onChange={handleDateValueChange}
                    showShortcuts={false}
                    separator="until"
                    displayFormat={'DD/MM/YYYY'}
                  />
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Location
                  </label>
                  <div className="flex flex-row w-full gap-2">
                    <select
                      id="state"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-1/2 p-2.5"
                      value={selectedState}
                      onChange={handleStateChange}
                    >
                      <option hidden defaultChecked>
                        -- Select State --
                      </option>
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>

                    {selectedState && (
                      <select
                        id="district"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-1/2 p-2.5"
                        value={selectedDistrict}
                        onChange={handleDistrictChange}
                      >
                        <option hidden defaultChecked>
                          -- Select District --
                        </option>
                        {jsonData[selectedState].map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="" hidden defaultChecked>
                      Select status
                    </option>
                    <option value="0">Found</option>
                    <option value="1">In search</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows="4"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Write event description here"
                    name="description"
                    autoComplete="off"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
              {allFieldsFilled ? (
                <input
                  type="submit"
                  className="bg-orange-400 hover:bg-orange-500 border-orange-800 border-2 border-opacity-30 p-4 m-auto block mt-4 rounded-lg text-white font-bold"
                  value="Update event"
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <p className="text-red-500 text-sm">
                    <FontAwesomeIcon
                      icon={faCircleXmark}
                      className="text-red-500 mr-2"
                    />
                    Please fill in all fields
                  </p>
                  <input
                    type="submit"
                    className="bg-gray-400 hover:bg-orange-500 border-orange-800 border-2 border-opacity-30 p-4 m-auto block mt-4 rounded-lg text-white font-bold pointer-events-none"
                    value="Update event"
                    disabled
                  />
                </div>
              )}
            </form>
            <br />
          </div>
        </div>
      </dialog>
    </div>
  )
}
