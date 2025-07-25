import { useEffect, useState } from "react";
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: "All",
    search: "",
    sort: "createdAt:desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/v1/tasks/stats",
        {
          withCredentials: true,
        }
      );
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const params = {
        ...filters,
        page: currentPage,
        limit: tasksPerPage,
      };

      const { data } = await axios.get(
        "http://localhost:8000/api/v1/tasks/tasks",
        {
          withCredentials: true,
          params,
        }
      );

      setTasks(data.tasks || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [filters, currentPage]);

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/tasks/delete/${id}`, {
        withCredentials: true,
      });
      fetchTasks();
      fetchStats();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const updateTask = async () => {
    try {
      await axios.put(
        `http://localhost:8000/api/v1/tasks/update/${editingTask._id}`,
        editingTask,
        { withCredentials: true }
      );
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      console.error("Update failed", error);
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

  return (
    <div className="p-4 max-w-7xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="grid grid-cols-4 gap-2">
          <StatCard
            label="Total"
            value={stats?.totalTasks || 0}
            bg="bg-white"
            text="text-gray-800"
          />
          <StatCard
            label="Pending"
            value={stats?.statusBreakdown?.pending || 0}
            bg="bg-yellow-100"
            text="text-yellow-800"
          />
          <StatCard
            label="In Progress"
            value={stats?.statusBreakdown?.["in-progress"] || 0}
            bg="bg-blue-100"
            text="text-blue-800"
          />
          <StatCard
            label="Completed"
            value={stats?.statusBreakdown?.completed || 0}
            bg="bg-green-100"
            text="text-green-800"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by title/description..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="px-3 py-1.5 border border-gray-300 rounded-md w-60"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="px-2 py-1 border border-gray-300 rounded-md"
        >
          <option value="All">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          className="px-2 py-1 border border-gray-300 rounded-md"
        >
          <option value="createdAt:desc">Newest First</option>
          <option value="createdAt:asc">Oldest First</option>
        </select>
      </div>

      <div className="overflow-x-auto border rounded-lg shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Created At</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {tasks.map((task) => (
              <tr key={task._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 font-bold">{task.title}</td>
                <td className="px-4 py-2 text-zinc-500">{task.description}</td>
                <td
                  className={`${getStatusColor(
                    task.status
                  )} px-4 py-2 capitalize`}
                >
                  {task.status}
                </td>
                <td className="px-4 py-2">
                  {new Date(task.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => setEditingTask(task)}
                    className="text-blue-600 hover:underline"
                  >
                    <CiEdit />
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="text-red-600 hover:underline"
                  >
                    <MdDeleteOutline />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tasks.length === 0 && (
          <p className="text-center text-gray-500 py-4">No tasks found.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-3 py-1 rounded ${
                num === currentPage
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-3">Edit Task</h2>
            <input
              type="text"
              value={editingTask.title}
              onChange={(e) =>
                setEditingTask({ ...editingTask, title: e.target.value })
              }
              className="w-full mb-2 px-3 py-2 border rounded"
              placeholder="Title"
            />
            <textarea
              value={editingTask.description}
              onChange={(e) =>
                setEditingTask({ ...editingTask, description: e.target.value })
              }
              className="w-full mb-2 px-3 py-2 border rounded"
              placeholder="Description"
            />
            <select
              value={editingTask.status}
              onChange={(e) =>
                setEditingTask({ ...editingTask, status: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 border rounded"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingTask(null)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={updateTask}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, bg, text }) => (
  <div className={`rounded-xl shadow-sm ${bg} px-3 py-2 text-center`}>
    <p className="text-xs text-gray-600">{label}</p>
    <h2 className={`text-lg font-bold ${text}`}>{value}</h2>
  </div>
);

export default AdminDashboard;
