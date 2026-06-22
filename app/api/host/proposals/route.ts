import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, proposals } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Verify user is an approved host
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user || user.hostStatus !== "approved") {
      return NextResponse.json(
        { error: "Unauthorized: Approved host role required" },
        { status: 403 }
      );
    }

    // Fetch all proposals sent by this host
    const hostProposals = await db.query.proposals.findMany({
      where: eq(proposals.userId, userId),
      orderBy: desc(proposals.createdAt),
      with: {
        request: {
          with: {
            user: {
              columns: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(hostProposals);
  } catch (error) {
    console.error("Fetch host proposals error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
