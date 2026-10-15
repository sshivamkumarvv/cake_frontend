'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingBag,
  GraduationCap,
  Cake,
  Users,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Tag,
  DollarSign,
  Plus,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Edit,
} from 'lucide-react';
import {
  CAKE_PRODUCTS,
  BAKING_COURSES,
  SAMPLE_ORDERS,
  SAMPLE_COUPONS,
  SAMPLE_DELIVERY_SLOTS,
  SAMPLE_ADMIN_METRICS,
} from '../../lib/data';
import { Order } from '../../lib/types';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'cakes' | 'orders' | 'courses' | 'coupons'>('overview');
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [cakesList, setCakesList] = useState(CAKE_PRODUCTS);
  const [cakeSearch, setCakeSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredCakes = cakesList.filter(
    (c) =>
      c.name.toLowerCase().includes(cakeSearch.toLowerCase()) ||
      c.category.toLowerCase().includes(cakeSearch.toLowerCase())
  );

  const filteredOrders =
    orderFilter === 'all'
      ? orders
      : orders.filter((o) => o.status.toLowerCase() === orderFilter.toLowerCase());

  const handleUpdateOrderStatus = (orderId: string, newStatus: any) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EFE9DF]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#283625] text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-[#9CB894]" />
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#253322]">
              Studio Admin & Operations Portal
            </h1>
            <p className="text-xs text-[#736B63]">
              Indiranagar Pastry Kitchen & Online Academy Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold bg-[#E6F0E2] text-[#283625] px-3 py-1.5 rounded-full border border-[#D0E2CA] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Kitchen Live Dispatch Active
          </span>
          <Link
            href="/"
            className="text-xs text-[#6B8B62] hover:underline px-3 py-1.5 font-medium"
          >
            ← View Storefront
          </Link>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#EFE9DF]">
        {[
          { id: 'overview', label: 'Dashboard KPIs', icon: TrendingUp },
          { id: 'orders', label: `Cake Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'cakes', label: `Cakes Menu (${cakesList.length})`, icon: Cake },
          { id: 'courses', label: `Baking Academy (${BAKING_COURSES.length})`, icon: GraduationCap },
          { id: 'coupons', label: `Coupons (${SAMPLE_COUPONS.length})`, icon: Tag },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#283625] text-white shadow-xs'
                  : 'text-[#546F4D] hover:bg-[#E6F0E2]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 bg-white rounded-3xl border border-[#EFE9DF] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-[#736B63]">
                <span className="text-xs font-medium uppercase tracking-wider">Gross Monthly Sales</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {SAMPLE_ADMIN_METRICS.monthlyGrowth}
                </span>
              </div>
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#253322]">
                {SAMPLE_ADMIN_METRICS.totalRevenue}
              </h3>
              <p className="text-[11px] text-[#736B63]">Cakes + Online Academy revenue</p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-[#EFE9DF] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-[#736B63]">
                <span className="text-xs font-medium uppercase tracking-wider">Orders This Month</span>
                <ShoppingBag className="w-4 h-4 text-[#86A57D]" />
              </div>
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#253322]">
                {SAMPLE_ADMIN_METRICS.ordersThisMonth}
              </h3>
              <p className="text-[11px] text-[#736B63]">Avg. order value {SAMPLE_ADMIN_METRICS.averageOrderValue}</p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-[#EFE9DF] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-[#736B63]">
                <span className="text-xs font-medium uppercase tracking-wider">Enrolled Students</span>
                <GraduationCap className="w-4 h-4 text-[#86A57D]" />
              </div>
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#253322]">
                {SAMPLE_ADMIN_METRICS.activeAcademyStudents.toLocaleString('en-IN')}
              </h3>
              <p className="text-[11px] text-[#736B63]">78% course completion rate</p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-[#EFE9DF] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-[#736B63]">
                <span className="text-xs font-medium uppercase tracking-wider">Kitchen Status</span>
                <Clock className="w-4 h-4 text-[#DE9E62]" />
              </div>
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#283625]">
                Baking Slot 3
              </h3>
              <p className="text-[11px] text-[#736B63]">Evening deliveries preparing now</p>
            </div>
          </div>

          {/* Popular Cakes Table & Recent Dispatch List */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-[#EFE9DF] shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-base text-[#253322]">
                Top Revenue Gateaux (October 2026)
              </h3>
              <div className="divide-y divide-[#FAF8F5]">
                {SAMPLE_ADMIN_METRICS.popularCakes.map((c, i) => (
                  <div key={i} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-[#253322]">{c.name}</p>
                      <span className="text-[11px] text-[#736B63]">{c.orders} units baked</span>
                    </div>
                    <span className="font-serif font-bold text-sm text-[#283625]">
                      {c.revenue}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-[#EFE9DF] shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-base text-[#253322]">
                Recent Orders Stream
              </h3>
              <div className="divide-y divide-[#FAF8F5]">
                {SAMPLE_ADMIN_METRICS.recentOrders.map((ro) => (
                  <div key={ro.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-[#253322] font-semibold">{ro.id}</strong>
                        <span className="text-[#736B63]">• {ro.customer}</span>
                      </div>
                      <span className="text-[11px] text-[#546F4D]">{ro.cake}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-serif font-bold text-[#253322] block">{ro.amount}</span>
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-semibold">
                        {ro.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDER MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#736B63]">Filter Status:</span>
              {['all', 'baking', 'delivered'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase ${
                    orderFilter === st
                      ? 'bg-[#283625] text-white'
                      : 'bg-white border border-[#D0E2CA] text-[#736B63]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#EFE9DF] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] border-b border-[#EFE9DF] text-[#736B63] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Order #</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Cake Items</th>
                    <th className="p-4">Delivery Slot</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status & Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FAF8F5]">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#283625]">{ord.orderNumber}</td>
                      <td className="p-4">
                        <p className="font-semibold text-[#253322]">{ord.customer.name}</p>
                        <p className="text-[11px] text-[#736B63]">{ord.customer.phone}</p>
                      </td>
                      <td className="p-4">
                        {ord.items.map((it) => (
                          <div key={it.cartItemId}>
                            <p className="font-semibold text-[#253322]">{it.title}</p>
                            <span className="text-[10px] text-[#736B63]">
                              {it.quantity}x {it.weight} {it.flavor ? `• ${it.flavor}` : ''}
                            </span>
                          </div>
                        ))}
                      </td>
                      <td className="p-4">
                        <span className="block font-medium text-[#253322]">{ord.deliveryDate}</span>
                        <span className="text-[11px] text-[#736B63]">{ord.deliverySlot}</span>
                      </td>
                      <td className="p-4 font-serif font-bold text-[#253322]">
                        ₹{ord.total.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4">
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="px-2.5 py-1 text-xs rounded-lg border border-[#D0E2CA] bg-white font-semibold text-[#253322] cursor-pointer"
                        >
                          <option value="Received">Received</option>
                          <option value="Baking">Baking</option>
                          <option value="Quality Check">Quality Check</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CAKE CATALOG MANAGEMENT */}
      {activeTab === 'cakes' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-[#736B63] absolute left-3 top-3" />
              <input
                type="text"
                value={cakeSearch}
                onChange={(e) => setCakeSearch(e.target.value)}
                placeholder="Search cake catalog..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#D0E2CA] bg-white text-[#253322] focus:outline-none"
              />
            </div>

            <button
              onClick={() => alert('New product formulation modal ready')}
              className="px-5 py-2.5 bg-[#283625] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Add New Cake
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-[#EFE9DF] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] border-b border-[#EFE9DF] text-[#736B63] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Cake</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Base Price (0.5kg)</th>
                    <th className="p-4">Dietary</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4">Notice Time</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FAF8F5]">
                  {filteredCakes.map((ck) => (
                    <tr key={ck.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0">
                          <Image src={ck.images[0]} alt={ck.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#253322]">{ck.name}</p>
                          <span className="text-[10px] text-[#736B63]">{ck.weights.length} sizes</span>
                        </div>
                      </td>
                      <td className="p-4 text-[#546F4D]">{ck.category}</td>
                      <td className="p-4 font-serif font-bold text-[#253322]">
                        ₹{ck.price.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4">
                        {ck.isEggless ? (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-semibold">
                            100% Eggless
                          </span>
                        ) : (
                          <span className="text-[#736B63]">Contains Egg</span>
                        )}
                      </td>
                      <td className="p-4 font-semibold text-[#253322]">★ {ck.rating}</td>
                      <td className="p-4 text-[11px] text-[#736B63] truncate max-w-xs">{ck.preparationTime}</td>
                      <td className="p-4">
                        <Link
                          href={`/cakes/${ck.slug}`}
                          className="text-[#6B8B62] hover:underline flex items-center gap-1 font-semibold"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BAKING ACADEMY COURSES */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BAKING_COURSES.map((co) => (
            <div
              key={co.id}
              className="bg-white p-6 rounded-3xl border border-[#EFE9DF] space-y-4 shadow-xs"
            >
              <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-black">
                <Image src={co.thumbnail} alt={co.title} fill className="object-cover" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#86A57D] uppercase">
                  {co.category} • {co.level}
                </span>
                <h4 className="font-serif font-bold text-base text-[#253322] mt-0.5 line-clamp-1">
                  {co.title}
                </h4>
                <div className="flex justify-between items-center text-xs text-[#736B63] mt-2">
                  <span>{co.lessonCount} Lessons ({co.duration})</span>
                  <span className="font-serif font-bold text-[#283625] text-sm">
                    ₹{co.price.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              <div className="pt-3 border-t border-[#FAF8F5] flex items-center justify-between text-xs">
                <span className="text-[#546F4D]">{co.studentCount} active students</span>
                <Link
                  href={`/learn/${co.id}`}
                  className="text-[#6B8B62] hover:underline font-semibold"
                >
                  Preview Player →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: COUPONS */}
      {activeTab === 'coupons' && (
        <div className="bg-white rounded-3xl border border-[#EFE9DF] overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#EFE9DF] text-[#736B63] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Minimum Order</th>
                <th className="p-4">Description</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF8F5]">
              {SAMPLE_COUPONS.map((cp) => (
                <tr key={cp.code}>
                  <td className="p-4 font-mono font-bold text-[#283625]">{cp.code}</td>
                  <td className="p-4 font-bold text-[#6B8B62]">
                    {cp.discountType === 'percentage' ? `${cp.value}% OFF` : `₹${cp.value} OFF`}
                  </td>
                  <td className="p-4">₹{cp.minOrder}</td>
                  <td className="p-4 text-[#736B63]">{cp.description}</td>
                  <td className="p-4">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
