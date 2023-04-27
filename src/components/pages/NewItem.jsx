import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import axios from "axios";
import path from "../utils/path";

export default function NewItem() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [image, setImage] = useState(null);
    const [userID, setUserID] = useState("");

    const state = useLocation().state;

    const handleSubmit = (event) => {
        setUserID(state.ID);
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("quantity", quantity);
        formData.append("image", image);
        formData.append("userID", userID);

        axios.post(path.url + "api/item/create", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }

    return (
      <div>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              name="description"
              autoComplete="off"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label>
            Price:
            <input
              type="number"
              name="price"
              autoComplete="off"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>
          <label>
            Quantity:
            <input
              type="number"
              name="quantity"
              autoComplete="off"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </label>
          <label>
            Image:
            <input
              type="file"
              name="image"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
}
    