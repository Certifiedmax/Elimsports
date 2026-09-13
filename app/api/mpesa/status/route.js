import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const checkoutRequestId = searchParams.get("checkoutRequestId");

    if (!checkoutRequestId) {
      return NextResponse.json(
        { status: "failed", message: "checkoutRequestId is required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("mpesa_transactions")
      .select("status, order_ref, result_desc, mpesa_receipt")
      .eq("checkout_request_id", checkoutRequestId)
      .maybeSingle();

    if (error) {
      console.error("Status lookup error:", error);
      return NextResponse.json(
        { status: "failed", message: "Could not check status." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ status: "pending" });
    }

    return NextResponse.json({
      status: data.status,
      orderRef: data.order_ref,
      message: data.result_desc,
      receipt: data.mpesa_receipt,
    });
  } catch (err) {
    console.error("Status route error:", err);
    return NextResponse.json(
      { status: "failed", message: "Internal error." },
      { status: 500 }
    );
  }
}