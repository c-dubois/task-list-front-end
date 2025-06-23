import { useState } from 'react';
import PropTypes from 'prop-types';
import './NewTaskForm.css';

const kDefaultFormState = {
  title: '',
  description: '',
  completed: false,
};

const NewTaskForm = ({ onPostTask }) => {
  const [formData, setFormData] = useState(kDefaultFormState);

  const handleSubmit = (event) => {
    event.preventDefault();

    onPostTask(formData);
    setFormData(kDefaultFormState);
  };

  const handleChange = (event) => {
    const inputName = event.target.name;
    const inputValue = event.target.value;
    setFormData((formData) => {
      return {
        ...formData,
        [inputName]: inputValue,
      };
    });
  };
  const makeControlledInput = (inputName) => {
    return <input
      onChange={handleChange}
      type="text"
      name={inputName}
      value={formData[inputName]}
      placeholder={inputName.charAt(0).toUpperCase() + inputName.slice(1)}
      className="task-input"
    />;
  };

  return (
    <form onSubmit={handleSubmit} className="new-task-form">
      <div>
        <label htmlFor='input-title'>Task Title: </label>
        { makeControlledInput('title') }
      </div>
      <div>
        <label htmlFor='input-description'>Task Description: </label>
        { makeControlledInput('description') }
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