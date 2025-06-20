import TaskList from './components/TaskList.jsx';
import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import NewTaskForm from './components/NewTaskForm.jsx';

// const TASKS = [
//   {
//     id: 1,
//     title: 'Mow the lawn',
//     isComplete: false,
//   },
//   {
//     id: 2,
//     title: 'Cook Pasta',
//     isComplete: true,
//   },
// ];

const KBaseURL = import.meta.env.VITE_BASE_URL;

const convertFromApi = (task) => {
  const { description, id, is_complete: isComplete, title } = task;
  return { description, id, isComplete, title };
};

const getAllTasksApi = () => {
  return axios.get(`${KBaseURL}/tasks`)
    .then((response) => {
      return response.data.map(convertFromApi);
    })
    .catch((error) => {
      console.error('Error fetching tasks from API:', error);
    });
};

const taskCompletedApi = (id, isComplete) => {
  const route = isComplete ? 'mark_incomplete' : 'mark_complete';
  return axios.patch(`${KBaseURL}/tasks/${id}/${route}`)
    .then((response) => {
      return convertFromApi(response.data);
    })
    .catch((error) => {
      console.error('Error marking task as complete/incomplete:', error);
    });
};

const deleteTaskApi = (id) => {
  return axios.delete(`${KBaseURL}/tasks/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('Error deleting task:', error);
    });
};

const addTaskApi = (newTaskData) => {
  return axios.post(`${KBaseURL}/tasks`, newTaskData)
    .then((response) => {
      return convertFromApi(response.data.task);
    })
    .catch((error) => {
      console.error('Error posting new task:', error);
    });
};

const App = () => {
  const [taskData, setTaskData] = useState([]);

  const getAllTasks = () => {
    return getAllTasksApi()
      .then((tasks) => {
        setTaskData(tasks);
      });
  };

  useEffect(() => {
    getAllTasks();
  }, []);

  const toggleCompleteTask = (id) => {
    return taskCompletedApi(id, taskData.find(task => task.id === id).isComplete)
      .then(() => {
        setTaskData(taskData => {
          return taskData.map(task => {
            if (task.id === id) {
              return {...task, isComplete: !task.isComplete};
            } else {
              return task;
            }
          });
        });
      });
  };

  const deleteTask = (id) => {
    return deleteTaskApi(id)
      .then(() => {
        setTaskData(taskData => {
          return taskData.filter(task => {
            return task.id !== id;
          });
        });
      });
  };

  const addTask = (newTaskData) => {
    return addTaskApi(newTaskData)
      .then((newTask) => {
        setTaskData(taskData => {
          console.log('Task to add to state:', newTask);
          return [...taskData, newTask];
        });
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ada&apos;s Task List</h1>
      </header>
      <main>
        <div>{<TaskList tasks={taskData} onTask={toggleCompleteTask} onRemove={deleteTask}/>}</div>
        <NewTaskForm onPostTask={addTask} />
      </main>
    </div>
  );
};

export default App;
