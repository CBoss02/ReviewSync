import React, {useState} from "react";
import api from "../../config/axiosConfig";
import {XIcon} from "@heroicons/react/solid";

function CreateProject() {
    const [showCreateProject, setShowCreateProject] = useState(false);
    const [projectName, setProjectName] = useState("");

    const handleCreateProject = async () => {
        try {
            const response = await api.post('/api/projects/createProject', {projectName});
            console.log('Project created:', response.data);
            setProjectName("");
            setShowCreateProject(false);
        } catch (error) {
            console.error('Failed to create project:', error);
        }
    }

    return (
        <div>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    onClick={() => setShowCreateProject(true)}>Create Project
            </button>

            {showCreateProject && (
                <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <div className="flex justify-end">
                            <button className="text-gray-400 rounded hover:text-gray-600"
                                    onClick={() => setShowCreateProject(false)}>
                                <XIcon className="h-6 w-6"/>
                            </button>
                        </div>
                        <div className="flex flex-col gap-4">
                            <form className="flex flex-col gap-4">
                                <label htmlFor="projectName">Project Name</label>
                                <input type="text" id="projectName" name="projectName" value={projectName}
                                       onChange={(e) => setProjectName(e.target.value)}/>
                                <button type="button" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                                        onClick={handleCreateProject}>Create Project
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateProject;