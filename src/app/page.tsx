import { redirect } from "next/navigation";

export default async function Home() {
  // For demo purposes, redirect to dashboard without auth check
  // In production, this would check Clerk authentication
  redirect("/dashboard");
}