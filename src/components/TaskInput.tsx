import React, { useState, KeyboardEvent } from 'react';

interface TaskInputProps {
  onAddTask: (task: string) => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [task, setTask] = useState('');

  const handleAddTask = () => {
    if (task.trim() !== '') {
      onAddTask(task.trim());
      setTask(''); // Clear input after adding task
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // Explicitly check for Enter key
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default form submission
      handleAddTask();
    }
  };

  return (
    <div>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter a new task"
      />
    </div>
  );
};