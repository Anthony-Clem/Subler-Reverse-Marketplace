import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, rentalRequests } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const updateStatusSchema = z.object({
  requestId: z.string().uuid(),
  status: z.enum(["open", "closed", "fulfilled"]),
});

// Admin verification helper
async function verifyAdmin(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  return user?.role === "admin";
}

export async function GET() {
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
    // Admin gets all platform requests, ordered by newest first, including user details and proposals
    const allRequests = await db.query.rentalRequests.findMany({
      orderBy: desc(rentalRequests.createdAt),
      with: {
        user: {
          columns: {
            id: true,
            email: true,
          },
        },
        proposals: {
          columns: {
            id: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    return NextResponse.json(allRequests);
  } catch (error) {
    console.error("Admin fetch requests error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
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
    const body = await req.json();
    const parsed = updateStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { requestId, status } = parsed.data;

    // Update request status in database
    const updated = await db
      .update(rentalRequests)
      .set({ status })
      .where(eq(rentalRequests.id, requestId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: "Rental request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Admin update request status error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
