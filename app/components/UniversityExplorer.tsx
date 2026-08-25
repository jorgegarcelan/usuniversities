"use client";

import { useMemo, useState } from "react";
import type { University } from "@/lib/universities";

type Filter = "All" | "Public" | "Private";

const landmarks = [
  { name: "California Institute of Technology", label: "Caltech", placement: "east" },
  { name: "Harvard University", label: "Harvard", placement: "south" },
  { name: "University of California at Berkeley", label: "UC Berkeley", placement: "north" },
  { name: "University of Texas at Austin", label: "UT Austin", placement: "west" },
] as const;

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function UniversityExplorer({ universities }: { universities: University[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<University | null>(
    universities.find((university) => university.name.includes("California Institute")) ?? universities[0],
  );

  const visible = useMemo(() => universities.filter((university) => {
    const matchesType = filter === "All" || university.type === filter;
    const matchesQuery = !query || university.name.toLowerCase().includes(query.toLowerCase());
    return matchesType && matchesQuery;
  }), [filter, query, universities]);

  const landmarkNames = new Set<string>(landmarks.map((landmark) => landmark.name));
  const plotBase = visible.slice(0, 720);
  const plotted = query ? visible : [
    ...plotBase,
    ...visible.filter((university) => landmarkNames.has(university.name) && !plotBase.includes(university)),
  ];

  function selectFirstMatch(value: string) {
    setQuery(value);
    const match = universities.find((university) =>
      university.name.toLowerCase().includes(value.toLowerCase()),
    );
    if (value && match) setSelected(match);
  }

  return (
    <div className="explorer-card">
      <div className="explorer-toolbar">
        <div>
          <p className="micro-label">VIEW BY TYPE</p>
          <div className="segmented" aria-label="Filter institutions by type">
            {(["All", "Public", "Private"] as Filter[]).map((option) => (
              <button className={filter === option ? "active" : ""} key={option} onClick={() => setFilter(option)} type="button">
                {option}
              </button>
            ))}
          </div>
        </div>
        <label className="search-label">
          <span className="micro-label">FIND AN INSTITUTION</span>
          <span className="search-wrap">
            <span aria-hidden="true">⌕</span>
            <input onChange={(event) => selectFirstMatch(event.target.value)} placeholder="Try Harvard, Stanford…" type="search" value={query} />
          </span>
        </label>
      </div>

      <div className="explorer-layout">
        <div className="scatter-wrap">
          <span className="axis-label axis-y">Graduation rate</span>
          <div className="scatter" role="img" aria-label="Acceptance rate versus graduation rate for US universities">
            <div className="scatter-grid" />
            <div className="axis-ticks axis-ticks-y" aria-hidden="true"><span>100%</span><span>75</span><span>50</span><span>25</span><span>0</span></div>
            <div className="axis-ticks axis-ticks-x" aria-hidden="true"><span>0</span><span>25</span><span>50</span><span>75</span><span>100%</span></div>
            {plotted.map((university) => {
              const isSelected = selected?.name === university.name;
              const landmark = landmarks.find((item) => item.name === university.name);
              return (
                <button
                  aria-label={`Select ${university.name}`}
                  className={`scatter-point ${university.type.toLowerCase()} ${isSelected ? "selected" : ""} ${landmark ? "has-label" : ""}`}
                  key={`${university.name}-${university.state}`}
                  onClick={() => setSelected(university)}
                  style={{ left: `${university.acceptance * 100}%`, bottom: `${university.graduation}%` }}
                  tabIndex={isSelected ? 0 : -1}
                  title={university.name}
                  type="button"
                >
                  {landmark ? <span aria-hidden="true" className={`scatter-landmark ${landmark.placement}`}>{landmark.label}</span> : null}
                </button>
              );
            })}
          </div>
          <span className="axis-label axis-x">Acceptance rate →</span>
          <div className="scatter-legend"><span className="public-dot" /> Public <span className="private-dot" /> Private</div>
        </div>

        <aside className="institution-card" aria-live="polite">
          {selected ? (
            <>
              <p className="micro-label">SELECTED INSTITUTION</p>
              <p className="state-tag">{selected.state} · {selected.type}</p>
              <h3>{selected.name}</h3>
              <dl>
                <div><dt>{Math.round(selected.acceptance * 100)}%</dt><dd>acceptance rate</dd></div>
                <div><dt>{selected.graduation}%</dt><dd>graduation rate</dd></div>
                <div><dt>{selected.students.toLocaleString("en-US")}</dt><dd>undergraduates</dd></div>
                <div><dt>{selected.cost ? money.format(selected.cost) : "N/A"}</dt><dd>estimated total cost</dd></div>
              </dl>
              <p className="card-note">Historical values from the project dataset; not current admissions data.</p>
            </>
          ) : <p>Select an institution to inspect it.</p>}
        </aside>
      </div>
      <div className="scatter-variable-guide">
        <div><b>X / Acceptance rate</b><p>Accepted applications divided by applications received. Moving left means the institution admits a smaller share of applicants and is more selective.</p></div>
        <div><b>Y / Graduation rate</b><p>The share of students who complete their degree. Moving up means a larger share graduates.</p></div>
        <div><b>Color / Institution type</b><p>Coral marks public universities; dark green marks private colleges. Color does not indicate performance.</p></div>
      </div>
      <div className="chart-footnote">
        <p><b>Interpretation.</b> Move right for a higher acceptance rate and up for a higher graduation rate. The upper-left area combines selective admissions with strong completion; labels mark four familiar reference institutions.</p>
        <p>This is a direct two-variable comparison, not the PCA or a ranking. Overlapping dots can hide density, and association between the axes does not imply causation. Showing {plotted.length.toLocaleString("en-US")} institutions with complete measures.</p>
      </div>
    </div>
  );
}
