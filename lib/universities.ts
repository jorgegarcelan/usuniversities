import fs from "node:fs";
import path from "node:path";

export type University = {
  name: string;
  state: string;
  type: "Public" | "Private";
  acceptance: number;
  graduation: number;
  students: number;
  cost: number | null;
};

function number(value: string) {
  if (!value || value === "*") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function getUniversities(): University[] {
  const csvPath = path.join(process.cwd(), "collegedata.csv");
  const rows = fs.readFileSync(csvPath, "utf8").trim().split(/\r?\n/);

  return rows.flatMap((row) => {
    const columns = row.split(",");
    const applications = number(columns[14]);
    const accepted = number(columns[15]);
    const fullTime = number(columns[19]);
    const partTime = number(columns[20]);
    const graduation = number(columns[34]);

    if (
      applications === null || applications <= 0 || accepted === null ||
      fullTime === null || partTime === null || graduation === null ||
      graduation < 0 || graduation > 100
    ) return [];

    const tuitionIn = number(columns[21]);
    const tuitionOut = number(columns[22]);
    const roomBoard = number(columns[23]);
    const fees = number(columns[26]);
    const books = number(columns[27]);
    const personal = number(columns[28]);
    const costParts = [roomBoard, fees, books, personal];
    const hasCost = tuitionIn !== null && tuitionOut !== null && costParts.every((item) => item !== null);

    return [{
      name: columns[1],
      state: columns[2],
      type: columns[3] === "1" ? "Public" : "Private",
      acceptance: Math.min(1, accepted / applications),
      graduation,
      students: fullTime + partTime,
      cost: hasCost
        ? Math.round(((tuitionIn as number) + (tuitionOut as number)) / 2 + costParts.reduce<number>((sum, item) => sum + (item as number), 0))
        : null,
    }];
  });
}
