import React, { useState } from "react";
import Link from "next/link";


const Create = () => {

  const [todos, setTodos] = useState([]);
  const [todoTitle, setTodoTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [filter, setFilter] = useState("all");

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
    setTodos([
      ...todos,
      {
        id: Number(todos.length + 1),
        title: todoTitle,
        date: newDate,
        status: "notStarted",
      },
      
    ]);
    
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
              <Link href={{ pathname: "/", query: { title: todos  } }}><button className="add-button" onClick={() => handleAddTodo(todoTitle)}>保存</button></Link>
              <label className="date-limit">
                <span className="limit-text">期限: </span><input type="date" onChange={handleDateChanges} />
              </label>
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


</>
      





  )


}

export default Create;