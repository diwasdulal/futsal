// src/pages/AdminPanel.js
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useState } from "react";

const fetchData = (url) =>
  axios
    .get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => res.data);

const AdminPanel = () => {
  const [tab, setTab] = useState("users");
  const [editItem, setEditItem] = useState(null);
  const [newItem, setNewItem] = useState({});
  const queryClient = useQueryClient();

  const { data: users = [] } = useQuery("users", () => fetchData("http://localhost:5000/api/users"));
  const { data: courts = [] } = useQuery("courts", () => fetchData("http://localhost:5000/api/courts"));
  const { data: bookings = [] } = useQuery("bookings", () => fetchData("http://localhost:5000/api/bookings/admin"));
  const { data: tournaments = [] } = useQuery("tournaments", () => fetchData("http://localhost:5000/api/tournaments"));

  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  const deleteItem = async (id) => {
    const endpoints = {
      users: `http://localhost:5000/api/users/${id}`,
      courts: `http://localhost:5000/api/courts/${id}`,
      bookings: `http://localhost:5000/api/bookings/${id}`,
      tournaments: `http://localhost:5000/api/tournaments/${id}`,
    };
    if (endpoints[tab]) {
      await axios.delete(endpoints[tab], { headers });
      queryClient.invalidateQueries(tab);
      alert("Deleted successfully");
    }
  };

  const mutation = useMutation(({ url, method, payload }) => axios[method](url, payload, { headers }), {
    onSuccess: () => {
      queryClient.invalidateQueries(tab);
      setEditItem(null);
      setNewItem({});
      alert("Saved successfully");
    },
  });

  const currentData = { users, courts, bookings, tournaments }[tab];

  const renderTable = (items) => (
    <table className="w-full table-auto border">
      <thead>
        <tr className="bg-gray-200">
          {Object.keys(items[0] || {}).map((key) => (
            <th key={key} className="px-4 py-2">
              {key}
            </th>
          ))}
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} className="border-t">
            {Object.keys(item).map((key) => (
              <td key={key} className="px-4 py-2">
                {item[key]}
              </td>
            ))}
            <td className="px-4 py-2 space-x-2">
              <button onClick={() => setEditItem(item)} className="px-2 py-1 bg-yellow-400 text-white rounded">
                Edit
              </button>
              <button onClick={() => deleteItem(item.id)} className="px-2 py-1 bg-red-600 text-white rounded">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderCreateForm = () => {
    const handleChange = (e) => setNewItem({ ...newItem, [e.target.name]: e.target.value });

    const handleSubmit = () => {
      const urlMap = {
        users: "http://localhost:5000/api/users",
        courts: "http://localhost:5000/api/courts",
        bookings: "http://localhost:5000/api/bookings",
        tournaments: "http://localhost:5000/api/tournaments",
      };
      mutation.mutate({ url: urlMap[tab], method: "post", payload: newItem });
      setNewItem({});
    };

    return (
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-lg font-semibold mb-4">Create New {tab.slice(0, 1).toUpperCase() + tab.slice(1)}</h2>

        {tab === "users" && (
          <>
            <label className="block mb-1 font-medium">Name</label>
            <input name="name" placeholder="Enter name" onChange={handleChange} className="w-full p-2 border rounded mb-3" />

            <label className="block mb-1 font-medium">Email</label>
            <input name="email" type="email" placeholder="Enter email" onChange={handleChange} className="w-full p-2 border rounded mb-3" />

            <label className="block mb-1 font-medium">Phone</label>
            <input name="phone" placeholder="Enter phone number" onChange={handleChange} className="w-full p-2 border rounded mb-3" />

            <label className="block mb-1 font-medium">Password</label>
            <input name="password" type="password" placeholder="Create password" onChange={handleChange} className="w-full p-2 border rounded mb-3" />
          </>
        )}

        {tab === "courts" && (
          <>
            <label className="block mb-1 font-medium">Court Name</label>
            <input name="name" placeholder="Enter court name" onChange={handleChange} className="w-full p-2 border rounded mb-3" />

            <label className="block mb-1 font-medium">Location</label>
            <input name="location" placeholder="Enter location" onChange={handleChange} className="w-full p-2 border rounded mb-3" />

            <label className="block mb-1 font-medium">Price Per Hour</label>
            <input name="price_per_hour" placeholder="Enter price" onChange={handleChange} className="w-full p-2 border rounded mb-3" />

            <label className="block mb-1 font-medium">Available Slots</label>
            <input name="available_slots" placeholder="Enter number of slots" onChange={handleChange} className="w-full p-2 border rounded mb-3" />
          </>
        )}

        {tab === "bookings" && (
          <>
            <label className="block mb-1 font-medium">Court ID</label>
            <input name="court_id" placeholder="Enter court ID" onChange={handleChange} className="w-full p-2 border rounded mb-3" />

            <label className="block mb-1 font-medium">Date</label>
            <input name="date" type="date" onChange={handleChange} className="w-full p-2 border rounded mb-3" />

            <label className="block mb-1 font-medium">Start Time</label>
            <input name="start_time" type="time" onChange={handleChange} className="w-full p-2 border rounded mb-3" />

            <label className="block mb-1 font-medium">End Time</label>
            <input name="end_time" type="time" onChange={handleChange} className="w-full p-2 border rounded mb-3" />
          </>
        )}

        {tab === "tournaments" && (
          <>
            <label className="block mb-1 font-medium">Tournament Name</label>
            <input name="name" placeholder="Enter tournament name" onChange={handleChange} className="w-full p-2 border rounded mb-3" />

            <label className="block mb-1 font-medium">Start Date</label>
            <input name="start_date" type="date" onChange={handleChange} className="w-full p-2 border rounded mb-3" />

            <label className="block mb-1 font-medium">End Date</label>
            <input name="end_date" type="date" onChange={handleChange} className="w-full p-2 border rounded mb-3" />
          </>
        )}

        <button onClick={handleSubmit} className="mt-2 px-4 py-2 bg-green-600 text-white rounded">
          Create
        </button>
      </div>
    );
  };

  const renderModal = () => {
    if (!editItem) return null;

    const handleChange = (e) => setEditItem({ ...editItem, [e.target.name]: e.target.value });

    const handleSave = () => {
      const urlMap = {
        users: `http://localhost:5000/api/users/${editItem.id}`,
        courts: `http://localhost:5000/api/courts/${editItem.id}`,
        bookings: `http://localhost:5000/api/bookings/${editItem.id}`,
        tournaments: `http://localhost:5000/api/tournaments/${editItem.id}`,
      };
      mutation.mutate({ url: urlMap[tab], method: "put", payload: editItem });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-lg">
          <h2 className="text-xl font-bold mb-4">Edit {tab.slice(0, 1).toUpperCase() + tab.slice(1)}</h2>
          {Object.keys(editItem).map((key) => (
            <div key={key} className="mb-3">
              <label className="block text-sm font-medium capitalize mb-1">{key}</label>
              <input name={key} value={editItem[key] || ""} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
          ))}
          <div className="flex justify-end gap-2">
            <button onClick={() => setEditItem(null)} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex gap-4 mb-6">
        {["users", "courts", "bookings", "tournaments"].map((key) => (
          <button
            key={key}
            className={`px-4 py-2 rounded ${tab === key ? "bg-blue-600 text-white" : "bg-white border"}`}
            onClick={() => {
              setTab(key);
              setEditItem(null);
              setNewItem({});
            }}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>
      {renderCreateForm()}
      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">{renderTable(currentData)}</div>
      {renderModal()}
    </div>
  );
};

export default AdminPanel;
