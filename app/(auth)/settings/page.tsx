import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import SettingsForm from "./settings-form";

export const metadata = {
  title: "Settings | Subler Reverse Marketplace",
  description: "Manage your email preferences and reverse marketplace account.",
};

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch user profile from database
  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!dbUser) {
    redirect("/login");
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SettingsForm email={dbUser.email} />
    </div>
  );
}
