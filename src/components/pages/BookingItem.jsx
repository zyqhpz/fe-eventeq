import React from 'react'
import { Link, useParams } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

export default function BookingItem () {
  const { ownerId } = useParams()
  const userId = localStorage.getItem('userId')
  const tempItemId = localStorage.getItem('tempItemId')

  const backPath = '/listing/item/' + tempItemId

  const removeTempItemId = () => {
    localStorage.removeItem('tempItemId')
  }

  return (
    <div>
      <ul className="menu menu-horizontal bg-base-200 rounded-box">
        <li>
          <Link to={backPath} className="btn btn-ghost btn-sm rounded-btn" onClick={removeTempItemId}>
            <FontAwesomeIcon icon={faArrowLeft} />
            Back
          </Link>
        </li>
      </ul>
      This is BookingItem page for owner {ownerId} and user {userId}
    </div>
  )
}
