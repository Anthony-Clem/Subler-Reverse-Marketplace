import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, rentalRequests, proposals } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const requestsList = await db.query.rentalRequests.findMany({
      where: eq(rentalRequests.userId, userId),
    });

    const proposalsList = await db.query.proposals.findMany({
      where: eq(proposals.userId, userId),
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        hostStatus: user.hostStatus,
        createdAt: user.createdAt,
      },
      rentalRequests: requestsList,
      proposals: proposalsList,
    });
  } catch (error) {
    console.error("Export user data error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
