import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { proposals, rentalRequests } from "@/db/schema";
import { eq } from "drizzle-orm";

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
    const body = await req.json();
    const { status } = body;

    if (status !== "accepted" && status !== "rejected") {
      return NextResponse.json(
        { error: "Invalid status. Must be 'accepted' or 'rejected'" },
        { status: 400 }
      );
    }

    // Retrieve proposal and join the request to verify ownership
    const proposal = await db.query.proposals.findFirst({
      where: eq(proposals.id, id),
      with: {
        request: true,
      },
    });

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    if (!proposal.request) {
      return NextResponse.json({ error: "Associated request not found" }, { status: 404 });
    }

    // Verify current user owns the request
    if (proposal.request.userId !== userId) {
      return NextResponse.json(
        { error: "Forbidden: Only the request creator can moderate proposals" },
        { status: 403 }
      );
    }

    // Update proposal status
    const updated = await db
      .update(proposals)
      .set({ status })
      .where(eq(proposals.id, id))
      .returning();

    // If accepted, mark the parent rental request as fulfilled
    if (status === "accepted") {
      await db
        .update(rentalRequests)
        .set({ status: "fulfilled" })
        .where(eq(rentalRequests.id, proposal.requestId));
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Update proposal status error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
