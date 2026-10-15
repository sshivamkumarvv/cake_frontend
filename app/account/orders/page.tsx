'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  Clock,
  MapPin,
  CheckCircle2,
  ChefHat,
  Truck,
  PackageCheck,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { SAMPLE_ORDERS } from '../../../lib/data';

export default function AccountOrdersPage() {
  const steps = [
    { title: 'Received', icon: ShoppingBag },
    { title: 'Baking', icon: ChefHat },
    { title: 'Quality Check', icon: Sparkles },
    { title: 'Out for Delivery', icon: Truck },
    { title: 'Delivered', icon: PackageCheck },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'Received':
        return 0;
      case 'Baking':
        return 1;
      case 'Quality Check':
        return 2;
      case 'Out for Delivery':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EFE9DF]">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#86A57D]">
            Order History
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#253322] mt-1">
            My Cake Orders & Live Tracking
          </h1>
        </div>

        <Link
          href="/cakes"
          className="px-6 py-2.5 bg-[#283625] hover:bg-[#3E5239] text-white text-xs font-bold rounded-full transition-colors flex items-center gap-2 self-start sm:self-auto shadow-xs"
        >
          Order Another Cake <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Orders List */}
      <div className="space-y-8">
        {SAMPLE_ORDERS.map((order) => {
          const currentStep = getStepIndex(order.status);

          return (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-[#EFE9DF] overflow-hidden shadow-xs space-y-6 p-6 sm:p-8"
            >
              {/* Order Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EFE9DF]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-lg text-[#253322]">
                      Order #{order.orderNumber}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#736B63] mt-0.5">Placed on {order.date}</p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-[#736B63] block">Paid via {order.paymentMethod}</span>
                  <span className="font-serif font-bold text-xl text-[#283625]">
                    ₹{order.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Live Timeline Tracker */}
              <div className="py-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#86A57D] block mb-4">
                  Live Dispatch Status
                </span>
                <div className="grid grid-cols-5 gap-2 relative">
                  {steps.map((st, sIdx) => {
                    const isDone = sIdx <= currentStep;
                    const isCurrent = sIdx === currentStep;
                    const Icon = st.icon;

                    return (
                      <div key={st.title} className="flex flex-col items-center text-center space-y-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isDone
                              ? 'bg-[#283625] text-white shadow-sm'
                              : 'bg-[#F2EDE4] text-[#B0CEAA]'
                          } ${isCurrent ? 'ring-4 ring-[#9CB894]/40 scale-110' : ''}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span
                          className={`text-[10px] sm:text-xs font-medium leading-tight ${
                            isDone ? 'text-[#253322] font-semibold' : 'text-[#736B63]'
                          }`}
                        >
                          {st.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items in this Order */}
              <div className="pt-4 border-t border-[#EFE9DF] space-y-4">
                <div className="divide-y divide-[#FAF8F5]">
                  {order.items.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="py-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-[#E6F0E2]">
                          <Image src={item.image} alt={item.title} fill className="object-cover" />
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-sm text-[#253322]">
                            {item.title}
                          </h4>
                          <div className="flex flex-wrap gap-2 text-xs text-[#736B63] mt-0.5">
                            <span>Qty: {item.quantity}</span>
                            <span>•</span>
                            <span>{item.weight}</span>
                            <span>•</span>
                            <span>{item.flavor}</span>
                          </div>
                          {item.customMessage && (
                            <p className="text-[11px] text-[#6B8B62] italic mt-1 bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EFE9DF] inline-block">
                              Message: &quot;{item.customMessage}&quot;
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right sm:self-center">
                        <span className="font-serif font-bold text-sm text-[#253322]">
                          ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Slot info */}
                <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E6F0E2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#546F4D]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#86A57D]" />
                    <span>
                      Delivery Window: <strong>{order.deliveryDate} ({order.deliverySlot})</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#86A57D]" />
                    <span className="truncate max-w-xs">{order.customer.address}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
