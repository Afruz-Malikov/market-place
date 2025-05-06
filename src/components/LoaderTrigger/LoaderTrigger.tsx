import { useEffect, useRef, useState } from 'react';
import style from './loadertrigger.module.scss';

interface Props {
  onVisible: () => void;
}

const LoaderTrigger = ({ onVisible }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isMounted || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isScrollable = document.body.scrollHeight > window.innerHeight;
        if (entry.isIntersecting && isScrollable) {
          onVisible();
        }
      },
      { threshold: 1.0 },
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [isMounted, onVisible]);

  return (
    <div ref={ref} className={style.loader}>
      <div className={style.spinner} />
    </div>
  );
};

export default LoaderTrigger;
