import type { CSSProperties } from "react";
import type { University } from "@/lib/universities";

const variance = [40.65, 21.06, 8.03, 7.49, 5.38, 4.82, 4.02, 3.51, 3.04, 2.01];

const pc1 = [
  ["Instructional spend", 0.4],
  ["Total cost", 0.4],
  ["Graduation rate", 0.37],
  ["Top 25% students", 0.35],
  ["Alumni giving", 0.34],
  ["Student–faculty ratio", -0.31],
  ["Acceptance rate", -0.24],
] as const;

const pc2 = [
  ["Undergraduate size", 0.58],
  ["Public / private", -0.48],
  ["Terminal faculty", 0.43],
  ["Top 25% students", 0.3],
  ["Acceptance rate", -0.3],
  ["Instructional spend", 0.15],
] as const;

const correlationLabels = ["Cost", "Spend", "Grad", "Top 25", "Accept", "Size"];
const correlations = [
  [1, .68, .59, .50, -.28, -.27],
  [.68, 1, .43, .55, -.46, -.02],
  [.59, .43, 1, .51, -.27, -.17],
  [.50, .55, .51, 1, -.44, .15],
  [-.28, -.46, -.27, -.44, 1, -.10],
  [-.27, -.02, -.17, .15, -.10, 1],
];

const componentVariables = [
  ["PC1", "A combined axis dominated by academic preparation, spending, graduation and selectivity."],
  ["PC2", "A combined axis dominated by undergraduate population and public/private status."],
] as const;

const correlationVariables = [
  ["Cost", "Estimated total student cost: tuition, room, board, fees, books and personal expenses."],
  ["Spend", "Instructional expenditure per student — money devoted directly to teaching."],
  ["Grad", "Percentage of students who graduate."],
  ["Top 25", "Share of new students who finished in the top quarter of their high-school class."],
  ["Accept", "Accepted applications divided by all applications received."],
  ["Size", "Full-time plus part-time undergraduate students."],
] as const;

const pc1Variables = [
  ["Instructional spend", "Teaching expenditure per student."],
  ["Total cost", "Estimated cost paid by a student."],
  ["Graduation rate", "Share of students who complete their degree."],
  ["Top 25% students", "New students from the top quarter of their school class."],
  ["Alumni giving", "Share of alumni who donate to the institution."],
  ["Student–faculty ratio", "Students per faculty member; lower suggests more individual attention."],
  ["Acceptance rate", "Share of applicants admitted; lower means more selective."],
] as const;

const pc2Variables = [
  ["Undergraduate size", "Total full-time and part-time undergraduate enrollment."],
  ["Public / private", "Institutional control, encoded as public or private in the source data."],
  ["Terminal faculty", "Share of faculty holding the highest degree in their field."],
  ["Top 25% students", "New students from the top quarter of their school class."],
  ["Acceptance rate", "Share of applicants admitted."],
  ["Instructional spend", "Teaching expenditure per student."],
] as const;

function histogram(values: number[], bins = 10) {
  const counts = Array.from({ length: bins }, () => 0);
  values.forEach((value) => {
    const index = Math.min(bins - 1, Math.max(0, Math.floor(value / (100 / bins))));
    counts[index] += 1;
  });
  return counts;
}

function VariableGuide({ items, inverse = false }: { items: readonly (readonly [string, string])[]; inverse?: boolean }) {
  return (
    <div className={`variable-guide ${inverse ? "variable-guide-inverse" : ""}`}>
      <p>VARIABLES IN THIS GRAPH</p>
      <dl>
        {items.map(([name, description]) => <div key={name}><dt>{name}</dt><dd>{description}</dd></div>)}
      </dl>
    </div>
  );
}

