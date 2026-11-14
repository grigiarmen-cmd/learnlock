import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.warn("Auth session error on server, falling back to demo parent session:", error);
  }

  // Provide demo session if no live user is logged in so dashboard opens seamlessly
  const user = session?.user || {
    name: "Elternteil",
    email: "eltern@learnlock.de",
  };

  return <DashboardClient initialUser={user} />;
}
