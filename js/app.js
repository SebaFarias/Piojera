const todoInput = document.querySelector('#todoInput');
const todoButton = document.querySelector('.input-button');
const todoList = document.querySelector('.todo-list');
const todoFilter = document.querySelector('#filterTodo');

document.addEventListener('DOMContentLoaded',getTodoListFromLocal);
todoButton.addEventListener('click', addToDo);
todoList.addEventListener('click',handleListClick);
todoFilter.addEventListener('click',filterTodoList);

function renderTodo(text,state){
    const todoDiv = document.createElement('div')
    todoDiv.classList.add('todo')
    if(state)todoDiv.classList.add('completed')   
    const newTodo = document.createElement('li')
    newTodo.innerText = text
    newTodo.classList.add('todo-item')
    todoDiv.appendChild(newTodo)
    const checkButton = document.createElement('button')  
    checkButton.innerHTML = '<i class="fas fa-check-square"></i>' 
    checkButton.classList.add('complete-btn')
    todoDiv.appendChild(checkButton)
    const trashButton = document.createElement('button')     
    trashButton.innerHTML = '<i class="fas fa-trash-alt"></i>'
    trashButton.classList.add('trash-btn')
    todoDiv.appendChild(trashButton)
    todoList.appendChild(todoDiv)
}

function addToDo(event){
    event.preventDefault()
    let todoText = todoInput.value
    if(todoText !== null && todoText !== ''){
        renderTodo(todoText,false)
        saveTodoOnLocal(todoText,false)
        todoInput.value = ''
    }
}
function handleListClick(event){
    let button = event.target;
    let todo = button.parentElement;
    if(button.classList.contains('trash-btn'))dropTodo(todo);
    if(button.classList.contains('complete-btn')){
        toggleCompleted(todo);
    }
}
function dropTodo(todo){
    let text = todo.querySelector('.todo-item').innerText;
    todo.classList.add(Math.random()<0.5?'fall-r':'fall-l');
    todo.addEventListener('transitionend',(event)=>{
        todo.remove();
    })
    removeTodoFromLocal(text);
}
function toggleCompleted(todo){
    let text = todo.querySelector('.todo-item').innerText;
    todo.classList.toggle('completed');
    toggleCompletedFromLocal(text);
    filterTodoList();
}   
function filterTodoList(){
    const todos = todoList.childNodes
    todos.forEach(todo=>{
        if(todo.nodeType == Node.ELEMENT_NODE)
        switch(todoFilter.value){
            case 'all':
                todo.style.display = 'flex';
                break;
            case 'completed':
                if(todo.classList.contains("completed")){
                    todo.style.display = 'flex';
                }else{
                    todo.style.display = 'none';
                }
                break;
            case 'uncompleted':
                if(todo.classList.contains('completed')){
                    todo.style.display = 'none';
                }else{
                    todo.style.display = 'flex';
                }
                break;    
        }
    })    
}
function checkLocal(){
    let todos,
    completed;
    if(localStorage.getItem('todos') === null) todos = [];
    else todos = JSON.parse(localStorage.getItem('todos'));      
    if(localStorage.getItem('completed') === null) completed = [];
    else completed = JSON.parse(localStorage.getItem('completed'));      
    return [todos,completed];
}
function getTodoListFromLocal(){
    let todos = checkLocal();
    todos[0].forEach((todo,index)=>{
        renderTodo(todo,todos[1][index]);
    })
}
function saveTodoOnLocal(todo,completed){
    let todos=checkLocal();
    todos[0].push(todo);
    todos[1].push(completed)
    localStorage.setItem('todos',JSON.stringify(todos[0]));
    localStorage.setItem('completed',JSON.stringify(todos[1]));
}
function removeTodoFromLocal(todo){
    let todos = checkLocal()
    todos[0].splice(todos[0].indexOf(todo),1);
    todos[1].splice(todos[0].indexOf(todo),1);
    localStorage.setItem('todos',JSON.stringify(todos[0]));
    localStorage.setItem('completed',JSON.stringify(todos[1]));
}
function toggleCompletedFromLocal(todo){
    let todos=checkLocal()
    todos[1][todos[0].indexOf(todo)]=!todos[1][todos[0].indexOf(todo)];
    localStorage.setItem('completed', JSON.stringify(todos[1]));
}