import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, rentalRequests, proposals } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { createProposalSchema } from "@/types";

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Verify user exists and is an approved host
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    if (user.hostStatus !== "approved") {
      return NextResponse.json(
        { error: "Only approved hosts can submit proposals" },
        { status: 403 }
      );
    }

    if (!user.hasPaidFee) {
      return NextResponse.json(
        { error: "Payment required: You must complete the one-time $5 fee to submit proposals" },
        { status: 402 }
      );
    }

    const body = await req.json();
    const parsed = createProposalSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { requestId, sublerLink, pitch } = parsed.data;

    // Validate Subler URL server-side
    try {
      const parsedUrl = new URL(sublerLink);
      const hostname = parsedUrl.hostname;
      const isValidSubler =
        hostname === "app.getsubler.com" ||
        hostname === "subler.com" ||
        hostname.endsWith(".subler.com");

      if (!isValidSubler) {
        return NextResponse.json(
          { error: "Proposals must link to a valid Subler listing URL (app.getsubler.com or subler.com)" },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format for Subler link" },
        { status: 400 }
      );
    }

    // Verify request exists and is open
    const request = await db.query.rentalRequests.findFirst({
      where: eq(rentalRequests.id, requestId),
    });

    if (!request) {
      return NextResponse.json({ error: "Rental request not found" }, { status: 404 });
    }

    if (request.status !== "open") {
      return NextResponse.json(
        { error: "This space request is closed or already fulfilled" },
        { status: 400 }
      );
    }

    // Host cannot submit proposal to their own request
    if (request.userId === userId) {
      return NextResponse.json(
        { error: "You cannot submit a proposal to your own request" },
        { status: 400 }
      );
    }

    // Verify host hasn't already sent a proposal
    const existingProposal = await db.query.proposals.findFirst({
      where: and(
        eq(proposals.requestId, requestId),
        eq(proposals.userId, userId)
      ),
    });

    if (existingProposal) {
      return NextResponse.json(
        { error: "You have already submitted a proposal for this request" },
        { status: 400 }
      );
    }

    // Create the proposal
    const newProposal = await db
      .insert(proposals)
      .values({
        requestId,
        userId: userId,
        sublerLink,
        pitch,
        status: "pending",
      })
      .returning();

    return NextResponse.json(newProposal[0]);
  } catch (error) {
    console.error("Create proposal error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
