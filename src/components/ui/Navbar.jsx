import { Fragment, useState, useEffect } from 'react'
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'

import { useNavigate } from 'react-router-dom'

import EventEQLogo from './../../assets/EventEQ.png'
import SearchBar from './SearchBar'
import ProfileIconButton from './ProfileIconButton'

import path from '../utils/path'

export default function Navbar () {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  const userId = localStorage.getItem('userId')

  useEffect(() => {
    if (userId == null) {
      setIsAuthenticated(false)
    } else {
      setIsAuthenticated(true)

      fetch(path.url + 'api/user/id/' + userId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }).then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            setName(data.FirstName + ' ' + data.LastName)
            setLoading(false)
          })
        }
      })
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
        localStorage.removeItem('userId')
        navigate('/')
      }
    })
  }

  return (
    <header className="bg-white w-full">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a
            href="/"
            className="-m-1.5 p-1.5 flex items-center gap-2 hover:text-orange-500"
          >
            <img className="h-8 w-auto" src={EventEQLogo} alt="EventEQ Logo" />
            <span className="not-sr-only">EventEQ</span>
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <SearchBar />
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <ProfileIconButton />
        </div>
      </nav>
      <hr />
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">EventEQ</span>
              <img
                className="h-8 w-auto"
                src={EventEQLogo}
                alt="EventEQ Logo"
              />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div
                className={
                  isAuthenticated
                    ? 'flex flex-col gap-2 space-y-2 py-6'
                    : 'hidden'
                }
              >
                <span className="space-y-2 py-6 font-bold">Welcome, {name}</span>
                <a
                  href="/user/manage/item"
                  className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 hover:text-orange-500"
                >
                  Manage Items
                </a>
                <a
                  href="/message"
                  className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 hover:text-orange-500"
                >
                  Message
                </a>
                <a
                  href="/listing/booking"
                  className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 hover:text-orange-500"
                >
                  Booking
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 hover:text-orange-500"
                >
                  Account settings
                </a>
              </div>
              <div className="py-6">
                {isAuthenticated ? (
                  <a
                    href="#"
                    onClick={logout}
                    className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 hover:text-orange-500"
                  >
                    Log out
                  </a>
                ) : (
                  <Fragment>
                    <a
                      href="/login"
                      className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 hover:text-orange-500"
                    >
                      Log in
                    </a>
                    <a
                      href="/register"
                      className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 hover:text-orange-500"
                    >
                      Register
                    </a>
                  </Fragment>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}
