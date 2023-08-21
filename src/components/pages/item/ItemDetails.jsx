import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

import axios from 'axios'

import path from '../../utils/path'

import Navbar from '../../ui/Navbar'
import LoadingButton from '../../ui/button/LoadingButton'
import { others } from '@chakra-ui/react'

export default function ItemDetails () {
  const { id } = useParams()
  const [item, setItem] = useState(null)
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
              <div className="mt-24 flex flex-col w-full h-2/3 bg-gray-200 py-3 px-5 items-center justify-center">
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
                      <h1 className="text-black font-regular text-base md:text-xl">
                        {item.OwnedBy.FirstName} {item.OwnedBy.LastName}
                      </h1>
                      <div className="flex flex-row items-center ml-2">
                        {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg> */}
                        {/* <h1 className="text-black font-regular text-xl">{item.OwnedBy.Rating}</h1> */}
                        <p className="text-sm md:text-base">
                          Posted Date: <strong>{formattedDate}</strong>
                        </p>
                      </div>
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
                          <Link
                            to={{
                              pathname: '/message',
                              state: {
                                item
                              }
                            }}
                          >
                            <button className="h-10 w-36 text-base bg-white border-2 border-orange-400 text-gray-800 px-2 md:px-6 md:h-12 md:w-48 md:text-lg">
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
                    <button className="h-10 w-44 text-base bg-amber-500 text-gray-800 px-2 md:px-6 md:h-12 md:w-auto md:text-lg" onClick={
                      () => {
                        window.rentalHistoryModal =
                          document.getElementById('rentalHistoryModal')
                        window.rentalHistoryModal.showModal()
                      }

                    }>
                      View Rental History
                    </button>

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
                    <div className="flex flex-col w-full h-full">
                      <div className="flex flex-col w-full h-full">
                        {item.Feedbacks > 0 ? (
                          item.Feedbacks.map((feedback) => {
                            const formattedDate = new Date(
                              feedback.CreatedAt
                            ).toLocaleDateString('en-MY', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                            return (
                              <div
                                className="flex flex-col w-full h-full"
                                key={feedback.ID}
                              >
                                <div className="flex flex-row w-full h-full">
                                  <div className="flex flex-col w-1/2">
                                    <h1 className="text-black font-semibold text-base md:text-xl">
                                      {feedback.User.FirstName}{' '}
                                      {feedback.User.LastName}
                                    </h1>
                                    <p className="text-black font-regular text-sm md:text-base">
                                      {formattedDate}
                                    </p>
                                  </div>
                                  <div className="flex flex-col w-1/2 items-end">
                                    <p className="text-black font-regular text-base md:text-lg">
                                      {feedback.Rating} / 5
                                    </p>
                                    <p className="text-black font-regular text-sm md:text-base">
                                      {feedback.Comment}
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
          <h3 className="font-bold text-lg">Rental History</h3>
          {/* <p className="py-4">No Rental History</p> */}
          <p className="py-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec
            diam nec arcu tincidunt malesuada id nec nunc. Curabitur scelerisque
            in enim pretium iaculis. Nam non sapien mollis, interdum ante
            posuere, tempus elit. Vestibulum ullamcorper nisl vitae orci
            convallis pharetra. Vestibulum a pulvinar ligula. Ut a enim volutpat
            turpis consectetur imperdiet. Praesent vitae metus nibh. Fusce
            mollis odio velit, maximus tempor tellus sollicitudin malesuada. Sed
            non imperdiet quam. Nam accumsan augue ut congue ultricies. Integer
            ac magna vitae augue sollicitudin rhoncus sed vel odio. Fusce nec
            arcu neque. Duis at lacinia mi. Donec porttitor mi massa, quis
            venenatis leo aliquet id. Pellentesque nec nibh vel nibh viverra
            pellentesque. Donec lobortis fermentum enim. Phasellus ut nulla eu
            ligula eleifend hendrerit. Vestibulum a lobortis magna, non egestas
            magna. Nulla pellentesque odio vitae sapien convallis pulvinar.
            Morbi luctus urna sed nibh iaculis faucibus sit amet vehicula nisi.
            Fusce non lobortis erat. Etiam sit amet convallis tellus, nec
            gravida nisi. Integer venenatis et lacus quis vulputate.
          </p>
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </div>
        </form>
      </dialog>
    </div>
  )
}
