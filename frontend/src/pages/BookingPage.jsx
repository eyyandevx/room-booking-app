import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function BookingPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRoom();
  }, []);

  const fetchRoom = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoom(response.data);
    } catch (error) {
      setError('Failed to load room details');
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!checkInDate || !checkOutDate) {
      setError('Please select both check-in and check-out dates');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/bookings',
        {
          roomId,
          checkInDate,
          checkOutDate,
          numberOfGuests: guests,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Booking confirmed! Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (!room) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  const calculateTotal = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const days = Math.ceil(
      (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
    );
    return days * room.price;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button onClick={() => navigate('/dashboard')} className="text-blue-600 hover:underline">
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Room Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{room.name}</h1>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-64 rounded-lg mb-4"></div>
            <p className="text-gray-600 mb-4">{room.description}</p>
            <div className="space-y-2">
              <p className="text-lg">
                <span className="font-semibold">Price:</span> Rs. {room.price}/night
              </p>
              <p className="text-lg">
                <span className="font-semibold">Type:</span> {room.type}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Capacity:</span> {room.capacity} people
              </p>
              <p className="text-lg">
                <span className="font-semibold">City:</span> {room.city}
              </p>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Booking</h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Check-in Date</label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Check-out Date</label>
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Number of Guests</label>
                <input
                  type="number"
                  min="1"
                  max={room.capacity}
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span>Price per night:</span>
                  <span>Rs. {room.price}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Number of nights:</span>
                  <span>
                    {checkInDate && checkOutDate
                      ? Math.ceil(
                          (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
                        )
                      : 0}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>Rs. {calculateTotal()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
