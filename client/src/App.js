
import { useEffect, useState } from "react";
import { createTodo, readTodos, updateTodo, deleteTodo } from "./api";
import Preloader from "./components/Preloader";



function App() {
  const [todo, setTodo] = useState({ title: '', content: '' })
  const [todos, setTodos] = useState();
  const [currentId, setCurrentId] = useState(0);
  useEffect(() => {
    let currentTodo = currentId !== 0 ? todos.find(todo => todo._id === currentId) : { title: '', content: '' }
    setTodo(currentTodo)
  }, [currentId, todos])
  useEffect(() => {
    const fetchData = async () => {
      const result = await readTodos();
      console.log(result.data)
      setTodos(result.data)
    }
    fetchData()
  }, [currentId])
  const clear = () => {
    setCurrentId(0);
    setTodo({ title: '', content: '' });
  }
  useEffect(() => {
    const clearField = (e) => {
      if (e.keyCode === 27) {
        clear()
      }
    }
    window.addEventListener('keydown', clearField)
    return () => window.removeEventListener('keydown', clearField)
  }, [])
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (currentId === 0) {
      const result = await createTodo(todo)
      console.log(result);
      setTodos(todos,result)
      window.location.reload()
      clear()
    } else {
      await updateTodo(currentId, todo)
      clear()
    }
    const deleteTodo = async (id) => {
      await deleteTodo(id)
      const todosCopy = [...todos];
      todosCopy.filter(todo => todo._id !== id)
      setTodos(todosCopy);
      
    }

  }
  return (
    <div className="Container">
      <div className="row">
        <pre>{JSON.stringify(todo)}</pre>
        <form className="col s12" onSubmit={onSubmitHandler} >
          <div className="row">
            <div className="input-field col s6">
              <i className="material-icons prefix">title</i>
              <input id="icon_prefix" type="text" className="validate"
                value={todo.title}
                onChange={e => setTodo({ ...todo, title: e.target.value })} />

              <label htmlFor="icon_prefix">Title</label>
            </div>
            <div className="input-field col s6">
              <i className="material-icons prefix">description</i>
              <input id="description" type="tel" className="validate" value={todo.content} onChange={e => setTodo({ ...todo, content: e.target.value })} />
              <label htmlFor="icon_telephone">content</label>
            </div>
          </div>
          <div className="row right-align">
            <button className="waves-effect waves-light btn"  >Submit</button>
          </div>
        </form>

        {
          !todos ? <Preloader /> : todos.length > 0 ? <ul className="collection">
            {todos.map(todo => (
              <li key={todo._id}
                onClick={() => setCurrentId(todo._id)} className="collection-item"><div><h5>{todo.title}</h5>
                  <p>{todo.content}<a href="#!" onClick={() => deleteTodo(todo._id)} className="secondary-content"><i
                    className="material-icons" >delete</i></a></p></div></li>

            ))}
          </ul> : <div><h5>We Have Nothing</h5></div>
        }



      </div>

    </div>

  );
}

export default App;
