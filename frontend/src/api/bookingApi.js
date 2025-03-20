import axios from "axios";

const API_URL = "http://localhost:5000/api/bookings";

export const fetchBookingsForDate = async (date) => {
  const response = await axios.get(`${API_URL}?date=${date}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};

export const bookCourt = async (data) => {
  const response = await axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};
