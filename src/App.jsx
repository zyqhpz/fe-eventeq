import SignIn from './components/pages/SignIn'
import Home from './components/pages/Home'
import NotFound from './components/pages/NotFound'
import SignUp from './components/pages/SignUp'
import ManageProfile from './components/pages/profile/ManageProfile'

import { Route, Routes, Link } from 'react-router-dom'
import DisplayImage from './components/pages/DisplayImage'

import ManageItem from './components/pages/item/ManageItem'
import ItemDetails from './components/pages/item/ItemDetails'

import BookingItem from './components/pages/booking/BookingItem'
import Bookings from './components/pages/booking/Bookings'
import GetItem from './components/pages/booking/GetBookingItem'
import ReturnItem from './components/pages/booking/ReturnBookingItem'

import ManageEvent from './components/pages/event/ManageEvent'

import ChatPage from './components/pages/chat/ChatPage'

import PaymentRedirectPage from './components/pages/payment/PaymentRedirectPage'

import BookingReceipt from './components/pages/receipt/BookingReceipt'
import { PDFViewer } from '@react-pdf/renderer' // Import PDFViewer

function App () {
  return (
    <div className="App">
      <Routes>
        <Route path="*" element={<NotFound />} />

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/user/manage/profile" element={<ManageProfile />} />

        {/* item */}
        <Route path="/user/manage/item" element={<ManageItem />} />
        <Route path="/item/:id" element={<DisplayImage />} />
        <Route path="/listing/item/:id" element={<ItemDetails />} />

        {/* Booking Item */}
        <Route path="/booking/:ownerId" element={<BookingItem />} />
        <Route path="/listing/booking/" element={<Bookings />} />
        <Route path="/listing/booking/active/:id" element={<GetItem />} />
        <Route
          path="/listing/booking/active/:id/return"
          element={<ReturnItem />}
        />

        {/* Event */}
        <Route path="/listing/event/:id" element={<DisplayImage />} />
        <Route path="/user/manage/event" element={<ManageEvent />} />

        {/* Chat */}
        <Route path="/message/" element={<ChatPage />} />

        {/* Payment */}
        <Route path="/payment/redirect" element={<PaymentRedirectPage />} />

        {/* PDF */}
        <Route
          path="/booking/:bookingId/receipt/pdf"
          element={
            <div className="w-screen h-screen">
              <PDFViewer width="100%" height="100%">
                <BookingReceipt />
              </PDFViewer>
            </div>
          }
        />
      </Routes>
    </div>
  )
}

export default App
