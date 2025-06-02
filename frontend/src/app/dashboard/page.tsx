import styles from './Dashboard.module.css';

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

async function fetchAuthorPosts() {
  // This fetch automatically includes the JWT token via cookies
  const res = await fetch(`${getApiURL()}/post/posts?author=me`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json() as Promise<Post[]>;
}

export default async function Dashboard() {
  const posts = await fetchAuthorPosts();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Dashboard</h1>

      <section className={styles.section}>
        <h2>Your Posts</h2>
        <div className={styles.postList}>
          {posts.map((post, idx) => (
            <div key={idx} className={styles.postCard}>
              <h3>{post.heading}</h3>
              <p>{post.content}</p>
              <p className={styles.meta}>By {post.author} on {new Date(post.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Create New Post</h2>
        <form action="/api/post/create" method="POST" className={styles.form}>
          <input type="text" name="heading" placeholder="Heading" required />
          <textarea name="content" placeholder="Content" rows={4} required></textarea>
          <button type="submit">Post</button>
        </form>
      </section>
    </div>
  );
}