function LoadingChart({ title, subtitle, values, interpretation, variables }: { title: string; subtitle: string; values: readonly (readonly [string, number])[]; interpretation: string; variables: readonly (readonly [string, string])[] }) {
  return (
    <article className="notebook-card loading-card">
      <div className="chart-heading"><div><p>{title}</p><h3>{subtitle}</h3></div><span>− / +</span></div>
      <div className="loading-chart" role="img" aria-label={`${title}: signed variable loadings`}>
        {values.map(([label, value]) => (
          <div className="loading-row" key={label}>
            <span>{label}</span>
            <div className="loading-track">
              <i className="loading-axis" />
              <i
                className={`loading-bar ${value < 0 ? "negative" : "positive"}`}
                style={{ "--bar": `${Math.abs(value) / .6 * 50}%` } as CSSProperties}
              />
            </div>
            <b>{value > 0 ? "+" : ""}{value.toFixed(2)}</b>
          </div>
        ))}
      </div>
      <p className="chart-explanation"><b>Interpretation.</b> Bars to the right raise the component score; bars to the left lower it. Longer bars have more influence. {interpretation}</p>
      <VariableGuide items={variables} />
    </article>
  );
}

export function NotebookFigures({ universities }: { universities: University[] }) {
  const acceptance = histogram(universities.map((university) => university.acceptance * 100));
  const graduation = histogram(universities.map((university) => university.graduation));
  const histogramMax = Math.max(...acceptance, ...graduation);
  const publicCount = universities.filter((university) => university.type === "Public").length;
  const privateCount = universities.length - publicCount;
  const publicShare = Math.round(publicCount / universities.length * 100);
  const privateShare = 100 - publicShare;

  return (
    <section className="notebook-section shell" id="notebook">
      <div className="section-heading">
        <p className="section-number">03 / NOTEBOOK FIGURES</p>
        <h2>The analysis,<br />made <em>visible.</em></h2>
        <p>Key figures from the original notebook, redrawn to make variance, correlations and component structure easier to compare.</p>
      </div>

      <div className="notebook-grid">
        <article className="notebook-card scree-card">
          <div className="chart-heading"><div><p>PCA / EXPLAINED VARIANCE</p><h3>Two components carry 61.7%</h3></div><strong>61.7%</strong></div>
          <div className="scree-chart" role="img" aria-label="PCA explained variance: PC1 40.65 percent, PC2 21.06 percent, remaining components below 9 percent each">
            {variance.map((value, index) => (
              <div className={`scree-column ${index < 2 ? "selected" : ""}`} key={value}>
                <span>{value.toFixed(index < 2 ? 1 : 0)}%</span>
                <i style={{ height: `${value / variance[0] * 100}%` }} />
                <b>PC{index + 1}</b>
              </div>
            ))}
          </div>
          <p className="chart-explanation"><b>Interpretation.</b> Taller bars explain more variation. The drop after PC2 supports a two-dimensional summary, but 61.7% is not the whole dataset: 38.3% of its structure remains outside these two synthetic axes.</p>
          <VariableGuide items={componentVariables} />
        </article>

        <article className="notebook-card correlation-card">
          <div className="chart-heading"><div><p>EDA / CORRELATIONS</p><h3>Measures move together</h3></div><span>−1 ↔ +1</span></div>
          <div className="correlation-matrix" role="img" aria-label="Correlation matrix for six selected university measures">
            <span />
            {correlationLabels.map((label) => <b key={`top-${label}`}>{label}</b>)}
            {correlations.map((row, rowIndex) => (
              <div className="correlation-row" key={correlationLabels[rowIndex]}>
                <b>{correlationLabels[rowIndex]}</b>
                {row.map((value, columnIndex) => (
                  <i
                    key={`${rowIndex}-${columnIndex}`}
                    style={{ backgroundColor: value >= 0 ? `rgba(201,255,54,${.12 + Math.abs(value) * .78})` : `rgba(255,107,61,${.12 + Math.abs(value) * .78})` }}
                    title={`${correlationLabels[rowIndex]} × ${correlationLabels[columnIndex]}: ${value.toFixed(2)}`}
                  >{value.toFixed(2)}</i>
                ))}
              </div>
            ))}
          </div>
          <div className="matrix-legend"><span><i /> positive</span><span><i /> negative</span></div>
          <p className="chart-explanation chart-explanation-light"><b>Interpretation.</b> Acid cells move together; coral cells move in opposite directions; darker cells indicate a stronger linear relationship. Cost and instructional spending form the clearest positive pair, but correlation does not establish causation.</p>
          <VariableGuide inverse items={correlationVariables} />
        </article>

        <LoadingChart title="PC1 / LOADINGS" subtitle="Institutional distinction" values={pc1} variables={pc1Variables} interpretation="In plain English, a high PC1 combines stronger completion, preparation and spending with greater selectivity and fewer students per teacher. It is not an official quality score." />
        <LoadingChart title="PC2 / LOADINGS" subtitle="Scale and institution type" values={pc2} variables={pc2Variables} interpretation="In plain English, this axis mainly separates larger public universities from smaller private colleges. The sign can be reversed without changing the model; the contrast is what matters." />

        <article className="notebook-card distribution-card">
          <div className="chart-heading"><div><p>EDA / DISTRIBUTIONS</p><h3>Admissions and outcomes</h3></div><span>0–100%</span></div>
          {[
            ["Acceptance rate", acceptance],
            ["Graduation rate", graduation],
          ].map(([label, bins]) => (
            <div className="mini-histogram" key={label as string}>
              <span>{label as string}</span>
              <div>
                {(bins as number[]).map((count, index) => <i key={index} style={{ height: `${count / histogramMax * 100}%` }} />)}
              </div>
              <p><b>0</b><b>50</b><b>100%</b></p>
            </div>
          ))}
          <p className="chart-explanation"><b>Interpretation.</b> Each bar counts institutions inside a ten-point band. Acceptance rates gather toward the upper end, while graduation outcomes are more dispersed. The shape describes the sample; bin width hides differences inside each band.</p>
          <VariableGuide items={[
            ["Acceptance rate", "The percentage of applicants who receive an offer; lower means more selective admissions."],
            ["Graduation rate", "The percentage of students who complete their degree."],
          ]} />
        </article>

        <article className="notebook-card type-card">
          <div className="chart-heading"><div><p>PROFILE / TYPE</p><h3>Public and private</h3></div><span>{universities.length.toLocaleString("en-US")} records</span></div>
          <div className="type-split" role="img" aria-label={`${publicShare} percent public and ${privateShare} percent private universities among records with complete plotted measures`}>
            <div className="type-public" style={{ flexBasis: `${publicShare}%` }}><strong>{publicShare}%</strong><span>Public</span></div>
            <div className="type-private" style={{ flexBasis: `${privateShare}%` }}><strong>{privateShare}%</strong><span>Private</span></div>
          </div>
          <dl className="type-counts"><div><dt>{publicCount}</dt><dd>public</dd></div><div><dt>{privateCount}</dt><dd>private</dd></div></dl>
          <p className="chart-explanation chart-explanation-type"><b>Interpretation.</b> Width represents each type’s share among institutions with complete scatterplot measures. It describes this analytical subset, not the full universe of American colleges.</p>
          <VariableGuide items={[
            ["Public", "Primarily governed and funded by a state or public authority."],
            ["Private", "Independently governed and primarily funded through tuition, donations and endowment."],
          ]} />
        </article>
      </div>

      <aside className="interpretability-guide" aria-labelledby="interpretability-title">
        <div className="interpretability-heading">
          <p className="section-number">INTERPRETABILITY GUIDE</p>
          <h3 id="interpretability-title">What the graphics can — and cannot — tell us.</h3>
        </div>
        <div className="interpretability-grid">
          <article><span>01</span><h4>Observed measures</h4><p>Histograms and the scatterplot show recorded variables directly. They describe where institutions sit, without creating a score or predicting an outcome.</p></article>
          <article><span>02</span><h4>PCA components</h4><p>PC1 and PC2 are weighted combinations of variables. Loadings explain each axis; the components are analytical summaries, not official rankings.</p></article>
          <article><span>03</span><h4>Correlation</h4><p>A coefficient measures linear association. A strong value may reveal a pattern worth explaining, but it does not prove that one measure causes another.</p></article>
          <article><span>04</span><h4>Clusters</h4><p>Groups depend on selected variables, scaling, distance and the chosen number of clusters. They are model-produced segments, not natural or permanent categories.</p></article>
          <article><span>05</span><h4>Historical scope</h4><p>Every graphic reflects the project’s historical dataset and preprocessing decisions. It should be read as an analytical case study, not current admissions guidance.</p></article>
        </div>
      </aside>
    </section>
  );
}
