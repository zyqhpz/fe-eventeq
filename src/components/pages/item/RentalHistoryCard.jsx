import React from 'react'

export default function RentalHistoryCard ({ data }) {
  return (
    <div className="card">
      <div className="card-header">
        <h4>Rental History</h4>
      </div>
      <div className="card-body">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Date</th>
              <th>Quantity</th>
              <th>Duration</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {/* {data.map((item, index) => ( */}
            <tr key={data.id}>
              <td>{data + 1}</td>
              <td>{data.name}</td>
              <td>{data.date}</td>
              <td>{data.quantity}</td>
              <td>{data.duration}</td>
              <td>{data.amount}</td>
            </tr>
            {/* ))} */}
          </tbody>
        </table>
      </div>
    </div>
  )
}
