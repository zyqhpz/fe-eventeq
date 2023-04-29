import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import axios from "axios";
import path from "../utils/path";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

export default function NewItem() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [selectedImages, setSelectedImages] = useState([]);
    const [images, setImages] = useState([]);
    const [userID, setUserID] = useState("");

    const state = useLocation().state;

    const handleSubmit = async (event) => {
        setUserID(state.ID);
        event.preventDefault();
        const formData = new FormData();
        formData.append("userID", userID);
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("quantity", quantity);
        formData.append("imagesCount", selectedImages.length);
        images.forEach(async (image, index) => {
          // const compressedImage = await compressImage(image);
          // formData.append(`images-${index}`, compressedImage);\
          formData.append(`images-${index}`, image);
        });

        console.log(images)

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

    const onSelectFile = (event) => {
      const selectedFiles = event.target.files;
      const selectedFilesArray = Array.from(selectedFiles);

      const imagesArray = selectedFilesArray.map((file) => {
        return URL.createObjectURL(file);
      });

      setImages((previousImages) =>
        previousImages.concat(selectedFilesArray)
      );
      setSelectedImages((previousImages) =>
        previousImages.concat(imagesArray)
      );

      // FOR BUG IN CHROME
      event.target.value = "";
    };

    function deleteHandler(image) {
      setSelectedImages(selectedImages.filter((e) => e !== image));
      URL.revokeObjectURL(image);
    }

    const compressImage = (file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const MAX_WIDTH = 800;
            let width = img.width;
            let height = img.height;
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
              (blob) => {
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              },
              file.type,
              0.7
            );
          };
        };
      });
    };

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
          <label
            htmlFor="file-upload"
            className="relative block w-full h-48 mt-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
          >
            Image:
            <div className="absolute top-0 left-0 w-full h-full opacity-0"></div>
            <div className="flex flex-col items-center justify-center w-full h-full bg-gray-200 hover:bg-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <p className="mt-1 text-sm text-gray-600">
                Drag and drop or click to add images
              </p>
            </div>
            <input
              type="file"
              id="file-upload"
              className="absolute top-0 left-0 w-full h-full opacity-0"
              accept="image/png,image/jpeg,image/webp"
              name="images"
              multiple
              onChange={onSelectFile}
            />
          </label>
          <input type="submit" className="bg-blue-400 p-12" value="Add Images" />
          {/* <input type="submit" value="Submit" /> */}
        </form>
        <br />
        {selectedImages.length > 0 &&
          (selectedImages.length > 10 ? (
            <p className="error">
              You can't upload more than 10 images! <br />
              <span>
                please delete <b> {selectedImages.length - 10} </b> of them{" "}
              </span>
            </p>
          ) : (
            <button
              className="upload-btn"
              onClick={() => {
                console.log(selectedImages);
              }}
            >
              UPLOAD {selectedImages.length} IMAGE
              {selectedImages.length === 1 ? "" : "S"}
            </button>
          ))}
        <div className="images flex gap-2">
          {selectedImages &&
            selectedImages.map((image, index) => {
              return (
                <div key={image} className="image w-32 h-32">
                  <img src={image} height="200" alt="upload" />
                  <button
                    onClick={() => deleteHandler(image)}
                    className="disabled:pointer-events-none w-6 h-6 rounded-full"
                  >
                    {/* delete image */}
                    <FontAwesomeIcon
                      icon={faCircleXmark}
                      className="text-red-500 w-full h-full"
                    />
                  </button>
                  {/* <p>{index + 1}</p> */}
                </div>
              );
            })}
        </div>
      </div>
    );
}
    