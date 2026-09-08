import { useEffect, useState } from 'react';

/** 当前视口内最靠上的区块，用于导航高亮 */
export function useScrollSpy(ids: readonly string[], offset = 120) {
  const [active, setActive] = useState<string>(ids[0] ?? '');

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      let current = '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - offset <= 0) current = id;
      }
      // 接近页底时锁定最后一个区块，避免短区块抢不走高亮
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        current = ids[ids.length - 1] ?? current;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ids, offset]);

  return active;
}
