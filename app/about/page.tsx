import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "About the Project",
  description: "Context, methodology and limitations of the US universities unsupervised learning project.",
  openGraph: {
    title: "About the Project — College by College",
    description: "Context, methodology and limitations of the US universities unsupervised learning project.",
    images: [{
      url: "/og.png",
      width: 1200,
      height: 630,
      alt: "College by College — U.S. Higher Education",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About the Project — College by College",
    description: "Context, methodology and limitations of the US universities unsupervised learning project.",
    images: ["/og.png"],
  },
};

const steps = [
  ["01", "Prepare", "Rename variables, inspect missingness, remove invalid values and create interpretable derived measures."],
  ["02", "Reduce", "Use PCA and factor analysis to compress correlated indicators into a smaller number of dimensions."],
  ["03", "Group", "Compare K-means, Mahalanobis K-means, hierarchical clustering, PAM and kernel K-means."],
  ["04", "Interpret", "Use institutional type, region and an explicit elite profile to understand the resulting patterns."],
];

export default function AboutPage() {
  return (
    <main className="about-page">
      <SiteHeader inverse />

      <section className="about-hero shell">
        <p className="eyebrow"><span /> About the project</p>
        <h1>Behind the<br /><em>analysis.</em></h1>
        <div className="about-intro">
          <p className="about-lead">A university is more than a ranking. This project asks whether its structure can be discovered from the data alone.</p>
          <p>The study was completed for Statistical Learning at Universidad Carlos III de Madrid in 2021. It applies unsupervised learning techniques to a historical dataset of American colleges and universities.</p>
        </div>
      </section>

      <section className="about-facts">
        <div className="shell fact-grid">
          <div><span>AUTHOR</span><strong>Jorge Garcelán Gómez</strong></div>
          <div><span>COURSE</span><strong>Statistical Learning</strong></div>
          <div><span>INSTITUTION</span><strong>UC3M</strong></div>
          <div><span>COMPLETED</span><strong>October 2021</strong></div>
        </div>
      </section>

      <section className="about-section shell">
        <p className="section-number">01 / THE OBJECTIVE</p>
        <div className="about-two-col">
          <h2>Let the variables<br />reveal the <em>groups.</em></h2>
          <div className="prose">
            <p>The analysis investigates whether colleges can be separated by institutional type or by a broader profile of academic distinction without supplying the models with a target label.</p>
            <p>It also examines which academic, financial and structural measures drive those differences — from graduation and acceptance rates to teaching expenditure, cost and student scale.</p>
          </div>
        </div>
      </section>

      <section className="dataset-band">
        <div className="shell dataset-layout">
          <div><p className="section-number">02 / THE DATASET</p><h2>One snapshot.<br /><em>Thirty-five measures.</em></h2></div>
          <div className="dataset-stat"><strong>1,302</strong><span>US colleges and universities in the raw source</span></div>
          <div className="dataset-copy"><p>The data comes from the Integrated Postsecondary Education Data System and was used in the 1995 ASA Statistical Graphics Data Exposition.</p><p>It contains admissions, test scores, enrolment, tuition, living costs, faculty qualifications, student–faculty ratio, alumni donations, instructional expenditure and graduation rates.</p></div>
        </div>
      </section>

      <section className="workflow-section shell">
        <div className="section-heading"><p className="section-number">03 / THE WORKFLOW</p><h2>From incomplete rows<br />to interpretable <em>structure.</em></h2></div>
        <div className="workflow-list">
          {steps.map(([number, title, description]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}
        </div>
      </section>

      <section className="limitations-section">
        <div className="shell limitations-grid">
          <div><p className="section-number">04 / LIMITATIONS</p><h2>What the models<br /><em>cannot claim.</em></h2></div>
          <ol>
            <li><span>01</span><p><b>Historical, not current.</b> The values describe an earlier period and should not guide present-day application or financial decisions.</p></li>
            <li><span>02</span><p><b>“Quality” is interpretive.</b> It is a name given to a statistical direction, not an official ranking or universal definition.</p></li>
            <li><span>03</span><p><b>Institution type influences the result.</b> Including the public/private indicator makes separation along that distinction more likely.</p></li>
            <li><span>04</span><p><b>Thresholds are project choices.</b> The elite profile and cluster labels are transparent analytical conventions, not external classifications.</p></li>
          </ol>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="shell contact-layout">
          <div className="contact-intro">
            <p className="section-number">05 / CONTACT</p>
            <h2>Let’s keep the<br /><em>conversation going.</em></h2>
            <p>Questions about the analysis, the dataset or another data project? You can reach me directly or follow my work.</p>
          </div>
          <div className="contact-links">
            <a href="mailto:jorgegarcelan@gmail.com"><span>EMAIL</span><strong>jorgegarcelan@gmail.com</strong><b>↗</b></a>
            <a href="https://www.linkedin.com/in/jgarcelan" rel="noreferrer" target="_blank"><span>LINKEDIN</span><strong>Jorge Garcelán Gómez</strong><b>↗</b></a>
            <a href="https://github.com/jorgegarcelan" rel="noreferrer" target="_blank"><span>GITHUB</span><strong>@jorgegarcelan</strong><b>↗</b></a>
          </div>
        </div>
      </section>

      <section className="about-cta shell">
        <p className="section-number">KEEP EXPLORING</p><h2>See the institutions<br />inside the <em>data.</em></h2>
        <Link className="button button-dark" href="/#explore">Open the explorer <span>↗</span></Link>
      </section>

      <footer className="site-footer site-footer-about shell">
        <p><b>College by College</b><br />A statistical learning project by Jorge Garcelán Gómez.</p>
        <p>Questions or dataset requests?<br /><a href="mailto:jorgegarcelan@gmail.com">jorgegarcelan@gmail.com</a></p>
        <div><Link href="/">Home</Link><a href="#contact">Contact</a><a href="https://www.linkedin.com/in/jgarcelan" rel="noreferrer" target="_blank">LinkedIn</a><a href="https://github.com/jorgegarcelan" rel="noreferrer" target="_blank">GitHub</a></div>
      </footer>
    </main>
  );
}
