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
                  <input className="taskCheckbox" type="checkbox" />              
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
