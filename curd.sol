// Curd.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CurdContract {
    struct Project {
        string name;
        string description;
    }

    mapping(uint256 => Project) private projects;
    uint256 private projectIdCounter;

    event ProjectCreated(uint256 projectId, string name, string description);
    event ProjectUpdated(uint256 projectId, string name, string description);
    event ProjectDeleted(uint256 projectId);

    function createProject(string memory name, string memory description) external {
        uint256 projectId = projectIdCounter++;
        projects[projectId] = Project(name, description);

        emit ProjectCreated(projectId, name, description);
    }

    function readProject(uint256 projectId) external view returns (string memory name, string memory description) {
        Project storage project = projects[projectId];
        return (project.name, project.description);
    }

    function updateProject(uint256 projectId, string memory name, string memory description) external {
        require(projectId < projectIdCounter, "Project does not exist");

        projects[projectId].name = name;
        projects[projectId].description = description;

        emit ProjectUpdated(projectId, name, description);
    }

    function deleteProject(uint256 projectId) external {
        require(projectId < projectIdCounter, "Project does not exist");

        delete projects[projectId];

        emit ProjectDeleted(projectId);
    }
}
