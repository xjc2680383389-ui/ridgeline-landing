import { useMemo, useRef, useState, type FormEvent } from 'react';
import { BATCHES } from '../data/site';
import { formatPrice, getProduct } from '../data/catalog';
import { formatDateTime } from '../lib/format';
import { usePreorder, type PreorderForm } from '../state/PreorderContext';

type FieldName = 'name' | 'phone' | 'email' | 'batchId' | 'terms';

const EMPTY: PreorderForm = {
  name: '',
  phone: '',
  email: '',
  batchId: BATCHES[0].id,
  note: '',
  terms: '',
};

const validators: Record<FieldName, (value: string) => string | null> = {
  name: (value) => {
    const trimmed = value.trim();
    if (!trimmed) return '请填写测试姓名。';
    if (trimmed.length < 2) return '姓名至少 2 个字符。';
    return null;
  },
  phone: (value) => {
    const trimmed = value.trim();
    if (!trimmed) return '请填写测试手机号，仅用于本地表单演示。';
    if (!/^1[3-9]\d{9}$/.test(trimmed)) return '手机号格式不对，应为 11 位数字。';
    return null;
  },
  email: (value) => {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) return '邮箱格式不对，检查一下是否少了 @ 或域名。';
    return null;
  },
  batchId: (value) => (value ? null : '选择一个交付批次。'),
  terms: (value) => (value ? null : '请先确认质保与退换说明。'),
};

