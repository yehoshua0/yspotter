import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import tt from '@tomtom-international/web-sdk-maps'
import 'bootstrap-icons/font/bootstrap-icons.css'
import pic from '../../assets/pic2.jpg'
import pic2 from '../../assets/pic3.jpg'
import { ACCESS_TOKEN, REFRESH_TOKEN } from './../../constants'
import api from './../../api'

function Home() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const username = localStorage.getItem('user')

  const mapRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    console.log(loading)
    axios
      .get(`${import.meta.env.VITE_API_URL}api/users/`)
      .then((response) => {
        setUsers(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching users:', error)
        setLoading(false)
      })

    // Initialize TomTom Map
    const mapElement = document.getElementById('map')
    if (!mapElement) return

    mapRef.current = tt.map({
      key: import.meta.env.VITE_TOMTOM_API_KEY,
      container: 'map',
      center: [-74.006, 40.7128], // New York coordinates
      zoom: 13,
    })

    // mapRef.current.addControl(new tt.FullscreenControl())
    // mapRef.current.addControl(new tt.NavigationControl())

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          console.log(latitude, longitude)

          if (mapRef.current) {
            mapRef.current.flyTo({
              center: [longitude, latitude],
              zoom: 10,
            })

            new tt.Marker()
              .setLngLat([longitude, latitude])
              .addTo(mapRef.current)
          }
        },
        (error) => {
          console.error('Error getting location:', error)
        },
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }

  const handleNavLink = (todo) => {
    switch (todo) {
      case 'Direction':
        alert('Direction')
        break
      case 'Favourite':
        alert('Favourite [IN DEVELOPMENT]')
        break
      case 'History':
        alert('History [IN DEVELOPMENT]')
        break
      case 'Saved':
        alert('Saved [IN DEVELOPMENT]')
        break
      default:
        break
    }
  }

  const handleNavAction = (todo) => {
    switch (todo) {
      case 'bell-fill':
        alert('Notifications [IN DEVELOPMENT]')
        break
      case 'chat-left-dots-fill':
        alert('Messages [IN DEVELOPMENT]')
        break
      case 'gear':
        alert('Settings [IN DEVELOPMENT]')
        break
      default:
        break
    }
  }

  const handleSeeDirection = async (e) => {
    e.preventDefault()

    // Get different values
    const name = document.getElementById('name').value
    const description = document.getElementById('description').value
    const curr_location = document.getElementById('curr_location').value
    const pick_location = document.getElementById('pick_location').value
    const drop_location = document.getElementById('drop_location').value
    const curr_cycle = document.getElementById('curr_cycle').value
    console.log(
      name,
      description,
      curr_location,
      pick_location,
      drop_location,
      curr_cycle,
      username,
    )

    // Print route using TOMTOM API

    // Add your create trip logic here (e.g., API call)
    try {
      const res = await api.post('/api/trips/', {
        name,
        description,
        current_location: curr_location, // Adjust keys to match API expectations
        pickup_location: pick_location,
        dropoff_location: drop_location,
        current_cycle: curr_cycle,
        username,
      })

      // Store tokens if returned by the API
      if (res.data.access && res.data.refresh) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access)
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
      }

      navigate('/') // Redirect to home
    } catch (error) {
      // Improved error handling
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'An error occurred while creating the trip.'
      alert(errorMessage) // Or use a toast library for better UX
      console.error('Trip creation failed:', error)
    } finally {
      setLoading(false) // Reset loading state
    }
  }

  //TODO: Toggle between satellite and vector view
  const changeLayerView = () => {
    alert('FUTURE VERSION: THIS FEATURE IS ALWAYS UNDER DEVELOPMENT')
  }

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
            <span className="ml-2.5">{username}</span>
          </div>
          <ul className="flex space-x-6">
            {['Direction', 'Favourite', 'History', 'Saved'].map((action) => (
              <li
                key={action}
                className={`px-4 py-2 rounded-md cursor-pointer hover:bg-gray-700 ${action === 'Direction' ? 'bg-gray-600' : ''}`}
                onClick={() => handleNavLink(action)}
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
              onClick={() => handleNavAction(icon)}
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
          {users.map(({ idx, username }) => (
            <Link key={idx} to={`/profile/${username}`} className="my-6">
              <img
                src={pic}
                alt={`${username} profile picture`}
                title={`${username}`}
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
              <li>
                Distance: <span id="distance">---</span> km
              </li>
              <li>
                Remaining: <span id="remaining">---</span> km
              </li>
              <li>
                Time: <span id="time">---</span> min
              </li>
            </ul>
          </div>

          <ul className="grid grid-rows-2 mr-10 gap-2">
            <li
              onClick={changeLayerView}
              title="Change layer view"
              className=" text-black items-center ml-4 py-1 px-2 font-extrabold text-2xl cursor-pointer absolute top-4 right-4 z-10 bg-white p-4 rounded-xl shadow-lg"
            >
              <i className="bi bi-map"></i>
            </li>
            <li
              onClick={getCurrentPosition}
              title="Get current position"
              className="text-black items-center ml-4 py-1 px-2 font-extrabold text-2xl cursor-pointer absolute top-16 right-4 z-10 bg-white p-4 rounded-xl shadow-lg"
            >
              <i className="bi bi-crosshair"></i>
            </li>
          </ul>
        </section>

        {/* Toolbar Section */}
        <section className="w-1/3 p-6 bg-white overflow-y-auto">
          {/* Driver details */}
          <div className="mb-6">
            <div className="bg-gray-200 p-4 rounded-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <img
                    src={pic}
                    alt="Trip Icon"
                    className="w-10 h-10 rounded-full outline-1 outline-gray-300 p-0.5"
                  />
                  <span className="ml-2 font-bold">Driver name</span>
                </div>
                <div className="flex space-x-4">
                  <span>
                    <i className="bi bi-alarm text-orange-600"></i> 10:00 AM
                  </span>
                </div>
              </div>
              <p className="text-gray-500 mt-1">Driver main information</p>
            </div>
          </div>

          {/* Editable Trip Details Form */}
          <form className="bg-gray-100 p-4 rounded-2xl mb-6">
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                defaultValue="Untitled trip"
                className="text-sm text-gray-600 bg-white w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Description
              </label>
              <input
                id="description"
                type="text"
                defaultValue="Description of the trip"
                maxLength={100}
                className="text-sm text-gray-600 bg-white w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Current Location
              </label>
              <input
                id="curr_location"
                type="text"
                defaultValue="Zabiniec 12/222, Sophi Nowakowska"
                className="text-sm text-gray-600 bg-white w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Pickup Location
              </label>
              <input
                id="pick_location"
                type="text"
                defaultValue="Restaurant, Zabiniec 12/222"
                className="text-sm text-gray-600 bg-white w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Dropoff Location
              </label>
              <input
                id="drop_location"
                type="text"
                defaultValue="Central Station, Krakow 15"
                className="text-sm text-gray-600 bg-white w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Current Cycle Used (Hrs)
              </label>
              <input
                type="number"
                id="curr_cycle"
                defaultValue="1.5"
                step="0.1"
                className="text-sm text-gray-600 bg-white w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>

            {/* Direction button */}
            <button
              type="submit"
              onClick={(e) => handleSeeDirection(e)}
              className="bg-orange-600 w-full p-4 my-4 text-white text-center rounded-xl shadow-orange-600/60 shadow-lg cursor-pointer"
            >
              See Direction <i className="bi bi-arrow-right mx-3"></i>
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

export default Home
