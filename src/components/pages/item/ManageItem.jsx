import Footer from "../../ui/Footer";
import Navbar from "../../ui/Navbar";

import { React, useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTable } from "react-table";

import NewItem from "../NewItem";

import axios from "axios";
import path from "../../utils/path";

export default function ManageItem(props) {

    const location = useLocation();
    const state = location.state;

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios
          .get(path.url + "api/item/user/" + state.ID)
          .then((res) => {
            setItems(res.data.map((
                {Name, Description}
            ) => ({Name, Description})))
            setLoading(false);
          })
          .catch((err) => {});
    }, [])

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
            {/* <NewItem /> */}
            { loading ? (<div>Loading...</div>) : (
            <table {...getTableProps()} style={{ border: "solid 1px blue" }}>
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps()}
                        style={{
                          borderBottom: "solid 3px red",
                          background: "aliceblue",
                          color: "black",
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
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <td
                            {...cell.getCellProps()}
                            style={{
                              padding: "10px",
                              border: "solid 1px gray",
                              background: "papayawhip",
                            }}
                          >
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>)}
          </div>
        </div>
        <Footer />
      </div>
    );
}