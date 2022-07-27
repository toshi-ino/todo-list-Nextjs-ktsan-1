import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { todoState } from "../components/atoms";
import { db } from "../lib/firebase";

const App = () => {
  const router = useRouter();

  // Todoリストのstateを定義
  const [todos, setTodos] = useState([]);
  const [newDate, setNewDate] = useState("");
  // フィルターのstateを定義
  const [filter, setFilter] = useState("all");
  // 絞り込まれたtodoリストのstateを定義
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [inputId, setInputId] = useState(0);
  const [recoilTodos, setRecoilTodos] = useRecoilState(todoState);

  useEffect(() => {
    const unSub = db.collection("todos").onSnapshot((snapshot) => {
      setRecoilTodos(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          status: doc.data().status,
          date: doc.data().date,
        }))
      );
    });
    return () => unSub();
  }, []);

  // 期限の更新
  const handleDateChanges = (e) => {
    setNewDate(e.target.value);
  };

  // 対象のtodoをリストから削除
  // 修正済み（22.7.24）
  const handleDeleteTodo = (targetTodo) => {
    const filteredtodos = recoilTodos.filter((todo) => todo !== targetTodo);
    setRecoilTodos(filteredtodos);
    setFilteredTodos(filteredtodos);

    db.collection("todos").doc(targetTodo.id).delete();
  };

  // 対象のtodoのステータスを更新した、新しいTodoリストの配列を作成
  const handleStatusChange = (targetTodo, e) => {
    const newArray = recoilTodos.map((todo) => {
      if (todo.id === targetTodo.id) {
        db.collection("todos")
          .doc(todo.id)
          .set({ status: e.target.value }, { merge: true });

        return { ...todo, status: e.target.value };
      } else {
        return todo;
      }
    });
    setRecoilTodos(newArray);
    setFilteredTodos(newArray);
  };

  const filterTodoByDate = (selectedDate) => {
    if (selectedDate === "all") {
      setFilteredTodos(recoilTodos);
    } else {
      let fTodos = [];
      recoilTodos.forEach((todo) => {
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
            recoilTodos.filter((todo) => todo.status === "notStarted")
          );
          break;

        case "inProgress":
          setFilteredTodos(
            recoilTodos.filter((todo) => todo.status === "inProgress")
          );
          break;
        case "done":
          setFilteredTodos(
            recoilTodos.filter((todo) => todo.status === "done")
          );
          break;

        default:
          setFilteredTodos(recoilTodos);
      }
    };
    filteringTodos();
  }, [filter, recoilTodos]);

  const filterTodoById = (id) => {
    if (id === "") {
      setFilteredTodos(recoilTodos);
    } else {
      let fTodos = [];
      recoilTodos.forEach((todo) => {
        const comparableId = todo.id;
        if (comparableId.includes(String(id))) {
          fTodos.push(todo);
        }
      });
      setFilteredTodos(fTodos);
    }
  };

  return (
    <>
      <div>
        <div className="title">
          <p>Todo-List</p>
        </div>

        <div className="input-area">
          <Link href="/create">
            <button className="add-button">追加</button>
          </Link>
        </div>

        <div className="filter-area">
          <input
            type="text"
            label="フィルタid"
            placeholder="文字または数値を入力 空文字で解除"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
          />
          <button onClick={() => filterTodoById(inputId)}>idでフィルタ</button>

          <select
            className="date-limitfilter"
            onChange={(e) => filterTodoByDate(e.target.value)}
          >
            <option hidden>選択してください </option>
            <option value={"all"}>解除</option>
            {recoilTodos.map(
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
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">すべて</option>
            <option value="notStarted">未着手</option>
            <option value="inProgress">作業中</option>
            <option value="done">完了</option>
          </select>
        </div>
      </div>

      {/* 状態 */}
      <div className="todo-area">
        {!filteredTodos.length ? (
          <p>todoが登録されていません</p>
        ) : (
          <ul>
            {filteredTodos?.map((todo) => (
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

                <Link
                  href={{
                    pathname: "/edit",
                    query: { title: todo.title, id: todo.id },
                  }}
                >
                  <button className="edit-button">編集</button>
                </Link>

                <button
                  className="delete-button"
                  onClick={() => handleDeleteTodo(todo)}
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default App;
