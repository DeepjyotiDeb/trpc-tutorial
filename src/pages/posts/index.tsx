import Link from 'next/link';
import { trpc } from '../../utils/trpc';

export default function PostListingPage() {
  const { isLoading, data } = trpc.useQuery(['posts.posts']);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {data?.map((post, id) => (
        <article key={id}>
          <p>{post?.title}</p>
          <Link href={`/posts/${post.id}`}>Read Post</Link>
        </article>
      ))}
    </div>
  );
}
