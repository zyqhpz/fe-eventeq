import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

import axios from 'axios'

import path from '../../utils/path'

import Navbar from '../../ui/Navbar'
import LoadingButton from '../../ui/button/LoadingButton'

import RentalHistoryCard from './RentalHistoryCard'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faCircleUser } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons'

export default function ItemDetails () {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [bookingHistory, setBookingHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [formattedDate, setFormattedDate] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const userId = localStorage.getItem('userId')

  useEffect(() => {
    if (userId == null) {
      setIsAuthenticated(false)
    } else {
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    axios
      .get(path.url + 'api/item/' + id)
      .then((response) => {
        setItem(response.data)
        const formattedDate = new Date(response.data.CreatedAt).toLocaleDateString('en-MY', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
        setFormattedDate(formattedDate)
        setLoading(false)
        localStorage.setItem('tempItemId', response.data.ID)
        if (response.data.OwnedBy.ID === userId) {
          setIsOwner(true)
        }
      })
      .catch((error) => console.error(error))
  }, [])

  useEffect(() => {
    axios
      .get(path.url + 'api/item/' + id + '/booking')
      .then((response) => {
        setBookingHistory(response.data)
      })
      .catch((error) => console.error(error))
  }, [])

  // feedbacks
  const [feedbacks, setFeedbacks] = useState([])

  useEffect(() => {
    axios
      .get(path.url + 'api/item/' + id + '/feedback')
      .then((response) => {
        setFeedbacks(response.data)
      })
      .catch((error) => console.error(error))
  }, [])

  const StarRating = (rating) => {
    const getRatingLabel = () => {
      switch (rating) {
        case 5:
          return <span className="text-amber-600">Amazing</span>
        case 4:
          return <span className="text-amber-600">Good</span>
        case 3:
          return 'Fair'
        case 2:
          return 'Poor'
        case 1:
          return 'Terrible'
        default:
          return ''
      }
    }

    return (
      <div>
        <div className="flex flex-row place-items-center">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              className={`star ${
                index < rating
                  ? 'text-amber-400'
                  : 'text-gray-400 hover:text-amber-400'
              }`}
            >
              <FontAwesomeIcon
                icon={index < rating ? faStar : faStarRegular}
                className="inline"
              />
            </span>
          ))}
          <p className="text-sm ml-4">{getRatingLabel()}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-screen min-h-screen overflow-auto bg-gray-100">
      <Navbar />
      <div className="h-full max-w-full">
        <div className="flex flex-col items-center justify-center h-full">
          {loading ? (
            <LoadingButton />
          ) : (
            <div
              className="container mx-auto -mt-38 h-screen w-screen"
              style={{ height: 'calc(100vh - 96px)' }}
            >
              <div className="mt-10 flex flex-col w-full h-auto bg-gray-200 py-3 px-5 items-center justify-center">
                {/* Images */}
                <div className="md:p-2 md:w-1/3 md:h-4/5">
                  <div className="carousel w-full h-full mx-auto p-2 shadow-md">
                    {item.Images.length > 1 ? (
                      item.Images.map((image, index) => {
                        const prevId =
                          index === 0
                            ? item.Images[item.Images.length - 1]
                            : item.Images[index - 1]
                        const nextId =
                          index === item.Images.length - 1
                            ? item.Images[0]
                            : item.Images[index + 1]

                        return (
                          <div
                            id={image}
                            key={image}
                            className="carousel-item relative w-full"
                          >
                            <img
                              src={path.url + 'api/item/image/' + image}
                              className="w-full object-fit"
                            />
                            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                              <a href={'#' + prevId} className="btn btn-circle">
                                ❮
                              </a>
                              <a href={'#' + nextId} className="btn btn-circle">
                                ❯
                              </a>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div
                        id={item.Images[0]}
                        key={item.Images[0]}
                        className="carousel-item relative w-full"
                      >
                        <img
                          src={path.url + 'api/item/image/' + item.Images[0]}
                          className="w-full object-fit"
                        />
                      </div>
                    )}
                  </div>
                </div>
                {/* Details */}
                <div className="flex md:w-2/3 justify-between items-center">
                  <div className="flex flex-col w-1/2">
                    <h1 className="text-black font-bold text-2xl">
                      {item.Name}
                    </h1>
                    <div className="flex flex-col">
                      <div className="flex gap-x-2 text-base md:text-xl my-2">
                        {item.OwnedBy.IsAvatarImageSet ? (
                          <img
                            src={
                              path.url +
                              'api/item/image/' +
                              item.OwnedBy.ProfileImage
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
                          {item.OwnedBy.FirstName} {item.OwnedBy.LastName}
                        </p>
                      </div>
                      <div className="flex flex-row items-center ml-2">
                        <p className="text-sm md:text-base">
                          Posted Date: <strong>{formattedDate}</strong>
                        </p>
                      </div>
                      <button
                        className="h-8 w-auto text-sm bg-orange-400 text-gray-800 mt-2 px-2 md:my-4 md:px-6 md:h-10 md:w-1/2"
                        onClick={() => {
                          window.rentalHistoryModal =
                            document.getElementById('rentalHistoryModal')
                          window.rentalHistoryModal.showModal()
                        }}
                      >
                        View Rental History
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col w-1/3 items-end my-4 mx-0 md:m-auto">
                    <h1 className="text-black font-semibold text-base md:text-xl">
                      RM {item.Price} / Day
                    </h1>
                    {isAuthenticated ? (
                      isOwner ? (
                        <button
                          className="h-10 w-44 text-base bg-orange-400 text-gray-800 px-2 md:px-6 md:h-12 md:w-auto md:text-lg"
                          disabled
                        >
                          You Owned This Item
                        </button>
                      ) : (
                        <div className="my-2 flex flex-col gap-2">
                          <Link to={'/message?to_user=' + item.OwnedBy.ID}>
                            <button className="h-10 w-36 text-base bg-gray-100 border-2 border-orange-400 text-gray-800 px-2 md:px-6 md:h-12 md:w-48 md:text-lg">
                              Message Owner
                            </button>
                          </Link>
                          <Link
                            to={{
                              pathname: '/booking/' + item.OwnedBy.ID,
                              state: {
                                item
                              }
                            }}
                          >
                            <button className="h-10 w-36 text-base bg-orange-400 text-gray-800 px-2 md:px-6 md:h-12 md:w-48 md:text-lg">
                              Rent Now
                            </button>
                          </Link>
                        </div>
                      )
                    ) : (
                      <Link
                        to={{
                          pathname: '/login'
                        }}
                      >
                        <button className="h-10 w-36 text-base bg-orange-400 text-gray-800 px-2 md:px-6 md:h-12 md:w-48 md:text-lg">
                          Login To Rent
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              {/* Description, Rental History, Feedbacks */}
              <div className="flex flex-col w-full bg-gray-100 shadow-xl py-3 px-5 items-center justify-center">
                <div className="flex flex-col w-full h-full">
                  <div className="flex flex-col w-full h-full">
                    <h1 className="text-black font-semibold text-xl mt-4">
                      Description
                    </h1>
                    <p className="text-black font-regular text-base md:text-lg">
                      {item.Description}
                    </p>

                    {/* Feedbacks */}
                    <h1 className="text-black font-semibold text-xl mt-4">
                      Feedbacks
                    </h1>
                    <div className="flex flex-col w-full h-full p-4">
                      <div className="flex flex-col w-full h-full p-4 border-2 shadow-sm gap-2">
                        {feedbacks && feedbacks.length > 0 ? (
                          feedbacks.map((feedback) => {
                            const formattedDate = new Date(
                              feedback.CreatedAt
                            ).toLocaleDateString('en-MY', {
                              year: 'numeric',
                              month: 'numeric',
                              day: 'numeric'
                            })
                            return (
                              <div
                                className="flex flex-col w-full h-full"
                                key={feedback.ID}
                              >
                                <div className="flex flex-row w-full h-full">
                                  <div className="flex flex-col w-1/2">
                                    <p className="text-black font-regular text-sm md:text-base">
                                      {formattedDate}
                                    </p>
                                  </div>
                                  <div className="flex flex-col w-1/2 items-end">
                                    <p className="text-black font-regular text-base md:text-lg">
                                      {StarRating(feedback.Rating)}
                                    </p>
                                    <p className="text-black font-regular text-sm md:text-base">
                                      {feedback.Review}
                                    </p>
                                  </div>
                                </div>
                                <hr className="my-2" />
                              </div>
                            )
                          })
                        ) : (
                          <p className="text-black font-regular text-base md:text-lg">
                            No Feedbacks
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <dialog
        id="rentalHistoryModal"
        className="modal modal-bottom sm:modal-middle"
      >
        <form method="dialog" className="modal-box">
          <RentalHistoryCard data={bookingHistory} />
          <div className="modal-action">
            <button className="btn">Close</button>
          </div>
        </form>
      </dialog>
    </div>
  )
}
