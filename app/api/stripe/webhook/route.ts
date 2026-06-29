import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed:`, err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const userId = session.metadata?.userId;

    if (userId) {
      try {
        await db
          .update(users)
          .set({ hasPaidFee: true })
          .where(eq(users.id, userId));
        console.log(`Successfully updated hasPaidFee to true for user: ${userId}`);
      } catch (error) {
        console.error("Failed to update user payment status in DB:", error);
        return NextResponse.json({ error: "Database update failed" }, { status: 500 });
      }
    } else {
      console.error("No userId found in session metadata");
    }
  }

  return NextResponse.json({ received: true });
}
