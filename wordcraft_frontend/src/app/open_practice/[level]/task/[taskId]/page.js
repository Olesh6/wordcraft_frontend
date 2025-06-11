"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../../../../styles/taskPage.module.css";

export default function TaskPage() {
  const router = useRouter();
  const params = useParams();
  const {level, taskId } = params;

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userText, setUserText] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerState, setTimerState] = useState("stop");

  useEffect(() => {
    async function fetchTasksAndFindOne() {
      try {
        const res = await fetch(`http://localhost:3001/open_practice/${level}/?page=1&amount=100`);
        const tasks = await res.json();

        const found = tasks.find(task => task["task-id"] === Number(taskId));

        if (!found) throw new Error("Task not found");
        setTask(found);
      } catch (e) {
        router.back();
      } finally {
        setLoading(false);
      }
    }

    fetchTasksAndFindOne();
  }, [level, taskId]);


  useEffect(()=>{
    let intervalId;

    if(timerState === "start")
      intervalId = setInterval(() =>{setTimeLeft(prev => prev + 1);
    },1000);
    else if (timerState === "reset")
      setTimeLeft(0);

    return () => clearInterval(intervalId);
  },[timerState])



  if (loading) return <p className={styles.loading}>Loading Task...</p>;
  if (!task) return <p className={styles.error}>Task not found</p>;

  function showTime(){
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60;
    const real_time = `${minutes  ? (minutes+":"):""}${(seconds < 10) ? ("0"+seconds): seconds}`
    return real_time;
  }

  function wordCount(text){
    const amount = text.trim().split(/\s+/).filter(Boolean).length;
    return amount === 1 ? `${amount} word` : `${amount} words`;
  }

  return(
    <div className={styles["task-page"]}>

      <div className={styles["test-time"]}>
        <h1>{task["genre"]+": "+task["topic"]}</h1>

        <p className={styles["timer"]} role="button" 
          onClick={() => {
            if (timerState !== "start"){
              setTimerState("start")
              return;
            } else {
              setTimerState("stop")
            }}}>Time: {showTime()} {timeLeft >= 60 ? "minutes" : "seconds"}</p>
      </div>
  
      <div className={styles["description"]}>
        <h2><em>{task["task-intro"]}</em></h2><br></br>
        
        <h2>{task["question"]}</h2><br></br>

        <h2 className={styles["task-todo"]}>{task["task-todo"]}</h2>
      </div>
      
      <div className={styles["textarea-wrapper"]}>
        <textarea
          className={styles["user-text"]}
          placeholder="Start writing your answer here..."
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
        />

        <div className={styles["word-counter"]}>{wordCount(userText)}</div>
      </div>

      <div className={styles["task-button"]}>
        <button className={styles["button"]} onClick={() => setTimerState("start")}>Start Timer</button>
        <button className={styles["button"]} onClick={() => setTimerState("stop")}>Stop Timer</button>
        <button className={styles["button"]} onClick={() => setTimerState("reset")}>Reset Timer</button>
      </div>
    </div>
  );
}
