// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Todo {
    struct Task {
        uint256 id;
        string content;
        bool completed;
    }

    uint256 private taskId;
    mapping(uint256 => Task) private tasks;

    event TaskCreated(uint256 id, string content);
    event TaskUpdated(uint256 id, bool completed);
    event TaskDeleted(uint256 id);

    function createTask(string memory _content) public {
        taskId++;
        tasks[taskId] = Task(taskId, _content, false);
        emit TaskCreated(taskId, _content);
    }

    function getAllTasks() public view returns (Task[] memory) {
        Task[] memory allTasks = new Task[](taskId);
        for (uint256 i = 1; i <= taskId; i++) {
            allTasks[i - 1] = tasks[i];
        }
        return allTasks;
    }

    function isCompletedTask(uint256 _id, bool _completed) public {
        require(_id <= taskId, "Invalid task ID");
        tasks[_id].completed = _completed;
        emit TaskUpdated(_id, _completed);
    }

    function updateTask(uint256 _id, string memory _newContent) public {
    require(_id <= taskId, "Invalid task ID");
    tasks[_id].content = _newContent;
    emit TaskUpdated(_id, tasks[_id].completed);
    }

    function deleteTask(uint256 _id) public {
        require(_id <= taskId, "Invalid task ID");
        delete tasks[_id];
        emit TaskDeleted(_id);
    }
}
