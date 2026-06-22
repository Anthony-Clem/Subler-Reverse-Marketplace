import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check user's current host status
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return NextResponse.json({ error: "User profile not found in database" }, { status: 404 });
    }

    if (user.hostStatus === "approved") {
      return NextResponse.json(
        { error: "You are already an approved host" },
        { status: 400 }
      );
    }

    if (user.hostStatus === "pending") {
      return NextResponse.json(
        { error: "Your host upgrade request is already pending review" },
        { status: 400 }
      );
    }

    // Update hostStatus to 'pending' in database
    const updated = await db
      .update(users)
      .set({ hostStatus: "pending" })
      .where(eq(users.id, userId))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Host upgrade request error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
