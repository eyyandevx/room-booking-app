import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PAKISTAN_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Multan',
  'Peshawar',
  'Quetta',
  'Faisalabad',
];

export default function DashboardPage() {
  const [selectedCity, setSelectedCity] = useState('Karachi');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    fetchRooms('Karachi');
  }, []);

  const fetchRooms = async (city) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/rooms?city=${city}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    fetchRooms(city);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">RoomBook</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* City Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Select a City</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PAKISTAN_CITIES.map((city) => (
              <button
                key={city}
                onClick={() => handleCityChange(city)}
                className={`py-3 px-4 rounded-lg font-semibold transition ${
                  selectedCity === city
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Available Rooms */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Available Rooms in {selectedCity}
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading rooms...</p>
            </div>
          ) : rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-48"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{room.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{room.description}</p>
                    <div className="space-y-2 mb-4">
                      <p className="text-gray-700">
                        <span className="font-semibold">Price:</span> Rs. {room.price}/night
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Type:</span> {room.type}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Capacity:</span> {room.capacity} people
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Status:</span>{' '}
                        <span
                          className={`${
                            room.available
                              ? 'text-green-600 font-semibold'
                              : 'text-red-600 font-semibold'
                          }`}
                        >
                          {room.available ? 'Available' : 'Booked'}
                        </span>
                      </p>
                    </div>
                    {room.available && (
                      <button
                        onClick={() => navigate(`/booking/${room._id}`)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition"
                      >
                        Book Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No rooms available in {selectedCity} right now.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
