// src/components/Member/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import API from '../../api';
const Dashboard = () => {
    const id = localStorage.getItem('id');
    const role = localStorage.getItem('role');
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Fix Bug #42', status: 'In Progress', dueDate: '2023-12-31' },
        { id: 2, title: 'Add Feature X', status: 'Not Started', dueDate: '2024-01-15' },
    ]);
    const [projects, setProjects] = useState([]);


    const fetchTasks = async () => {
        try {
            const response = await API.get('/task/getTask'); // Replace with your API endpoint
            console.log(response?.data?.data)
            setTasks(response?.data?.data);
        } catch (err) {
            console.error('Error fetching tasks:', err);
        } finally {
        }
    };
    const getListOfProjects = async (id) => {
        const { data } = await API.get(`/projects/getProjects/`);
        console.log(data);
        if (data.status === 200) {
            setProjects(data.data);
        }
    }


    // Fetch tasks from API
    useEffect(() => {
        fetchTasks();
        getListOfProjects();
    }, []);

    const totalProjects = projects.length;
    const totalTasks = tasks.length;
    const tasksDueToday = tasks.filter((task) => new Date(task.target_date).toDateString() === new Date().toDateString()).length;
    if (role == 2) {
        return <>Welcome to member dashboard</>
    } else {
        return (
            <>
                <Navbar></Navbar>
                <div className="container mt-5">
                    {/* <Navbar></Navbar> */}
                    <h2 className="text-center mb-4">Admin Dashboard</h2>

                    {/* Metrics Section */}
                    <div className="row mb-4">
                        <div className="col-md-4">
                            <div className="card text-center">
                                <div className="card-body">
                                    <h5 className="card-title">Total Projects</h5>
                                    <Link className="nav-link" to="/projects">
                                        <p className="card-text display-6">{totalProjects}</p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card text-center">
                                <div className="card-body">
                                    <h5 className="card-title">Total Tasks</h5>
                                    <Link className="nav-link" to="/tasks/list">
                                        <p className="card-text display-6">{totalTasks}</p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card text-center">
                                <div className="card-body">
                                    <h5 className="card-title">Tasks Due Today</h5>
                                    <Link className="nav-link" to="/tasks/list">
                                        <p className="card-text display-6">{tasksDueToday}</p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tasks Section */}
                    <div>
                        <h4>Tasks Overview</h4>
                        <ul className="list-group">
                            {tasks.map((task) => (
                                <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    {task.title}
                                    <span
                                        className={`badge ${task.status === 'In Progress'
                                            ? 'bg-warning'
                                            : task.status === 'Completed'
                                                ? 'bg-success'
                                                : 'bg-secondary'
                                            }`}
                                    >
                                        {task.status}
                                    </span>
                                    <small className="text-muted">Due: {new Date(task.target_date).toDateString()}</small>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </>
        );
    }
};

export default Dashboard;
