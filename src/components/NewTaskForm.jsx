import { useState } from 'react';
import PropTypes from 'prop-types';
import './NewTaskForm.css';

// Объект с начальными значениями формы
const kNewFormData = {
  title: '',
  isComplete: 'false',
};

const NewTaskForm = ({ onAddTaskCallback }) => {
  const [taskData, setTaskData] = useState(kNewFormData);

  const handleChange = (e) => {
    const fieldName = e.target.name;
    const value = e.target.value;

    setTaskData((oldData) => ({
      ...oldData,
      [fieldName]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskData.title) return;

    // Сначала отправляем данные, потом сбрасываем форму
    onAddTaskCallback({
      ...taskData,
      isComplete: taskData.isComplete === 'true',
    });

    setTaskData(kNewFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="new-task__form">
      <section>
        <h2>Add a Task</h2>
        <div className="new-task__fields">
          <label htmlFor="new-task__title">Title</label>
          <input
            name="title"
            id="new-task__title"
            value={taskData.title}
            onChange={handleChange}
          />
          <label htmlFor="new-task__isComplete">Complete</label>
          <select
            value={taskData.isComplete}
            onChange={handleChange}
            name="isComplete"
            id="new-task__isComplete"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          <button className="button new-task__submit" type="submit">
            Add Task
          </button>
        </div>
      </section>
    </form>
  );
};

NewTaskForm.propTypes = {
  onAddTaskCallback: PropTypes.func.isRequired,
};

export default NewTaskForm;
