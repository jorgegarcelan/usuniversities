import Link from "next/link";
import { SiteHeader } from "./components/SiteHeader";
import { NotebookFigures } from "./components/NotebookFigures";
import { UniversityExplorer } from "./components/UniversityExplorer";
import { getUniversities } from "@/lib/universities";

const methods = [
  { number: "01", title: "Principal Component Analysis", short: "PCA", value: "61.7%", description: "Two principal components capture most of the structure, revealing a quality profile and an institutional scale profile." },
  { number: "02", title: "Factor Analysis", short: "FA", value: "53.1%", description: "Latent factors condense correlated measures into two interpretable forces: distinction and popularity." },
  { number: "03", title: "Clustering", short: "K", value: "2–3", description: "K-means, PAM and kernel methods test whether institutions naturally form stable, meaningful groups." },
];

export default function Home() {
  const universities = getUniversities();

  return (
    <main id="top">
      <SiteHeader />

      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Unsupervised learning · UC3M · 2021</p>
          <h1>The shape of <em>US higher education</em></h1>
          <p className="dek">
            What can 35 variables reveal about 1,302 American colleges? A visual exploration of quality, scale, selectivity and the divide between public and private institutions.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#explore">Explore the data <span>↘</span></a>
            <Link className="button button-quiet" href="/about">Read the methodology</Link>
          </div>
        </div>

        <div className="hero-visual" aria-label="The project turns 1,302 colleges and 35 variables into three analytical views and three interpretable patterns">
          <div className="flow-heading">
            <p>FIG. 01 / ANALYSIS FLOW</p>
            <span>From raw data to interpretable structure</span>
          </div>

          <div className="flow-pipeline">
            <div className="flow-stage">
              <span className="flow-label">INPUT</span>
              <strong>1,302</strong>
              <p>institutions</p>
            </div>
            <span className="flow-arrow" aria-hidden="true">→</span>
            <div className="flow-stage">
              <span className="flow-label">MEASURE</span>
              <strong>35</strong>
              <p>variables</p>
            </div>
            <span className="flow-arrow" aria-hidden="true">→</span>
            <div className="flow-stage">
              <span className="flow-label">MODEL</span>
              <strong>03</strong>
              <p>methods</p>
            </div>
          </div>

          <div className="flow-variables" aria-hidden="true">
            <span>Admissions</span><span>Scale</span><span>Spending</span><span>Outcomes</span>
          </div>

          <div className="flow-output">
            <p className="flow-label">WHAT THE MODELS REVEAL</p>
            <ol>
              <li><span>01</span><b>Institutional distinction</b></li>
              <li><span>02</span><b>Institutional scale</b></li>
              <li><span>03</span><b>Public–private divide</b></li>
            </ol>
          </div>
        </div>
      </section>

      <section className="intro-strip">
        <div className="shell intro-grid">
          <p className="section-number">01 / THE QUESTION</p>
          <h2>Universities look similar on paper.<br /><em>The data says otherwise.</em></h2>
          <p>By reducing dozens of measures into a handful of dimensions, the analysis uncovers the forces that most clearly distinguish one institution from another.</p>
        </div>
      </section>

      <section className="methods-section shell" id="findings">
        <div className="section-heading">
          <p className="section-number">02 / THREE LENSES</p>
          <h2>Finding structure<br />without a <em>label.</em></h2>
          <p>The project compares complementary unsupervised methods rather than relying on a single model.</p>
        </div>
        <div className="method-list">
          {methods.map((method) => (
            <article className="method-row" key={method.number}>
              <span className="method-number">{method.number}</span>
              <div><span className="method-short">{method.short}</span><h3>{method.title}</h3></div>
              <p>{method.description}</p>
              <strong>{method.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <NotebookFigures universities={universities} />

      <section className="explore-section" id="explore">
        <div className="shell">
          <div className="section-heading section-heading-light">
            <p className="section-number">04 / EXPLORE THE DATA</p>
            <h2>Where does each<br />institution <em>sit?</em></h2>
            <p>This direct view of the source data compares selectivity and graduation outcomes. It complements — rather than reproduces — the PCA model.</p>
          </div>
          <UniversityExplorer universities={universities} />
        </div>
      </section>

      <section className="findings-section shell">
        <div className="section-heading">
          <p className="section-number">05 / WHAT EMERGES</p>
          <h2>Three patterns<br />stand <em>out.</em></h2>
        </div>
        <div className="findings-grid">
          <article className="finding finding-large">
            <span className="finding-index">A</span><p className="finding-kicker">THE FIRST COMPONENT</p>
            <h3>A profile of institutional distinction</h3>
            <p>Higher graduation rates, instructional spending and academic preparation move together, while acceptance rate and student–faculty ratio tend to move in the opposite direction.</p>
            <div className="signal-profile" role="img" aria-label="PC1 loading direction: instructional spending, graduation, top 25 percent students and alumni giving are positive; acceptance rate and student-faculty ratio are negative">
              <div><span>Instructional spend</span><i /><b>+</b></div>
              <div><span>Graduation rate</span><i /><b>+</b></div>
              <div><span>Top 25% students</span><i /><b>+</b></div>
              <div><span>Alumni giving</span><i /><b>+</b></div>
              <div className="negative"><span>Acceptance rate</span><i /><b>−</b></div>
              <div className="negative"><span>Student–faculty ratio</span><i /><b>−</b></div>
            </div>
          </article>
          <article className="finding finding-orange">
            <span className="finding-index">B</span><p className="finding-kicker">THE SECOND COMPONENT</p>
            <h3>Scale changes the picture</h3>
            <p>Large public institutions occupy a different statistical space from smaller private colleges.</p>
            <strong>38,338</strong><small>maximum undergraduate population</small>
          </article>
          <article className="finding finding-dark">
            <span className="finding-index">C</span><p className="finding-kicker">THE CLUSTERS</p>
            <h3>Type is a powerful separator</h3>
            <p>When institution type is included, several models recover a strong public–private divide.</p>
            <div className="cluster-diagram" aria-hidden="true">
              <div className="cluster-group cluster-public">
                <span>PUBLIC</span>
                <div>{Array.from({ length: 9 }, (_, index) => <i key={`public-${index}`} />)}</div>
              </div>
              <div className="cluster-divider"><span>TYPE</span></div>
              <div className="cluster-group cluster-private">
                <span>PRIVATE</span>
                <div>{Array.from({ length: 9 }, (_, index) => <i key={`private-${index}`} />)}</div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="caveat-section">
        <div className="shell caveat-grid">
          <p className="section-number">06 / READ WITH CARE</p>
          <div><h2>This is a historical analysis,<br /><em>not a current ranking.</em></h2><p>The source was used in the 1995 ASA Statistical Graphics Data Exposition. “Quality” and “elite” are analytical interpretations created within the project, not official classifications. Costs are nominal historical values.</p></div>
          <Link className="round-link" href="/about"><span>Read the full<br />methodology</span><b>↗</b></Link>
        </div>
      </section>

      <footer className="site-footer shell">
        <p><b>College by College</b><br />A statistical learning project by Jorge Garcelán Gómez.</p>
        <p>UC3M · 2021<br />Built as an interactive data story.</p>
        <div><Link href="/about">About</Link><Link href="/about#contact">Contact</Link><a href="https://www.linkedin.com/in/jgarcelan" rel="noreferrer" target="_blank">LinkedIn</a><a href="https://github.com/jorgegarcelan" rel="noreferrer" target="_blank">GitHub</a><a href="#top">Back to top ↑</a></div>
      </footer>
    </main>
  );
}
