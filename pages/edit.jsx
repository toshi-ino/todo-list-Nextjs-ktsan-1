import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {userState} from "../components/atoms"

function Edit () {


  const router = useRouter(); 

  const [todos, setTodos] = useState([]);

  const [isEditable, setIsEditable] = useState(false);

    // 編集したいtodoのidの状態を定義
  const [editId, setEditId] = useState("");

  // 新しいタイトルのstateを定義
  const [newTitle, setNewTitle] = useState(router.query.title);

    // 編集画面に切り替わる
    const handleOpenEditForm = (todo) => {
      setIsEditable(true);
      // idのstateを更新
      setEditId(todo.id);
      // 編集対象のtodoタイトルをinputに表示
      setNewTitle(todo.title);
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
  };

  const handleStatusChange = (targetTodo, e) => {
    const newArray = todos.map((todo) =>
      todo.id === targetTodo.id ? { ...todo, status: e.target.value } : todo
    );
    setTodos(newArray);
  };

  return (
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
        <Link href={{ pathname: "/", query: { title: newTitle } }}><button 
        className="editsave-button"
        onClick={handleEditTodo}>編集を保存</button></Link>
        <Link href="/"><button 
        className="cancel-button"
        >キャンセル</button></Link>
      </div>
    

    <div className="todo-area">
    <ul>
      {todos.map((todo) => (
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
        </li>
      ))}
    </ul>
    </div>
  </>
  )



}

export default Edit;