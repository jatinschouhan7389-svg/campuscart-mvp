import { useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, UserCheck } from 'lucide-react';
import { DELIVERY_LOCATIONS } from '../data/catalog';
import type { PageId, UserProfile } from '../types/campuscart';
import {
  validateOnboardingForm,
  type OnboardingInput,
  type ValidationErrors,
} from '../utils/commerce';

interface OnboardingPageProps {
  activeProfile: UserProfile | null;
  onSaveProfile: (input: OnboardingInput) => void;
  onNavigate: (page: PageId) => void;
}

export function OnboardingPage({
  activeProfile,
  onSaveProfile,
  onNavigate,
}: OnboardingPageProps) {
  const [form, setForm] = useState<OnboardingInput>({
    fullName: activeProfile?.fullName ?? '',
    studentId: activeProfile?.studentId ?? '',
    email: activeProfile?.email ?? '',
    phone: activeProfile?.phone ?? '',
    accommodation: activeProfile?.accommodation ?? '',
    preferredLocation: activeProfile?.preferredLocation ?? '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const validation = validateOnboardingForm(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      setSavedNotice(false);
      return;
    }
    setErrors({});
    onSaveProfile(form);
    setSavedNotice(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-2 mb-8">
        <p className="text-xs font-medium text-teal-700">
          Student Onboarding &amp; Profile · Built for DGU MBA Students
        </p>
        <h1 className="font-display text-3xl font-bold text-slate-900">
          {activeProfile ? 'Your CampusCart Student Profile' : 'Welcome to CampusCart'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Save your residential details once so checkout and WhatsApp order confirmation
          take seconds.
        </p>
      </div>

      {savedNotice && (
        <div
          role="status"
          className="mb-6 rounded-xl bg-teal-50 border border-teal-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2
              className="w-5 h-5 text-teal-700 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-semibold text-teal-900">
                Student profile saved
              </p>
              <p className="text-xs text-teal-800">
                Your details will automatically pre-fill at checkout.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('catalog')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Browse Essentials</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      {activeProfile && (
        <div className="mb-8 rounded-xl bg-white border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <UserCheck className="w-5 h-5 text-teal-700 mt-0.5 shrink-0" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-semibold text-slate-900">{activeProfile.fullName}</p>
              <p className="text-slate-600 text-xs mt-0.5">
                {activeProfile.studentId} · {activeProfile.phone} ·{' '}
                {activeProfile.preferredLocation}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('catalog')}
              className="px-4 py-2 rounded-lg bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Shop Essentials
            </button>
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Venture Metrics
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="onb-fullName"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              Full Name
            </label>
            <input
              id="onb-fullName"
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="e.g. Aarav Sharma"
              aria-invalid={Boolean(errors.fullName)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
            />
            {errors.fullName && (
              <p role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                {errors.fullName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="onb-studentId"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              DGU Student ID / Roll Number
            </label>
            <input
              id="onb-studentId"
              type="text"
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
              placeholder="e.g. DGU-MBA-2601"
              aria-invalid={Boolean(errors.studentId)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
            />
            {errors.studentId && (
              <p role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                {errors.studentId}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="onb-email"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              Email
            </label>
            <input
              id="onb-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="e.g. aarav.sharma@dgu.edu.in"
              aria-invalid={Boolean(errors.email)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
            />
            {errors.email && (
              <p role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="onb-phone"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              Phone Number (WhatsApp)
            </label>
            <input
              id="onb-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="10-digit mobile number"
              aria-invalid={Boolean(errors.phone)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
            />
            {errors.phone && (
              <p role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="onb-accommodation"
            className="block text-sm font-medium text-slate-800 mb-1.5"
          >
            Accommodation / Residential Area
          </label>
          <input
            id="onb-accommodation"
            type="text"
            value={form.accommodation}
            onChange={(e) => setForm({ ...form, accommodation: e.target.value })}
            placeholder="e.g. Boys Hostel Block B, Room 204 or Prem Nagar PG"
            aria-invalid={Boolean(errors.accommodation)}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
          />
          {errors.accommodation && (
            <p role="alert" className="mt-1.5 text-xs font-medium text-red-700">
              {errors.accommodation}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="onb-location"
            className="block text-sm font-medium text-slate-800 mb-1.5"
          >
            Preferred Delivery Location
          </label>
          <select
            id="onb-location"
            value={form.preferredLocation}
            onChange={(e) => setForm({ ...form, preferredLocation: e.target.value })}
            aria-invalid={Boolean(errors.preferredLocation)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
          >
            <option value="">Select campus hostel or nearby block</option>
            {DELIVERY_LOCATIONS.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
          {errors.preferredLocation && (
            <p role="alert" className="mt-1.5 text-xs font-medium text-red-700">
              {errors.preferredLocation}
            </p>
          )}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Stored locally for this prototype session to speed up checkout.
          </p>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Continue to CampusCart</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );
}
