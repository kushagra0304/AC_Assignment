import styles from './Homepage.module.css';

export default function Loading() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>Loading posts...</p>
    </div>
  );
}
