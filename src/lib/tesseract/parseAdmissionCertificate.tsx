export type AdmissionCertificateResult = {
  department?: string;
  raw: string;
};

const normalize = (raw: string) =>
  raw
    .replace(/\r/g, '')
    .replace(/[：]/g, ':')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim();

export default function parseAdmissionCertificateText(
  rawText: string,
): AdmissionCertificateResult | undefined {
  const text = normalize(rawText);
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const line =
    lines.find((l) => /모\s*집\s*단\s*위/.test(l)) ??
    lines.find((l) => /모집단위/.test(l));

  if (!line) return undefined;

  const after = line.includes(':')
    ? line
        .split(':')
        .slice(1)
        .join(':')
        .replace(/모\s*집\s*단\s*위\s*/g, '')
        .trim()
    : line.replace(/모\s*집\s*단\s*위\s*/g, '').trim();

  if (!after) return undefined;

  const m = after.match(/(?:^|\s)([가-힣A-Za-z]+대학)\s+(.+)$/);
  if (m?.[2]) {
    return { department: m[2].trim(), raw: after };
  }

  return { department: after.trim(), raw: after };
}
