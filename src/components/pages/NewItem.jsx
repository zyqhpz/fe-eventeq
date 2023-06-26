import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import axios from 'axios'
import path from '../utils/path'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'

import ProcessingButton from '../ui/button/ProcessingButton'

export default function NewItem () {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [quantity, setQuantity] = useState(0)
  const [category, setCategory] = useState('')
  const [selectedImages, setSelectedImages] = useState([])
  const [images, setImages] = useState([])
  const [userID, setUserID] = useState('')
  const [loading, setLoading] = useState(false)

  const state = useLocation().state

  const handleSubmit = async (event) => {
    setLoading(true)
    setUserID(state.ID)
    event.preventDefault()
    const formData = new FormData()
    formData.append('userID', userID)
    formData.append('name', name)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('quantity', quantity)
    formData.append('imagesCount', selectedImages.length)
    images.forEach(async (image, index) => {
      const compressedImage = await compressImage(image)
      formData.append(`images-${index}`, compressedImage)
    })

    console.log(images)

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
            // console.log(response)
          })
          .catch((error) => {
            console.error('Error:', error)
          })
        setLoading(false)
      }
    }, 2000)
  }

  useEffect(() => {
    console.log(category)
  }, [category])

  const onSelectFile = (event) => {
    const selectedFiles = event.target.files
    const selectedFilesArray = Array.from(selectedFiles)

    const imagesArray = selectedFilesArray.map((file) => {
      return URL.createObjectURL(file)
    })

    setImages((previousImages) =>
      previousImages.concat(selectedFilesArray)
    )
    setSelectedImages((previousImages) =>
      previousImages.concat(imagesArray)
    )

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

  return (
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
                <option selected hidden>
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
              console.log(selectedImages)
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
  )
}
