import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rentalRequests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const updateRequestSchema = z.object({
  status: z.enum(["open", "closed", "fulfilled"]).optional(),
  eventType: z.string().optional(),
  spaceType: z.string().optional(),
  budget: z.union([z.string(), z.number()]).optional(),
  headcount: z.number().int().positive().optional(),
  locationPreference: z.string().optional(),
  notes: z.string().nullable().optional(),
  amenities: z.string().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Retrieve request first to verify ownership
    const request = await db.query.rentalRequests.findFirst({
      where: eq(rentalRequests.id, id),
    });

    if (!request) {
      return NextResponse.json({ error: "Rental request not found" }, { status: 404 });
    }

    if (request.userId !== userId) {
      return NextResponse.json({ error: "Forbidden: You do not own this request" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = updateRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const updateData: Partial<typeof rentalRequests.$inferInsert> = {};
    if (parsed.data.status !== undefined) updateData.status = parsed.data.status;
    if (parsed.data.eventType !== undefined) updateData.eventType = parsed.data.eventType;
    if (parsed.data.spaceType !== undefined) updateData.spaceType = parsed.data.spaceType;
    if (parsed.data.budget !== undefined) updateData.budget = String(parsed.data.budget);
    if (parsed.data.headcount !== undefined) updateData.headcount = parsed.data.headcount;
    if (parsed.data.locationPreference !== undefined) updateData.locationPreference = parsed.data.locationPreference;
    if (parsed.data.notes !== undefined) updateData.notes = parsed.data.notes;
    if (parsed.data.amenities !== undefined) updateData.amenities = parsed.data.amenities;

    const updated = await db
      .update(rentalRequests)
      .set(updateData)
      .where(eq(rentalRequests.id, id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
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

  try {
    const { id } = await params;

    // Retrieve request first to verify ownership
    const request = await db.query.rentalRequests.findFirst({
      where: eq(rentalRequests.id, id),
    });

    if (!request) {
      return NextResponse.json({ error: "Rental request not found" }, { status: 404 });
    }

    if (request.userId !== userId) {
      return NextResponse.json({ error: "Forbidden: You do not own this request" }, { status: 403 });
    }

    const deleted = await db
      .delete(rentalRequests)
      .where(eq(rentalRequests.id, id))
      .returning();

    return NextResponse.json(deleted[0]);
  } catch (error) {
    console.error("Error deleting request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
