import Navbar from "../ui/Navbar";

function Home() {
  return (
    <div className="Home">
      <Navbar />
      <div className="bg-gray-100 w-screen h-screen">
        <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl font-bold text-gray-800">Home</h1>

            <p className="text-gray-600">This is the home page</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
