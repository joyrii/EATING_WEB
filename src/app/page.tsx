import { redirect } from "next/navigation";

export default function Page() {
  // (임시) 약관 동의 페이지로 리다이렉트
  redirect("/terms");
}
