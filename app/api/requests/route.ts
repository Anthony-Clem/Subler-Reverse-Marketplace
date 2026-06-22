import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rentalRequests } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { createRequestSchema } from "@/types";

export async function GET() {
  try {
    // Retrieve all open requests along with renter profile name and list of proposals
    const openRequests = await db.query.rentalRequests.findMany({
      where: eq(rentalRequests.status, "open"),
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
            userId: true,
          },
        },
      },
    });

    return NextResponse.json(openRequests);
  } catch (error) {
    console.error("Fetch open requests error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      eventType,
      spaceType,
      startDate,
      endDate,
      budget,
      headcount,
      amenities,
      locationPreference,
      notes,
    } = parsed.data;

    // Insert request with status 'open' linked to the logged-in renter
    const newRequest = await db
      .insert(rentalRequests)
      .values({
        eventType,
        spaceType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        budget: budget.toString(), // PostgreSQL numeric stored as string in JS
        headcount,
        amenities,
        locationPreference,
        notes: notes || null,
        userId: userId,
        status: "open",
      })
      .returning();

    return NextResponse.json(newRequest[0]);
  } catch (error) {
    console.error("Create space request error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
