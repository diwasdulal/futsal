import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Activity, Pencil, Trash, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Custom components
const Button = ({ children, variant = "primary", onClick, className = "", disabled = false }) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2";
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
    danger: "bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700",
    outline: "border border-gray-300 hover:border-indigo-500 hover:text-indigo-600",
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}>
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }) => <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 ${className}`}>{children}</div>;

const Badge = ({ status }) => {
  const variants = {
    confirmed: "bg-green-50 text-green-700 border border-green-200",
    pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    cancelled: "bg-red-50 text-red-700 border border-red-200",
  };

  return <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${variants[status] || variants.pending}`}>{status}</span>;
};

// Main component
const UserDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editBooking, setEditBooking] = useState(null);
  const [activeTab, setActiveTab] = useState("bookings");

  const { data: bookings = [], isLoading } = useQuery("userBookings", fetchUserBookings);

  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  const mutation = useMutation(({ url, method, payload }) => axios[method](url, payload, { headers }), {
    onSuccess: () => {
      queryClient.invalidateQueries("userBookings");
      setEditBooking(null);
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Your booking has been updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    },
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to cancel this booking.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    });

    if (result.isConfirmed) {
      await axios.delete(`http://localhost:5000/api/bookings/${id}`, { headers });
      queryClient.invalidateQueries("userBookings");
      Swal.fire("Cancelled!", "Your booking has been cancelled.", "success");
    }
  };

  async function fetchUserBookings() {
    const res = await axios.get("http://localhost:5000/api/bookings", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data;
  }

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
      <AnimatePresence>
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="bg-indigo-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Modify Booking Details</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="date"
                      type="date"
                      value={editBooking.date}
                      onChange={handleChange}
                      className="pl-10 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="start_time"
                      type="time"
                      value={editBooking.start_time}
                      onChange={handleChange}
                      className="pl-10 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="end_time"
                      type="time"
                      value={editBooking.end_time}
                      onChange={handleChange}
                      className="pl-10 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setEditBooking(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  };

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="bg-indigo-50 inline-flex p-3 rounded-full mb-4">
        <Calendar className="h-6 w-6 text-indigo-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">No bookings found</h3>
      <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">You haven't made any bookings yet. Book a court to get started with your futsal journey!</p>
      <Button onClick={() => navigate("/booking")}>Book a Court</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-indigo-800">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-30"
            src="https://images.unsplash.com/photo-1552879935-4c5d3895ddfd?auto=format&fit=crop&w=1600&q=80"
            alt="Futsal pitch"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-800 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">Welcome to SkyKick Futsal</h1>
          <p className="mt-3 max-w-md text-lg text-indigo-200 sm:text-xl md:mt-5 md:max-w-3xl">Elevate your game with our premium facilities and seamless booking experience.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("bookings")}
              className={`${
                activeTab === "bookings" ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              My Bookings
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`${
                activeTab === "profile" ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              Profile
            </button>
          </nav>
        </div>

        {activeTab === "bookings" && (
          <>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Your Bookings</h2>
              <Button onClick={() => navigate("/booking")}>
                <PlusCircle className="h-4 w-4" />
                <span>New Booking</span>
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : bookings.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((booking) => (
                  <motion.div key={booking.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <Card>
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-indigo-50 p-2 rounded-lg">
                          <Activity className="h-6 w-6 text-indigo-600" />
                        </div>
                        <Badge status={booking.status} />
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-2">Court {booking.court}</h3>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{booking.date}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          <span>
                            {booking.start_time} - {booking.end_time}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                        <Button variant="outline" className="flex-1" onClick={() => setEditBooking(booking)}>
                          <Pencil className="h-4 w-4" />
                          <span>Edit</span>
                        </Button>

                        <Button variant="danger" className="flex-1" onClick={() => handleDelete(booking.id)}>
                          <Trash className="h-4 w-4" />
                          <span>Cancel</span>
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "profile" && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500">Your profile information and account settings would appear here.</p>
            </div>
          </div>
        )}
      </div>

      {renderModal()}
    </div>
  );
};

export default UserDashboard;
