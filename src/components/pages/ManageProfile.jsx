import React, { useState, useEffect } from 'react'

import Navbar from '../ui/Navbar'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'

import path from '../utils/path'
import axios from 'axios'

export default function ManageProfile () {
  const jsonData = {
    Johor: [
      'Johor Bahru',
      'Tebrau',
      'Pasir Gudang',
      'Bukit Indah',
      'Skudai',
      'Kluang',
      'Batu Pahat',
      'Muar',
      'Ulu Tiram',
      'Senai',
      'Segamat',
      'Kulai',
      'Kota Tinggi',
      'Pontian Kechil',
      'Tangkak',
      'Bukit Bakri',
      'Yong Peng',
      'Pekan Nenas',
      'Labis',
      'Mersing',
      'Simpang Renggam',
      'Parit Raja',
      'Kelapa Sawit',
      'Buloh Kasap',
      'Chaah'
    ],
    Kedah: [
      'Sungai Petani',
      'Alor Setar',
      'Kulim',
      'Jitra / Kubang Pasu',
      'Baling',
      'Pendang',
      'Langkawi',
      'Yan',
      'Sik',
      'Kuala Nerang',
      'Pokok Sena',
      'Bandar Baharu'
    ],
    Kelantan: [
      'Kota Bharu',
      'Pangkal Kalong',
      'Tanah Merah',
      'Peringat',
      'Wakaf Baru',
      'Kadok',
      'Pasir Mas',
      'Gua Musang',
      'Kuala Krai',
      'Tumpat'
    ],
    Melaka: [
      'Bandaraya Melaka',
      'Bukit Baru',
      'Ayer Keroh',
      'Klebang',
      'Masjid Tanah',
      'Sungai Udang',
      'Batu Berendam',
      'Alor Gajah',
      'Bukit Rambai',
      'Ayer Molek',
      'Bemban',
      'Kuala Sungai Baru',
      'Pulau Sebang',
      'Jasin'
    ],
    'Negeri Sembilan': [
      'Seremban',
      'Port Dickson',
      'Nilai',
      'Bahau',
      'Tampin',
      'Kuala Pilah'
    ],
    Pahang: [
      'Kuantan',
      'Temerloh',
      'Bentong',
      'Mentakab',
      'Raub',
      'Jerantut',
      'Pekan',
      'Kuala Lipis',
      'Bandar Jengka',
      'Bukit Tinggi'
    ],
    Perak: [
      'Ipoh',
      'Taiping',
      'Sitiawan',
      'Simpang Empat',
      'Teluk Intan',
      'Batu Gajah',
      'Lumut',
      'Kampung Koh',
      'Kuala Kangsar',
      'Sungai Siput Utara',
      'Tapah',
      'Bidor',
      'Parit Buntar',
      'Ayer Tawar',
      'Bagan Serai',
      'Tanjung Malim',
      'Lawan Kuda Baharu',
      'Pantai Remis',
      'Kampar'
    ],
    Perlis: ['Kangar', 'Kuala Perlis'],
    'Pulau Pinang': [
      'Bukit Mertajam',
      'Georgetown',
      'Sungai Ara',
      'Gelugor',
      'Ayer Itam',
      'Butterworth',
      'Perai',
      'Nibong Tebal',
      'Permatang Kucing',
      'Tanjung Tokong',
      'Kepala Batas',
      'Tanjung Bungah',
      'Juru'
    ],
    Sabah: [
      'Kota Kinabalu',
      'Sandakan',
      'Tawau',
      'Lahad Datu',
      'Keningau',
      'Putatan',
      'Donggongon',
      'Semporna',
      'Kudat',
      'Kunak',
      'Papar',
      'Ranau',
      'Beaufort',
      'Kinarut',
      'Kota Belud'
    ],
    Sarawak: [
      'Kuching',
      'Miri',
      'Sibu',
      'Bintulu',
      'Limbang',
      'Sarikei',
      'Sri Aman',
      'Kapit',
      'Batu Delapan Bazaar',
      'Kota Samarahan'
    ],
    Selangor: [
      'Subang Jaya',
      'Klang',
      'Ampang Jaya',
      'Shah Alam',
      'Petaling Jaya',
      'Cheras',
      'Kajang',
      'Selayang Baru',
      'Rawang',
      'Taman Greenwood',
      'Semenyih',
      'Banting',
      'Balakong',
      'Gombak Setia',
      'Kuala Selangor',
      'Serendah',
      'Bukit Beruntung',
      'Pengkalan Kundang',
      'Jenjarom',
      'Sungai Besar',
      'Batu Arang',
      'Tanjung Sepat',
      'Kuang',
      'Kuala Kubu Baharu',
      'Batang Berjuntai',
      'Bandar Baru Salak Tinggi',
      'Sekinchan',
      'Sabak',
      'Tanjung Karang',
      'Beranang',
      'Sungai Pelek',
      'Sepang'
    ],
    Terengganu: [
      'Kuala Terengganu',
      'Chukai',
      'Dungun',
      'Kerteh',
      'Kuala Berang',
      'Marang',
      'Paka',
      'Jerteh'
    ],
    'Wilayah Persekutuan': ['Kuala Lumpur', 'Labuan', 'Putrajaya']
  }

  const [user, setUser] = useState(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [noPhone, setNoPhone] = useState('')
  const [location, setLocation] = useState('')
  const [profilePic, setProfilePic] = useState(null)
  const [profilePicIsSet, setProfilePicIsSet] = useState(false)

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

  const userId = localStorage.getItem('userId')

  useEffect(() => {
    fetch(path.url + 'api/user/id/' + userId)
      .then((res) => res.json())
      .then((data) => {
        setUser(data)
        setFirstName(data.FirstName)
        setLastName(data.LastName)
        setEmail(data.Email)
        setNoPhone(data.PhoneNumber)
        setLocation(data.Location)
        setSelectedState(data.Location.State)
        setSelectedDistrict(data.Location.City)
        setProfilePic(data.UserImageAvatar)

        setProfilePicIsSet(data.IsImageAvatarSet)

        if (data.IsImageAvatarSet) {
        //   setProfilePic(path.url + 'api/user/image/' + data.UserImageAvatar)
          setProfilePic(data.UserImageAvatar)
        }
        setLoading(false)
      }
      )
      .catch((err) => console.log(err))
  }, [])

  function handleSave () {
    event.preventDefault()
    const formData = new FormData()
    formData.append('userID', userId)
    formData.append('firstName', firstName)
    formData.append('lastName', lastName)
    formData.append('email', email)
    formData.append('noPhone', noPhone)
    formData.append('state', selectedState)
    formData.append('district', selectedDistrict)
    formData.append('profilePic', profilePic)

    axios
      .put(path.url + 'api/item/update/' + userId, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        if (response.data.status === 'success') {
          window.editItemModal.close()
          //   UpdateSuccess()
          // set interval to 2 seconds
        //   setInterval(() => {
        //     // window.location.reload()
        //   }, 2000)
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
            <form action="#">
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
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      placeholder="Type your profile picture"
                      required
                      value={profilePic}
                      onChange={(e) => setProfilePic(e.target.value)}
                    />
                    {profilePicIsSet ? (
                      <img
                        className="mask mask-squircle h-10 w-10 object-cover"
                        src="https://images.unsplash.com/photo-1457449940276-e8deed18bfff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
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
                  onClick={handleSave}
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
