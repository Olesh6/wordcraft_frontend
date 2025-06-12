"use client"
import { notFound } from "next/navigation";
import styles from "../../styles/taskList-content.module.css";
import TaskList from "../../components/TaskList.jsx";
import { useState } from "react";
import {use} from "react";
import Image from "next/image"

const allowedLevels = ["a2","b1","b2","c1"];


function getTitle(level){
    switch(level){
      case("a2"): return "A2 Pre-Intermediate";
      case("b1"): return "B1 Intermediate";
      case("b2"): return "B2 Upper-Intermediate";
      case("c1"): return "C1 Advanced";
    }
  }


export default function Level({params}){
  const { level } = use(params);
  const [clicked, setClicked] = useState(false);
  const [showTaskList, setShowTaskList] = useState(true);
  
  if(!allowedLevels.includes(level))
    return notFound();

  return(
    <div className={`${styles["level-page"]} ${clicked ? styles["clickedOpen"] : ""}`}>
      <div className={styles["header-block"]}>
        <div className={styles["text-side"]}>
          <h1 className={styles["title"]}>{getTitle(level)}</h1>
          <Image
            src="/icons/turn_on.png"
            alt="turn on"
            tabIndex={0}
            role="button"
            width={31}
            height={31}
            className={styles["turn-button"]}
            onClick={(e) => {
              e.stopPropagation();
              setClicked(prev => !prev)}}
            onKeyDown={(e) => {
              if (e.key === "Enter") 
                setShowTaskList(prev => !prev)}}
          />
        </div>
        <hr className={styles["divider"]}/>
      </div>
      
      { (showTaskList) && (
        <div className={styles["task-list"]}>
          <TaskList key={level} level={level} mode={"open_practice"}/>
        </div>
      )}
    </div>
  )
}