import React, { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'

import axios from 'axios'
import path from '../../utils/path'

export default function ImageUploader () {
  const [selectedImages, setSelectedImages] = useState([])
  const [images, setImages] = useState([])

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
    URL.revokeObjectURL(image)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData()

    formData.append('count', selectedImages.length)

    images.forEach((image, index) => {
      formData.append(`images-${index}`, image)
    })

    for (const pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1])
    }

    axios
      .post(path.url + 'api/item/createImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  return (
    <section>
      <form onSubmit={handleSubmit}>
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
          className="bg-blue-400"
          value="Add Images"
        />
      </form>
      <br />
      {selectedImages.length > 0 &&
        (selectedImages.length > 10
          ? (
          <p className="error">
            You can&apos;t upload more than 10 images! <br />
            <span>
              please delete <b> {selectedImages.length - 10} </b> of them{' '}
            </span>
          </p>
            )
          : (
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
                {/* <p>{index + 1}</p> */}
              </div>
            )
          })}
      </div>
    </section>
  )
};
