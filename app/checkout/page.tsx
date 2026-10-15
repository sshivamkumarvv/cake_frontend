'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  CreditCard,
  Smartphone,
  Truck,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ShoppingBag,
  GraduationCap,
  MapPin,
  MessageCircle,
  Copy,
  Check,
} from 'lucide-react';
import { useCart } from '../../lib/cart-context';
import { SAMPLE_DELIVERY_SLOTS, BAKERY_INFO } from '../../lib/data';
import { getWhatsAppOrderUrl, generateWhatsAppOrderText } from '../../lib/whatsapp';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, deliveryFee, total, clearCart, user } = useCart();

  // Form states
  const [name, setName] = useState(user?.name || 'Priya Sharma');
  const [email, setEmail] = useState(user?.email || 'priya.sharma@example.com');
  const [phone, setPhone] = useState(user?.phone || '8198978095');
  const [addressLine, setAddressLine] = useState(
    user?.savedAddresses[0]?.addressLine || 'Flat 402, Ashiana Greens, Alwar Bypass Road'
  );
  const [landmark, setLandmark] = useState('Near Genesis Mall');
  const [city] = useState(BAKERY_INFO.location);
  const [pincode, setPincode] = useState('301019');
  const [deliveryDate, setDeliveryDate] = useState('Today');
  const [deliverySlot, setDeliverySlot] = useState(SAMPLE_DELIVERY_SLOTS[0].time);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [orderNotes, setOrderNotes] = useState('');

  // Processing & Confirmation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [confirmedOrderData, setConfirmedOrderData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedId = `BK-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderPayload = {
      orderId: generatedId,
      customerName: name,
      phone,
      items,
      subtotal,
      discount,
      deliveryFee,
      total,
      deliveryDate,
      deliverySlot,
      addressLine,
      landmark,
      city,
      pincode,
      paymentMethod,
      orderNotes,
    };

    // 1. Prepare WhatsApp URL & formatted message
    const whatsappUrl = getWhatsAppOrderUrl(orderPayload);
    const orderText = generateWhatsAppOrderText(orderPayload);

    // 2. 1-CLICK LAUNCH: Open WhatsApp immediately directly in the user click event
    try {
      const opened = window.open(whatsappUrl, '_blank');
      if (!opened || opened.closed || typeof opened.closed === 'undefined') {
        window.location.href = whatsappUrl;
      }
    } catch {
      window.location.href = whatsappUrl;
    }

    // 3. Record order in Google Sheets via internal API route (non-blocking)
    try {
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
        keepalive: true,
      }).catch((err) => console.error('Orders background sync error:', err));
    } catch (err) {
      console.error('Failed to dispatch order sync:', err);
    }

    setConfirmedOrderId(generatedId);
    setConfirmedOrderData({
      ...orderPayload,
      whatsappUrl,
      orderText,
    });
    setIsSubmitting(false);
    clearCart();
  };

  if (confirmedOrderId && confirmedOrderData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#E8F8EE] text-[#15803D] flex items-center justify-center mx-auto shadow-md animate-in zoom-in-75 duration-300">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F8EE] text-[#15803D] text-xs font-semibold border border-[#BBF7D0]">
            <Sparkles className="w-3.5 h-3.5 text-[#C27838]" />
            <span>Order Placed &amp; WhatsApp Launched</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810]">
            Thank You, {name}!
          </h1>
          <p className="text-xs sm:text-sm text-[#8A796F] max-w-md mx-auto">
            Your celebration order has been logged into our Kitchen Registry. WhatsApp was automatically launched with your order details for Chef Mitali.
          </p>
        </div>

        {/* ORDER DETAILS & WHATSAPP STATUS CARD */}
        <div className="p-6 bg-gradient-to-br from-[#FAF6F0] to-white rounded-3xl border border-[#E8DEC8] text-left space-y-4 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8]">
            <div>
              <span className="text-[10px] text-[#8A796F] uppercase tracking-wider">Order Reference</span>
              <p className="font-serif font-bold text-lg text-[#2C1810]">#{confirmedOrderId}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#8A796F] uppercase tracking-wider">Payable Total</span>
              <p className="font-serif font-bold text-lg text-[#2C1810]">
                ₹{total.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-[#2C1810]">
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#15803D]" />
              <span><strong>Kitchen Registry Status:</strong> Logged &amp; Scheduled for {deliveryDate}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#15803D]" />
              <span><strong>Delivery Slot:</strong> {deliverySlot}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#15803D]" />
              <span><strong>Delivery Address:</strong> {addressLine}, {city} - {pincode}</span>
            </p>
          </div>

          {/* WhatsApp Quick Re-Open (If tab was closed or blocked) */}
          <div className="pt-2">
            <a
              href={confirmedOrderData.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-[#25D366]/20 transition-all hover:scale-[1.01] active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Re-open WhatsApp Chat with Chef Mitali</span>
            </a>
            <p className="text-[11px] text-center text-[#8A796F] mt-2">
              ✓ WhatsApp chat launched automatically. Tap send in WhatsApp to finalize with our studio chef.
            </p>
          </div>

          {/* Copy Order Text Utility */}
          <div className="pt-2 border-t border-[#E8DEC8] flex items-center justify-between text-xs">
            <span className="text-[11px] text-[#8A796F]">Need to copy your order summary?</span>
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(confirmedOrderData.orderText);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E8DEC8] hover:bg-[#FAF6F0] rounded-lg text-xs font-semibold text-[#2C1810] transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#15803D]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#8A796F]" />
                  <span>Copy Order Text</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/cakes"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#2C1810] hover:bg-[#3E2014] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            Order Another Cake <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-[#F5ECE1] text-[#2C1810] text-xs font-bold uppercase tracking-wider rounded-full border border-[#E8DEC8] transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#253322]">No Items in Cart</h2>
        <p className="text-xs text-[#736B63]">
          Please select a cake or course before proceeding to checkout.
        </p>
        <Link
          href="/cakes"
          className="inline-block px-6 py-3 bg-[#283625] text-white text-xs font-bold rounded-full"
        >
          View Cake Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#736B63]">
        <Link href="/cart" className="hover:text-[#253322]">Cart</Link>
        <ChevronRight className="w-3 h-3 text-[#B0CEAA]" />
        <span className="text-[#253322] font-semibold">Secure Checkout</span>
      </nav>

      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#86A57D]">
          Temperature-Guarded Dispatch
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#253322] mt-1">
          Complete Your Order
        </h1>
      </div>

      {/* Mobile-First Collapsible Order Summary Bar */}
      <div className="lg:hidden bg-white rounded-2xl border border-[#D0E2CA] overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
          className="w-full px-4 py-3 bg-[#FAF8F5] flex items-center justify-between text-xs font-semibold text-[#283625]"
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#6B8B62]" />
            <span>{isMobileSummaryOpen ? 'Hide Order Summary' : 'Show Order Summary'} ({items.length} items)</span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#736B63] transition-transform duration-200 ${isMobileSummaryOpen ? 'rotate-180' : ''}`} />
          </div>
          <span className="font-serif font-bold text-sm text-[#283625]">₹{total.toLocaleString('en-IN')}</span>
        </button>

        {isMobileSummaryOpen && (
          <div className="p-4 space-y-3 border-t border-[#EFE9DF] animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-2.5 max-h-56 overflow-y-auto divide-y divide-[#FAF8F5]">
              {items.map((it) => (
                <div key={it.cartItemId} className="pt-2 first:pt-0 flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-[#FAF8F5] border border-[#E6F0E2]">
                    <Image src={it.image} alt={it.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-serif font-bold text-xs text-[#253322] truncate">{it.title}</h5>
                    <p className="text-[10px] text-[#736B63]">
                      {it.quantity}x • {it.weight || 'Standard'} {it.flavor ? `• ${it.flavor}` : ''}
                    </p>
                  </div>
                  <span className="font-serif font-bold text-xs text-[#253322] shrink-0">
                    ₹{(it.unitPrice * it.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 text-xs pt-3 border-t border-[#EFE9DF]">
              <div className="flex justify-between text-[#736B63]">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#6B8B62] font-semibold">
                  <span>Discount</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-[#736B63]">
                <span>Fresh Local Delivery (≤ {BAKERY_INFO.deliveryRadiusKm} km)</span>
                <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between font-serif font-bold text-sm text-[#253322] pt-1.5 border-t border-[#EFE9DF]">
                <span>Total</span>
                <span className="text-[#283625]">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form: Details, Address & Payment */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Contact Information */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EFE9DF] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#253322] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E6F0E2] text-[#283625] text-xs flex items-center justify-center font-sans font-bold">
                1
              </span>
              Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#253322] mb-1">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-[#D0E2CA] bg-[#FAF8F5] text-[#253322] focus:outline-none focus:border-[#6B8B62]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#253322] mb-1">
                  Mobile Number (For Delivery SMS) *
                </label>
                <div className="flex rounded-xl border border-[#D0E2CA] overflow-hidden bg-[#FAF8F5]">
                  <span className="px-3 py-2.5 bg-[#E6F0E2] text-xs font-semibold text-[#283625]">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 text-xs bg-transparent text-[#253322] focus:outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#253322] mb-1">
                  Email Address (For Invoice & Tracking) *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-[#D0E2CA] bg-[#FAF8F5] text-[#253322] focus:outline-none focus:border-[#6B8B62]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Destination in Bhiwadi */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EFE9DF] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-serif font-bold text-lg text-[#253322] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#E6F0E2] text-[#283625] text-xs flex items-center justify-center font-sans font-bold">
                  2
                </span>
                Delivery Address ({BAKERY_INFO.location})
              </h3>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-1 rounded-full border border-[#C8E6C9] self-start sm:self-auto">
                <MapPin className="w-3 h-3 text-[#2E7D32]" />
                Delivering within {BAKERY_INFO.deliveryRadiusKm} km of store
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#253322] mb-1">
                  House / Flat / Villa / Street Address *
                </label>
                <input
                  type="text"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="e.g. Flat 402, Ashiana Greens, Alwar Bypass Road"
                  required
                  className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-[#D0E2CA] bg-[#FAF8F5] text-[#253322] focus:outline-none focus:border-[#6B8B62]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#253322] mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Near metro / park"
                    className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-[#D0E2CA] bg-[#FAF8F5] text-[#253322] focus:outline-none focus:border-[#6B8B62]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#253322] mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    disabled
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D0E2CA] bg-[#E6F0E2] font-semibold text-[#283625]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#253322] mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.slice(0, 6))}
                    placeholder="560038"
                    maxLength={6}
                    required
                    className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-[#D0E2CA] bg-[#FAF8F5] text-[#253322] focus:outline-none focus:border-[#6B8B62]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Delivery Slot Confirmation */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EFE9DF] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#253322] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E6F0E2] text-[#283625] text-xs flex items-center justify-center font-sans font-bold">
                3
              </span>
              Schedule Chilled Delivery Slot
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {['Today', 'Tomorrow', 'Day After'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDeliveryDate(d)}
                  className={`py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                    deliveryDate === d
                      ? 'border-[#283625] bg-[#E6F0E2] text-[#283625]'
                      : 'border-[#EFE9DF] bg-[#FAF8F5] text-[#736B63]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <select
              value={deliverySlot}
              onChange={(e) => setDeliverySlot(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D0E2CA] bg-[#FAF8F5] text-[#253322] font-medium focus:outline-none focus:border-[#6B8B62]"
            >
              {SAMPLE_DELIVERY_SLOTS.map((s) => (
                <option key={s.id} value={s.time}>
                  {s.time} ({s.label})
                </option>
              ))}
            </select>
          </div>

          {/* Section 4: Payment Method Selection */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EFE9DF] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#253322] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E6F0E2] text-[#283625] text-xs flex items-center justify-center font-sans font-bold">
                4
              </span>
              Payment & Order Confirmation Preference
            </h3>

            <div className="space-y-2.5">
              <label
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-[#25D366] bg-[#E8F8EE]/60 ring-1 ring-[#25D366]'
                    : 'border-[#EFE9DF] bg-[#FAF8F5] hover:border-[#D0E2CA]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#253322] flex items-center gap-2">
                      WhatsApp Confirmation & Instant UPI QR
                      <span className="bg-[#283625] text-white text-[9px] uppercase px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </span>
                    <span className="text-[10px] text-[#736B63] block mt-0.5">
                      Send order to Chef Mitali on WhatsApp. Receive instant booking confirmation & Google Pay / PhonePe QR.
                    </span>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    paymentMethod === 'upi' ? 'border-[#25D366] bg-[#25D366]' : 'border-[#736B63]'
                  }`}
                >
                  {paymentMethod === 'upi' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#C27838] bg-[#F5ECE1]'
                    : 'border-[#E8DEC8] bg-[#FAF6F0] hover:border-[#C27838]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F5ECE1] text-[#2C1810] flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#2C1810] block">
                      Pay on Delivery (Cash / UPI upon delivery)
                    </span>
                    <span className="text-[10px] text-[#8A796F] block mt-0.5">
                      Pay safely at your doorstep in {BAKERY_INFO.location}. Cash or UPI QR upon handover.
                    </span>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    paymentMethod === 'cod' ? 'border-[#C27838] bg-[#C27838]' : 'border-[#8A796F]'
                  }`}
                >
                  {paymentMethod === 'cod' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Sticky Order Summary */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white p-6 rounded-3xl border border-[#EFE9DF] shadow-xs space-y-5 sticky top-28">
            <h3 className="font-serif font-bold text-base text-[#253322] pb-3 border-b border-[#EFE9DF]">
              Order Summary ({items.length} items)
            </h3>

            {/* Compact items list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-[#FAF8F5]">
              {items.map((it) => (
                <div key={it.cartItemId} className="pt-2 first:pt-0 flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-[#FAF8F5] border border-[#E6F0E2]">
                    <Image src={it.image} alt={it.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-serif font-bold text-xs text-[#253322] truncate">
                      {it.title}
                    </h5>
                    <p className="text-[10px] text-[#736B63]">
                      {it.quantity}x • {it.weight || 'Standard'} {it.flavor ? `• ${it.flavor}` : ''}
                    </p>
                    {it.customMessage && (
                      <p className="text-[9px] text-[#6B8B62] truncate italic">
                        &quot;{it.customMessage}&quot;
                      </p>
                    )}
                  </div>
                  <span className="font-serif font-bold text-xs text-[#253322] shrink-0">
                    ₹{(it.unitPrice * it.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs pt-3 border-t border-[#EFE9DF]">
              <div className="flex justify-between text-[#736B63]">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#253322]">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#6B8B62] font-semibold">
                  <span>Special Discount</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-[#736B63]">
                <span>Fresh Local Delivery (≤ {BAKERY_INFO.deliveryRadiusKm} km)</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-[#6B8B62] font-semibold">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="pt-3 border-t border-[#E8DEC8] flex justify-between items-baseline">
                <span className="font-serif font-bold text-base text-[#2C1810]">
                  Payable Total
                </span>
                <span className="font-serif font-bold text-2xl text-[#2C1810]">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#25D366] hover:bg-[#20ba59] disabled:bg-[#8A796F] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/25 active:scale-98 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Logging into Kitchen Registry...</span>
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>1-Click Order: Send to Kitchen on WhatsApp (₹{total.toLocaleString('en-IN')})</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-[#8A796F]">
              ⚡ 1-Click: Order logs into registry and immediately opens WhatsApp with pre-filled details for Chef Mitali.
            </p>
          </div>
        </div>

        {/* Sticky Mobile Place Order Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#FAF6F0]/95 backdrop-blur-md px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] border-t border-[#E8DEC8] lg:hidden shadow-[0_-8px_30px_rgba(44,24,16,0.12)] flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-[#8A796F] block leading-tight">Payable Total</span>
            <span className="font-serif font-bold text-lg text-[#2C1810]">
              ₹{total.toLocaleString('en-IN')}
            </span>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 max-w-[240px] py-3.5 bg-[#25D366] hover:bg-[#20ba59] disabled:bg-[#8A796F] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-md shadow-[#25D366]/25 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Logging...</span>
            ) : (
              <>
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>1-Click WhatsApp Order</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
