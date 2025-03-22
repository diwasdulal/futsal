import { useSearchParams } from "react-router-dom";
import { useKhalti } from "../hooks/useKhalti";
import { useEffect, useState } from "react";
import axios from "axios";

const PaymentForm = () => {
  const [params] = useSearchParams();
  const bookingId = params.get("bookingId");
  const amount = parseInt(params.get("amount"), 10);
  const { initiate } = useKhalti();

  const [user, setUser] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser(res.data);
      } catch (error) {
        console.error("Failed to load user info", error);
      }
    };

    fetchUser();
  }, []);

  const handlePayment = () => {
    initiate({
      amount,
      purchase_order_id: bookingId,
      purchase_order_name: "Court Booking",
      return_url: "http://localhost:3000/success",
      website_url: "http://localhost:3000",
      customer_info: {
        name: user.name || "Guest",
        email: user.email || "guest@example.com",
        phone: user.phone || "9800000000",
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="bg-white shadow-lg p-6 rounded-xl max-w-md text-center">
        <h2 className="text-xl font-semibold mb-4">Complete Payment</h2>
        <p className="mb-6 text-gray-600">Click below to complete your booking payment with Khalti.</p>
        <button onClick={handlePayment} className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;
