import React, { useState, useEffect } from 'react';
import API from '../../api';

const EditProject = ({ projectId, project, onClose, onUpdate }) => {

    const [projectDetail, setProject] = useState({
        name: '',
        description: '',
        target_date: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch project details when component loads
    useEffect(() => {
        const fetchProject = async () => {
            try {
                console.log(project);
                setProject({ ...project });
            } catch (err) {

            } finally {
                setLoading(false);
            }
        };

        fetchProject();

    }, [projectId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProject({ ...projectDetail, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            projectDetail.id = projectId;
            const response = await API.put(`/projects/updateProject`, projectDetail); // Replace with your API endpoint
            onUpdate(response.data); // Notify parent component of updates
            onClose(); // Close the modal
        } catch (err) {
            console.error('Error updating project:', err);
            setError('Failed to update project.');
        }
    };

    if (loading) {
        //  console.log(projectDetails.name);
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Project</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">
                                    Project Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form-control"
                                    value={projectDetail.name}
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
                                    value={projectDetail.description}
                                    onChange={handleChange}
                                    required
                                />
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
                                    value={projectDetail.target_date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProject;
