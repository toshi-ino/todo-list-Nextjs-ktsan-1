import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { todoState } from "../components/atoms";
import Link from "next/link";

// 修正済み（22.7.24）
const Create = () => {

  const [todoTitle, setTodoTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [recoilTodos, setRecoilTodos] = useRecoilState(todoState)
  // input入力時にstateが更新される処理
  const handleAddFormChanges = (e) => {
    setTodoTitle(e.target.value);
  };

  const handleDateChanges = (e) => {
    setNewDate(e.target.value);
  };


  const handleAddTodo = (todoTitle) => {
    console.log("todoTitle = ", todoTitle);
    if (todoTitle === "") return;
    // 新規のtodoはRecoilにセットしました
    setRecoilTodos([
      ...recoilTodos,
      {
        id: Number(recoilTodos.length + 1),
        title: todoTitle,
        date: newDate,
        status: "notStarted",
      },
    ]
    );
    setTodoTitle("");
    setNewDate("");
  };
  return (
    <>
    <div className="input-area">
      <input
        type="text"
        label="タイトル"
        placeholder="Todoを入力"
        className="input"
        value={todoTitle}
        onChange={handleAddFormChanges}
      />
      <label className="date-limit">
        <span className="limit-text">期限: </span><input type="date" onChange={handleDateChanges} />
      </label>
      <Link href={{ pathname: "/", query: { title: recoilTodos  } }}>
        <button className="add-button" onClick={() => handleAddTodo(todoTitle)}>保存</button>
      </Link>

    </div>
    </>
  )
}
export default Create;