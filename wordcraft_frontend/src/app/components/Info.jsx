"use client"
import styles from "./../styles/info.module.css";
import { useState } from "react";

export default function Info(){

  const [showInfo, setShowInfo] = useState(false)


  return (
    <div>
      <div className={styles["help-icon"]}>
        <img
          src="/icons/info.png"
          alt="info"
          width={45}
          height={45}
          onClick={() => setShowInfo(prev => !prev)}        
        />
      </div>

      {showInfo && (
          <div className={styles["overlay"]}>
            <div className={styles["modal"]}>
              <h2 className={styles["modal-title"]}>How to Use WordCraft</h2>
              
              <p className={styles["modal-description"]}>
                Welcome to WordCraft! Improve your English with two types of tasks:
              </p>
              <ul className={styles["task-list"]}>
                <li>
                  <span className={styles["highlight-task"]}>Open Practice Tasks</span> - to practice at your own pace
                </li>
                <li>
                  <span className={styles["highlight-task"]}>Timed Tasks</span> - to challenge your speed. Each task shows a difficulty level (A2, B1, B2, or C1).
                </li>
              </ul>
              <p className={styles["modal-description"]}>
                For each task, it's **difficulty level** (from 1 to 3) is displayed right next to it, so you always know what to expect at your chosen level.
              </p>

              <p className={styles["modal-description"]}>
                Choose a level in the sidebar and start learning! Need help? Email us at <a href="mailto:support@wordcraft.com" className={styles["support-email"]}>support@wordcraft.com</a>
              </p>
          

            <div className={styles["close-button"]}>
              <img 
                src="/icons/cross.png"
                alt="cross"
                onClick={() => setShowInfo(false)}
                role="button"
                width={35}
                height={35}
                className={styles["cross"]}
              />
            </div>
            </div>
          </div>
      )}

    </div>
  )
}