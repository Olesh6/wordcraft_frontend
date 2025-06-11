"use client";
import { useRouter, useParams } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import styles from "../../../../styles/testPage.module.css"
import TestSummary from "../../../../components/TestSummary.jsx"
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export default function TestPage() {
  const router = useRouter();
  const params = useParams();
  const {level, testId } = params;

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);

  const timerRef = useRef(null);
  const currentAnswerRef = useRef("");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchTestsAndFindOne() {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/timed_tests/test/${level}/${testId}`);
        const found = await res.json();

        if (!found) throw new Error("Test not found");
        setTest(found);
      } catch (e) {
        router.back();
      } finally {
        setLoading(false);
      }
    }
    fetchTestsAndFindOne()
  },[level, testId]);

  function handleStart(){
    const firstTask = test.tasks[0];
    const time = (firstTask["time_limit_min"] || 1) * 60;
    setStarted(true);
    setTimeLeft(time);
  }

  useEffect(() => {
    if (!started || sessionFinished) return;
    if (timerRef.current) 
      clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmitAnswer();  
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [started, currentIndex, sessionFinished]);

  // setting currentAnswer
  useEffect(() => { 
    if (!test) return;
    const taskId = test.tasks[currentIndex]["task-id"];
    const existing = answers.find(ans => ans.taskId === taskId);
    const answerText = existing ? existing.answer : "";
    setCurrentAnswer(answerText);
    currentAnswerRef.current = answerText;
  }, [currentIndex, answers]);
  function handleFinish(){
    setIsOpen(true);
  }
  function handleSubmitAnswer(){
    if (!test) return;
    const taskId = test.tasks[currentIndex]["task-id"];

    setAnswers(prev => {
      const exists = prev.find(ans => ans.taskId === taskId);
      if (exists) {
         return prev.map(ans => ans.taskId === taskId ? { ...ans, answer: currentAnswerRef.current, isSubmitted: true } : ans);
      } else {
        return [...prev, { taskId, answer: currentAnswerRef.current, isSubmitted: true }]
      }
    });

    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex < test.tasks.length) {
        const nextTask = test.tasks[nextIndex];
        const time = (nextTask.time_limit_min || 1) * 60;
        setTimeLeft(time);
        setCurrentIndex(nextIndex);
      } else {
        setSessionFinished(true);
      }
      setIsOpen(false);
    }, 0);
  }
  function handleBack(){
    const taskId = test.tasks[currentIndex]["task-id"];
    const exists = answers.find(task => task.taskId === taskId);

    // if it was not saved then save it 
    if (exists === undefined){
      //create new Answer
      setAnswers(prev => [...prev, {taskId, answer: currentAnswer, "isSubmitted": false}]);
    } else if (exists["isSubmitted"] === false){
      setAnswers(prev => prev.map(ans => ans.taskId === taskId ? {...ans, answer: currentAnswer} : ans))
    }
    setCurrentIndex(prev => prev-1);
  }
  function handleNext(){
    const taskId = test.tasks[currentIndex]["task-id"];
    const exists = answers.find(task=>task.taskId===taskId);

    // if it isn't added in answers database then just call submit
    if(exists === undefined){
      setIsOpen(true);

    // if answer exists in answers database and it was submitted then just change currIndex
    } else if (exists !== undefined && (exists["isSubmitted"] === true)){
      setCurrentIndex(prev => prev+1);
    } else { //
      setIsOpen(true);
    }

  }
  function wordCount(text){
    const amount = text.trim().split(/\s+/).filter(Boolean).length;
    return amount === 1 ? `${amount} word` : `${amount} words`;
  }
  if (loading) return <p >Loading Task...</p>; //className={styles.loading}
  if (!test) return <p>Task not found</p>;
  
  if (!started) {
    return (
      <div className={styles['start-screen']}>
        <h2 className={styles['start-title']}>{test["test-description"]}</h2>
        <p className={styles['start-info']}>Test has <strong>{test.tasks.length}</strong> tasks</p>
        <p className={styles['start-info']}>Minimum words per task: {test["min-words"]}</p>
        <p className={styles['start-info']}>Minimum minutes per task: {test["min-time"] || 0}</p>
        <p className={styles['start-help']}>You have a limited time for each answer. Try to write your response before the time runs out.</p>

        <div className={styles["button-container"]}>
          <div className={styles["back-icon"]}>
            <img 
              src="/icons/back_btn.png"
              alt="back"
              role="button"
              width={35}
              height={35}
              className={styles["img-logo"]}
              onClick={() => router.push(`/timed_tests/${level}`)}
            />
          </div>

          <button className={styles['start-button']} onClick={handleStart}>Start test</button>
        </div>

      </div>
    );
  }
  if (sessionFinished){
    if (!test || !level || !answers){
      return <div>Something went wrong</div>}
    return <TestSummary answersList={answers} test={test} level={level}/>
  }

  const currentTask = test.tasks[currentIndex];
  const { title, instruction, vocabulary } = currentTask;
  const taskId = currentTask["task-id"];
  const existingAnswer = answers.find(ans => ans.taskId === taskId);
  const isDisabled = (existingAnswer === undefined || existingAnswer["isSubmitted"] === false) ? false : true;
  const isLastTask = currentIndex === test.tasks.length-1;
  function showTime(){
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60;
    const real_time = `${minutes  ? (minutes+":"):""}${(seconds < 10) ? ("0"+seconds): seconds}`
    return real_time;
  }
  // test display
  return(
    <div className={styles["page"]}>
      <div className={styles["test-time"]}>
        <h1>Task {currentIndex + 1} of {test.tasks.length}</h1>
        <p className={`${styles["timer"]} ${(timeLeft<60) ? styles['timerWarning']:""}`}>Time left: {showTime()} {timeLeft >= 60 ? "minutes" : "seconds"}</p>
      </div>
      <hr className={styles["divider"]} />

      <p>{currentTask.question}</p>
      <h3 className={styles["topic"]}>{title}</h3>
      <p className={styles["instruction"]}>{instruction}</p>

      {currentTask["image-url"] && (
        <div className={styles["image-container"]}>
          <img 
            src={`${BACKEND_BASE_URL}/images/${currentTask["image-url"]}`}
            alt="Task illustration"
            className={styles["image"]} 
          />
        </div>
      )}

      {vocabulary && (<div className={styles["vocabulary"]}>{vocabulary}</div>)}

      <div className={styles["textarea-wrapper"]}>
        <textarea id="userAnswer" rows="5" cols="60" placeholder="Your answer..." value={currentAnswer} disabled={isDisabled} 
        onChange={(e) => {setCurrentAnswer(e.target.value); currentAnswerRef.current = e.target.value;}}/>

        <div className={styles["word-counter"]}>{wordCount(currentAnswerRef.current)}  (recommended {test.tasks[currentIndex]["min-words"]} words)</div>
      </div>

      <br />
      <div className={styles["button-next"]}>
        {(currentIndex > 0) ? <button onClick={handleBack}>Back</button> 
          : <div></div>}

        {(currentIndex === test.tasks.length-1) ? (<button onClick={handleFinish}>Finish</button>) : (<button onClick={handleNext}>Next</button>)}
      </div>
      {isOpen && (
        <div className={styles["overlay"]}>
          <div className={styles["modal"]}>
            <h2 className={styles["modal-title"]}>{isLastTask ? "Submit Final Answer and Finish Test?" : "Submit your final answer?"}</h2>
            <p className={styles["modal-description"]}>{isLastTask ? "This is your last answer. After submitting, the test will be finished and you will not be able to make changes." : "After submitting your answer, you will not be able to make any changes."}
            </p>
            <div className={styles["button-next"]}>
              <button onClick={() => setIsOpen(false)}>Cancel</button>
              <button onClick={handleSubmitAnswer}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}