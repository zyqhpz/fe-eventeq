import Footer from "../../ui/Footer";
import Navbar from "../../ui/Navbar";

import { React, useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTable } from "react-table";

import NewItem from "../NewItem";
import ImageUploader from "./UploadImages";

import axios from "axios";
import path from "../../utils/path";

export default function ManageItem(props) {
    const state = useLocation().state;
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false)

    // useEffect(() => {
    //     axios
    //       .get(path.url + "api/item/user/" + state.ID)
    //       .then((res) => {
    //         setItems(res.data.map((
    //             {Name, Description}
    //         ) => ({Name, Description})))
    //         setLoading(false);
    //       })
    //       .catch((err) => {});
    // }, [])

    const data = useMemo(() => items, [items]);

    const columns = useMemo(
      () => [
        {
            Header: "Item Name",
            accessor: "Name",
        },
        {
            Header: "Item Description",
            accessor: "Description",
        },
      ],
      []
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
      useTable({ columns, data });

    return (
      <div className="ManageItem">
        <Navbar />
        <div className="bg-gray-100 w-screen h-screen">
          <div className="flex flex-col items-center justify-center h-full">
            {loading ? (
              <button
                disabled
                type="button"
                className="text-white bg-orange-500 hover:bg-orange-700 focus:ring-4 border-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 inline-flex items-center"
              >
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-4 h-4 mr-3 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
                Loading...
              </button>
            ) : (
              <div>
                {/* <table
                  {...getTableProps()}
                  className="w-9/12 text-sm text-left text-gray-500 mx-16 border-gray-700"
                >
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    {headerGroups.map((headerGroup) => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          <th
                            {...column.getHeaderProps()}
                            style={{
                              fontWeight: "bold",
                            }}
                          >
                            {column.render("Header")}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                      prepareRow(row);
                      return (
                        <tr
                          {...row.getRowProps()}
                          className="bg-white border-b border-gray-200 hover:bg-gray-100"
                        >
                          {row.cells.map((cell) => {
                            return (
                              <td {...cell.getCellProps()}>
                                {cell.render("Cell")}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table> */}
                <NewItem />
                {/* <ImageUploader /> */}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
}