import React, { useState, useEffect } from "react";
import axios from "axios";

const PAGE_SIZE = 5;

const UserDashboard = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
  });

  const [loading, setLoading] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [countTasks, setCountTasks] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/tasks", {
        withCredentials: true,
      });
      setTasks(res.data.tasks.reverse());
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const getStats = async (req, res) => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/tasks/stats", {
        withCredentials: true,
      });

      setCountTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    getStats();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  console.log(countTasks);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (editId) {
        await axios.put(
          `http://localhost:8000/api/v1/tasks/update/${editId}`,
          formData,
          { withCredentials: true }
        );
        setMessage("Task updated!");
      } else {
        await axios.post(
          "http://localhost:8000/api/v1/tasks/create",
          formData,
          {
            withCredentials: true,
          }
        );
        getStats();
        setMessage("Task created!");
      }

      setFormData({ title: "", description: "", status: "pending" });
      setEditId(null);
      fetchTasks();

      setTimeout(() => {
        setFormData({ title: "", description: "", status: "pending" });
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error:", error);
      setMessage(" Failed to save task.");
    } finally {
      console.error("Error creating task:", error);
      setMessage(" Failed to create task.");
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
    });
    setEditId(task._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`http://localhost:8000/api/v1/tasks/delete/${id}`, {
          withCredentials: true,
        });
        setMessage("🗑️ Task deleted.");
        fetchTasks();
      } catch (error) {
        console.error("Error deleting:", error);
        setMessage("Failed to delete task.");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100 px-2 py-1 rounded";
      case "in-progress":
        return "text-blue-600 bg-blue-100 px-2 py-1 rounded";
      case "pending":
      default:
        return "text-gray-600 bg-gray-100 px-2 py-1 rounded";
    }
  };

  const paginatedTasks = tasks.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const totalPages = Math.ceil(tasks.length / PAGE_SIZE);

  return (
    <div className="max-w-2xl mx-auto mt-12 px-4 font-sans">
      <div className="absolute top-4 right-4 w-full max-w-md px-2 font-sans mt-[55px]">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="bg-white rounded-xl shadow p-2 text-center">
            <p className="text-gray-500 text-xs">Total</p>
            <h2 className="text-lg font-bold text-gray-800">
              {countTasks?.totalTasks || 0}
            </h2>
          </div>

          <div className="bg-yellow-100 rounded-xl shadow p-2 text-center">
            <p className="text-yellow-700 text-xs font-medium">Pending</p>
            <h2 className="text-lg font-semibold text-yellow-800">
              {countTasks?.statusBreakdown?.pending || 0}
            </h2>
          </div>

          <div className="bg-blue-100 rounded-xl shadow p-2 text-center">
            <p className="text-blue-700 text-xs font-medium">Progress</p>
            <h2 className="text-lg font-semibold text-blue-800">
              {countTasks?.statusBreakdown?.["in-progress"] || 0}
            </h2>
          </div>

          <div className="bg-green-100 rounded-xl shadow p-2 text-center">
            <p className="text-green-700 text-xs font-medium">Completed</p>
            <h2 className="text-lg font-semibold text-green-800">
              {countTasks?.statusBreakdown?.completed || 0}
            </h2>
          </div>
        </div>
      </div>

      <div className="bg-white  rounded-2xl p-6 mb-10 border border-gray-200 mt-[150px]">
        <h2 className="text-3xl font-bold text-zinc-500 mb-6 text-center">
          {editId ? "✏️ Edit Task" : "📝 Create a New Task"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Enter task title"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Enter task description"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <select
            name="status"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In-Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 bg-black text-white py-2 rounded ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 000 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                  ></path>
                </svg>
                Creating...
              </>
            ) : (
              "Create Task"
            )}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-green-600">{message}</p>
        )}
      </div>

      <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          📋 Your Tasks
        </h2>
        {paginatedTasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks found.</p>
        ) : (
          <ul className="space-y-4">
            {paginatedTasks.map((task) => (
              <li
                key={task._id}
                className="border border-gray-200 p-4 rounded-xl bg-gray-50 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {task.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{task.description}</p>
                    <p className="mt-2 text-sm">
                      Status:{" "}
                      <span className={getStatusColor(task.status)}>
                        {task.status}
                      </span>
                    </p>
                  </div>
                  <div className="space-x-3 mt-1">
                    <button
                      onClick={() => handleEdit(task)}
                      className="text-yellow-600 hover:text-yellow-700 transition"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="text-red-600 hover:text-red-700 transition"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-1 rounded-full text-sm font-medium ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
