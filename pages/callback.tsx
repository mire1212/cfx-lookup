import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    router.push('/');
  }, [router]);

  return <div>Processing login...</div>;
}

