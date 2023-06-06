import Footer from '../ui/Footer'
import Navbar from '../ui/Navbar'

import Error from './../../assets/error.png'

export default function NotFound () {
  return (
    <div className="Home">
      <Navbar />
      <div className="bg-gray-100 w-screen h-screen">
        <div className="flex flex-col items-center justify-center h-full">
          <img src={Error} alt="404" className="w-40 h-40" />
          <h1 className="text-4xl font-bold text-gray-800">404 Not Found</h1>
          <p className="text-gray-600">Are you missing?</p>
        </div>
      </div>
      <Footer/>
    </div>
  )
}
