import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

import axios from 'axios'

import path from '../utils/path'

import Navbar from '../ui/Navbar'
import LoadingButton from '../ui/button/LoadingButton'
import { others } from '@chakra-ui/react'

export default function ItemDetails () {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  // const [userId, setUserId] = useState(null);

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
        setLoading(false)
        if (response.data.OwnedBy.ID === userId) {
          setIsOwner(true)
        }
      })
      .catch((error) => console.error(error))
  }, [])

  // var formattedDate = new Date(item.CreatedAt).toLocaleDateString("en-MY", {
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  // });

  // var imagePath = "http://localhost:8080/api/item/image/" + item.Image;

  return (
    <div className="flex flex-col min-h-screen w-screen overflow-hidden">
      <Navbar />
      <div className="bg-gray-100 h-full max-w-full">
        <div className="flex flex-col items-center justify-center h-full">
          {loading ? (
            <LoadingButton />
          ) : (
            <div
              className="container mx-auto -mt-38 h-screen w-screen"
              style={{ height: 'calc(100vh - 96px)' }}
            >
              <div className="mt-24 flex flex-col w-full h-2/3 bg-gray-200 py-3 px-5 items-center justify-center">
                <div className="flex flex-row ml-5 p-2">
                  {item.Images.map((image) => (
                    <img
                      key={image}
                      className="w-72 h-72 object-cover"
                      src={path.url + 'api/item/image/' + image}
                      alt="item image"
                    />
                  ))}
                </div>
                <div className="flex w-2/3 justify-between items-center ">
                  <div className="flex flex-col w-1/2">
                    <h1 className="text-black font-bold text-2xl">
                      {item.Name}
                    </h1>
                    <div className="flex flex-col">
                      <h1 className="text-black font-regular text-xl">
                        {item.OwnedBy.FirstName} {item.OwnedBy.LastName}
                      </h1>
                      <div className="flex flex-row items-center ml-2">
                        {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg> */}
                        {/* <h1 className="text-black font-regular text-xl">{item.OwnedBy.Rating}</h1> */}
                        <p>Posted Date: DD/MM/YYYY</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col w-1/3 items-end">
                    <h1 className="text-black font-semibold text-xl">
                      RM {item.Price} / Day
                    </h1>

                    {isAuthenticated
                      ? (
                          isOwner
                            ? (
                        <button
                          className="h-12 bg-orange-400 text-gray-800 px-6"
                          disabled
                        >
                          You Owned This Item
                        </button>
                              )
                            : (
                        <div className="my-2 flex flex-col gap-2">
                          <Link
                            to={{
                              pathname: '/message',
                              state: {
                                item
                              }
                            }}
                          >
                            <button className="h-12 bg-white border-2 border-orange-400 w-48 text-gray-800 px-6">
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
                          <button className="h-12 bg-orange-400 w-48 text-gray-800 px-6">
                            Rent Now
                          </button>
                          </Link>
                        </div>
                              )
                        )
                      : (
                      <Link
                        to={{
                          pathname: '/login'
                        }}
                      >
                        <button className="h-12 bg-orange-400 text-gray-800 px-6">
                          Login To Rent
                        </button>
                      </Link>
                        )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
