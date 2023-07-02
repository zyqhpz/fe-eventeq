import { Fragment, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'

import path from '../utils/path'

function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example () {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  const userId = localStorage.getItem('userId')

  useEffect(() => {
    if (userId == null) {
      setIsAuthenticated(false)
    } else {
      setIsAuthenticated(true)

      if (user == null) {
        fetch(path.url + 'api/user/id/' + userId, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }).then((response) => {
          if (response.status === 200) {
            response.json().then((data) => {
              setUser(data)
              setName(data.FirstName + ' ' + data.LastName)
              setLoading(false)
            })
          }
        })
      }
    }
  }, [])

  const logout = () => {
    fetch(path.url + 'api/user/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }).then((response) => {
      if (response.status === 200) {
        setIsAuthenticated(false)
        setUser(null)
        setName('')
        localStorage.removeItem('userId')
        navigate('/')
      }
    })
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full items-center justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          <FontAwesomeIcon icon={faCircleUser} className="w-4 h-4" />
          {loading ? (
            <p className="text-gray-900"></p>
          ) : (
            name || '')}
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item className={isAuthenticated ? 'hidden' : 'block'}>
              {({ active }) => (
                <Link
                  to="/login"
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Login
                </Link>
              )}
            </Menu.Item>
            <Menu.Item className={isAuthenticated ? 'hidden' : 'block'}>
              {({ active }) => (
                <Link
                  to="/register"
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Register
                </Link>
              )}
            </Menu.Item>
            <Menu.Item className={isAuthenticated ? 'block' : 'hidden'}>
              {({ active }) => (
                <Link
                  to="/user/manage/item"
                  state={user}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block w-full px-4 py-2 text-left text-sm'
                  )}
                >
                  Manage items
                </Link>
              )}
            </Menu.Item>
            <Menu.Item className={isAuthenticated ? 'flex gap-2' : 'hidden'}>
              {({ active }) => (
                <Link
                  to="/message"
                  state={user}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block w-full px-4 py-2 text-left text-sm'
                  )}
                >
                  Message
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                  </span>
                </Link>
              )}
            </Menu.Item>
            <Menu.Item className={isAuthenticated ? 'flex gap-2' : 'hidden'}>
              {({ active }) => (
                <Link
                  to="/listing/booking"
                  state={user}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block w-full px-4 py-2 text-left text-sm'
                  )}
                >
                  Booking
                </Link>
              )}
            </Menu.Item>
            <Menu.Item className={isAuthenticated ? 'block' : 'hidden'}>
              {({ active }) => (
                <a
                  href="/user/manage/profile"
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Account settings
                </a>
              )}
            </Menu.Item>
            <Menu.Item className={isAuthenticated ? 'block' : 'hidden'}>
              {({ active }) => (
                <button
                  type="submit"
                  onClick={logout}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block w-full px-4 py-2 text-left text-sm'
                  )}
                >
                  Sign out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
