import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { todoState } from "../components/atoms";

// 修正済み（22.7.24）
function Edit () {

  const router = useRouter();
  // 編集したいtodoのidの状態を定義
  const [editId, setEditId] = useState(Number(router.query.id));
  // 新しいタイトルのstateを定義
  const [newTitle, setNewTitle] = useState(router.query.title);

  const [recoilTodos, setRecoilTodos] = useRecoilState(todoState)

   // 編集用inputの入力値に応じてstateを更新
    const handleEditFormChange = (e) => {
    setNewTitle(e.target.value);
  };

  // 編集内容をtodoリストの配列に加える
  const handleEditTodo = () => {
    const newArray = recoilTodos.map((todo) =>{
      return todo.id === editId ? { ...todo, title: newTitle } : todo
    }
    );
    setRecoilTodos(newArray);
    setNewTitle("");
    setEditId();
  };

  const handleStatusChange = (targetTodo, e) => {
    const newArray = recoilTodos.map((todo) =>
      todo.id === targetTodo.id ? { ...todo, status: e.target.value } : todo
    );
    setRecoilTodos(newArray);
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
        <Link href={{ pathname: "/", query: { title: newTitle } }}>
          <button 
            className="editsave-button"
            onClick={handleEditTodo}>
              編集を保存
          </button>
        </Link>
        <Link href="/">
          <button 
            className="cancel-button">
              キャンセル
          </button>
        </Link>
      </div>
  </>
  )
}
export default Edit;