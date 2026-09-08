import { useEffect } from 'react';
import { usePreorder } from '../state/PreorderContext';

/** 清单与表单操作的即时反馈。状态变化时重新计时，不叠加多条。 */
export function Toast() {
  const { notice, notify } = usePreorder();

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => notify(null), 3600);
    return () => window.clearTimeout(timer);
  }, [notice, notify]);

  if (!notice) return null;

  return (
    <div className="toast" role="status" aria-live="polite">
      <span className="toast__dot" aria-hidden="true" />
      <p className="toast__text">{notice.text}</p>
      <button type="button" className="toast__close" onClick={() => notify(null)}>
        <span className="sr-only">关闭提示</span>
        <span aria-hidden="true">✕</span>
      </button>
    </div>
  );
}
