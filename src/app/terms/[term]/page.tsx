import { TERMS } from "@/constants/TERMS";
import TermsDetail from "@/components/terms/TermsDetail";

export default async function TermsDetailPage({
  params,
}: {
  params: { term: keyof typeof TERMS };
}) {
  const { term } = await params;
  const terms = TERMS[term];

  return <TermsDetail title={terms.title} content={terms.content} />;
}
