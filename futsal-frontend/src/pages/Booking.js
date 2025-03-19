import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useQuery, useMutation } from "react-query";
import { fetchBookingsForDate, bookCourt } from "../api/bookingApi";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Booking = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);

  const { data: bookings, refetch } = useQuery(["bookings", selectedDate], () => fetchBookingsForDate(selectedDate.toISOString().split("T")[0]), { enabled: !!selectedDate });

  useEffect(() => {
    if (bookings) {
      const allSlots = [
        "08:00 - 09:00",
        "09:00 - 10:00",
        "10:00 - 11:00",
        "11:00 - 12:00",
        "12:00 - 13:00",
        "13:00 - 14:00",
        "14:00 - 15:00",
        "15:00 - 16:00",
        "16:00 - 17:00",
        "17:00 - 18:00",
        "18:00 - 19:00",
      ];
      const bookedSlots = bookings.map((b) => `${b.start_time} - ${b.end_time}`);
      setAvailableSlots(allSlots.filter((slot) => !bookedSlots.includes(slot)));
    }
  }, [bookings]);

  useEffect(() => {
    socket.on("update-availability", () => {
      refetch();
    });
  }, [refetch]);

  const mutation = useMutation(bookCourt, {
    onSuccess: () => {
      alert("Booking successful!");
      socket.emit("new-booking");
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Booking failed");
    },
  });

  const handleBooking = () => {
    if (!selectedSlot) {
      alert("Please select a slot");
      return;
    }

    const [start_time, end_time] = selectedSlot.split(" - ");
    mutation.mutate({
      court_id: 1,
      date: selectedDate.toISOString().split("T")[0],
      start_time,
      end_time,
    });
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-center mb-4">Book a Court</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium">Select Date:</label>
          <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} dateFormat="yyyy-MM-dd" className="w-full p-2 border rounded-lg" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Select Time Slot:</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {availableSlots.length > 0 ? (
              availableSlots.map((slot, index) => (
                <button key={index} className={`p-2 border rounded-lg ${selectedSlot === slot ? "bg-blue-600 text-white" : "bg-gray-100"}`} onClick={() => setSelectedSlot(slot)}>
                  {slot}
                </button>
              ))
            ) : (
              <p className="text-red-500">No slots available</p>
            )}
          </div>
        </div>

        <button onClick={handleBooking} className="w-full bg-green-600 text-white p-2 rounded-lg">
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default Booking;
