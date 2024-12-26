// src/components/Projects/CreateProject.js
import React, { useState } from 'react';
import API from '../../api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
const CreateProject = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        targetDate: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation example
        if (!formData.name || !formData.targetDate) {
            setError('Please provide all required fields.');
            setSuccess('');
            return;
        }

        try {
            const { data } = await API.post('/projects/createProject', {
                name: formData.name,
                description: formData.description,
                target_date: formData.targetDate,
            });
            setSuccess('Project created successfully!');
            setError('');
            setFormData({ name: '', description: '', targetDate: '' }); // Reset form
            if (data.status === 201) {
                navigate('/projects'); // Redirect to projects
            } else {
                setError('Error creating project. Please try again.');
            }
        } catch (err) {
            setError('Error creating project. Please try again.');
            setSuccess('');
        }
    };

    return (
        <><Navbar></Navbar>
            <div className="container mt-5">
                <h2 className="text-center mb-4">Create New Project</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Project Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-control"
                            placeholder="Enter project name"
                            value={formData.name}
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
                            placeholder="Enter project description"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="targetDate" className="form-label">Target Completion Date</label>
                        <input
                            type="date"
                            id="targetDate"
                            name="targetDate"
                            className="form-control"
                            value={formData.targetDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Create Project</button>
                </form>
            </div>
        </>
    );
};

export default CreateProject;
