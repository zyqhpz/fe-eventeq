import Footer from "../ui/Footer";
import Navbar from "../ui/Navbar";
import ItemCard from "../ui/ItemCard";

function Home() {

  const items = [
    {
      id: 1,
      name: "Item 1",
      price: 10,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
      owner: "Johnny",
    },
    {
      id: 2,
      name: "Item 2",
      price: 20,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
      owner: "Jason",
    },
    {
      id: 2,
      name: "Item 2",
      price: 20,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
      owner: "Jason",
    },
    {
      id: 2,
      name: "Item 2",
      price: 20,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
      owner: "Jason",
    },
    {
      id: 2,
      name: "Item 2",
      price: 20,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
      owner: "Jason",
    },
    {
      id: 2,
      name: "Item 2",
      price: 20,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
      owner: "Jason",
    },
    {
      id: 2,
      name: "Item 2",
      price: 20,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
      owner: "Jason",
    },
  ];

  return (
    <div className="Home min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-gray-100 h-screen">
        {/* div for items list */}
        <div className="flex flex-col items-center justify-center px-12 lg:px-32 py-12">
          {/* For loop of items */}
          <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 items-center justify-center gap-4">
            {items.map((item) => (
              <ItemCard item={item} key={item.id} className="m-2" />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
