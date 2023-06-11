import React from 'react'

export default function BookingDetailCard ({ booking }) {
  let count = 0

  const createdDate = new Date(booking.CreatedAt)
  const createdDateStr = createdDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // convert date string to date object
  const bookingStartDate = new Date(booking.StartDate)

  // convert date object to string
  const bookingStartDateStr = bookingStartDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="w-full p-4">
      <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
        <div className="flex-auto p-4">
          <div className="flex flex-wrap">
            <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
              <h5 className="text-gray-500 uppercase font-bold text-xs">
                Upcoming
              </h5>
              <span className="font-semibold text-xl text-gray-800">
                {booking.StartDate}
              </span>
              {booking.Items.map((item) => (
                <div className="flex flex-wrap" key={item.ItemID}>
                  <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                    <span className="font-semibold text-xl text-gray-800">
                      Item {++count}: {item.Name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative w-auto pl-4 flex-initial">
              <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-orange-500">
                <i className="fas fa-chart-pie"></i>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4 flex flex-col">
            <span className="font-semibold text-sm text-gray-800">
              Created On: {createdDateStr}
            </span>
            <span className="text-green-500 mr-2">
              <i className="fas fa-arrow-up"></i> 3.48%
            </span>
            <span className="whitespace-nowrap">Since last month</span>
          </p>
        </div>
      </div>
    </div>
  )
}
