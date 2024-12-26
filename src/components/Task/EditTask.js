import React, { useState, useEffect } from 'react';
import API from '../../api';

const EditTask = ({ taskId, taskData, onClose, onUpdate }) => {
    const [task, setTask] = useState({
        "id": null,
        "project_id": '',
        "title": "",
        "description": "",
        "target_date": "",
        "status": "Completed",
        "priority": "High",
        "assigned_to": "",
        "created_at": "",
        "name": null,
        "task_id": null,
        "tag_name": null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    console.log(taskId)
    // Fetch task details when the component is loaded
    useEffect(() => {
        const fetchTask = async () => {
            setTask({ ...taskData });
            setLoading(false);
        };

        fetchTask();
    }, [taskId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask({ ...task, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            task.id = taskId;
            const response = await API.put(`/task/updateTask/`, task); // Replace with your API endpoint
            onUpdate(response.data); // Notify the parent component of updates
            onClose(); // Close the modal
        } catch (err) {
            console.error('Error updating task:', err);
            setError('Failed to update task.');
        }
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Task</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="form-control"
                                    value={task.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    className="form-control"
                                    value={task.description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="status" className="form-label">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    className="form-control"
                                    value={task.status}
                                    onChange={handleChange}
                                >
                                    <option value="Not Started">Not Started</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="priority" className="form-label">Priority</label>
                                <select
                                    id="priority"
                                    name="priority"
                                    className="form-control"
                                    value={task.priority}
                                    onChange={handleChange}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="target_date" className="form-label">Target Date</label>
                                <input
                                    type="date"
                                    id="target_date"
                                    name="target_date"
                                    className="form-control"
                                    value={task.target_date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="tags" className="form-label">Tags (comma-separated)</label>
                                <input
                                    type="text"
                                    id="tags"
                                    name="tags"
                                    className="form-control"
                                    value={task.tags}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditTask;
