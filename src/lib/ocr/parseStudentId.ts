export type StudentIdResult = {
  studentId?: string;
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

const fixSpacedHangul = (s: string) => {
  let tokens = s.trim().split(/\s+/);

  tokens = tokens.map((t) => {
    if (/^[&＆][0-9IlO]{3,}$/.test(t)) return '&';
    return t;
  });

  tokens = tokens.filter((t) => {
    if (t === '&') return true;
    if (/^[0-9IlO]{3,}$/.test(t)) return false;
    return true;
  });

  const isHangul = (t: string) => /^[가-힣]+$/.test(t);
  const isSingleHangul = (t: string) => /^[가-힣]$/.test(t);

  const hangulTokens = tokens.filter(isHangul);
  const singleHangulCount = tokens.filter(isSingleHangul).length;

  const ratio =
    hangulTokens.length === 0 ? 0 : singleHangulCount / hangulTokens.length;

  const looksLikeDeptBySuffix =
    /(과|학과|학부|전공)$/.test(tokens.join('')) ||
    /(과|학과|학부|전공)$/.test(tokens[tokens.length - 1] ?? '');

  if (ratio >= 0.8 || looksLikeDeptBySuffix) {
    return tokens.join('');
  }

  return s.trim().replace(/\s{2,}/g, ' ');
};

const cleanDept = (s: string) => {
  const cleaned = s
    .trim()
    .replace(/\s{2,}/g, ' ')
    .replace(/^(학과|소속)\s*[:\-]?\s*/g, '')
    .trim();

  return fixSpacedHangul(cleaned);
};

export default function parseStudentIdText(rawText: string): StudentIdResult {
  const text = normalize(rawText);

  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  let studentId: string | undefined;
  let department: string | undefined;

  const parenMatch = text.match(/\((\d{6,12})\)/);
  if (parenMatch) studentId = parenMatch[1];

  const idx = lines.findIndex((line) => /\(\s*\d{6,12}\s*\)/.test(line));

  if (idx !== -1) {
    const m = lines[idx].match(/\(\s*(\d{6,12})\s*\)/);
    if (m) studentId = m[1];

    const nextLine = lines[idx + 1];
    if (nextLine) {
      const candidate = cleanDept(nextLine);

      const hasDeptSuffix = /(과|학과|학부|전공)$/.test(candidate);

      const hangulCount = (candidate.match(/[가-힣]/g) ?? []).length;
      const totalCount = candidate.replace(/\s/g, '').length || 1;
      const hangulRatio = hangulCount / totalCount;

      const looksLikeDept =
        hasDeptSuffix || (hangulCount >= 3 && hangulRatio >= 0.5);

      if (looksLikeDept) department = candidate;

      if (looksLikeDept) department = candidate;
    }
  }

  if (!studentId) {
    const nums = text.match(/\b\d{6,12}\b/g);
    studentId = nums?.[0];
  }

  if (!department) {
    department = lines.find((l) =>
      /(과|학과|학부|전공)$/.test(l.replace(/\s+/g, '')),
    );
    if (department) department = cleanDept(department);
  }

  return { studentId, department, raw: text };
}
