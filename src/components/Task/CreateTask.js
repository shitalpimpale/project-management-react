
import React, { useState, useEffect } from 'react';
import API from '../../api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
const CreateTask = ({ }) => {
    const navigate = useNavigate();
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        target_date: '',
        status: 'Not Started',
        priority: 'Medium',
        assigned_to: '',
        project_id: '',
    });
    const [users, setUsers] = useState([{
        id: 1, name: 'Shital'
    }]);
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Fetch Users and Projects for Dropdown Options
        const fetchUsersAndProjects = async () => {
            try {
                const projectsResponse = await API.get(`/projects/getProjects/`);
                setProjects(projectsResponse?.data?.data);
                const userResponse = await API.get(`/user`);
                console.log(userResponse?.data?.data)
                setUsers(userResponse?.data?.data);

            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchUsersAndProjects();
    }, []);

    const handleChange = (e) => {
        setTaskData({ ...taskData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        if (!taskData.title || !taskData.target_date || !taskData.project_id || !taskData.assigned_to) {
            setError('Please fill out all required fields.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await API.post('/task/createTask', taskData);
            setSuccess('Task created successfully!');
            setTaskData({
                title: '',
                description: '',
                target_date: '',
                status: 'Not Started',
                priority: 'Medium',
                assigned_to: '',
                project_id: '',
            });

            if (response.status === 201) {
                navigate('/tasks/list'); // Redirect to projects
            } else {
                setError('Error creating project. Please try again.');
            }
        } catch (err) {
            console.error('Error creating task:', err);
            setError('Failed to create the task. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Navbar></Navbar>
            <div className="container mt-5">
                <h2 className="text-center mb-4">Create and Assign Task</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                            Task Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="form-control"
                            placeholder="Enter task title"
                            value={taskData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            className="form-control"
                            placeholder="Enter task description"
                            rows="3"
                            value={taskData.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="target_date" className="form-label">
                            Target Completion Date
                        </label>
                        <input
                            type="date"
                            id="target_date"
                            name="target_date"
                            className="form-control"
                            value={taskData.target_date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="priority" className="form-label">
                            Priority
                        </label>
                        <select
                            id="priority"
                            name="priority"
                            className="form-select"
                            value={taskData.priority}
                            onChange={handleChange}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="status" className="form-label">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            className="form-select"
                            value={taskData.status}
                            onChange={handleChange}
                        >
                            <option value="Not Started">Not Started</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="assigned_to" className="form-label">
                            Assign To
                        </label>
                        <select
                            id="assigned_to"
                            name="assigned_to"
                            className="form-select"
                            value={taskData.assigned_to}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a user</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="project_id" className="form-label">
                            Project
                        </label>
                        <select
                            id="project_id"
                            name="project_id"
                            className="form-select"
                            value={taskData.project_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a project</option>
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create Task'}
                    </button>
                </form>
            </div>
        </>
    );
};

export default CreateTask;
