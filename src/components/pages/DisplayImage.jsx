import { useState, useEffect } from 'react'
import axios from 'axios'

import { useParams } from 'react-router-dom'

import path from '../utils/path'

export default function DisplayImage () {
  const [imageData, setImageData] = useState(null)

  // get the :id parameter from the URL
  const { id } = useParams()

  useEffect(() => {
    // Make GET request to retrieve image data from backend API
    axios
      .get(path.url + id, {
        responseType: 'arraybuffer'
      })
      .then((response) => {
        // Convert response data to a Blob object
        const blob = new Blob([response.data], { type: 'image/jpeg' })

        // Create URL for Blob object
        const imageURL = URL.createObjectURL(blob)

        // Set image URL as state
        setImageData(imageURL)
      })
      .catch((error) => console.error(error))
  }, [])

  return (
    <div>
      {imageData
        ? (
        <img src={imageData} alt="MongoDB GridFS image" />
          )
        : (
        <p>Loading image...</p>
          )}
    </div>
  )
}
