import Footer from "../../ui/Footer";
import Navbar from "../../ui/Navbar";

import { React, useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTable } from "react-table";

import NewItem from "../NewItem";
import ImageUploader from "./UploadImages";

import axios from "axios";
import path from "../../utils/path";
import LoadingButton from "../../ui/LoadingButton";

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
              <LoadingButton />
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