import React, { useState, useEffect } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'

import { useToast } from '@chakra-ui/react'
// import BlueToast from './BlueToast'

import path from '../utils/path'

export default function EventCard ({ event }) {
  const detailsPath = '/message?to_user=' + event.Organized_By.ID

  const MAX_NAME_LENGTH = 20 // Set the maximum length of characters to show

  const truncatedName =
    event.Name.length > MAX_NAME_LENGTH
      ? event.Name.substring(0, MAX_NAME_LENGTH) + '...'
      : event.Name

  const userId = localStorage.getItem('userId')
  const [isOrganizer, setIsOrganizer] = useState(false)

  useEffect(() => {
    if (userId === event.Organized_By.ID) {
      setIsOrganizer(true)
    }
  }, [userId, event.Organized_By.ID])

  const toast = useToast()

  const BlueToast = (title, message) => {
    return toast({
      title,
      description: message,
      status: 'info',
      position: 'top-right',
      duration: 3000,
      isClosable: true
    })
  }

  return (
    <div
      key={event.ID}
      className="flex flex-col max-w-xl items-start justify-between h-44 w-48 md:h-auto md:w-auto p-2 md:p-5 md:space-y-6 transition duration-200 ease-in-out transform bg-white rounded-lg shadow-xl hover:scale-105 hover:shadow-2xl cursor-pointer"
      onClick={
        isOrganizer
          ? () => {
              BlueToast('Info', 'You are the organizer of this event.')
            }
          : () => {
              window.location.href = detailsPath
            }
      }
    >
      <div className="group relative">
        <h3 className="mt-1 md:mt-3 text-base md:text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
          {truncatedName}
        </h3>
        <div className="flex flex-col bg-gray-100 rounded px-2 md:px-4 py-1 md:py-2 text-base mt-2">
          <p className="text-gray-500 text-xs md:text-sm">{event.Description}</p>
        </div>
      </div>
      {/* detailed part */}
      <div className="flex w-full items-center justify-between text-xs md:text-base">
        <div className="flex flex-col">
          <div className="flex gap-x-2">
            {event.Organized_By.IsAvatarImageSet ? (
              <img
                src={
                  path.url + 'api/item/image/' + event.Organized_By.ProfileImage
                }
                alt=""
                className="h-4 w-4 md:h-7 md:w-7 rounded-full object-cover"
              />
            ) : (
              <FontAwesomeIcon
                icon={faCircleUser}
                className="h-4 w-4 md:h-7 m:w-7 text-gray-500"
              />
            )}
            <p className="font-semibold text-gray-900">
              {event.Organized_By.FirstName} {event.Organized_By.LastName}
            </p>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs md:text-sm font-medium mr-2 px-2.5 py-0.5 rounded my-2">
            {event.StartDate} - {event.EndDate}
          </span>
          <div>
            <p className="text-gray-500 text-xs">
              {event.Location.State} - {event.Location.District}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
