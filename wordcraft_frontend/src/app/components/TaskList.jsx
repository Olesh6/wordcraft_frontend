"use client"
import { useEffect, useState } from "react";
import styles from "../styles/taskList-content.module.css";
import {useRouter} from "next/navigation";
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export default function TaskList({ level, mode}){
	const router = useRouter();
	const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

	function handleOpenTaskClick(taskId) {
    router.push(`/open_practice/${level}/task/${taskId}`);
  }

	function handleTestClick(testId) {
		router.push(`/timed_tests/${level}/test/${testId}`);
	}

	function content(){
		if (mode === "open_practice"){
			return tasks.map((task) => (
				<div key={task["task-id"]} className={styles["task-card"]}
					onClick={() => handleOpenTaskClick(task["task-id"])} role="button">
	
					<div className={styles["difficulty-bars"]}>
						{[1,2,3].map(i =>(
							<span key={i} className={`${styles["bar"]} ${i <= (task["difficulty"] || 0) ? styles["filled"] : ""}`}></span>
							))}
					</div>

					<div>
						<h3>{task["genre"]+":"}</h3>
					</div>			
					<p>{task["topic"]}</p>
				</div>
			))
		} else { 
			return tasks.map((task) => (
				<div key={task["test-id"]} className={styles["task-card"]} 
					onClick={() => handleTestClick(task["test-id"])} role="button">
						
					<div className={styles["difficulty-bars"]}>
						{[1,2,3].map(i =>(
							<span key={i} className={`${styles["bar"]} ${i <= (task["difficulty"] || 0) ? styles["filled"] : ""}`}></span>
							))}
					</div>	

					<h3>{task["test-description"]+":"}</h3>
					<p>{task["help-info"]}</p>
				</div>
			))
		}
	}

	async function loadTasks() {
		setLoading(true);
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/${mode}/${level}/?page=1&amount=100`);
      const allTasks = await res.json();	
      setTasks(allTasks);
			
    } catch (error) {
      console.error("Download error:", error);
    } 
		setLoading(false); 
	}

  useEffect(() => {
		setTasks([])
  	loadTasks(); 
	}, [level, mode]);

  return (
		<div className={styles["task-list"]}>
			{tasks.length === 0 && !loading && <p>Tasks are not found</p>}
			{content()}
		</div>
  );
}