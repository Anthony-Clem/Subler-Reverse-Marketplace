import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// Admin verification helper
async function verifyAdmin(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  return user?.role === "admin";
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = await verifyAdmin(userId);
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;

    // Prevent administrators from deleting themselves
    if (id === userId) {
      return NextResponse.json(
        { error: "You cannot delete your own administrator account" },
        { status: 400 }
      );
    }

    const deleted = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Note: Clerk user deletion should also happen here in a real production flow, 
    // but deleting from our database is the primary requirement for local DB sync.
    return NextResponse.json(deleted[0]);
  } catch (error) {
    console.error("Admin delete user error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
