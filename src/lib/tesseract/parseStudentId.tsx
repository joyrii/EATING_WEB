export type StudentIdResult = {
  studentNo?: string;
  department?: string;
  raw: string;
};

const normalize = (raw: string) => {
  return raw
    .replace(/\r/g, '')
    .replace(/[：]/g, ':')
    .replace(/[（［【〔〈]/g, '(')
    .replace(/[）］】〕〉]/g, ')')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim();
};

const cleanDept = (s: string) =>
  s
    .trim()
    .replace(/\s{2,}/g, ' ')
    .replace(/^(학과|소속)\s*[:\-]?\s*/g, '')
    .trim();

export default function parseStudentIdText(rawText: string): StudentIdResult {
  const text = normalize(rawText);

  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  let studentNo: string | undefined;
  let department: string | undefined;

  const parenMatch = text.match(/\((\d{6,12})\)/);
  if (parenMatch) studentNo = parenMatch[1];

  const idx = lines.findIndex((line) => /\(\s*\d{6,12}\s*\)/.test(line));

  if (idx !== -1) {
    const m = lines[idx].match(/\(\s*(\d{6,12})\s*\)/);
    if (m) studentNo = m[1];

    const nextLine = lines[idx + 1];
    if (nextLine) {
      const candidate = cleanDept(nextLine);

      const looksLikeDept =
        /(과|학과|학부|전공)$/.test(candidate) || candidate.length >= 2;

      if (looksLikeDept) department = candidate;
    }
  }

  if (!studentNo) {
    const nums = text.match(/\b\d{6,12}\b/g);
    studentNo = nums?.[0];
  }

  if (!department) {
    department = lines.find((l) => /(과|학과|학부|전공)$/.test(l));
  }

  return { studentNo, department, raw: text };
}
