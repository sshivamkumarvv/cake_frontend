'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  User,
  ShoppingBag,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Edit2,
  Plus,
  Check,
  LogOut,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../../lib/cart-context';
import { SAMPLE_CUSTOMER } from '../../lib/data';

export default function AccountPage() {
  const { user, logoutUser } = useCart();
  const [profile, setProfile] = useState(user || SAMPLE_CUSTOMER);
  const [isEditing, setIsEditing] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const [editName, setEditName] = useState(profile.name);
  const [editPhone, setEditPhone] = useState(profile.phone);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({ ...profile, name: editName, phone: editPhone });
    setIsEditing(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Profile Overview Banner */}
      <div className="bg-[#FAF8F5] rounded-3xl p-8 sm:p-10 border border-[#D0E2CA] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-5">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#9CB894] text-white flex items-center justify-center font-serif font-bold text-2xl shadow-sm border-2 border-white">
            {profile.name[0]}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#253322]">
                {profile.name}
              </h1>
              <span className="bg-[#DE9E62]/20 text-[#8E44AD] border border-[#DE9E62]/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                {profile.tier}
              </span>
            </div>
            <p className="text-xs text-[#736B63]">{profile.email} • {profile.phone}</p>
            <p className="text-[11px] text-[#86A57D]">Member since {profile.joinedDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/account/orders"
            className="px-5 py-2.5 bg-white hover:bg-[#E6F0E2] text-[#283625] text-xs font-semibold rounded-full border border-[#D0E2CA] transition-colors shadow-xs"
          >
            My Cake Orders
          </Link>
          <Link
            href="/account/learning"
            className="px-5 py-2.5 bg-[#283625] hover:bg-[#3E5239] text-white text-xs font-semibold rounded-full transition-colors shadow-xs flex items-center gap-1.5"
          >
            <GraduationCap className="w-4 h-4 text-[#9CB894]" />
            Student Classroom
          </Link>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" /> Profile preferences updated successfully.
        </div>
      )}

      {/* Grid: Profile Details & Saved Addresses */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Account Details & Editing */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#EFE9DF] shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#EFE9DF]">
            <h3 className="font-serif font-bold text-lg text-[#253322] flex items-center gap-2">
              <User className="w-5 h-5 text-[#86A57D]" />
              Personal Profile
            </h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs text-[#6B8B62] hover:underline flex items-center gap-1"
            >
              <Edit2 className="w-3.5 h-3.5" />
              {isEditing ? 'Cancel' : 'Edit Info'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#253322] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#D0E2CA] text-[#253322]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#253322] mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#D0E2CA] text-[#253322]"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#283625] text-white text-xs font-bold rounded-xl"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="flex justify-between py-2 border-b border-[#FAF8F5]">
                <span className="text-[#736B63]">Full Name</span>
                <span className="font-semibold text-[#253322]">{profile.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#FAF8F5]">
                <span className="text-[#736B63]">Primary Email</span>
                <span className="font-semibold text-[#253322]">{profile.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#FAF8F5]">
                <span className="text-[#736B63]">Mobile Number</span>
                <span className="font-semibold text-[#253322]">{profile.phone}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#FAF8F5]">
                <span className="text-[#736B63]">Dietary Preference</span>
                <span className="font-semibold text-[#6B8B62]">100% Eggless Preferred</span>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-[#EFE9DF] flex items-center justify-between text-xs">
            <span className="text-[#736B63]">Account Security: Simulated Session</span>
            <button
              onClick={logoutUser}
              className="text-red-600 hover:underline flex items-center gap-1 font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        {/* Right Column: Saved Delivery Addresses */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#EFE9DF] shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#EFE9DF]">
            <h3 className="font-serif font-bold text-lg text-[#253322] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#86A57D]" />
              Saved Delivery Addresses ({profile.savedAddresses.length})
            </h3>
            <button
              onClick={() => alert('New address creation ready for live database')}
              className="text-xs text-[#6B8B62] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Address
            </button>
          </div>

          <div className="space-y-4">
            {profile.savedAddresses.map((addr) => (
              <div
                key={addr.id}
                className="p-4 rounded-2xl border border-[#E6F0E2] bg-[#FAF8F5] space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#283625] bg-[#E6F0E2] px-2.5 py-0.5 rounded-full">
                    {addr.type}
                  </span>
                  {addr.isDefault && (
                    <span className="text-[10px] text-[#6B8B62] font-semibold">
                      Default Delivery Address
                    </span>
                  )}
                </div>

                <p className="text-xs font-semibold text-[#253322]">{addr.name}</p>
                <p className="text-xs text-[#546F4D] leading-relaxed">
                  {addr.addressLine}, {addr.landmark ? `near ${addr.landmark}, ` : ''}
                  {addr.city} - {addr.pincode}
                </p>
                <p className="text-[11px] text-[#736B63]">{addr.phone}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
