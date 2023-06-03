import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

export default function SearchBar () {
  return (
      <div className="flex items-center border-2 border-grey-300 rounded-lg h-10">
        <input
          type="text"
          className="border-none rounded-l-lg pl-4 h-full w-full"
          placeholder="What to rent?"
          autoComplete="off"
        />
        <button className="px-2 rounded-none rounded-r-lg h-full">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="px-2" />
        </button>
      </div>
  )
};
