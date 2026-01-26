import { redirect } from "next/navigation";

export default function Page() {
  // (임시) 홈화면로 리다이렉트
  redirect("/home");
}
