'use client';

import React, { useState } from 'react';
import { X, Phone, Mail, Lock, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import { useCart } from '../lib/cart-context';

export function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, loginUser } = useCart();
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    setErrorMsg('');
    setStep('otp');
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...otp];
    updated[index] = val;
    setOtp(updated);

    // Auto-focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const verifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join('').length < 4) {
      setErrorMsg('Please enter the 4-digit verification code (e.g. 1234)');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('Phone verified! Signing you in...');
    setTimeout(() => {
      loginUser(`+91 ${phoneNumber}`);
      setSuccessMsg('');
      setStep('input');
    }, 800);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('Signing you into Bakeistry...');
    setTimeout(() => {
      loginUser(email);
      setSuccessMsg('');
    }, 800);
  };

  const quickDemoLogin = (type: 'student' | 'chef') => {
    if (type === 'student') {
      loginUser('priya.sharma@example.com');
    } else {
      loginUser('mitali@bakeistrystudio.com');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsAuthModalOpen(false)}
      />

      <div className="relative w-full max-w-md bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#D0E2CA] overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-white border-b border-[#EFE9DF] text-center relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 p-2 text-[#736B63] hover:text-[#253322] rounded-full hover:bg-[#F2EDE4]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="inline-block p-2 rounded-2xl bg-[#E6F0E2] text-[#283625] mb-2">
            <Sparkles className="w-5 h-5 text-[#6B8B62]" />
          </span>
          <h3 className="font-serif font-bold text-2xl text-[#253322]">
            Welcome to Bakeistry
          </h3>
          <p className="text-xs text-[#736B63] mt-1">
            Access cake order tracking & student video classroom
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Method Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#EFE9DF] rounded-xl text-xs font-semibold">
            <button
              onClick={() => {
                setAuthMethod('phone');
                setStep('input');
                setErrorMsg('');
              }}
              className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                authMethod === 'phone'
                  ? 'bg-white text-[#253322] shadow-xs'
                  : 'text-[#736B63] hover:text-[#253322]'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              Phone OTP
            </button>
            <button
              onClick={() => {
                setAuthMethod('email');
                setStep('input');
                setErrorMsg('');
              }}
              className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                authMethod === 'email'
                  ? 'bg-white text-[#253322] shadow-xs'
                  : 'text-[#736B63] hover:text-[#253322]'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Email Login
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {successMsg}
            </div>
          )}

          {/* Form based on method */}
          {authMethod === 'phone' ? (
            step === 'input' ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#253322] mb-1.5">
                    Mobile Number (India)
                  </label>
                  <div className="flex rounded-xl border border-[#D0E2CA] overflow-hidden bg-white focus-within:border-[#6B8B62] focus-within:ring-2 focus-within:ring-[#9CB894]/30">
                    <span className="px-3 py-2.5 bg-[#FAF8F5] text-xs font-semibold text-[#736B63] border-r border-[#D0E2CA] flex items-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      maxLength={10}
                      placeholder="98765 43210"
                      className="w-full px-3 py-2.5 text-sm text-[#253322] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#283625] hover:bg-[#3E5239] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                >
                  Send One-Time Password (OTP)
                </button>
              </form>
            ) : (
              <form onSubmit={verifyOtp} className="space-y-4">
                <div className="text-center">
                  <p className="text-xs text-[#736B63]">
                    We sent a 4-digit code to <span className="font-bold text-[#253322]">+91 {phoneNumber}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep('input')}
                    className="text-[11px] text-[#6B8B62] underline mt-0.5"
                  >
                    Change number
                  </button>
                </div>

                <div className="flex justify-center gap-3">
                  {[0, 1, 2, 3].map((idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otp[idx]}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="w-12 h-12 text-center text-lg font-bold rounded-xl border border-[#D0E2CA] bg-white text-[#253322] focus:border-[#6B8B62] focus:ring-2 focus:ring-[#9CB894]/30 focus:outline-none"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#283625] hover:bg-[#3E5239] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                >
                  Verify & Continue
                </button>
                <p className="text-center text-[10px] text-[#736B63]">
                  Didn&apos;t receive it? Enter any 4 digits (e.g. 1234) for prototype demo.
                </p>
              </form>
            )
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#253322] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#736B63] absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D0E2CA] bg-white text-sm text-[#253322] focus:border-[#6B8B62] focus:ring-2 focus:ring-[#9CB894]/30 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#253322]">
                    Password
                  </label>
                  <a href="#" className="text-[11px] text-[#6B8B62] hover:underline">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#736B63] absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D0E2CA] bg-white text-sm text-[#253322] focus:border-[#6B8B62] focus:ring-2 focus:ring-[#9CB894]/30 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#283625] hover:bg-[#3E5239] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                Sign In to Account
              </button>
            </form>
          )}

          {/* Quick Demo Selector */}
          <div className="pt-4 border-t border-[#EFE9DF] space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#736B63] block text-center">
              Quick Prototype Demo Fill
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => quickDemoLogin('student')}
                className="py-2 px-3 text-left border border-[#D0E2CA] hover:bg-[#E6F0E2] rounded-xl transition-colors text-xs"
              >
                <span className="font-semibold text-[#283625] block">Priya Sharma</span>
                <span className="text-[10px] text-[#736B63]">Active Student</span>
              </button>
              <button
                type="button"
                onClick={() => quickDemoLogin('chef')}
                className="py-2 px-3 text-left border border-[#D0E2CA] hover:bg-[#E6F0E2] rounded-xl transition-colors text-xs"
              >
                <span className="font-semibold text-[#283625] block">Chef Mitali</span>
                <span className="text-[10px] text-[#736B63]">Studio Founder</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#736B63]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#6B8B62]" />
            <span>Prototype mode • Client-side simulation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
