"use client"
import { useRouter } from "next/navigation";
import styles from "../styles/testSummary.module.css"



export default function TestSummary ({answersList, test, level}){
  const router = useRouter();
  const answered = answersList.filter(ans => ans.answer.trim() !== "").length;
  const testLength = test.tasks.length;
  const passed = answersList.filter(ans => {
    const task = test.tasks.find(t => t["task-id"] === ans.taskId);
    return wordCount(ans.answer) >= task["min-words"]}).length;
  
  function wordCount(text){
    return text.trim().split(/\s+/).filter(Boolean).length;}

  return(
    <div className={styles['review-page']}>
      <h1 className={styles["title"]}>Test Completed</h1>
      <h2 className={styles["group-title"]}>{level.toLocaleUpperCase()} / {test["task-group-title"]}:</h2>
      <h2 className={styles["description"]}>{test["test-description"]}</h2>

      <span className={styles["result"]}><strong>Result: </strong></span>
      <span className={`${styles["result"]} ${passed === testLength ? styles["passed-result"] : styles["failed-result"]}`}><strong>{`${passed === testLength ? "Test Passed" : "Test Failed" }`} ({`${passed}/${testLength}`})</strong></span>
      <br /> <br /> 
      <div className={styles["stats"]}>
        <p><strong>Total Tasks: {testLength}</strong></p>
        <p><strong>Answered: {answered}</strong></p>
        <p><strong>Passed: {passed}</strong></p>
        <p><strong>Failed: {testLength - passed}</strong></p>
      </div>
      <hr className={styles["divider"]}/>

      {answersList.map((ans, index) => {
        const task = test.tasks.find(t => t["task-id"] === ans.taskId);
        const words = wordCount(ans["answer"]);
        const minWords = task["min-words"];
        const passed = words >= minWords;

        return (
          <div key={ans.taskId} className={`${styles["review-item"]} ${passed ? styles["passed"] : styles["failed"]}`}>
  
            <div className={styles["review-article"]}>
              <h1>Task {index + 1 } of {test.tasks.length}</h1>
              <img
                src={passed ? "/icons/passed.png" : "/icons/failed.png"}
                alt={passed ? "Passed" : "Failed"}
                width={31}
                height={31}
                style={{ verticalAlign: "middle", marginRight: "6px" }}/>
            </div>
            <p className={styles["question"]}>{task["instruction"]}</p>
            
            {task["image-url"] && (
              <div className={styles["image-container"]}>
                <img 
                  src={`http://localhost:3001/images/${task["image-url"]}`}
                  alt="Task illustration"
                  className={styles["image"]} 
                />
              </div>
            )}

            <textarea value={ans.answer} readOnly rows="6" 
              className={styles["answer-box"]}/>

            <p className={styles["result-indicator"]}>
              ✍️ {words} {words === 1 ? "word" : "words"} written of minimum {minWords} — 
              {passed ? " Passed" : " Not Passed"}
            </p>

          </div>);
      })}

      <div className={styles["button-container"]}>
        <button onClick={() => router.push(`/timed_tests/${level}`)} className={styles["back-button"]}>Back to Test List
        </button>
      </div>
    </div>
  )
}