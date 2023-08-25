import Footer from '../ui/Footer'
import Navbar from '../ui/Navbar'

import DisplayItems from './DisplayItems'
import DisplayEvents from './DisplayEvents'

export default function Home () {
  return (
    <div className="Home min-h-screen flex flex-col w-screen">
      <Navbar />
      <div className="bg-gray-100 min-h-screen">
        {/* div for items list */}
        <DisplayItems/>

        {/* div for events list */}
        <DisplayEvents/>
      </div>
      <Footer />
    </div>
  )
}
