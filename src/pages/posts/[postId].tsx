import Error from 'next/error';
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';

export default function SinglePostPage() {
  const router = useRouter();
  const postId = router.query.postId as string;

  const { isLoading, data } = trpc.useQuery(['posts.single-post', { postId }]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <Error statusCode={404} />;
  }
  return (
    <div style={{ border: '1px solid white' }}>
      <h1>{data?.title}</h1>
      <p>{data?.body}</p>
    </div>
  );
}
