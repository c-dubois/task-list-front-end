import { useState, useEffect } from 'react';
import TaskList from './components/TaskList.jsx';
import './App.css';
import axios from 'axios';
import NewTaskForm from './components/NewTaskForm.jsx';

// read the base url from the .env file
const kBaseUrl = import.meta.env.VITE_BASE_URL;

const taskApiToJson = task => {
  const { description, id, is_complete: isComplete, title } = task;
  return { description, id, isComplete, title };
};

const getTasksAsync = async () => {
  try {
    const response = await axios.get(`${kBaseUrl}/tasks`);
    return response.data.map(taskApiToJson);
  } catch (err) {
    console.log(err);
    throw new Error('error fetching tasks');
  }
};

const updateTaskAsync = async (id, markComplete) => {
  const endpoint = markComplete ? 'mark_complete' : 'mark_incomplete';

  try {
    const response = await axios.patch(`${kBaseUrl}/tasks/${id}/${endpoint}`);
    return taskApiToJson(response.data.task);
  } catch (err) {
    console.log(err);
    throw new Error(`error updating task ${id}`);
  }
};

const deleteTaskAsync = async id => {
  try {
    await axios.delete(`${kBaseUrl}/tasks/${id}`);
  } catch (err) {
    console.log(err);
    throw new Error(`error deleting task ${id}`);
  }
};

const addTaskAsync = async taskData => {
  const { title, isComplete } = taskData;
  const description = 'created in Task List Front End';
  const completedAt = isComplete ? new Date() : null;
  const body = { title, description, 'completed_at': completedAt };

  try {
    const response = await axios.post(`${kBaseUrl}/tasks`, body);
    return taskApiToJson(response.data.task);
  } catch (err) {
    console.log(err);
    throw new Error('error creating task');
  }
};

const App = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    refreshTasks();
  }, []);

  const refreshTasks = async () => {
    try {
      const tasks = await getTasksAsync();
      setTasks(tasks);
    } catch (err) {
      console.log(err.message);
    }
  };

  const updateTask = async id => {
    // шаг 1: локально переворачиваем isComplete, чтобы сразу отразилось
    setTasks((oldTasks) =>
      oldTasks.map((task) =>
        task.id === id
          ? { ...task, isComplete: !task.isComplete }
          : task
      )
    );

    // шаг 2: отправляем на сервер
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    try {
      await updateTaskAsync(id, !task.isComplete); // передаём новое значение
    } catch (err) {
      console.log(err.message);
      // (необязательно) можно отменить визуальное изменение, если API не сработал
    }
  };


  const deleteTask = async id => {
    try {
      await deleteTaskAsync(id);
      setTasks(oldTasks =>
        oldTasks.filter(task => task.id !== id)
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  const addTask = async taskData => {
    try {
      const task = await addTaskAsync(taskData);
      setTasks(oldTasks => [...oldTasks, task]);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ada&apos;s Task List</h1>
      </header>
      <main>
        <div>
          <TaskList
            tasks={tasks}
            onToggleCompleteCallback={updateTask}
            onDeleteCallback={deleteTask}
          />
        </div>
        <div>
          <NewTaskForm onAddTaskCallback={addTask} />
        </div>
      </main>
    </div>
  );
};

export default App;
