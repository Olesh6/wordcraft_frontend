import styles from "../styles/header.module.css"

export default function Header() {
  return(
    <header className={styles["app-header"]}>
      <div className={styles["navbar_logo"]}>WordCraft</div>

    </header>
  )
}
