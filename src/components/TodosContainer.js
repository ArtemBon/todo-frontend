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
      todos[todoIndex].done = response.data.done
      this.setState(state => ({
        todos: todos
      }))
    })
    .catch(error => console.log(error))      
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
                  <span className="deleteTaskBtn">x</span>
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
