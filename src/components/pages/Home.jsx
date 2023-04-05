import Footer from "../ui/Footer";
import Navbar from "../ui/Navbar";
import ItemCard from "../ui/ItemCard";

import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/item")
      .then((res) => {
        setItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        // console.log(err);
      });
  }, []);

  return (
    <div className="Home min-h-screen flex flex-col w-screen">
      <Navbar />
      <div className="bg-gray-100 h-screen">
        {/* div for items list */}
        <div className="flex flex-col items-center justify-center px-12 lg:px-32 py-12">
          {loading ? (
            <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 items-center justify-center gap-4">
              {[...Array(10)].map((x, i) => (
                <div role="status" className="max-w-sm animate-pulse m-6" key={i}>
                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                  <span className="sr-only">Loading...</span>
                </div>
              ))}
            </div>
          ) : (
            // For loop of items
            <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 items-center justify-center gap-4">
              {items.map((item) => (
                <ItemCard item={item} key={item.ID} className="m-2" />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
