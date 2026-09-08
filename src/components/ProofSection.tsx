import { useState } from 'react';
import { TESTS } from '../data/site';

export function ProofSection() {
  const [selectedId, setSelectedId] = useState(TESTS[0].id);
  const selected = TESTS.find((test) => test.id === selectedId) ?? TESTS[0];

  return (
    <section className="section proof" id="proof">
      <div className="container">
        <header className="section-head">
          <h2 className="t-h2 section-head__title">
            八项测试，一批面料里随机取五卷，取最差的那个值。
          </h2>
          <p className="t-lede">
            标称值来自供应商，实测值来自我们自己的材料室。下面每一项都可以点开看它怎么做、以及它对你的装备寿命意味着什么。
          </p>
        </header>

        <div className="tick-rule" aria-hidden="true" />

        <div className="proof__body">
          <ul className="proof__table" role="list">
            <li className="proof__thead" aria-hidden="true">
              <span>实测项目</span>
              <span>测试方法</span>
              <span>标准要求</span>
              <span>脊线实测</span>
            </li>
            {TESTS.map((test) => {
              const isActive = test.id === selected.id;
              return (
                <li key={test.id} className="proof__row" data-active={isActive || undefined}>
                  <button
                    type="button"
                    className="proof__row-btn"
                    aria-pressed={isActive}
                    aria-controls="proof-detail"
                    onClick={() => setSelectedId(test.id)}
                  >
                    <span className="proof__item">
                      {test.item}
                      <span className="proof__why-hint">{isActive ? '收起' : '看这项怎么做'}</span>
                    </span>
                    <span className="proof__method t-data">{test.method}</span>
                    <span className="proof__req t-data">
                      <em>要求</em>
                      {test.requirement}
                    </span>
                    <span className="proof__result t-data">
                      <em>实测</em>
                      {test.result}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="proof__detail care-label" id="proof-detail" aria-live="polite">
            <div className="proof__detail-head">
              <span className="proof__detail-code t-data">{selected.method}</span>
              <span className="proof__pass proof__pass--lg">通过</span>
            </div>
            <h3 className="t-h3">{selected.item}</h3>
            <p className="proof__why">{selected.why}</p>
            <div className="proof__compare">
              <div>
                <span className="t-micro">标准要求</span>
                <span className="t-data proof__compare-value">{selected.requirement}</span>
              </div>
              <div>
                <span className="t-micro">脊线实测</span>
                <span className="t-data proof__compare-value proof__compare-value--blaze">
                  {selected.result}
                </span>
              </div>
            </div>
            <p className="proof__detail-text">{selected.detail}</p>
            <p className="t-micro proof__sign">
              材料室 · 成都 · 报告编号 MR-{selected.id.slice(0, 3).toUpperCase()}-2609
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
