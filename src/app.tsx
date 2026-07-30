import { ArrowDown, ArrowUpRight, Circle } from "lucide-react"

import { Type4Taste } from "./type4taste/type4taste"

export function App() {
  return (
    <div className="app-shell">
      <div className="demo-topbar">
        <a className="demo-product" href="#top" aria-label="Type4Taste 首页">
          <span>Type4Taste</span>
          <sup>prototype 01</sup>
        </a>
        <p>
          这是一张可操作的字体校样页。点击右下角工具，然后选择任意文字。
        </p>
        <a className="demo-source-link" href="#how-it-works">
          How it works
          <ArrowDown size={13} />
        </a>
      </div>

      <main id="top" data-demo-root className="specimen-page">
        <nav className="specimen-nav" aria-label="示例网站导航">
          <a data-type-role="brand" className="specimen-brand" href="#top">
            Common Form
          </a>
          <div>
            <a data-type-role="ui" href="#essay">
              Essays
            </a>
            <a data-type-role="ui" href="#notes">
              Field notes
            </a>
            <a data-type-role="ui" href="#about">
              About
            </a>
          </div>
          <span data-type-role="mono">Issue 07 · 2026</span>
        </nav>

        <header className="specimen-hero">
          <div className="specimen-hero-index">
            <span data-type-role="mono">Reading systems</span>
            <span data-type-role="mono">CN / EN</span>
          </div>
          <h1 data-type-role="display">
            字体不是声音，
            <br />
            <em>却会改变一句话的语气。</em>
          </h1>
          <div className="specimen-hero-foot">
            <p data-type-role="body">
              字体选择很少发生在孤立的字形表里。它发生在标题换行、正文灰度、
              中英混排和按钮宽度共同形成的页面中。
            </p>
            <a data-type-role="ui" href="#essay">
              Read the essay
              <ArrowUpRight size={14} />
            </a>
          </div>
        </header>

        <section id="essay" className="specimen-article">
          <aside>
            <p data-type-role="mono">Essay 07</p>
            <dl>
              <div>
                <dt data-type-role="ui">Words</dt>
                <dd data-type-role="mono">1,284</dd>
              </div>
              <div>
                <dt data-type-role="ui">Reading</dt>
                <dd data-type-role="mono">06 min</dd>
              </div>
              <div>
                <dt data-type-role="ui">Scripts</dt>
                <dd data-type-role="mono">Hans / Latn</dd>
              </div>
            </dl>
          </aside>

          <article>
            <p data-type-role="body" className="specimen-lead">
              同一个词，用不同字体排出来，会显得像邀请、判断、命令，或者一段尚未说完的话。
              选字不是给内容套一种风格，而是在决定内容以怎样的姿态抵达读者。
            </p>
            <div className="specimen-columns">
              <div>
                <h2 data-type-role="display">先看它如何工作，再谈它像什么</h2>
                <p data-type-role="body">
                  一款字体是否适合长文，可以从字面大小、笔画灰度、标点位置和行间形成的纹理开始判断。
                  当这些基础关系不稳定时，再准确的品牌形容词也无法挽救阅读体验。
                </p>
                <p data-type-role="body">
                  中文与西文混排还增加了另一组变量：基线、视觉重心、数字宽度，以及英文小写在中文方块之间是否显得过轻。
                  These details are small, but the rhythm they create is not.
                </p>
              </div>
              <blockquote data-type-role="display">
                “好的字体选择，不是让人先注意字体，而是让内容以正确的速度被理解。”
                <cite data-type-role="ui">— A note on reading</cite>
              </blockquote>
            </div>
          </article>
        </section>

        <section id="notes" className="specimen-notes">
          <div className="specimen-section-heading">
            <p data-type-role="mono">Proofing notes</p>
            <h2 data-type-role="display">同一套字，需要通过不同尺度的考验。</h2>
          </div>
          <div className="specimen-note-grid">
            <article>
              <span data-type-role="mono">48–88 px</span>
              <h3 data-type-role="display">Display</h3>
              <p data-type-role="body">
                看标题的换行、重心和独特性。允许表达更强，但不能破坏中文标点与英文之间的节奏。
              </p>
            </article>
            <article>
              <span data-type-role="mono">16–20 px</span>
              <h3 data-type-role="display">Reading</h3>
              <p data-type-role="body">
                看段落灰度、字腔和长时间阅读压力。正文不是标题字体缩小之后的结果。
              </p>
            </article>
            <article>
              <span data-type-role="mono">10–14 px</span>
              <h3 data-type-role="display">Interface</h3>
              <p data-type-role="body">
                看按钮宽度、数字辨识和弱层级。空间越小，字体系统越需要克制。
              </p>
            </article>
          </div>
        </section>

        <footer id="about" className="specimen-footer">
          <div>
            <p data-type-role="mono">A working specimen for Type4Taste</p>
            <h2 data-type-role="brand">Common Form</h2>
          </div>
          <div className="specimen-footer-status">
            <Circle size={8} fill="currentColor" />
            <span data-type-role="ui">Ready for type inspection</span>
          </div>
        </footer>
      </main>

      <section id="how-it-works" className="product-explainer">
        <div>
          <p>What this proves</p>
          <h2>推荐只是候选，真实页面才是判断发生的地方。</h2>
        </div>
        <ol>
          <li>
            <span>选择</span>
            <p>从页面中取得真实文字、语义角色与 computed styles。</p>
          </li>
          <li>
            <span>试配</span>
            <p>按内容角色排列免费商用字体，并在原位即时加载。</p>
          </li>
          <li>
            <span>比较</span>
            <p>观察换行、灰度和混排变化，而不是只看字体名称。</p>
          </li>
        </ol>
      </section>

      <Type4Taste />
    </div>
  )
}
