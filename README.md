# College by College

![College by College social preview](./public/og.png)

An editorial, interactive data story about the structure of U.S. higher education.

College by College turns a 2021 Statistical Learning project into an accessible web experience. It uses a historical dataset of 1,302 American colleges and 35 variables to explore institutional distinction, scale, selectivity, outcomes, and the public–private divide through unsupervised learning.

> This is a historical analysis and an educational case study — not a current university ranking or admissions guide.

## What is included

- An editorial landing page explaining the project and its main findings.
- Notebook figures redrawn for the web rather than embedded as static screenshots.
- PCA explained-variance and signed-loading charts.
- A correlation matrix with plain-language variable definitions.
- Acceptance-rate and graduation-rate distributions.
- Public/private profile comparisons.
- An interactive university scatterplot with filters, search, highlighted institutions, and individual detail cards.
- Interpretation notes explaining what each chart can and cannot show.
- A dedicated About page covering the objective, dataset, workflow, limitations, authorship, and contact details.
- Responsive layouts, generated app icons, and Open Graph/social metadata.

## Main findings

The analysis uses three complementary unsupervised-learning approaches:

1. **Principal Component Analysis (PCA)** reduces correlated measures to a smaller set of synthetic dimensions. The first two components retain **61.7%** of the variance.
2. **Factor Analysis (FA)** identifies latent forces that can be interpreted as institutional distinction and popularity/scale.
3. **Clustering** compares K-means, Mahalanobis K-means, hierarchical clustering, PAM, and kernel K-means using two- and three-cluster solutions.

Across the models, three broad patterns emerge:

- Graduation rate, instructional spending, academic preparation, cost, and alumni giving tend to move together.
- Acceptance rate and student–faculty ratio often move in the opposite direction from that distinction profile.
- Undergraduate population and public/private status strongly shape the second component and several cluster solutions.

These are patterns within this dataset. Component names and cluster labels are interpretations, not official classifications.

## Understanding the visualizations

Every chart includes a local variable guide and an interpretation note:

- **Observed charts** — histograms and the scatterplot display recorded measures directly.
- **PCA charts** — component scores are weighted combinations of variables, not raw measures or rankings.
- **Loading charts** — longer bars indicate greater influence; direction shows whether a variable raises or lowers the component score. A PCA axis can be sign-reversed without changing the model.
- **Correlation matrix** — color and intensity show linear association, not causation.
- **Clusters** — groups depend on preprocessing, scaling, distance, selected variables, and the chosen number of clusters.

The interactive scatterplot compares:

- **X-axis — Acceptance rate:** accepted applications divided by applications received.
- **Y-axis — Graduation rate:** the percentage of students who complete their degree.
- **Color — Institution type:** public or private; color does not indicate performance.

Caltech, Harvard, UC Berkeley, and UT Austin are labelled as recognizable reference points.

## Dataset

The source data comes from the **Integrated Postsecondary Education Data System (IPEDS)** and was used in the **1995 ASA Statistical Graphics Data Exposition**.

- Raw institutions: **1,302**
- Raw variables: **35**
- Areas covered: admissions, test scores, enrolment, tuition, living costs, faculty qualifications, student–faculty ratio, alumni donations, instructional expenditure, and graduation outcomes.
- Local source: [`collegedata.csv`](./collegedata.csv)
- Original rendered analysis: [`Universities_Homework.html`](./Universities_Homework.html)
- IPEDS: [IPEDS Data Center](https://nces.ed.gov/ipeds/datacenter/InstitutionByGroup.aspx)

The website derives measures such as acceptance rate, estimated total cost, and total undergraduate population from the raw columns. Records with invalid or incomplete measures required by the interactive chart are excluded from that view.

## Tech stack

- Next.js App Router
- React
- TypeScript
- Server-side CSV parsing
- Native HTML and CSS visualizations

The project intentionally avoids a charting dependency: the figures are rendered with semantic components and CSS so their labels, explanations, and responsive behaviour remain part of the page.

## Run locally

Requirements: a current Node.js LTS release and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). If that port is occupied, Next.js will select another available port.

Create a production build with:

```bash
npm run build
npm start
```

## Project structure

```text
app/
├── about/page.tsx                 # Methodology, limitations, and contact
├── components/
│   ├── NotebookFigures.tsx        # PCA, correlation, and distribution figures
│   ├── SiteHeader.tsx             # Shared navigation and identity
│   └── UniversityExplorer.tsx     # Interactive scatterplot and filters
├── globals.css                    # Visual system and responsive layouts
├── icon.tsx                       # Generated favicon
├── apple-icon.tsx                 # Generated Apple touch icon
├── layout.tsx                     # Metadata, fonts, and social preview
└── page.tsx                       # Main data story
lib/
└── universities.ts               # CSV parsing and derived measures
public/
└── og.png                         # Open Graph image
```

## Contact

Created by **Jorge Garcelán Gómez** as a Statistical Learning project at Universidad Carlos III de Madrid.

- Email: [jorgegarcelan@gmail.com](mailto:jorgegarcelan@gmail.com)
- LinkedIn: [linkedin.com/in/jgarcelan](https://www.linkedin.com/in/jgarcelan)
- GitHub: [github.com/jorgegarcelan](https://github.com/jorgegarcelan)
- Website: [jorgegarcelan.com](https://jorgegarcelan.com)
