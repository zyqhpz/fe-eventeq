import Footer from '../../ui/Footer'
import Navbar from '../../ui/Navbar'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'

import ProcessingButton from '../../ui/button/ProcessingButton'

import { React, useEffect, useState, useMemo } from 'react'

import { useToast } from '@chakra-ui/react'

import axios from 'axios'
import path from '../../utils/path'
import LoadingButton from '../../ui/button/LoadingButton'

export default function ManageItem () {
  const [items, setItems] = useState([])
  const [showModal, setShowModal] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [quantity, setQuantity] = useState(0)
  const [category, setCategory] = useState('')
  const [selectedImages, setSelectedImages] = useState([])
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)

  const userId = localStorage.getItem('userId')

  const toast = useToast()

  // Success feedback for item insertion
  const InsertSuccess = () => {
    return toast({
      title: 'Item added.',
      description: 'Item has been added successfully.',
      status: 'success',
      position: 'top-right',
      duration: 9000,
      isClosable: true
    })
  }

  const handleSubmit = async (event) => {
    setLoading(true)
    event.preventDefault()
    const formData = new FormData()
    formData.append('userID', userId)
    formData.append('name', name)
    formData.append('description', description)
    formData.append('category', category)
    formData.append('price', price)
    formData.append('quantity', quantity)
    formData.append('imagesCount', selectedImages.length)
    images.forEach(async (image, index) => {
      const compressedImage = await compressImage(image)
      formData.append(`images-${index}`, compressedImage)
    })

    // set interval to 2 seconds
    const interval = setInterval(() => {
      if (selectedImages.length === images.length) {
        clearInterval(interval)

        axios
          .post(path.url + 'api/item/create', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then((response) => {
            if (response.data.status === 'success') {
              window.addNewItemModal.close()
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
        setLoading(false)
      }
    }, 2000)
  }

  const onSelectFile = (event) => {
    const selectedFiles = event.target.files
    const selectedFilesArray = Array.from(selectedFiles)

    const imagesArray = selectedFilesArray.map((file) => {
      return URL.createObjectURL(file)
    })

    setImages((previousImages) => previousImages.concat(selectedFilesArray))
    setSelectedImages((previousImages) => previousImages.concat(imagesArray))

    // FOR BUG IN CHROME
    event.target.value = ''
  }

  function deleteHandler (image) {
    setSelectedImages(selectedImages.filter((e) => e !== image))
    const index = images.findIndex((e) => e.name === image.name)
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
    URL.revokeObjectURL(image)
  }

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target.result
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          const MAX_WIDTH = 800
          let width = img.width
          let height = img.height
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)
          canvas.toBlob(
            (blob) => {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              })
              resolve(compressedFile)
            },
            file.type,
            0.7
          )
        }
      }
    })
  }

  useEffect(() => {
    axios
      .get(path.url + 'api/item/user/' + userId)
      .then((res) => {
        setItems(res.data)
        setLoading(false)
      })
      .catch(() => {})
  }, [])

  // clear all states when modal is closed
  useEffect(() => {
    if (!showModal) {
      setName('')
      setDescription('')
      setPrice(0)
      setQuantity(0)
      setCategory('')
      setSelectedImages([])
      setImages([])
    }
  }, [showModal])

  return (
    <div className="ManageItem">
      <Navbar />
      <div className="bg-gray-100 w-screen h-screen overflow-auto">
        <div className="flex flex-col items-center min-w-none w-full h-full py-10">
          {loading ? (
            <LoadingButton />
          ) : (
            <div className="p-4 md:w-2/3">
              <div className="flex flex-row justify-between mb-10">
                <h1 className="text-lg md:text-2xl font-bold">Manage Item</h1>
                <button
                  className="text-white bg-orange-500 hover:bg-orange-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  onClick={() => {
                    window.addNewItemModal.showModal()
                    setShowModal(true)
                  }}
                >
                  Add Item
                </button>
              </div>
              <table
                className="w-full text-sm text-left text-gray-500 dark:text-gray-400"
                id="bookingSummaryTable"
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
                      Price
                    </th>
                    <th scope="col" className="px-2 md:px-6 py-3">
                      Quantity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td className="px-6 py-4" colSpan={4}>
                        No items found
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr
                        className="bg-white border-b md:text-base hover:bg-gray-100"
                        key={item.ID}
                      >
                        <th
                          scope="row"
                          className="px-2 md:px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                        >
                          {item.Name}
                        </th>
                        <td className="px-2 md:px-6 py-4">
                          {item.Description}
                        </td>
                        <td className="px-2 md:px-6 py-4">RM {item.Price}</td>
                        <td className="px-2 md:px-6 py-4">{item.Quantity}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <dialog id="addNewItemModal" className="modal">
        <div method="dialog" className="modal-box max-w-none md:w-2/3">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => {
              window.addNewItemModal.close()
              setShowModal(false)
            }}
          >
            ✕
          </button>
          <h3 className="font-bold text-lg">Add New Item</h3>
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
                      placeholder="Type item name"
                      autoComplete="off"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="price"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Price <span className="font-light">(per day)</span>
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                        RM
                      </span>
                      <input
                        id="price"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg rounded-l-none focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        placeholder="199"
                        required
                        type="number"
                        name="price"
                        autoComplete="off"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="quantity"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Quantity
                    </label>
                    <input
                      id="quantity"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      placeholder="Enter product quantity"
                      required
                      type="number"
                      name="quantity"
                      autoComplete="off"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="category"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option hidden defaultChecked>
                        Select category
                      </option>
                      <option value="speaker">Speaker</option>
                      <option value="speaker_stand">Speaker Stand</option>
                      <option value="microphone">Microphone</option>
                      <option value="microphone_stand">Microphone Stand</option>
                      <option value="mixer">Mixer</option>
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
                      placeholder="Write item description here"
                      name="description"
                      autoComplete="off"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <label
                  htmlFor="file-upload"
                  className="relative block w-full h-48 mt-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                >
                  <div className="absolute top-0 left-0 w-full h-full opacity-0"></div>
                  <div className="flex flex-col items-center justify-center w-full h-full bg-gray-200 hover:bg-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-10 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <p className="mt-1 text-sm text-gray-600">
                      Drag and drop or click to add images
                    </p>
                  </div>
                  <input
                    type="file"
                    id="file-upload"
                    className="absolute top-0 left-0 w-full h-full opacity-0"
                    accept="image/png,image/jpeg,image/webp"
                    name="images"
                    multiple
                    onChange={onSelectFile}
                  />
                </label>
                <input
                  type="submit"
                  className="bg-orange-400 hover:bg-orange-500 border-orange-800 border-2 border-opacity-30 p-4 m-auto block mt-4 rounded-lg text-white font-bold"
                  value="Add new item"
                />
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
            {selectedImages.length > 0 &&
              (selectedImages.length > 10 ? (
                <p className="error">
                  You cannot upload more than 10 images! <br />
                  <span>
                    please delete <b> {selectedImages.length - 10} </b> of them{' '}
                  </span>
                </p>
              ) : (
                <button
                  className="upload-btn"
                  onClick={() => {
                    // console.log(selectedImages)
                  }}
                >
                  UPLOAD {selectedImages.length} IMAGE
                  {selectedImages.length === 1 ? '' : 'S'}
                </button>
              ))}
            <div className="images flex gap-2">
              {selectedImages &&
                selectedImages.map((image, index) => {
                  return (
                    <div key={image} className="image w-32 h-32">
                      <img src={image} height="200" alt="upload" />
                      <button
                        onClick={() => deleteHandler(image)}
                        className="disabled:pointer-events-none w-6 h-6 rounded-full"
                      >
                        {/* delete image */}
                        <FontAwesomeIcon
                          icon={faCircleXmark}
                          className="text-red-500 w-full h-full"
                        />
                      </button>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </dialog>
    </div>
  )
}
