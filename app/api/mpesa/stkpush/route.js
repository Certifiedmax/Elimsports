import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const SHORTCODE = process.env.MPESA_SHORTCODE;
const PASSKEY = process.env.MPESA_PASSKEY;
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL;
const BASE_URL =
  process.env.MPESA_ENVIRONMENT === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

let cachedToken = null;

async function getAccessToken() {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60_000) {
    return cachedToken.value;
  }

  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");
  const res = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    method: "GET",
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OAuth failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  cachedToken = {
    value: data.access_token,
    expiresAt: now + (Number(data.expires_in) || 3599) * 1000,
  };
  return data.access_token;
}

// FIXED: Force East Africa Time (UTC+3) regardless of server timezone
function getTimestamp() {
  const eat = new Date(Date.now() + 3 * 60 * 60 * 1000);
  return eat.toISOString().replace(/\D/g, "").slice(0, 14);
}

function generatePassword(timestamp) {
  return Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString("base64");
}

function formatPhone(phone) {
  if (phone.startsWith("254")) return phone;
  if (phone.startsWith("0")) return "254" + phone.slice(1);
  if (phone.startsWith("+254")) return phone.slice(1);
  return "254" + phone;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, amount, customer, items } = body;

    if (!phone || !amount) {
      return NextResponse.json(
        { message: "Phone and amount are required." },
        { status: 400 }
      );
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount < 1) {
      return NextResponse.json(
        { message: "Amount must be a positive number." },
        { status: 400 }
      );
    }

    const formattedPhone = formatPhone(String(phone));
    const timestamp = getTimestamp();
    const password = generatePassword(timestamp);

    const token = await getAccessToken();

    const stkPayload = {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(numericAmount),
      PartyA: formattedPhone,
      PartyB: SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: CALLBACK_URL,
      AccountReference: `ELIM-${Date.now().toString().slice(-6)}`,
      TransactionDesc: "Elim Sports Order",
    };

    const stkRes = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(stkPayload),
    });

    const stkData = await stkRes.json();

    if (!stkRes.ok || stkData.ResponseCode !== "0") {
      console.error("STK Push failed:", stkData);
      return NextResponse.json(
        {
          message:
            stkData.errorMessage ||
            stkData.ResponseDescription ||
            "Could not initiate payment.",
          raw: stkData,
        },
        { status: 502 }
      );
    }

    const { error: dbError } = await supabase.from("mpesa_transactions").insert({
      checkout_request_id: stkData.CheckoutRequestID,
      merchant_request_id: stkData.MerchantRequestID,
      phone: formattedPhone,
      amount: numericAmount,
      status: "pending",
      customer: customer || null,
      items: items || null,
    });

    if (dbError) {
      console.error("Supabase insert failed:", dbError);
    }

    return NextResponse.json({
      checkoutRequestId: stkData.CheckoutRequestID,
      merchantRequestId: stkData.MerchantRequestID,
      message: stkData.CustomerMessage || "STK Push sent. Check your phone.",
    });
  } catch (err) {
    console.error("STK Push route error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Internal server error." },
      { status: 500 }
    );
  }
}