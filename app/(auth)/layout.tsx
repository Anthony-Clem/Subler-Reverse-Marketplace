import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import Sidebar from "@/components/shared/sidebar";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch user profile from database
  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  // If user is not found in database, redirect to login
  if (!dbUser) {
    redirect("/login");
  }

  return <Sidebar user={dbUser}>{children}</Sidebar>;
}

