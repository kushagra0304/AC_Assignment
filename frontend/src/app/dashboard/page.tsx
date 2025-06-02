'use client'; // Ensure this component is a Client Component

import styles from './Dashboard.module.css';
import { useState, useEffect } from 'react';

type Post = {
  title: string;
  content: string;
  authorId: {
    name: string;
    email: string;
    id: string;
  };
  createdAt: string;
  id: string;
};

async function fetchAuthorPosts() {
  const res = await fetch('/api/post/get?author=me');
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json() as Promise<Post[]>;
}

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAuthorPosts()
      .then(setPosts)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const form = e.currentTarget; // Save form reference immediately
  
    const formData = new FormData(form);
    const data = {
      title: formData.get('heading'),
      content: formData.get('content'),
    };
  
    try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!res.ok) throw new Error('Failed to create post');
  
      const newPosts = await fetchAuthorPosts();
      setPosts(newPosts);
  
      form.reset(); // Use saved form reference here, safe after await
    } catch (err) {
      console.error(err);
      setError('Error creating post');
    }
  };
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Dashboard</h1>

      <section className={styles.section}>
        <h2>Your Posts</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <div className={styles.postList}>
            {posts.map((post) => (
              <div key={post.id} className={styles.postCard}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <p className={styles.meta}>
                  By {post.authorId.name} on {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2>Create New Post</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input type="text" name="heading" placeholder="Heading" required />
          <textarea name="content" placeholder="Content" rows={4} required></textarea>
          <button type="submit">Post</button>
        </form>
      </section>
    </div>
  );
}
