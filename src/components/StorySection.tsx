import { FACTS, STORY_TIMELINE } from '../data/site';

export function StorySection() {
  return (
    <section className="section story on-dark" id="story">
      <div className="container">
        <div className="story__grid">
          <div className="story__lead">
            <h2 className="t-h2">脊线的第一件产品，是一份报废清单。</h2>
            <p className="t-lede">
              2011 年，第一款硬壳在贡嘎转山途中开线七处。回来之后我们没有改配色，而是把那 480 件全部拆开，把线头、压胶和拉链条一片一片摊在桌上。
            </p>
            <p className="t-lede">
              从那以后，脊线的开发顺序一直是反的：先定测试方法与要求值，再去找能做到这个值的面料和五金，最后才谈版型。做不到的，就不进产品线。
            </p>
            <blockquote className="story__quote">
              <p>「一件装备的寿命不是由最好的一块布决定的，是由最先断的那根线决定的。所以我们只报最差值。」</p>
              <footer className="t-micro">—— 材料室负责人，成都，2026 年 3 月</footer>
            </blockquote>
          </div>

          <ol className="story__timeline" role="list">
            {STORY_TIMELINE.map((item) => (
              <li key={item.year} className="milestone">
                <span className="milestone__year">{item.year}</span>
                <div className="milestone__body">
                  <h3 className="milestone__title">{item.title}</h3>
                  <p className="milestone__text">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="tick-rule story__facts-rule" aria-hidden="true" />

        <dl className="story__facts">
          {FACTS.map((fact) => (
            <div key={fact.k} className="story__fact">
              <dt>{fact.k}</dt>
              <dd className="story__fact-value t-data">{fact.v}</dd>
              <span className="story__fact-note t-micro">{fact.note}</span>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
