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
    if (!trimmed) return '请填写收货人姓名，物流需要实名。';
    if (trimmed.length < 2) return '姓名至少 2 个字符。';
    return null;
  },
  phone: (value) => {
    const trimmed = value.trim();
    if (!trimmed) return '请填写手机号，排产与发货通知会发到这里。';
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
            选好尺码与配色后提交，我们按批次排产。第一批名额剩余 {BATCHES[0].seatsLeft} 位，提交后会收到确认与排产进度。
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
                  ，或者直接提交一份批次意向，开放时我们通知你。
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
              <li>提交不扣款，排产前二次确认尺码与金额</li>
              <li>尺码不合可免费换一次，来回运费我们承担</li>
              <li>3 000 公里质保，拉链 / 扣具 / 内衬备件单卖十年</li>
            </ul>
          </div>

          {receipt ? (
            <ReceiptCard batchLabel={`${batch.label} · ${batch.eta}`} />
          ) : (
            <form className="preorder__form care-label" ref={formRef} onSubmit={onSubmit} noValidate>
              <header className="preorder__form-head">
                <h3 className="t-h3">{lines.length ? '提交预订' : '提交批次意向'}</h3>
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
                    placeholder="用于接收实测报告"
                    autoComplete="email"
                  />
                  <FieldError id="email-error" message={errors.email} />
                  {!errors.email && (
                    <p className="field__hint" id="email-hint">
                      留空也可以，排产通知走短信。
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
                    我已阅读<a href="#proof">3 000 公里质保</a>与退换说明，同意按批次排产。
                  </span>
                </label>
                <FieldError id="terms-error" message={errors.terms} />
              </div>

              <div className="preorder__submit">
                <button type="submit" className="btn btn--block" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="spinner" aria-hidden="true" />
                      提交中
                    </>
                  ) : lines.length ? (
                    `提交预订 · ${formatPrice(subtotal)}`
                  ) : (
                    '提交批次意向'
                  )}
                </button>
                <p className="field__hint preorder__hint" aria-live="polite">
                  {Object.values(errors).some(Boolean)
                    ? '还有字段需要修正，检查后再次提交。'
                    : '提交后 24 小时内收到确认；未确认前排产不会开始。'}
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
          <h3 className="t-h3">预订已提交</h3>
          <p className="t-micro">
            确认短信已发往 {receipt.phone.slice(0, 3)}****{receipt.phone.slice(-4)}
            {receipt.email ? `，实测报告将发往 ${receipt.email}` : ''}
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
          <dt>提交时间</dt>
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
        {items.length === 0 && <li className="t-micro">意向预订：批次开放时按你的联系方式通知。</li>}
      </ul>

      {receipt.note && <p className="receipt__note">备注：{receipt.note}</p>}

      <ol className="receipt__next" role="list">
        <li>
          <strong>24 小时内</strong> 收到排产确认，核对尺码与金额
        </li>
        <li>
          <strong>裁剪前</strong> 可免费改一次尺码
        </li>
        <li>
          <strong>{batchLabel.split(' · ')[1]}</strong> 发货，附该批实测报告
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
