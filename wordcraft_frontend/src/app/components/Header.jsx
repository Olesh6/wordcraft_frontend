import styles from "../styles/header.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return(
    <header className={styles["app-header"]}>
      
      <Link href={"/"} passHref className={styles["logo-link"]}>
        <div className={styles["app-logo-container"]}>
          <div className={styles["app-title"]}>WordCraft</div>

          <Image
            src="/icons/writing.png"
            alt="Logo"
            width={34}
            height={34}
            className={styles["app-logo"]}
          />
        </div>
      </Link>

    </header>
  )
}
