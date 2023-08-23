import React from 'react'

export default function RentalHistoryCard ({ data }) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="flex flex-col gap-8 relative">
          {data.map((item, index) => (
            <div key={index} className="relative">
              {index !== 0 && (
                <div className="absolute left-1/2 w-0.5 bg-gray-300 h-full transform -translate-x-1/2 bottom-10 z-10"></div>
              )}
              <div className="border-2 shadow-sm p-4 bg-white relative z-20">
                <p>
                  <strong>Quantity: </strong>
                  {item.Items[0].Quantity}
                </p>
                <p>
                  <strong>Duration: </strong>
                  {item.Duration === 1
                    ? `${item.Duration} day`
                    : `${item.Duration} days`}
                </p>
                <p>
                  <strong>Booking Date: </strong>
                  {item.StartDate}
                </p>
                <p>
                  <strong>Return Date: </strong>
                  {item.EndDate}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
