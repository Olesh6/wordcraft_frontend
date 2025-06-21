import styles from "./styles/main.module.css"
import Link from 'next/link';
export default function Home() {
  return (
    <div className={styles['pageContainer']}>
      <section className={styles['mainSection']}>
        <h1>Welcome to WordCraft!</h1>
        <p>
          Discover the limitless possibilities of language, improve your writing and reading skills, and master the art of words with our interactive tools.
        </p>
        <Link href="open_practice/a2">
          <button className={styles['mainButton']}>
            Start your practicing now
          </button>
        </Link>
      </section>

      <section className={styles['infoSection']}>
        <h2>What you will find in WordCraft?</h2>
        
        <div className={styles['featuresGrid']}>
          
          <Link href="/open_practice/a2" className={styles['featureLink']}>
            <div className={styles['featureItem']}>
              <h3>📚 Open Practice</h3>
              <p>Improve your language skills efficiently, and make learning enjoyable without time pressure at your own pace.</p>
            </div>
          </Link>
          
          <Link href="/open_practice/a2" className={styles['featureLink']}>
            <div className={styles['featureItem']}>
              <h3>📈 Personal Progress</h3>
              <p>Track your progress, get detailed analysis of your successes, and identify areas for improvement.</p>
            </div>
          </Link>

          <Link href="/timed_tests/a2" className={styles['featureLink']}>
            <div className={styles['featureItem']}>
              <h3>⏱️ Timed Challenges</h3>
              <p>Test your speed and accuracy under pressure. This will help you apply your knowledge for real-world communication.</p>
            </div>
          </Link>
        </div>
      </section>


      <section className={styles['callToActionSection']}>
        <h2>Ready to start?</h2>
        <p>Join thousands of users who have already improved their language skills with WordCraft.</p>
        <Link href="open_practice/a2">
          <button className={styles['mainButton']}>
            Start now
          </button>
        </Link>
      </section>
    </div>
  );
}
