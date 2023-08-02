import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    // Backend'ten tüm todo listesini al
    axios.get('http://localhost:5000/api/todos')
      .then((response) => setTodos(response.data))
      .catch((error) => console.error('Todo listesi alınırken bir hata oluştu:', error));
  }, []);

  const handleInputChange = (event) => {
    setNewTodo(event.target.value);
  };

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      // Yeni görevi backend'e gönder
      axios.post('http://localhost:5000/api/todos', { text: newTodo })
        .then((response) => setTodos([...todos, response.data]))
        .catch((error) => console.error('Görev eklenirken bir hata oluştu:', error));

      setNewTodo('');
    }
  };

  const handleCompleteTodo = (id) => {
    // Todo'yu tamamlandı olarak işaretlemek için backend'e bir PUT isteği gönderebilirsiniz.
    // Burada örnek olarak yerel state'i güncelliyoruz.
    const updatedTodos = todos.map((todo) =>
      todo._id === id ? { ...todo, completed: !todo.completed } : todo
    );

    setTodos(updatedTodos);
  };

  const handleDeleteTodo = (id) => {
  // Todo'yu backend'den silmek için DELETE isteği gönderin
  axios.delete(`http://localhost:5000/api/todos/${id}`)
    .then(() => {
      // Başarılı bir şekilde silindiğinde yerel state'i güncelleyin
      const updatedTodos = todos.filter((todo) => todo._id !== id);
      setTodos(updatedTodos);
    })
    .catch((error) => console.error('Görev silinirken bir hata oluştu:', error));
};

  return (
    <div className="App">
      <h1>ToDo Uygulaması</h1>
      <div className="todo-list">
        {todos.map((todo) => (
          <div
            key={todo._id}
            className={`todo-item ${todo.completed ? 'completed' : ''}`}
            onClick={() => handleCompleteTodo(todo._id)}
          >
            {todo.text}
            <button className="delete-button" onClick={() => handleDeleteTodo(todo._id)}>X</button>
          </div>
        ))}
      </div>
      <div className="add-todo">
        <input type="text" value={newTodo} onChange={handleInputChange} />
        <button onClick={handleAddTodo}>Ekle</button>
      </div>
    </div>
  );
}

export default App;
