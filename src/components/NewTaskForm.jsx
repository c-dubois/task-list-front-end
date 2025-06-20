import { useState } from 'react';
import PropTypes from 'prop-types';

const NewTaskForm = ({ onPostTask }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('handleSubmit called');
    const newTask = {
      title,
      completed: false,
      description: '',
    };
    console.log('New task from form:', newTask);
    onPostTask(newTask);
    setTitle('');
  };

  const handleChange = (event) => {
    setTitle(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="new-task-form">
      <div>
        <label htmlFor='input-name'>Task Title: </label>
        <input
          type="text"
          value={title}
          id='input-name'
          onChange={handleChange}
          placeholder="New task"
          className="task-input"
        />
      </div>
      <div>
        <button type="submit" className="add-task-button">Add Task</button>
      </div>
    </form>
  );
};

NewTaskForm.propTypes = {
  onPostTask: PropTypes.func.isRequired,
};

export default NewTaskForm;