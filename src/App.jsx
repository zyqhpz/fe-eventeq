import { useState } from "react";
// import "./App.css";
// import API from "./api.js";

async function getData() {
  const response = await fetch(API.books);
  const res = await response.json();
  console.log(res);
}

var data = {
  id: "4",
  title: "The Great Gatsby",
  author: "F. Scott Fitzgerald",
  quantity: 7,
};

async function postData() {
  await fetch(API.books, {
    method: "POST",
    Accept: "application/json",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(function (response) {
      console.log(response);
    })
    .then(function (data) {
      console.log("Success:", data);
    })
    .catch(function (error) {
      console.error("Error:", error);
    });
}

function App() {
  getData();

  return (
    <div className="App">
      <form className="mx-auto flex-1">
        <div>
          <label className="text-2xl font-bold mx-3" htmlFor="book_title">
            Title
          </label>
          <input type="text" id="book_title" name="book_title" />
        </div>
        <div>
          <label
            className="text-2xl font-bold mx-3 rounded-md"
            htmlFor="book_author"
          >
            Author
          </label>
          <input type="text" id="book_author" name="book_author" />
        </div>
        {/* add input field that accept only integer numbers. use range */}
        <div>
          <label className="text-2xl font-bold mx-3" htmlFor="book_quantity">
            Quantity
          </label>
          <input
            type="number"
            id="book_quantity"
            name="book_quantity"
            min={0}
            max={100}
          />
        </div>

        <button className="m-3 bg-blue-600" type="submit">
          Add New
        </button>
      </form>
      <div>
        <button className="mx-2 bg-green-500" type="button" onClick={postData}>
          Send JSON
        </button>
      </div>
    </div>
  );
}

export default App;
