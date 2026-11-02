import Calculator from './components/Calculator';
import { BrandMark, HeroPlot } from './components/Logo';

const METHODS = [
  {
    no: '01',
    tag: 'Newton–Cotes',
    title: 'Trapezoidal Rule',
    desc: 'Approximates the area under the curve with straight-line trapezoids between consecutive sample points.',
  },
  {
    no: '02',
    tag: 'Newton–Cotes',
    title: 'Midpoint Rule',
    desc: "Builds rectangles from the function value at each interval's midpoint for a balanced estimate.",
  },
  {
    no: '03',
    tag: 'Newton–Cotes',
    title: "Simpson's 1/3 Rule",
    desc: 'Fits parabolas through consecutive points for higher-order accuracy — exact for quadratics.',
  },
];

const STEPS = [
  {
    icon: 'ƒ',
    no: 'STEP 01',
    title: 'Enter measurements',
    desc: 'Provide the interval, the sampled x and y values, and one midpoint value per interval.',
  },
  {
    icon: '∑',
    no: 'STEP 02',
    title: 'Compute',
    desc: 'A compiled C++ engine runs all three integration rules and the full error analysis.',
  },
  {
    icon: '√',
    no: 'STEP 03',
    title: 'Compare',
    desc: 'See each estimate with its absolute and percentage error, and the most accurate method.',
  },
];

const FEATURES = [
  {
    icon: 'ƒ',
    title: 'Three methods',
    desc: 'Trapezoidal, midpoint, and Simpson’s 1/3 rule computed side by side from one input.',
  },
  {
    icon: '≈',
    title: 'Error analysis',
    desc: 'Absolute and percentage error against a known reference value when you provide one.',
  },
  {
    icon: '≡',
    title: 'Method comparison',
    desc: 'The most accurate rule for your data is detected and highlighted automatically.',
  },
  {
    icon: '⚙',
    title: 'Real C++ engine',
    desc: 'Results come from the compiled NumeriCore backend, not approximations in the browser.',
  },
];

export default function App() {
  return (
    <>
      <nav className="nav">
        <div className="container nav-inner">
          <a className="brand" href="#top">
            <BrandMark />
            Numeri<span className="accent">Core</span>
          </a>
          <div className="nav-links">
            <a href="#methods">Methods</a>
            <a href="#how">How it works</a>
            <a href="#about">About</a>
          </div>
          <a className="btn btn-primary" href="#calculator">
            Open Calculator
          </a>
        </div>
      </nav>

      <header className="hero" id="top">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="kicker">// trapezoidal · midpoint · simpson</span>
            <h1>
              Integration you can <span className="grad">actually see.</span>
            </h1>
            <p className="hero-sub">
              Estimate definite integrals three ways, compare their errors, and watch which method
              wins — powered by a real C++ engine.
            </p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#calculator">
                Open Calculator →
              </a>
              <a className="btn btn-ghost" href="#how">
                How it works
              </a>
            </div>
            <div className="tech-row">
              <span>React</span>
              <span>TypeScript</span>
              <span>C++ engine</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="plot-chip">
              <span className="chip-label">∫₀⁴ x² dx</span>
              <span className="chip-value">≈ 21.3333</span>
            </div>
            <HeroPlot />
          </div>
        </div>

        <div className="container">
          <div className="stats">
            <div className="stat">
              <div className="stat-num">
                <span className="grad">3</span>
              </div>
              <div className="stat-label">Methods</div>
            </div>
            <div className="stat">
              <div className="stat-num">
                <span className="grad">∞</span>
              </div>
              <div className="stat-label">Calculations</div>
            </div>
            <div className="stat">
              <div className="stat-num">
                <span className="grad">100%</span>
              </div>
              <div className="stat-label">Interactive</div>
            </div>
          </div>
        </div>
      </header>

      <section className="section" id="methods">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Integration toolkit</span>
            <h2 className="section-title">Three rules. One workspace.</h2>
            <p className="section-desc">
              Explore the classical Newton–Cotes integration rules through calculations, errors, and a
              clear comparison table.
            </p>
          </div>
          <div className="grid grid-3">
            {METHODS.map((m) => (
              <article className="card method-card" key={m.no}>
                <div className="method-meta">
                  <span>Method {m.no}</span>
                  <span className="method-tag">{m.tag}</span>
                </div>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
                <a className="method-link" href="#calculator">
                  Open solver →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="calculator" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Try it</span>
            <h2 className="section-title">Integration workspace.</h2>
            <p className="section-desc">
              Enter a measurement set and run it through the backend. The sample below integrates
              f(x) = x² over [0, 4].
            </p>
          </div>
          <Calculator />
        </div>
      </section>

      <section className="section" id="how">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Simple workflow</span>
            <h2 className="section-title">From measurements to insight.</h2>
            <p className="section-desc">
              NumeriCore turns numerical integration into a clear, step-by-step experience.
            </p>
          </div>
          <div className="grid grid-3">
            {STEPS.map((s) => (
              <div className="step" key={s.no}>
                <div className="step-icon">{s.icon}</div>
                <div className="step-num">{s.no}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-band">
            <h2>Ready to integrate?</h2>
            <p>Turn a set of measurements into verified results in seconds.</p>
            <a className="btn btn-primary" href="#calculator">
              Open Calculator →
            </a>
          </div>
        </div>
      </section>

      <section className="section" id="about">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">About NumeriCore</span>
            <h2 className="section-title">Numerical integration, made understandable.</h2>
          </div>
          <div className="about-text" style={{ marginBottom: 40 }}>
            <p>
              NumeriCore is an interactive tool for definite integration. Instead of returning a single
              number, it shows how three classical methods estimate the same integral — and how close
              each one lands against a known value.
            </p>
            <p>
              Built with a React and TypeScript interface powered by a C++ numerical engine, it pairs a
              modern, responsive experience with genuine computational accuracy.
            </p>
          </div>
          <div className="grid grid-2">
            {FEATURES.map((f) => (
              <article className="card feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <a className="brand" href="#top">
            <BrandMark size={28} />
            Numeri<span className="accent">Core</span>
          </a>
          <span>Built with React, TypeScript &amp; a C++ engine.</span>
        </div>
      </footer>
    </>
  );
}
