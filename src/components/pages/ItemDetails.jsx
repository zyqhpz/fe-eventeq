import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";

import path from "../utils/path";

export default function ItemDetails() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        axios
        .get(path.url + "api/item/" + id)
        .then((response) => {
            setItem(response.data);
            setLoading(false);
        })
        .catch((error) => console.error(error));
    }, []);

    // var formattedDate = new Date(item.CreatedAt).toLocaleDateString("en-MY", {
    //     year: "numeric",
    //     month: "long",
    //     day: "numeric",
    // });

    // var imagePath = "http://localhost:8080/api/item/image/" + item.Image;
    
    return (
      <div>
        {loading ? (
          <p>Loading item...</p>
        ) : (
          <div>
            <h1>{item.Name}</h1>
            <p>{item.Description}</p>
            <p>{item.Price}</p>
            <p>{item.Images.length}</p>
            {/* <p>{item.ategory}</p> */}
            {/* <p>{item.location}</p> */}
            {/* <p>{item.contact}</p> */}
            {/* <p>{formattedDate}</p> */}
            {/* <p>{item.Image}</p> */}
            {/* <img
              className="w-72"
              src={path.url + "api/item/image/" + item.Images}
              alt="item image"
            /> */}
            {
              item.Images.map((image) => (
                <img
                  className="w-72"
                  src={path.url + "api/item/image/" + image}
                  alt="item image"
                />
              ))
            }
          </div>
        )}
      </div>
    );
}