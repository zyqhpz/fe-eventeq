export default function Footer () {
  // get the current year
  const year = new Date().getFullYear()

  return (
        <footer className="mt-auto bg-white rounded-lg shadow m-4 dark:bg-gray-800">
            <div className="w-full mx-auto container md:p-6 p-4 md:flex md:items-center md:justify-between">
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© {year} <a href="#" className="hover:underline">EventEQ™</a>. All Rights Reserved.
                </span>
                <span></span>
            </div>
        </footer>
  )
}
