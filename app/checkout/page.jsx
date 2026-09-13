"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/CartContext";
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Loader2,
  Smartphone,
  Clock,
  Truck,
  Sparkles,
} from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import { KENYA_COUNTIES, NAIROBI_SHIPPING_FEE, DEFAULT_SHIPPING_FEE } from "@/lib/constants";

const PHONE_REGEX = /^(?:\+?254|0)(7\d{8}|1\d{8})$/;

function normalizePhone(input) {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return "254" + digits.slice(1);
  if (digits.length === 9) return "254" + digits;
  return digits;
}

export default function CheckoutPage() {
  const { cart, subtotal, clearCart, hydrated } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    county: "Nairobi",
    address: "",
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [errors, setErrors] = useState({});

  const [paymentState, setPaymentState] = useState("idle");
  const [paymentError, setPaymentError] = useState("");
  const [orderRef, setOrderRef] = useState("");
  const [countdown, setCountdown] = useState(90);

  const pollIntervalRef = useRef(null);
  const countdownRef = useRef(null);

  const isNairobi = formData.county.toLowerCase() === "nairobi";
  const shippingFee = isNairobi ? NAIROBI_SHIPPING_FEE : DEFAULT_SHIPPING_FEE;
  const total = subtotal + (cart.length > 0 ? shippingFee : 0);

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!formData.fullName.trim()) next.fullName = "Full name is required";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) next.email = "Enter a valid email";
    if (!PHONE_REGEX.test(formData.phone.trim()))
      next.phone = "Enter a valid Kenyan phone number (07XX or 01XX)";
    if (!formData.address.trim()) next.address = "Delivery address is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  const startPolling = useCallback(
    (checkoutRequestId) => {
      setCountdown(90);
      countdownRef.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            stopPolling();
            setPaymentState("failed");
            setPaymentError("Payment request timed out. Please try again.");
            return 0;
          }
          return c - 1;
        });
      }, 1000);

      pollIntervalRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/mpesa/status?checkoutRequestId=${checkoutRequestId}`);
          const data = await res.json();

          if (data.status === "success") {
            stopPolling();
            setPaymentState("success");
            setOrderRef(data.orderRef || checkoutRequestId);
            clearCart();
          } else if (data.status === "failed") {
            stopPolling();
            setPaymentState("failed");
            setPaymentError(data.message || "Payment was not completed.");
          }
        } catch (err) {
          console.error("Poll error:", err);
        }
      }, 3000);
    },
    [clearCart, stopPolling]
  );

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!validate()) {
      document.querySelector('[data-error="true"]')?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setPaymentError("");
    setPaymentState("pending");

    try {
      const res = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: normalizePhone(formData.phone),
          amount: total,
          customer: {
            fullName: formData.fullName,
            email: formData.email,
            county: formData.county,
            address: formData.address,
            notes: formData.notes,
          },
          items: cart.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity || 1,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.checkoutRequestId) {
        throw new Error(data.message || "Could not initiate payment.");
      }

      startPolling(data.checkoutRequestId);
    } catch (err) {
      setPaymentState("failed");
      setPaymentError(err.message || "Something went wrong. Please try again.");
    }
  };

  const retryPayment = () => {
    stopPolling();
    setPaymentState("idle");
    setPaymentError("");
    setCountdown(90);
  };

  // ---------- SUCCESS ----------
  if (paymentState === "success") {
    return (
      <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between">
        <div className="max-w-3xl mx-auto px-6 py-24 text-center space-y-6 my-auto">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm ring-8 ring-emerald-50">
            <CheckCircle2 size={40} />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 block">
            Payment Confirmed
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-950">
            THANK YOU FOR CHOOSING ELIM SPORTS
          </h1>
          <p className="text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
            Your order reference is <strong className="text-neutral-950">{orderRef}</strong>. A
            confirmation has been sent to <strong>{formData.email}</strong> and{" "}
            <strong>{normalizePhone(formData.phone)}</strong>. We'll notify you when your gear ships.
          </p>
          <div className="pt-6">
            <Link
              href="/"
              className="inline-block px-8 py-4 bg-neutral-950 hover:bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] transition-all rounded-xl shadow-md"
            >
              Return To Store
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ---------- FAILED ----------
  if (paymentState === "failed") {
    return (
      <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between">
        <div className="max-w-3xl mx-auto px-6 py-24 text-center space-y-6 my-auto">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-sm ring-8 ring-red-50">
            <XCircle size={40} />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-red-600 block">
            Payment Not Completed
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950">
            WE COULDN'T CONFIRM YOUR PAYMENT
          </h1>
          <p className="text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">{paymentError}</p>
          <div className="flex items-center justify-center gap-3 pt-6">
            <button
              onClick={retryPayment}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-[0.2em] transition-all rounded-xl shadow-md"
            >
              Try Again
            </button>
            <Link
              href="/cart"
              className="px-8 py-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-black text-xs uppercase tracking-[0.2em] transition-all rounded-xl"
            >
              Back To Cart
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ---------- MAIN CHECKOUT ----------
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col justify-between">
      <div>
        {/* ================= HERO BANNER ================= */}
        <div className="relative bg-neutral-950 text-white py-20 px-6 sm:px-12 lg:px-16 border-b border-neutral-800 overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-full lg:w-3/5 z-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent z-10" />
            <img
              src="/images/checkout.jpg"
              alt="Pro Checkout Background"
              className="w-full h-full object-cover object-center opacity-40 filter contrast-110"
            />
          </div>

          <div className="max-w-[1400px] mx-auto relative z-20 space-y-4 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-blue-600 text-white shadow-md">
              <Lock size={13} /> Pro Lab Secure Gateway
            </div>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white max-w-2xl leading-none">
              CHECKOUT & DISPATCH
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl font-medium leading-relaxed bg-neutral-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-neutral-800">
              Complete your tournament equipment order with secure M-Pesa STK push integration and nationwide delivery across Kenya.
            </p>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 pt-6">
          <Breadcrumbs
            customCrumbs={[
              { label: "Home", href: "/" },
              { label: "Cart", href: "/cart" },
              { label: "Checkout" },
            ]}
          />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-12">
          {!hydrated ? (
            <div className="py-24 text-center">
              <Loader2 size={32} className="animate-spin text-neutral-400 mx-auto" />
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-20 space-y-4 bg-white border border-neutral-200 rounded-3xl">
              <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-950">
                Your Cart is Empty
              </h2>
              <p className="text-xs text-neutral-500">
                Add tournament gear to your cart before proceeding to checkout.
              </p>
              <Link
                href="/shop"
                className="inline-block mt-4 px-8 py-3.5 bg-neutral-950 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all"
              >
                Explore Pro Shop
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handlePlaceOrder}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
              noValidate
            >
              {/* LEFT — Form */}
              <div className="lg:col-span-7 space-y-6">
                <fieldset
                  disabled={paymentState === "pending"}
                  className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm disabled:opacity-70 transition-opacity"
                >
                  <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Truck size={16} />
                    </div>
                    <div>
                      <legend className="text-sm font-black uppercase tracking-tight text-neutral-950">
                        Shipping & Contact
                      </legend>
                      <p className="text-[11px] text-neutral-500 font-medium">
                        Where should we send your gear?
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field
                      label="Full Name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Brian Ochieng"
                      error={errors.fullName}
                    />
                    <Field
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="brian@example.com"
                      error={errors.email}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field
                      label="M-Pesa Number (Safaricom)"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0712345678"
                      error={errors.phone}
                      hint={
                        formData.phone && PHONE_REGEX.test(formData.phone.trim())
                          ? `Will charge ${normalizePhone(formData.phone)}`
                          : "Safaricom line registered to M-Pesa"
                      }
                    />
                    <div className="space-y-1.5">
                      <label
                        htmlFor="county"
                        className="text-[11px] font-black uppercase tracking-wider text-neutral-600"
                      >
                        County / Region
                      </label>
                      <select
                        id="county"
                        name="county"
                        value={formData.county}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                      >
                        {KENYA_COUNTIES.map((c) => (
                          <option key={c} value={c}>
                            {c} {c === "Nairobi" ? `(KSh ${NAIROBI_SHIPPING_FEE})` : `(KSh ${DEFAULT_SHIPPING_FEE})`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Field
                    label="Delivery Address / Pickup Location"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="e.g. Westlands, Chiromo Road or Club Name"
                    error={errors.address}
                  />
                </fieldset>

                <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                  <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h2 className="text-sm font-black uppercase tracking-tight text-neutral-950">
                        Payment Method
                      </h2>
                      <p className="text-[11px] text-neutral-500 font-medium">
                        Choose how you want to pay
                      </p>
                    </div>
                  </div>

                  <div
                    role="radiogroup"
                    aria-label="Payment method"
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    <PaymentOption
                      value="mpesa"
                      selected={paymentMethod === "mpesa"}
                      onSelect={setPaymentMethod}
                      title="M-Pesa STK Push"
                      description="Instant prompt sent directly to your phone to authorize payment via Safaricom M-Pesa."
                      icon={<Smartphone size={16} />}
                      disabled={paymentState === "pending"}
                    />
                    <PaymentOption
                      value="cod"
                      selected={paymentMethod === "cod"}
                      onSelect={setPaymentMethod}
                      title="Cash / M-Pesa on Delivery"
                      description="Pay upon receiving your equipment dispatch at your tournament or training venue."
                      disabled={paymentState === "pending"}
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT — Order Summary */}
              <div className="lg:col-span-5 lg:sticky lg:top-8">
                <div className="bg-white border border-neutral-200 rounded-3xl shadow-lg shadow-neutral-200/50 overflow-hidden">
                  <div className="px-8 py-5 bg-gradient-to-r from-neutral-950 to-neutral-900 text-white flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-tight">
                      Order Summary
                    </h3>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-2.5 py-1 rounded-full border border-white/20">
                      {cart.length} {cart.length === 1 ? "item" : "items"}
                    </span>
                  </div>

                  <div className="p-8 space-y-6">
                    {/* Items — enlarged thumbnails */}
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2 -mr-2">
                      {cart.map((item, idx) => (
                        <div
                          key={`${item.id}-${idx}`}
                          className="flex items-center justify-between gap-4 py-3 border-b border-neutral-100 last:border-b-0"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="relative w-20 h-20 bg-neutral-50 rounded-xl border border-neutral-200 overflow-hidden shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="80px"
                                className="object-contain p-2"
                              />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-black uppercase text-neutral-950 line-clamp-2 leading-tight">
                                {item.name}
                              </h4>
                              <span className="text-[10px] text-neutral-500 font-bold">
                                Qty: {item.quantity || 1}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-black text-neutral-900 shrink-0">
                            KSh {(item.price * (item.quantity || 1)).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-neutral-100 text-xs font-bold text-neutral-600">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="text-neutral-950">KSh {subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping ({formData.county})</span>
                        <span className="text-neutral-950">KSh {shippingFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-4 mt-2 border-t border-neutral-200 items-baseline">
                        <span className="text-xs font-black uppercase tracking-wider text-neutral-950">
                          Total
                        </span>
                        <span className="text-2xl font-black text-blue-600">
                          KSh {total.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {paymentState === "pending" ? (
                      <div className="w-full py-5 bg-blue-50 border-2 border-blue-200 rounded-2xl flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 text-blue-700 font-black text-xs uppercase tracking-widest">
                          <Loader2 size={16} className="animate-spin" />
                          Check your phone
                        </div>
                        <p className="text-[11px] text-blue-800/80 text-center px-4 leading-relaxed">
                          Enter your M-Pesa PIN on the prompt sent to{" "}
                          <strong>{normalizePhone(formData.phone)}</strong>.
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-700/70 uppercase tracking-widest">
                          <Clock size={12} /> Expires in {countdown}s
                        </div>
                      </div>
                    ) : (
                      <button
                        type="submit"
                        className="group w-full py-4 bg-neutral-950 hover:bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] transition-all rounded-2xl shadow-lg shadow-neutral-900/10 hover:shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>
                          {paymentMethod === "mpesa"
                            ? `Pay KSh ${total.toLocaleString()} via M-Pesa`
                            : `Place Order — KSh ${total.toLocaleString()}`}
                        </span>
                        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    )}

                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest pt-1">
                      <ShieldCheck size={14} className="text-emerald-600" /> Secure SSL Encrypted Checkout
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ---------- Subcomponents ---------- */

function Field({ label, name, value, onChange, placeholder, error, type = "text", hint }) {
  return (
    <div className="space-y-1.5" data-error={error ? "true" : "false"}>
      <label htmlFor={name} className="text-[11px] font-black uppercase tracking-wider text-neutral-600">
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
        className={`w-full px-4 py-3 bg-neutral-50 border rounded-xl text-xs font-medium focus:outline-none transition-colors ${
          error
            ? "border-red-500 focus:border-red-600 bg-red-50/30"
            : "border-neutral-200 focus:border-blue-600 focus:bg-white"
        }`}
      />
      {error ? (
        <p id={`${name}-error`} className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
          {error}
        </p>
      ) : hint ? (
        <p id={`${name}-hint`} className="text-[10px] font-medium text-neutral-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function PaymentOption({ value, selected, onSelect, title, description, icon, disabled }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={() => onSelect(value)}
      className={`text-left p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 disabled:opacity-60 disabled:cursor-not-allowed ${
        selected
          ? "border-blue-600 bg-blue-50/50 shadow-md shadow-blue-600/10"
          : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50"
      }`}
    >
      <div className="flex items-center justify-between w-full">
        <span className="text-xs font-black uppercase tracking-wider text-neutral-950 inline-flex items-center gap-2">
          {icon} {title}
        </span>
        <div
          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
            selected ? "border-blue-600 bg-blue-600" : "border-neutral-300"
          }`}
        >
          {selected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
        </div>
      </div>
      <p className="text-[11px] text-neutral-500 leading-relaxed">{description}</p>
    </button>
  );
}