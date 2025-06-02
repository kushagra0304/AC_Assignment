import styles from './Homepage.module.css';

// Define the type of a single post
type Post = {
  author: string;
  date: string;
  heading: string;
  content: string;
};

const getApiURL = () => {
  return process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_DEV_API_URL
    : process.env.NEXT_PUBLIC_PROD_API_URL;
};

// Server-rendered component (async)
export default async function Homepage() {
  // Fetch data from the API
  const res = await fetch(`${getApiURL()}/post/posts`, { cache: 'no-store' });
  const posts: Post[] = await res.json();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Blog Posts</h1>
      <div className={styles.postList}>
        {posts.map((post, index) => (
          <div key={index} className={styles.postCard}>
            <h2 className={styles.postHeading}>{post.heading}</h2>
            <p className={styles.postMeta}>
              By {post.author} on {new Date(post.date).toLocaleDateString()}
            </p>
            <p className={styles.postContent}>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
