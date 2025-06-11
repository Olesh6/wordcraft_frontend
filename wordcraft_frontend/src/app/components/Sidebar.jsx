'use client'
import styles from "../styles/sidebar.module.css"
import { useState } from "react"
import {useRouter} from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const [openLevelClicked, setOpenLevelClicked] = useState(""); 
  const [timedLevelClicked, setTimedLevelClicked] = useState("");
  const [showOpenLevels, setShowOpenLevels] = useState(false);
  const [showTimedLevels, setShowTimedLevels] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  function toggleSidebar(){
    setIsCollapsed(!isCollapsed);
  }
  function handleOpenPractice(){
    setShowOpenLevels(!showOpenLevels)
  }
  function handleTimedChallenges(){
    setShowTimedLevels(!showTimedLevels)
  }
  function goToOpenPracticePage(page){
    setOpenLevelClicked(page);
    router.push(`/open_practice/${page}`)
  }
  function goToTimedTestsPage(page){
    setTimedLevelClicked(page);
    router.push(`/timed_tests/${page}`)
  }

  return(
    <aside className={`${styles.sidebar} ${isCollapsed ? styles["sidebar--closed"] : ""}`}>
      
      <div className={`${styles['menu-div']} ${!isCollapsed ? "" : styles["collapsed"]}`}>
        <img role="button" alt="menu" src="/icons/menu.png" width="42" height="42" onClick={toggleSidebar} className={styles["menu"]}/>
      </div>

      <hr className={styles["divider"]}/>
      
      <div className={`${styles["top-content"]}  ${isCollapsed ? styles["top-collapsed"] : ""}`}>
        <button 
          className={`${styles["sidebarHeader"]} ${showOpenLevels ? styles["headerOpen"] : ""}`} onClick={handleOpenPractice}>
          Open Practice Tasks
        </button>

        <div className={`${styles.levels} ${showOpenLevels ? styles.levelsOpen : ""}`}>
              
              <button className={`${styles["level-a2"]} ${openLevelClicked==="a2" ? styles["a2-active"] : ""}`} 
              onClick={() => goToOpenPracticePage("a2")}>A2 Pre-Intermediate</button>

              <button className={`${styles["level-b1"]} ${openLevelClicked==="b1" ? styles["b1-active"] : ""}`} 
              onClick={() => goToOpenPracticePage("b1")}>B1 Intermediate</button>

              <button className={`${styles["level-b2"]} ${openLevelClicked==="b2" ? styles["b2-active"] : ""}`} 
              onClick={() => goToOpenPracticePage("b2")}>B2 Upper-Intermediate</button>

              <button className={`${styles["level-c1"]} ${openLevelClicked==="c1" ? styles["c1-active"] : ""}`} 
              onClick={() => goToOpenPracticePage("c1")}>C1 Advanced</button>
        </div>
            
        <button 
          className={`${styles["sidebarHeader"]} ${showTimedLevels ? styles["headerOpen"] :""}`}
          onClick={handleTimedChallenges}>
            Timed Challenges 
        </button>
            
        <div className={`${styles.levels} ${showTimedLevels ? styles.levelsOpen : ""}`}>
              <button className={`${styles["level-a2"]} ${timedLevelClicked==="a2" ? styles["a2-active"] : ""}`}
              onClick={() => goToTimedTestsPage("a2")}>A2 Pre-Intermediate</button>
              
              <button className={`${styles["level-b1"]} ${timedLevelClicked==="b1" ? styles["b1-active"] : ""}`}
              onClick={() => goToTimedTestsPage("b1")}>B1 Intermediate</button>

              <button className={`${styles["level-b2"]} ${timedLevelClicked==="b2" ? styles["b2-active"] : ""}`}
              onClick={() => goToTimedTestsPage("b2")}>B2 Upper-Intermediate</button>
            
        </div>

        <div className={styles["bottom-content"]}>
          <div className={styles["sidebarHeader"]}>Help center</div>
        </div>
      </div>
    </aside>
  )
}
