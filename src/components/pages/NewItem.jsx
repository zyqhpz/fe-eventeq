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
    const [loading, setLoading] = useState(false);

    const state = useLocation().state;

    const handleSubmit = async (event) => {
        setLoading(true)
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
          const compressedImage = await compressImage(image);
          formData.append(`images-${index}`, compressedImage);
        });

        console.log(images)

        // set interval to 2 seconds
        const interval = setInterval(() => {
          if (selectedImages.length === images.length) {
            clearInterval(interval);
            axios
              .post(path.url + "api/item/create", formData, {
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
            setLoading(false);
          }
        }, 2000);
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
      const index = images.findIndex((e) => e.name === image.name);
      const newImages = [...images];
      newImages.splice(index, 1);
      setImages(newImages);
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
        <div>
          <form onSubmit={handleSubmit} className="gap-2">
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
            <input
              type="submit"
              className="bg-orange-400 hover:bg-orange-500 border-orange-800 border-2 border-opacity-30 p-4 m-auto block mt-4 rounded-lg text-white font-bold"
              value="Add new item"
            />
          </form>
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-gray-400 opacity-50 z-40"></div>
              <button
                disabled
                type="button"
                className="text-white bg-orange-500 border-orange-800 border-2 border-opacity-40 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 inline-flex items-center inset-0 z-50"
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
                Processing..
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>
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
    