export function PreorderSection() {
  const { lines, units, subtotal, receipt, submitting, submit, setQty, removeLine, clear } =
    usePreorder();
  const [form, setForm] = useState<PreorderForm>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const batch = useMemo(
    () => BATCHES.find((item) => item.id === (receipt?.batchId ?? form.batchId)) ?? BATCHES[0],
    [receipt, form.batchId],
  );

  const update = (field: FieldName | 'note', value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field !== 'note' && touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validators[field](value) ?? undefined }));
    }
  };

  const validateField = (field: FieldName, value: string) => {
    const message = validators[field](value);
    setErrors((prev) => ({ ...prev, [field]: message ?? undefined }));
    return message;
  };

  const handleBlur = (field: FieldName) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, form[field]);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const fields: FieldName[] = ['name', 'phone', 'email', 'batchId', 'terms'];
    const found: Partial<Record<FieldName, string>> = {};
    fields.forEach((field) => {
      const message = validators[field](form[field]);
      if (message) found[field] = message;
    });
    setErrors(found);
    setTouched({ name: true, phone: true, email: true, batchId: true, terms: true });

    const firstError = fields.find((field) => found[field]);
    if (firstError) {
      const target = formRef.current?.querySelector<HTMLElement>(`[name="${firstError}"]`);
      target?.focus();
      return;
    }
    await submit(form);
  };

  return (
    <section className="section preorder" id="preorder">
      <div className="container">
        <header className="section-head">
          <h2 className="t-h2 section-head__title">
            预订按批次投产，不做多余库存。
          </h2>
          <p className="t-lede">
            本页为虚构品牌演示。选择装备后可在此浏览器保存清单；不会发送给商家、下单、付款或发送短信。
          </p>
        </header>

        <div className="preorder__grid">
          <div className="preorder__aside">
            <section className="listing care-label" aria-label="预订清单">
              <header className="listing__head">
                <h3 className="listing__title">预订清单</h3>
                <span className="listing__count t-data">
                  {units} 件 / {lines.length} 款
                </span>
              </header>

              {lines.length === 0 ? (
                <p className="listing__empty">
                  还没有选择型号。
                  <a href="#catalog" className="listing__empty-link">
                    去装备区看五款产品
                  </a>
                  ，或者保存一份不含装备的本地批次意向。
                </p>
              ) : (
                <ul className="listing__lines" role="list">
                  {lines.map((line) => {
                    const product = getProduct(line.productId);
                    if (!product) return null;
                    return (
                      <li key={line.key} className="listing__line">
                        <div className="listing__line-main">
                          <span className="listing__line-code t-data">{product.code}</span>
                          <span className="listing__line-name">{product.nameZh}</span>
                          <span className="listing__line-option t-micro">
                            {line.size} · {line.color}
                          </span>
                        </div>
                        <div className="stepper stepper--sm">
                          <button
                            type="button"
                            onClick={() => setQty(line.key, line.qty - 1)}
                            disabled={line.qty <= 1}
                            aria-label={`减少 ${product.code} 数量`}
                          >
                            −
                          </button>
                          <output className="t-data">{line.qty}</output>
                          <button
                            type="button"
                            onClick={() => setQty(line.key, line.qty + 1)}
                            disabled={line.qty >= 20}
                            aria-label={`增加 ${product.code} 数量`}
                          >
                            +
                          </button>
                        </div>
                        <span className="listing__line-price t-data">
                          {formatPrice(product.price * line.qty)}
                        </span>
                        <button
                          type="button"
                          className="listing__remove"
                          onClick={() => removeLine(line.key)}
                        >
                          <span className="sr-only">从清单移除 {product.nameZh}</span>
                          <span aria-hidden="true">✕</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              <div className="listing__foot">
                <span>合计</span>
                <span className="listing__total t-data">{formatPrice(subtotal)}</span>
              </div>
              {lines.length > 0 && (
                <button type="button" className="listing__clear" onClick={clear}>
                  清空清单
                </button>
              )}
              <div className="hazard" aria-hidden="true" />
            </section>

            <ul className="preorder__terms" role="list">
              <li>演示操作不扣款，不会创建订单或开始排产</li>
              <li>尺码不合可免费换一次，来回运费我们承担</li>
              <li>3 000 公里质保，拉链 / 扣具 / 内衬备件单卖十年</li>
            </ul>
          </div>

          {receipt ? (
            <ReceiptCard batchLabel={`${batch.label} · ${batch.eta}`} />
          ) : (
            <form className="preorder__form care-label" ref={formRef} onSubmit={onSubmit} noValidate>
              <header className="preorder__form-head">
                <h3 className="t-h3">{lines.length ? '保存演示清单' : '保存本地批次意向'}</h3>
                <span className="t-micro">带 * 的为必填项</span>
              </header>

              <div className="field">
                <label className="field__label" htmlFor="name">
                  <em className="field__req" aria-hidden="true">
                    *
                  </em>
                  收货人姓名
                </label>
                <input
                  id="name"
                  name="name"
                  className="field__input"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  aria-invalid={Boolean(errors.name) || undefined}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  placeholder="物流需要实名"
                  autoComplete="name"
                />
                <FieldError id="name-error" message={errors.name} />
              </div>

              <div className="field field--row">
                <div>
                  <label className="field__label" htmlFor="phone">
                    <em className="field__req" aria-hidden="true">
                      *
                    </em>
                    手机号
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    className="field__input"
                    value={form.phone}
                    inputMode="numeric"
                    onChange={(e) => update('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    aria-invalid={Boolean(errors.phone) || undefined}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    placeholder="11 位手机号"
                    autoComplete="tel"
                  />
                  <FieldError id="phone-error" message={errors.phone} />
                </div>
                <div>
                  <label className="field__label" htmlFor="email">
                    邮箱（选填）
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="field__input"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    aria-invalid={Boolean(errors.email) || undefined}
                    aria-describedby={errors.email ? 'email-error' : 'email-hint'}
                    placeholder="test@example.com（选填）"
                    autoComplete="email"
                  />
                  <FieldError id="email-error" message={errors.email} />
                  {!errors.email && (
                    <p className="field__hint" id="email-hint">
                      留空也可以；本页不会发送邮件或短信。
                    </p>
                  )}
                </div>
              </div>

              <fieldset className="field">
                <legend className="field__label">
                  <em className="field__req" aria-hidden="true">
                    *
                  </em>
                  交付批次
                </legend>
                <div className="batches">
                  {BATCHES.map((item) => (
                    <label
                      key={item.id}
                      className="batch"
                      data-active={form.batchId === item.id || undefined}
                      data-tight={item.seatsLeft < 60 || undefined}
                    >
                      <input
                        type="radio"
                        name="batchId"
                        value={item.id}
                        checked={form.batchId === item.id}
                        onChange={() => update('batchId', item.id)}
                      />
                      <span className="batch__label">{item.label}</span>
                      <span className="batch__eta t-data">{item.eta}</span>
                      <span className="batch__seats t-micro">
                        {item.note} · 剩 {item.seatsLeft} 位
                      </span>
                    </label>
                  ))}
                </div>
                <FieldError id="batchId-error" message={errors.batchId} />
              </fieldset>

              <div className="field">
                <label className="field__label" htmlFor="note">
                  备注（选填）
                </label>
                <textarea
                  id="note"
                  name="note"
                  className="field__input field__input--area"
                  rows={3}
                  maxLength={200}
                  value={form.note}
                  onChange={(e) => update('note', e.target.value)}
                  placeholder="例：腰头需要放长 2 cm；需要发票；工作日 18 点后送达"
                />
                <p className="field__hint">
                  <span className="t-data">{form.note.length}</span> / 200
                </p>
              </div>

              <div className="field field--check">
                <label className="field__label" htmlFor="terms">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={form.terms === 'yes'}
                    onChange={(e) => update('terms', e.target.checked ? 'yes' : '')}
                    onBlur={() => handleBlur('terms')}
                    aria-invalid={Boolean(errors.terms) || undefined}
                    aria-describedby={errors.terms ? 'terms-error' : undefined}
                  />
                  <span>
                    我已了解本页为概念演示，<a href="#proof">质保与测试资料</a>为展示内容。
                  </span>
                </label>
                <FieldError id="terms-error" message={errors.terms} />
              </div>

              <div className="preorder__submit">
                <button type="submit" className="btn btn--block" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="spinner" aria-hidden="true" />
                      保存中
                    </>
                  ) : lines.length ? (
                    `保存演示清单 · ${formatPrice(subtotal)}`
                  ) : (
                    '保存本地批次意向'
                  )}
                </button>
                <p className="field__hint preorder__hint" aria-live="polite">
                  {Object.values(errors).some(Boolean)
                    ? '还有字段需要修正，检查后再次保存。'
                    : '演示清单仅保存在当前浏览器，请勿填写真实联系方式。'}
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p className="field__error" id={id} role="alert">
      <span className="dot" aria-hidden="true" />
      {message}
    </p>
  );
}

function ReceiptCard({ batchLabel }: { batchLabel: string }) {
  const { receipt, editListing, notify } = usePreorder();
  if (!receipt) return null;

  const items = receipt.lines;
  const total = items.reduce((sum, line) => {
    const product = getProduct(line.productId);
    return sum + (product ? product.price * line.qty : 0);
  }, 0);

  return (
    <section className="receipt care-label" aria-label="预订回执">
      <div className="receipt__head">
        <span className="receipt__check" aria-hidden="true" />
        <div>
          <h3 className="t-h3">演示清单已保存</h3>
          <p className="t-micro">
            清单仅保存在此浏览器。未发送短信或邮件，未形成订单。
          </p>
        </div>
      </div>

      <div className="receipt__ref">
        <span className="t-micro">预订编号</span>
        <span className="receipt__ref-value t-data">{receipt.ref}</span>
      </div>

      <dl className="receipt__meta">
        <div>
          <dt>收货人</dt>
          <dd>{receipt.name}</dd>
        </div>
        <div>
          <dt>交付批次</dt>
          <dd>{batchLabel}</dd>
        </div>
        <div>
          <dt>保存时间</dt>
          <dd className="t-data">{formatDateTime(receipt.placedAt)}</dd>
        </div>
        <div>
          <dt>合计</dt>
          <dd className="t-data">{formatPrice(total)}</dd>
        </div>
      </dl>

      <ul className="receipt__lines" role="list">
        {items.map((line) => {
          const product = getProduct(line.productId);
          if (!product) return null;
          return (
            <li key={line.key}>
              <span className="t-data">{product.code}</span>
              <span>{product.nameZh}</span>
              <span className="t-micro">
                {line.size} · {line.color} · ×{line.qty}
              </span>
              <span className="t-data">{formatPrice(product.price * line.qty)}</span>
            </li>
          );
        })}
        {items.length === 0 && <li className="receipt__empty t-micro">尚未添加装备，可返回编辑并选择商品；此清单不会触发通知。</li>}
      </ul>

      {receipt.note && <p className="receipt__note">备注：{receipt.note}</p>}

      <ol className="receipt__next" role="list">
        <li>
          <strong>本地保存</strong> 刷新后可在同一浏览器恢复清单
        </li>
        <li>
          <strong>继续编辑</strong> 可修改尺码、数量和备注
        </li>
        <li>
          <strong>概念展示</strong> 商品、批次和价格均为演示资料
        </li>
      </ol>

      <footer className="receipt__foot">
        <button type="button" className="btn btn--sm btn--ghost" onClick={editListing}>
          修改预订
        </button>
        <button
          type="button"
          className="receipt__copy"
          onClick={() => {
            if (!navigator.clipboard) {
              notify(`请手动记录预订编号 ${receipt.ref}`);
              return;
            }
            navigator.clipboard.writeText(receipt.ref).then(
              () => notify(`预订编号 ${receipt.ref} 已复制`),
              () => notify('复制失败，请手动记录编号'),
            );
          }}
        >
          复制编号
        </button>
      </footer>
      <div className="hazard" aria-hidden="true" />
    </section>
  );
}
