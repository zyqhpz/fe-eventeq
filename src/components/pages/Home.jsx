import Footer from '../ui/Footer'
import Navbar from '../ui/Navbar'
import ItemCard from '../ui/ItemCard'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

import { useEffect, useState } from 'react'
import axios from 'axios'

import Select from 'react-select'

import path from '../utils/path'
import DisplayItems from './DisplayItems'
import DisplayEvents from './DisplayEvents'

export default function Home () {
  const [items, setItems] = useState([])
  const [itemsFiltered, setItemsFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState([])

  const options = [
    { value: 'mixer', label: 'Mixer' },
    { value: 'speaker', label: 'Speaker' },
    { value: 'microphone', label: 'Microphone' }
  ]

  useEffect(() => {
    axios
      .get(path.url + 'api/itemsActiveWithUser')
      .then((res) => {
        setItems(res.data)
        setItemsFiltered(res.data)
        setLoading(false)
      })
      .catch(() => {})
  }, [])

  const handleSearchChange = (e) => {
    setSearch(e.target.value)

    // filter items by name and description (case insensitive) and return the filtered items array
    const filteredItems = items.filter((item) => {
      return (
        item.Name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.Description.toLowerCase().includes(e.target.value.toLowerCase())
      )
    })

    // set the items array to the filtered items array
    setItemsFiltered(filteredItems)

    // if the search bar is empty, get all items
    if (e.target.value === '') {
      setItemsFiltered(items)
    }
  }

  const handleCategoryChange = (e) => {
    setCategory(e)

    // filter items by category and return the filtered items array
    const filteredItems = items.filter((item) => {
      return e.some((category) => {
        return item.Category === category.value
      })
    })

    // set the items array to the filtered items array
    setItemsFiltered(filteredItems)

    // // if the category filter is empty, get all items
    if (e.length === 0) {
      setItemsFiltered(items)
    }
  }

  return (
    <div className="Home min-h-screen flex flex-col w-screen">
      <Navbar />
      <div className="bg-gray-100 h-screen">
        {/* div for items list */}
        <DisplayItems/>

        {/* div for events list */}
        <DisplayEvents/>
      </div>
      <Footer />
    </div>
  )
}
