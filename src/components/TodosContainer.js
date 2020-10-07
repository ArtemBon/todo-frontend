import React, { Component } from 'react';
import axios from 'axios';

class TodosContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      inputValue: ''
    };

    this.createTodo = this.createTodo.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getTodos() {
    axios.get('http://localhost:3001/api/v1/todos')
    .then(response => {
      this.setState({todos: response.data})
    })
    .catch(error => console.log(error));
  }

  componentDidMount() {
    this.getTodos();
  }

  handleChange(e) {
    this.setState({ inputValue: e.target.value });
  }

  createTodo(e) {
    if (e.key === 'Enter') {
      axios.post('http://localhost:3001/api/v1/todos', {todo: {body: e.target.value}})
      .then(response => {
        const todos = [ response.data, ...this.state.todos ]
        this.setState({
          todos,
          inputValue: ''
        })
      })
      .catch(error => console.log(error))      
    }    
  }

  updateTodo = (e, id) => {
    axios.put(`http://localhost:3001/api/v1/todos/${id}`, { todo: {done: e.target.checked} })
    .then(response => {
      const todoIndex = this.state.todos.findIndex(x => x.id === response.data.id)
      const todos = this.state.todos
      todos[todoIndex] = response.data
      this.setState(state => ({
        todos: todos
      }))
    })
    .catch(error => console.log(error))      
  }

  deleteTodo = (id) => {
    axios.delete(`http://localhost:3001/api/v1/todos/${id}`)
    .then(response => {
      const todos = this.state.todos.filter(
        todo => todo.id !== id
      )
      this.setState(state => ({
        todos
      }))
    })
    .catch(error => console.log(error))
  }

  formatDate(created_at) {
    const date = new Date(Date.parse(created_at));

    let hh = date.getHours();
    let mm = date.getMinutes()+1; 
    let ss = date.getSeconds();

    hh = hh < 10 ? `0${hh}` : hh;
    mm = mm < 10 ? `0${mm}` : mm;
    ss = ss < 10 ? `0${ss}` : ss;

    return `${hh}:${mm}:${ss}`;
  }

  render() {
    return (
      <div>
        <div className="inputContainer">
          <input className="taskInput" type="text" 
            placeholder="Add a task" maxLength="1000"
            value={this.state.inputValue}
            onChange={this.handleChange}
            onKeyPress={this.createTodo} />
        </div>  	    
        <div className="listWrapper">
          <ul className="taskList">
            {this.state.todos.map(todo => {
              return(
                <li className="task" todo={todo} key={todo.id}>
                  <input className="taskCheckbox" type="checkbox"
                    checked={todo.done}
                    onChange={(e) => this.updateTodo(e, todo.id)} />
                  <label className="taskLabel">{todo.body}</label>
                  <span className="deleteTaskBtn"
                    onClick={(e) => this.deleteTodo(todo.id)}>
                    x
                  </span>
                  <br/>
                  { todo.done
                    ? <small>done at: {this.formatDate(todo.updated_at)}</small>
                    : <small>created at: {this.formatDate(todo.created_at)}</small> }
                </li>
              );
            })} 	    
          </ul>
        </div>
     </div>
    )
  }
}

export default TodosContainer;
