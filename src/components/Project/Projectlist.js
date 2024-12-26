// src/components/Projects/ProjectList.js
import React, { useEffect, useState } from 'react';
import API from '../../api';
import Navbar from '../Navbar';
import EditProject from './EditProject';
import { Link } from 'react-router-dom';
const ProjectList = () => {
    const [projects, setData] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [selectedProject, setSelectedProject] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5; // Number of items per page

    // Calculate total pages
    const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);

    // Get projects for the current page
    const currentProjects = projects.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };


    const onDelete = async (id) => {
        const { data } = await API.delete(`/projects/deleteProject/${id}`);
        if (data.status === 200) {
            alert('Project Deleted Successfully')
        }
    }

    const getListOfProjects = async (id) => {
        const { data } = await API.get(`/projects/getProjects`);
        if (data.status === 200) {
            setData(data.data);
        }
    }


    const handleEditClick = (projectId) => {
        var item = projects.find(item => item.id === projectId);
        setSelectedProject(item);

        setSelectedProjectId(projectId);
    };

    const handleClose = () => {
        setSelectedProjectId(null);
    };

    const handleUpdate = (updatedProject) => {
        console.log('Updated Project:', updatedProject);
        // Refresh project list or update the UI as needed
    };


    useEffect(() => {
        getListOfProjects();
    }, []);


    return (
        <>
            <Navbar></Navbar>
            <div className="container mt-5">
                <h2 className="text-center mb-4">Project List</h2>
                <Link to="/projects/create"><button
                    className="btn btn-primary btn-sm me-2"
                >
                    Create Project
                </button></Link>

                {/* Table Layout for Projects */}
                <h4 className="mt-5">Projects</h4>
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Target Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProjects.map((project, index) => (
                                <tr key={project.id}>
                                    <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                                    <td>{project.name}</td>
                                    <td>{project.description.substring(0, 20)}</td>
                                    <td>{new Date(project.target_date).toDateString()}</td>
                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm me-2"
                                            onClick={() => handleEditClick(project.id)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => onDelete(project.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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

                {selectedProjectId && (
                    <EditProject
                        projectId={selectedProjectId}
                        project={selectedProject}
                        onClose={handleClose}
                        onUpdate={handleUpdate}
                    />
                )}
            </div>
        </>
    );
};

export default ProjectList;
