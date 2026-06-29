import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  // Rate Limiting: 5 checkout sessions per 15 minutes per IP address
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const limiterKey = `rate:stripe-checkout:${ip}`;
  const limitResult = await rateLimit(limiterKey, { limit: 5, windowMs: 15 * 60 * 1000 });

  if (!limitResult.success) {
    return NextResponse.json(
      { error: "Too many checkout session requests. Please try again in 15 minutes." },
      { status: 429 }
    );
  }

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Verify user exists and is approved host
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    if (user.hostStatus !== "approved") {
      return NextResponse.json(
        { error: "Only approved hosts can access the payment page" },
        { status: 403 }
      );
    }

    if (user.hasPaidFee) {
      return NextResponse.json(
        { error: "You have already paid the host activation fee" },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Subler Reverse Marketplace - Renter Proposal Access",
              description: "One-time fee to unlock sending unlimited proposals to renters.",
            },
            unit_amount: 500, // $5.00
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/host/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/host/dashboard?canceled=true`,
      metadata: {
        userId: userId,
      },
    });

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Create Stripe checkout session error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
