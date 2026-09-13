import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("M-Pesa callback received:", JSON.stringify(body, null, 2));

    const stkCallback = body?.Body?.stkCallback;
    if (!stkCallback) {
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Ignored" });
    }

    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const merchantRequestId = stkCallback.MerchantRequestID;
    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;

    const isSuccess = resultCode === 0;

    // Extract metadata if success
    let mpesaReceipt = null;
    let paidAmount = null;
    let paidPhone = null;
    let transactionDate = null;

    if (isSuccess && stkCallback.CallbackMetadata?.Item) {
      const items = stkCallback.CallbackMetadata.Item;
      const get = (name) => items.find((i) => i.Name === name)?.Value;

      mpesaReceipt = get("MpesaReceiptNumber") ?? null;
      paidAmount = get("Amount") ?? null;
      paidPhone = get("PhoneNumber") ?? null;
      transactionDate = get("TransactionDate") ?? null;
    }

    const orderRef = isSuccess
      ? `ELIM-${Date.now().toString().slice(-6)}`
      : null;

    // Upsert: update if row exists, insert if it doesn't.
    // This protects against the STK insert having failed earlier.
    const record = {
      checkout_request_id: checkoutRequestId,
      merchant_request_id: merchantRequestId,
      phone: paidPhone ? String(paidPhone) : null,
      amount: paidAmount,
      status: isSuccess ? "success" : "failed",
      result_code: resultCode,
      result_desc: resultDesc,
      mpesa_receipt: mpesaReceipt,
      order_ref: orderRef,
      raw_callback: body,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("mpesa_transactions")
      .upsert(record, { onConflict: "checkout_request_id" });

    if (error) {
      console.error("Supabase upsert failed:", error);
    }

    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Callback received successfully",
    });
  } catch (err) {
    console.error("Callback route error:", err);
    return NextResponse.json({ ResultCode: 0, ResultDesc: "OK" });
  }
}

export async function GET() {
  return NextResponse.json({ status: "M-Pesa callback endpoint is live" });
}