import { redirect } from "next/navigation";
export default function Signup() {
  redirect("/api/auth/login?screen_hint=signup&returnTo=%2Fperfil");
}
