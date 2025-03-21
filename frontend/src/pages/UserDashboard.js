// src/pages/UserDashboard.js
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useState } from "react";
import { motion } from "framer-motion";

const fetchUserBookings = async () => {
  const res = await axios.get("http://localhost:5000/api/bookings", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

const UserDashboard = () => {
  const queryClient = useQueryClient();
  const [editBooking, setEditBooking] = useState(null);

  const { data: bookings = [], isLoading } = useQuery("userBookings", fetchUserBookings);

  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  const mutation = useMutation(({ url, method, payload }) => axios[method](url, payload, { headers }), {
    onSuccess: () => {
      queryClient.invalidateQueries("userBookings");
      setEditBooking(null);
      alert("Changes saved");
    },
  });

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/bookings/${id}`, { headers });
    queryClient.invalidateQueries("userBookings");
    alert("Booking cancelled");
  };

  const renderModal = () => {
    if (!editBooking) return null;

    const handleChange = (e) => setEditBooking({ ...editBooking, [e.target.name]: e.target.value });

    const handleSave = () => {
      mutation.mutate({
        url: `http://localhost:5000/api/bookings/${editBooking.id}`,
        method: "put",
        payload: editBooking,
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Edit Booking</h2>
          <label className="block mb-1 font-medium text-sm">Date</label>
          <input name="date" type="date" value={editBooking.date} onChange={handleChange} className="w-full p-2 border rounded mb-3" />
          <label className="block mb-1 font-medium text-sm">Start Time</label>
          <input name="start_time" type="time" value={editBooking.start_time} onChange={handleChange} className="w-full p-2 border rounded mb-3" />
          <label className="block mb-1 font-medium text-sm">End Time</label>
          <input name="end_time" type="time" value={editBooking.end_time} onChange={handleChange} className="w-full p-2 border rounded mb-3" />
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setEditBooking(null)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              Cancel
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Save
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-8">
      <section
        className="relative rounded-xl overflow-hidden bg-cover bg-center mb-10"
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1610130840916-6b9a1e063be1?auto=format&fit=crop&w=1600&q=80)" }}
      >
        <div className="bg-black bg-opacity-50 p-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow mb-4">Welcome to SkyKick Futsal Arena</h1>
          <p className="text-white text-lg max-w-3xl">Premium turf. Easy booking. Great vibes. Reserve your slot and elevate your game at our world-class facility.</p>
        </div>
      </section>

      <h2 className="text-2xl font-semibold mb-6 text-gray-800">My Bookings</h2>
      {isLoading ? (
        <p className="text-gray-600">Loading your bookings...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((b) => (
            <motion.div key={b.id} whileHover={{ scale: 1.02 }} className="bg-white p-5 rounded-lg shadow border border-gray-200 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-blue-700 mb-2">Court: {b.court}</h3>
                <p className="text-gray-600 text-sm">Date: {b.date}</p>
                <p className="text-gray-600 text-sm">
                  Time: {b.start_time} - {b.end_time}
                </p>
                <p className="text-sm mt-1">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold ${b.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                  >
                    {b.status}
                  </span>
                </p>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setEditBooking(b)} className="px-4 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500">
                  Edit
                </button>
                <button onClick={() => handleDelete(b.id)} className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                  Cancel
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {renderModal()}
    </div>
  );
};

export default UserDashboard;
