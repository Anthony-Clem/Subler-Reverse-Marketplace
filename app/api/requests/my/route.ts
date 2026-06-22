import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rentalRequests } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all requests owned by the user, ordered by creation date, including their proposals
    const userRequests = await db.query.rentalRequests.findMany({
      where: eq(rentalRequests.userId, userId),
      orderBy: desc(rentalRequests.createdAt),
      with: {
        proposals: {
          with: {
            user: {
              columns: {
                id: true,
                email: true,
                role: true,
                hostStatus: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(userRequests);
  } catch (error) {
    console.error("Error fetching user requests:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
