import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { todoState } from "../components/atoms";



const App = () => {
  
  const router = useRouter();

  // Todoリストのstateを定義
  const [todos, setTodos] = useState([]);

  // 新規Todoのstateを定義
  const [todoTitle, setTodoTitle] = useState();

  // 編集画面に切り替えるためのstateを定義
  const [isEditable, setIsEditable] = useState(false);

  // 編集したいtodoのidの状態を定義
  const [editId, setEditId] = useState("");

  // 新しいタイトルのstateを定義
  const [newTitle, setNewTitle] = useState("");

  const [newDate, setNewDate] = useState("");

  // フィルターのstateを定義
  const [filter, setFilter] = useState("all");

  // 絞り込まれたtodoリストのstateを定義
  const [filteredTodos, setFilteredTodos] = useState([]);

  const [inputId, setInputId] = useState(0);


  // input入力時にstateが更新される処理
  const handleAddFormChanges = (e) => {
    setTodoTitle(e.target.value);
  };

  // 期限の更新
  const handleDateChanges = (e) => {
    setNewDate(e.target.value);
  };

  // ボタンを押すと新しいtodoがtodoリストに追加される
  const handleAddTodo = (todoTitle) => {
    
    console.log("todoTitle = ", todoTitle);
    if (todoTitle === "") return;
    setTodos([
      ...todos,
      {
        id: Number(todos.length + 1),
        title: todoTitle,
        date: newDate,
        status: "notStarted",
        
      },
      
    ]);
    
    {router.query.title}
    setTodoTitle("");
    setNewDate("");
    
  };

  // 対象のtodoをリストから削除
  const handleDeleteTodo = (targetTodo) => {
    setTodos(todos.filter((todo) => todo !== targetTodo));
  };

  // 編集画面に切り替わる
  const handleOpenEditForm = (todo) => {
    setIsEditable(true);
    // idのstateを更新
    setEditId(todo.id);
    // 編集対象のtodoタイトルをinputに表示
    setNewTitle(todo.title);
  };

  // 通常画面に切り替わる
  const handleCloseEditForm = () => {
    setIsEditable(false);
    setEditId("");
  };

  // 編集用inputの入力値に応じてstateを更新
  const handleEditFormChange = (e) => {
    setNewTitle(e.target.value);
  };

  // 編集内容をtodoリストの配列に加える
  const handleEditTodo = () => {
    const newArray = todos.map((todo) =>
      todo.id === editId ? { ...todo, title: newTitle } : todo
    );
    setTodos(newArray);
    setNewTitle("");
    setEditId();
    handleCloseEditForm();
  };
  // 対象のtodoのステータスを更新した、新しいTodoリストの配列を作成
  const handleStatusChange = (targetTodo, e) => {
    const newArray = todos.map((todo) =>
      todo.id === targetTodo.id ? { ...todo, status: e.target.value } : todo
    );
    setTodos(newArray);
  };

  const filterTodoByDate = (selectedDate) => {
    if (selectedDate === "all") {
      setFilteredTodos(todos);
    } else {
      let fTodos = [];
      todos.forEach((todo) => {
        if (todo.date === selectedDate) {
          fTodos.push(todo);
        }
      });
      setFilteredTodos(fTodos);
    }
  };

  useEffect(() => {
    const filteringTodos = () => {
      switch (filter) {
        case "notStarted":
          setFilteredTodos(
            todos.filter((todo) => todo.status === "notStarted")
          );
          break;

        case "inProgress":
          setFilteredTodos(
            todos.filter((todo) => todo.status === "inProgress")
          );
          break;
        case "done":
          setFilteredTodos(todos.filter((todo) => todo.status === "done"));
          break;

        default:
          setFilteredTodos(todos);
      }
    };
    filteringTodos();
  }, [filter, todos]);

  const filterTodoById = (id) => {
    console.log("id =", id);
    if (id === "") {
      setFilteredTodos(todos);
    } else {
      let fTodos = [];
      todos.forEach((todo) => {
        if (todo.id == id) {
          console.log("todo.id =", todo.id);
          fTodos.push(todo);
        }
      });
      setFilteredTodos(fTodos);
    }
  };

  




  

  return (
    <>

      {isEditable ? (
        <>
        <div className="title">
        <p>Todoの編集</p>
        </div>
          <div className="edit-area">
            <input
              type="text"
              label="新しいタイトル"
              placeholder="Todoを編集"
              value={newTitle}
              onChange={handleEditFormChange}
            />
            <button 
            className="editsave-button"
            onClick={handleEditTodo}>編集を保存</button>
            <button 
            className="cancel-button"
            onClick={handleCloseEditForm}>キャンセル</button>
          </div>
        </>
      ) : (
        <>
      <div>
          <div className="title">
        <p>Todo-List</p>
      </div>
            <div className="input-area">
              <input
                type="text"
                label="タイトル"
                placeholder="Todoを入力"
                className="input"
                value={todoTitle}
                onChange={handleAddFormChanges}
              />
              <Link href="/create"><button className="add-button" onClick={() => handleAddTodo(todoTitle)}>追加</button></Link>
              <label className="date-limit">
                <span className="limit-text">期限: </span><input type="date" onChange={handleDateChanges} />
              </label>
            </div>
            
            <div className="filter-area">
            <input
              type="text"
              label="フィルタid"
              placeholder="数値を入力 空文字で解除"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
            />
            <button onClick={() => filterTodoById(inputId)}>
              idでフィルタ
            </button>

            <select 
              className = "date-limitfilter"
              onChange={(e) => filterTodoByDate(e.target.value)}>
              <option hidden>選択してください </option>
              <option value={"all"}>解除</option>
              {todos.map(
                (todo, index) =>
                  todo.date && (
                    <option value={todo.date} key={index}>
                      {todo.date}
                    </option>
                  )
              )}
            </select>

            <select
            className="status-filter" 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}>
              <option value="all">すべて</option>
              <option value="notStarted">未着手</option>
              <option value="inProgress">作業中</option>
              <option value="done">完了</option>
            </select>
            </div>
          </div>
        </>
      )}
      {/* 状態 */}
      <div className="todo-area">
      <ul>
        {filteredTodos.map((todo) => (
          <li className="list-row" key={todo.id}>
            <span className="id-text">ID:{todo.id} </span>
            <span className="title-text">{todo.title}</span>
            <span className="date-text">期限:{todo.date}</span>
            <select
              className="status-box"
              value={todo.status}
              onChange={(e) => handleStatusChange(todo, e)}
            >
              <option value="notStarted">未着手</option>
              <option value="inProgress">作業中</option>
              <option value="done">完了</option>
            </select>
            <Link href={{ pathname: "/edit", query: { title: todo.title } }}><button className="edit-button" 
            onClick={() => handleOpenEditForm(todo) }
            >  
              編集</button></Link>
            <button className="delete-button" onClick={() => handleDeleteTodo(todo)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
      
    </>
  );
}

export default App;
