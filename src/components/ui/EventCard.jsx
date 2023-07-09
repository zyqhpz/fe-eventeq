import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'

import path from '../utils/path'

export default function EventCard ({ event }) {
  // const detailsPath = '/listing/event/' + event.ID

  const detailsPath = '/message'

  const MAX_NAME_LENGTH = 20 // Set the maximum length of characters to show

  const truncatedName =
    event.Name.length > MAX_NAME_LENGTH
      ? event.Name.substring(0, MAX_NAME_LENGTH) + '...'
      : event.Name

  return (
    <a
      key={event.ID}
      className="flex flex-col max-w-xl items-start justify-between h-52 w-48 md:h-auto md:w-auto p-2 md:p-5 md:space-y-6 transition duration-200 ease-in-out transform bg-white rounded-lg shadow-xl hover:scale-105 hover:shadow-2xl"
      href={detailsPath}
    >
      <div className="group relative">
        <h3 className="mt-1 md:mt-3 text-base md:text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
          {truncatedName}
        </h3>
      </div>
      {/* detailed part */}
      <div className="flex w-full items-center justify-between text-xs md:text-base">
        <div className="flex flex-col">
          {/* <div className="flex gap-x-2">
            {event.OwnedBy.IsAvatarImageSet ? (
              <img
                src={path.url + 'api/event/image/' + event.OwnedBy.ProfileImage}
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
              {event.OwnedBy.FirstName} {event.OwnedBy.LastName}
            </p>
          </div> */}
          <div>
            <p className="text-gray-500 text-xs">
              {event.Location.State} - {event.Location.District}
            </p>
          </div>
        </div>
      </div>
    </a>
  )
}
