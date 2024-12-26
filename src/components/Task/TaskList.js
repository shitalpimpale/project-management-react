
import React, { useEffect, useState } from 'react';
import API from '../../api';
import Navbar from '../Navbar';
import EditTask from './EditTask';
import { Link } from 'react-router-dom';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [SelectedTask, setSelectedTask] = useState({});

    const [selectedTaskId, setSelectedTaskId] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5; // Number of items per page

    // Calculate total pages
    const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE);

    // Get projects for the current page
    const currentTasks = tasks.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleEditClick = (taskId) => {
        setSelectedTaskId(taskId);
        var item = tasks.find(item => item.id === taskId);
        setSelectedTask(item);
    };

    const handleClose = () => {
        setSelectedTaskId(null);
    };

    const handleUpdate = (updatedTask) => {
        console.log('Updated Task:', updatedTask);
        fetchTasks();
        // Refresh task list or update the UI as needed
    };

    const fetchTasks = async () => {
        try {
            const response = await API.get('/task/getTask'); // Replace with your API endpoint
            setTasks(response?.data?.data);
            setError('');
        } catch (err) {
            console.error('Error fetching tasks:', err);
            setError('Failed to fetch tasks.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch tasks from API
    useEffect(() => {


        fetchTasks();
    }, []);


    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const response = await API.put(`/tasks/${taskId}`, { status: newStatus }); // Replace with your API endpoint
            setTasks((prevTasks) =>
                prevTasks.map((task) => (task.id === taskId ? response.data : task))
            );
        } catch (err) {
            console.error('Error updating task status:', err);
            setError('Failed to update task status.');
        }
    };

    const handleDelete = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        try {
            await API.delete(`/task/deleteTask/${taskId}`); // Replace with your API endpoint
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        } catch (err) {
            console.error('Error deleting task:', err);
            //setError('Failed to delete task.');
        }
    };

    if (loading) {
        return <div className="text-center mt-5">Loading tasks...</div>;
    }

    if (error) {
        return <div className="alert alert-danger text-center mt-5">{error}</div>;
    }

    return (
        <>
            <Navbar></Navbar>
            <div className="container mt-5">
                <h2 className="text-center mb-4">Task List</h2>
                <Link to="/tasks/create"><button
                    className="btn btn-primary btn-sm me-2"
                >
                    Create Task
                </button></Link>
                {tasks.length === 0 ? (
                    <p className="text-center">No tasks available.</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Target Date</th>
                                    <th>Assignee</th>
                                    <th>Tags</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentTasks.map((task, index) => (
                                    <tr key={task.id}>
                                        <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                                        <td>{task.title}</td>
                                        <td>{task.description}</td>
                                        <td>{task.priority}</td>
                                        <td>
                                            <select
                                                className="form-select form-select-sm"
                                                value={task.status}
                                                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                            >
                                                <option value="Not Started">Not Started</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                        </td>
                                        <td>{new Date(task.target_date).toDateString()}</td>
                                        <td>{task.name}</td>
                                        <td>{task.tag_name}</td>
                                        <td>
                                            <button
                                                className="btn btn-primary btn-sm me-2"
                                                onClick={() => handleEditClick(task.id)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(task.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {/* Pagination Controls */}
                <nav aria-label="Project pagination">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                                Previous
                            </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <li
                                key={i + 1}
                                className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                            >
                                <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>

                {selectedTaskId && (
                    <EditTask
                        taskId={selectedTaskId}
                        taskData={SelectedTask}
                        onClose={handleClose}
                        onUpdate={handleUpdate}
                    />
                )}
            </div>
        </>
    );
};

export default TaskList;
