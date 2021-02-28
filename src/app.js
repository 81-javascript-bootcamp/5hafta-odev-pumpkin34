import { getDataFromApi, addTaskToApi, deleteTaskToApi } from './data';

class PomodoroApp {
  constructor(options) {
    let { tableTbodySelector, taskFormSelector } = options;
    this.$tableTbody = document.querySelector(tableTbodySelector);
    this.$taskForm = document.querySelector(taskFormSelector);
    this.$taskFormInput = this.$taskForm.querySelector('input');
    this.$taskFormBtn = this.$taskForm.querySelector('button');
  }

  addTask(task) {
    this.$taskFormBtn.textContent = 'Please Wait!';
    this.$taskFormBtn.disabled = true;
    addTaskToApi(task)
      .then((data) => data.json())
      .then((newTask) => {
        this.addTaskToTable(newTask);
        this.$taskFormBtn.textContent = 'Add Task';
        this.$taskFormBtn.disabled = false;
      });
  }

  addTaskToTable(task, index) {
    const $newTaskEl = document.createElement('tr');
    $newTaskEl.innerHTML = `<th scope="row">${task.id}</th><td>${task.title}</td> <td><button id='${task.id}' class="delete btn btn-danger"><i id='${task.id}' class="fa fa-trash"></i></button></td>`;
    this.$tableTbody.appendChild($newTaskEl);
    this.$taskFormInput.value = '';
    this.hadleDeleteTask();
  }

  handleAddTask() {
    this.$taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const task = { title: this.$taskFormInput.value };
      this.addTask(task);
    });
  }

  fillTasksTable() {
    getDataFromApi().then((currentTasks) => {
      currentTasks.forEach((task, index) => {
        this.addTaskToTable(task, index + 1);
      });
      
    });
  }

  hadleDeleteTask() {
    const $deleteBtn = document.querySelectorAll('.btn-danger');
    $deleteBtn.forEach((element) => {
      element.addEventListener('click', (e) => {
        deleteTaskToApi(element.id).then((res) => {
          if (res.status == '200') {
            const $newTaskEl = this.$tableTbody.querySelectorAll('tr');
            $newTaskEl.forEach((tr) => {
              tr.remove();
            });
            this.fillTasksTable();
          }
        });
      });
    });
  }
  
  init() {
    this.fillTasksTable();
    this.handleAddTask();
    this.hadleDeleteTask();
  }
}

export default PomodoroApp;

