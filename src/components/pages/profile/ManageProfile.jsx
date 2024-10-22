import React, { useState, useEffect } from 'react'

import Navbar from '../../ui/Navbar'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'

import { useToast } from '@chakra-ui/react'

import path from '../../utils/path'
import axios from 'axios'

import statesDistricts from '../../../assets/data/states_districts'

export default function ManageProfile () {
  const jsonData = statesDistricts

  // const [user, setUser] = useState(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [noPhone, setNoPhone] = useState('')
  const [location, setLocation] = useState('')
  const [profilePic, setProfilePic] = useState(null)
  const [profilePicURL, setProfilePicURL] = useState('')
  const [profilePicIsSet, setProfilePicIsSet] = useState(false)

  const [profilePicChanged, setProfilePicChanged] = useState(false)

  const [loading, setLoading] = useState(true)

  const [selectedState, setSelectedState] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')

  const states = Object.keys(jsonData)

  const handleStateChange = (e) => {
    setSelectedState(e.target.value)
    setSelectedDistrict('')
  }

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value)
  }

  const toast = useToast()

  // Success feedback for updating user
  const UpdateSuccess = () => {
    return toast({
      title: 'Update Success',
      description: 'Your profile has been updated successfully.',
      status: 'success',
      position: 'top-right',
      duration: 3000,
      isClosable: true
    })
  }

  const userId = localStorage.getItem('userId')

  useEffect(() => {
    fetch(path.url + 'api/user/id/' + userId)
      .then((res) => res.json())
      .then((data) => {
        setFirstName(data.FirstName)
        setLastName(data.LastName)
        setEmail(data.Email)
        setNoPhone(data.NoPhone)
        setLocation(data.Location)
        setSelectedState(data.Location.State)
        setSelectedDistrict(data.Location.District)
        setProfilePicIsSet(data.IsAvatarImageSet)

        console.log(data)

        if (data.IsAvatarImageSet) {
          setProfilePic(data.ProfileImage)

          const imagePath = path.url + 'api/item/image/' + data.ProfileImage
          setProfilePicURL(imagePath)
        }
        setLoading(false)
      }
      )
      .catch((err) => console.log(err))
  }, [])

  const onSelectFile = (event) => {
    const selectedFile = event.target.files[0]

    setProfilePic(selectedFile)

    const image = URL.createObjectURL(selectedFile)
    setProfilePicURL(image)

    setProfilePicIsSet(true)
    setProfilePicChanged(true)

    // Set the value of the file input to trigger validation
    const fileInput = document.getElementById('profile-pic')
    if (fileInput) {
      fileInput.value = event.target.value
    }

    // FOR BUG IN CHROME
    event.target.value = ''
  }

  function handleSave () {
    event.preventDefault()
    const formData = new FormData()
    formData.append('firstName', firstName)
    formData.append('lastName', lastName)
    formData.append('email', email)
    formData.append('noPhone', noPhone)
    formData.append('state', selectedState)
    formData.append('district', selectedDistrict)

    formData.append('profileImageChanged', profilePicChanged)
    if (profilePicChanged) {
      formData.append('profileImage', profilePic)
    }

    axios
      .put(path.url + 'api/user/update/' + userId, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      })
      .then((response) => {
        if (response.data.status === 'success') {
          UpdateSuccess()
        }
      })
      .catch((error) => {
        console.error('Error:', error)
      })
    setLoading(false)
  }

  return (
    <div>
      <Navbar />
      <div className="bg-gray-100 w-screen h-screen overflow-auto">
        <div className="flex flex-col p-4 w-full h-full md:h-auto items-center min-w-none py-10 gap-4">
          <h1 className="text-lg md:text-2xl font-bold">Manage Profile</h1>
          <div className="relative p-4 bg-white rounded-lg shadow sm:p-5 md:w-1/2">
            <form onSubmit={handleSave}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    First Name
                  </label>
                  <input
                    id="first-name"
                    name="first-name"
                    type="text"
                    autoComplete="off"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Type your first name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Last Name
                  </label>
                  <input
                    id="last-name"
                    name="last-name"
                    type="text"
                    autoComplete="off"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Type your last name"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="off"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Type your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone-number"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone-number"
                    name="phone-number"
                    type="number"
                    autoComplete="off"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Type your phone number"
                    required
                    value={noPhone}
                    onChange={(e) => setNoPhone(e.target.value)}
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
                    htmlFor="profile-pic"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Profile Picture
                  </label>
                  <div className="flex flex-row gap-4">
                    <input
                      id="profile-pic"
                      name="profile-pic"
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/avif"
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      onChange={onSelectFile}
                    />
                    {profilePicIsSet ? (
                      <img
                        className="mask mask-squircle h-10 w-10 object-cover"
                        src={profilePicURL}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faCircleUser}
                        className="h-10 w-10  text-gray-500"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <button
                  className="text-white bg-orange-500 hover:bg-orange-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  type="submit"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
