import PropTypes from 'prop-types';
import './Task.css';

const Task = ({ id, title, isComplete, onTask, onRemove }) => {
  // const [complete, setComplete] = useState(isComplete);
  const buttonClass = isComplete ? 'tasks__item__toggle--completed' : '';

  return (
    <li className="tasks__item">
      <button
        className={`tasks__item__toggle ${buttonClass}`}
        onClick={() => onTask(id)}
      >
        {title}
      </button>
      <button className="tasks__item__remove button" onClick={() => onRemove(id)}>x</button>
    </li>
  );
};

Task.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  isComplete: PropTypes.bool.isRequired,
  onTask: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default Task;
