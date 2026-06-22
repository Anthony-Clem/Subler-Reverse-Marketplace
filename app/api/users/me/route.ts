import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User profile not found in database" }, { status: 404 });
    }

    return NextResponse.json(dbUser);
  } catch (error) {
    console.error("Fetch current user profile error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const deleted = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: deleted[0] });
  } catch (error) {
    console.error("Delete current user error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

