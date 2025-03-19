import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import tt from '@tomtom-international/web-sdk-maps'
import 'bootstrap-icons/font/bootstrap-icons.css'
import space from '../../assets/space.jpg'
import pic from '../../assets/pic.jpg'
import pic2 from '../../assets/pic2.jpg'
import pic3 from '../../assets/pic3.jpg'
import item from '../../assets/item.jpeg'
import item2 from '../../assets/item2.jpeg'
import item3 from '../../assets/item3.jpeg'
import item4 from '../../assets/item4.jpeg'
import item5 from '../../assets/item5.jpeg'
import item6 from '../../assets/item6.jpeg'
import item7 from '../../assets/item7.jpeg'

// Sample items (replace with API data later)
const sampleItems = [
  { id: 1, img: item, name: 'Item 1' },
  { id: 2, img: item2, name: 'Item 2' },
  { id: 3, img: item3, name: 'Item 3' },
  { id: 4, img: item4, name: 'Item 4' },
  { id: 5, img: item5, name: 'Item 5' },
  { id: 6, img: item6, name: 'Item 6' },
  { id: 7, img: item7, name: 'Item 7' },
]

function Home() {
  const [items, setItems] = useState(sampleItems) // Default to sample items
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('ALL') // Tab state

  useEffect(() => {
    // Fetch items from Django API
    axios
      .get(`${import.meta.env.VITE_API_URL}/items/`)
      .then((response) => {
        setItems(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching items:', error)
        setLoading(false)
      })

    // Initialize TomTom Map
    const mapElement = document.getElementById('map')
    if (!mapElement) return

    const map = tt.map({
      key: `${import.meta.env.VITE_TOMTOM_API_KEY}`, // Your TomTom API Key
      container: 'map',
      center: [-74.006, 40.7128], // New York coordinates
      zoom: 10,
    })

    map.addControl(new tt.FullscreenControl())
    map.addControl(new tt.NavigationControl())

    return () => map.remove() // Cleanup
  }, [])

  const handleTabChange = (tab) => setActiveTab(tab)

  return (
    <div id="home" className="w-full h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <nav className="bg-black text-white p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <img
              src={pic2}
              alt="User"
              className="w-10 h-10 rounded-full outline-1 outline-white p-0.5"
            />
            <span className="ml-2.5">Esmeralda Ruby</span>
          </div>
          <ul className="flex space-x-6">
            {['Direction', 'Favourite', 'History', 'Saved'].map((action) => (
              <li
                key={action}
                className={`px-4 py-2 rounded-md cursor-pointer hover:bg-gray-700 ${action === 'Direction' ? 'bg-gray-600' : ''}`}
              >
                <i
                  className={`bi bi-${action.toLowerCase() === 'direction' ? 'geo-alt-fill' : action.toLowerCase() === 'favourite' ? 'heart-fill' : action.toLowerCase() === 'history' ? 'clock-history' : 'floppy-fill'}`}
                ></i>
                <span className="ml-2">{action}</span>
              </li>
            ))}
          </ul>
        </div>
        <ul className="flex bg-gray-600 rounded-md">
          {['bell-fill', 'chat-left-dots-fill', 'gear'].map((icon) => (
            <li
              key={icon}
              className="p-4 cursor-pointer hover:bg-gray-500 rounded-md"
            >
              <i className={`bi bi-${icon}`}></i>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-20 p-4 bg-white flex flex-col items-center justify-between border-r border-gray-300">
          {[pic, pic2, pic3].map((src, idx) => (
            <Link key={idx} to={`/profile/${idx + 1}`} className="my-6">
              <img
                src={src}
                alt={`User ${idx + 1}`}
                className="w-10 h-10 rounded-full outline-1 outline-gray-300 p-0.5 hover:scale-110 transition-transform"
              />
            </Link>
          ))}
          <Link to="/logout" className="text-gray-600 hover:text-black">
            <i className="bi bi-box-arrow-left text-xl"></i>
          </Link>
        </aside>

        {/* Map Section */}
        <section className="w-2/3 relative">
          <div id="map" className="w-full h-full"></div>
          {/* Floating Controls (Uncomment if needed) */}
          <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded-xl shadow-lg">
            <p className="font-bold">Route Info</p>
            <ul className="mt-2 space-y-2">
              <li>Distance: 4.4 km</li>
              <li>Remaining: 2.4 km</li>
              <li>Time: 40 min</li>
            </ul>
          </div>

          <ul className="grid grid-rows-2 mr-10 gap-2">
            <li className=" text-black items-center ml-4 py-1 px-2 font-extrabold text-2xl cursor-pointer absolute top-4 right-4 z-10 bg-white p-4 rounded-xl shadow-lg">
              <i className="bi bi-map"></i>
            </li>
            <li className="text-black items-center ml-4 py-1 px-2 font-extrabold text-2xl cursor-pointer absolute top-16 right-4 z-10 bg-white p-4 rounded-xl shadow-lg">
              <i className="bi bi-crosshair"></i>
            </li>
          </ul>
        </section>

        {/* Toolbar Section */}
        <section className="w-1/3 p-6 bg-white overflow-y-auto">
          <div className="mb-6">
            <img
              src={space}
              alt="Area Overview"
              className="w-full rounded-t-2xl shadow-md"
            />
            <div className="bg-gray-200 p-4 rounded-b-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <img
                    src={pic}
                    alt="Restaurant"
                    className="w-10 h-10 rounded-full outline-1 outline-gray-300 p-0.5"
                  />
                  <span className="ml-2 font-bold">Restaurant</span>
                </div>
                <div className="flex space-x-4">
                  <span>
                    <i className="bi bi-alarm text-orange-600"></i> 10:00 AM
                  </span>
                  <span>
                    <i className="bi bi-star text-orange-600"></i> 4.8
                  </span>
                </div>
              </div>
              <p className="text-gray-500 mt-1">
                Sophi Nowakowska, Zabiniec 12/222
              </p>
            </div>
          </div>

          {/* Tabs */}
          <ul className="flex justify-around bg-gray-200 rounded-full p-2 mb-6 text-sm">
            {['ALL', 'MENU', 'REVIEW'].map((tab) => (
              <li
                key={tab}
                className={`px-4 py-2 rounded-full cursor-pointer ${activeTab === tab ? 'bg-white shadow' : 'hover:bg-gray-300'}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </li>
            ))}
          </ul>

          {/* Items Grid */}
          {loading ? (
            <p className="text-center text-gray-500">Loading items...</p>
          ) : (
            <ul className="grid grid-cols-3 gap-4">
              {items.map((item) => (
                <li key={item.id}>
                  <Link to={`/items/${item.id}`}>
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-24 object-cover rounded-lg hover:scale-105 transition-transform"
                    />
                    <p className="text-center text-sm mt-1">{item.name}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* Direction button */}
          <button className="bg-orange-600 w-full p-4 my-8 text-white text-center rounded-xl shadow-orange-600/60 shadow-lg cursor-pointer">
            See Direction <i className="bi bi-arrow-right mx-3"></i>
          </button>
        </section>
      </div>
    </div>
  )
}

export default Home
