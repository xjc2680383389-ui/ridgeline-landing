import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import { PRODUCTS, getProduct } from '../data/catalog';
import { makeReference } from '../lib/format';

export interface PreorderLine {
  /** 型号 + 尺码 + 配色 唯一确定一行 */
  key: string;
  productId: string;
  size: string;
  color: string;
  qty: number;
}

export interface Receipt {
  ref: string;
  placedAt: string;
  name: string;
  phone: string;
  email: string;
  batchId: string;
  note: string;
  /** 条款确认留档 */
  terms: string;
  lines: PreorderLine[];
}

export interface PreorderForm {
  name: string;
  phone: string;
  email: string;
  batchId: string;
  note: string;
  /** 质保与退换说明确认，勾选为 'yes' */
  terms: string;
}

interface Notice {
  id: number;
  text: string;
}

interface State {
  lines: PreorderLine[];
  receipt: Receipt | null;
  submitting: boolean;
  notice: Notice | null;
}

type Action =
  | { type: 'hydrate'; lines: PreorderLine[]; receipt: Receipt | null }
  | { type: 'add'; line: PreorderLine }
  | { type: 'qty'; key: string; qty: number }
  | { type: 'remove'; key: string }
  | { type: 'clear' }
  | { type: 'submitting' }
  | { type: 'submitted'; receipt: Receipt }
  | { type: 'edit' }
  | { type: 'notice'; text: string | null };

const STORAGE_KEY = 'ridgeline.preorder.v1';

const initialState: State = { lines: [], receipt: null, submitting: false, notice: null };

const lineKey = (line: Omit<PreorderLine, 'key' | 'qty'>) => `${line.productId}|${line.size}|${line.color}`;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'hydrate':
      return { ...state, lines: action.lines, receipt: action.receipt };

    case 'add': {
      const existing = state.lines.find((line) => line.key === action.line.key);
      if (existing) {
        return {
          ...state,
          lines: state.lines.map((line) =>
            line.key === action.line.key ? { ...line, qty: Math.min(line.qty + action.line.qty, 20) } : line,
          ),
        };
      }
      return { ...state, lines: [...state.lines, action.line] };
    }

    case 'qty':
      return {
        ...state,
        lines: state.lines.map((line) =>
          line.key === action.key ? { ...line, qty: Math.max(1, Math.min(action.qty, 20)) } : line,
        ),
      };

    case 'remove':
      return { ...state, lines: state.lines.filter((line) => line.key !== action.key) };

    case 'clear':
      return { ...state, lines: [], receipt: null };

    case 'submitting':
      return { ...state, submitting: true };

    case 'submitted':
      return { ...state, submitting: false, receipt: action.receipt };

    case 'edit':
      return { ...state, receipt: null };

    case 'notice':
      return {
        ...state,
        notice: action.text === null ? null : { id: Date.now(), text: action.text },
      };

    default:
      return state;
  }
}

interface PreorderApi {
  lines: PreorderLine[];
  units: number;
  subtotal: number;
  receipt: Receipt | null;
  submitting: boolean;
  notice: Notice | null;
  hasProduct: (productId: string) => boolean;
  addLine: (line: Omit<PreorderLine, 'key'>) => void;
  setQty: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
  clear: () => void;
  submit: (form: PreorderForm) => Promise<Receipt>;
  editListing: () => void;
  notify: (text: string | null) => void;
}

const PreorderContext = createContext<PreorderApi | null>(null);

export function PreorderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<State>;
        const validIds = new Set(PRODUCTS.map((p) => p.id));
        const lines = (parsed.lines ?? []).filter(
          (line) => line && validIds.has(line.productId) && line.qty > 0,
        );
        dispatch({ type: 'hydrate', lines, receipt: parsed.receipt ?? null });
      }
    } catch {
      /* 本地缓存不可用时按空清单开始 */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ lines: state.lines, receipt: state.receipt }),
      );
    } catch {
      /* 隐私模式下忽略写入失败 */
    }
  }, [state.lines, state.receipt]);

  const notify = useCallback((text: string | null) => dispatch({ type: 'notice', text }), []);

  const hasProduct = useCallback(
    (productId: string) => state.lines.some((line) => line.productId === productId),
    [state.lines],
  );

  const addLine = useCallback(
    (line: Omit<PreorderLine, 'key'>) => {
      dispatch({ type: 'add', line: { ...line, key: lineKey(line) } });
      const product = getProduct(line.productId);
      notify(
        `${product?.code ?? '装备'} · ${line.size} / ${line.color} 已加入预订清单`,
      );
    },
    [notify],
  );

  const setQty = useCallback((key: string, qty: number) => dispatch({ type: 'qty', key, qty }), []);
  const removeLine = useCallback((key: string) => dispatch({ type: 'remove', key }), []);

  const clear = useCallback(() => {
    dispatch({ type: 'clear' });
    notify('预订清单已清空');
  }, [notify]);

  const subtotal = useMemo(
    () =>
      state.lines.reduce((sum, line) => {
        const product = getProduct(line.productId);
        return sum + (product ? product.price * line.qty : 0);
      }, 0),
    [state.lines],
  );

  const units = useMemo(() => state.lines.reduce((sum, line) => sum + line.qty, 0), [state.lines]);

  const submit = useCallback(
    (form: PreorderForm) => {
      dispatch({ type: 'submitting' });
      return new Promise<Receipt>((resolve) => {
        window.setTimeout(() => {
          const receipt: Receipt = {
            ref: makeReference(),
            placedAt: new Date().toISOString(),
            ...form,
            lines: state.lines,
          };
          dispatch({ type: 'submitted', receipt });
          notify(`预订已提交，编号 ${receipt.ref}`);
          resolve(receipt);
        }, 900);
      });
    },
    [state.lines, notify],
  );

  const editListing = useCallback(() => {
    dispatch({ type: 'edit' });
    notify('已返回编辑，清单保留');
  }, [notify]);

  const value = useMemo<PreorderApi>(
    () => ({
      lines: state.lines,
      units,
      subtotal,
      receipt: state.receipt,
      submitting: state.submitting,
      notice: state.notice,
      hasProduct,
      addLine,
      setQty,
      removeLine,
      clear,
      submit,
      editListing,
      notify,
    }),
    [
      state.lines,
      state.receipt,
      state.submitting,
      state.notice,
      units,
      subtotal,
      hasProduct,
      addLine,
      setQty,
      removeLine,
      clear,
      submit,
      editListing,
      notify,
    ],
  );

  return <PreorderContext.Provider value={value}>{children}</PreorderContext.Provider>;
}

export function usePreorder() {
  const ctx = useContext(PreorderContext);
  if (!ctx) throw new Error('usePreorder 必须在 PreorderProvider 内使用');
  return ctx;
}
