'use client';
import { useState } from 'react';
import { CLASSIFIED_CATEGORIES, TRICHY_AREAS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { createListing } from '@/lib/classifieds/postListing';
import { ChevronRight, ChevronLeft, Check, X, ImagePlus } from 'lucide-react';
import {
  Briefcase, Home, Car, Smartphone, Wrench, Heart, GraduationCap, LayoutGrid,
} from 'lucide-react';

const MAX_IMAGES = 6;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const IconMap: Record<string, React.ElementType> = {
  Briefcase, Home, Car, Smartphone, Wrench, Heart, GraduationCap, LayoutGrid,
};

const colorMap: Record<string, string> = {
  jobs: 'border-blue-200 bg-blue-50 text-blue-700',
  'real-estate': 'border-green-200 bg-green-50 text-green-700',
  vehicles: 'border-orange-200 bg-orange-50 text-orange-700',
  electronics: 'border-purple-200 bg-purple-50 text-purple-700',
  services: 'border-teal-200 bg-teal-50 text-teal-700',
  matrimony: 'border-pink-200 bg-pink-50 text-pink-700',
  education: 'border-cyan-200 bg-cyan-50 text-cyan-700',
  other: 'border-gray-200 bg-gray-50 text-gray-700',
};

const steps = ['Category', 'Details', 'Contact & Submit'];

export function PostClassifiedForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    category: '',
    subCategory: '',
    title: '',
    description: '',
    price: '',
    priceType: 'fixed',
    area: '',
    name: '',
    phone: '',
    email: '',
    whatsapp: false,
  });
  const [images, setImages] = useState<{ file: File; previewUrl: string }[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const selectedCat = CLASSIFIED_CATEGORIES.find((c) => c.value === form.category);

  const handleImagesSelected = (fileList: FileList | null) => {
    if (!fileList) return;
    const incoming = Array.from(fileList);
    const room = MAX_IMAGES - images.length;

    const tooBig = incoming.some((f) => f.size > MAX_IMAGE_BYTES);
    const accepted = incoming.filter((f) => f.size <= MAX_IMAGE_BYTES).slice(0, room);

    if (tooBig) {
      setImageError('Some photos were skipped — max 5MB each.');
    } else if (incoming.length > room) {
      setImageError(`Only ${MAX_IMAGES} photos allowed — extra ones were skipped.`);
    } else {
      setImageError(null);
    }

    setImages((prev) => [
      ...prev,
      ...accepted.map((file) => ({ file, previewUrl: URL.createObjectURL(file) })),
    ]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const formData = new FormData();
    formData.set('title', form.title);
    formData.set('description', form.description);
    formData.set('category', form.category);
    formData.set('subCategory', form.subCategory);
    formData.set('price', form.price);
    formData.set('priceType', form.priceType);
    formData.set('area', form.area);
    formData.set('name', form.name);
    formData.set('phone', form.phone);
    formData.set('email', form.email);
    formData.set('whatsapp', String(form.whatsapp));
    images.forEach(({ file }) => formData.append('images', file));

    const result = await createListing(formData);
    setSubmitting(false);

    if (result.error) {
      setSubmitError(result.error);
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2">Ad Submitted!</h2>
        <p className="text-text-secondary mb-6">Your listing is under review and will be published shortly.</p>
        <Button href="/classifieds" variant="primary">Browse Classifieds</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-center gap-0 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`flex items-center gap-2 ${i < step ? 'text-primary' : i === step ? 'text-primary font-semibold' : 'text-text-secondary'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors
                ${i < step ? 'bg-primary border-primary text-white' : i === step ? 'border-primary text-primary bg-red-50' : 'border-border text-text-secondary'}`}>
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className="text-sm hidden sm:block">{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-8 sm:w-16 h-0.5 mx-2 ${i < step ? 'bg-primary' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 0: Category */}
      {step === 0 && (
        <div>
          <h2 className="text-lg font-bold text-text-primary mb-4">What are you selling or offering?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CLASSIFIED_CATEGORIES.map((cat) => {
              const Icon = IconMap[cat.icon];
              const colors = colorMap[cat.value];
              return (
                <button
                  key={cat.value}
                  onClick={() => { setForm({ ...form, category: cat.value, subCategory: '' }); setStep(1); }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:shadow-sm
                    ${form.category === cat.value ? colors + ' shadow-sm' : 'border-border hover:' + colors}`}
                >
                  {Icon && <Icon className="w-6 h-6" />}
                  <span className="text-sm font-medium">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 1: Details */}
      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
          <h2 className="text-lg font-bold text-text-primary mb-4">Tell us about your listing</h2>

          {selectedCat && selectedCat.subCategories.length > 0 && (
            <div className="mb-4">
              <label className="text-sm font-medium text-text-primary block mb-1.5">Sub-category</label>
              <select
                required
                value={form.subCategory}
                onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">Select sub-category</option>
                {selectedCat.subCategories.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}

          <div className="mb-4">
            <label className="text-sm font-medium text-text-primary block mb-1.5">Title *</label>
            <input
              required
              type="text"
              placeholder="e.g., 2 BHK Apartment for Rent in Thillai Nagar"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium text-text-primary block mb-1.5">Description *</label>
            <textarea
              required
              rows={5}
              placeholder="Describe your listing in detail..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-text-primary block mb-1.5">Price Type</label>
              <select
                value={form.priceType}
                onChange={(e) => setForm({ ...form, priceType: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="fixed">Fixed Price</option>
                <option value="negotiable">Negotiable</option>
                <option value="free">Free</option>
                <option value="on-request">On Request</option>
              </select>
            </div>
            {form.priceType !== 'free' && form.priceType !== 'on-request' && (
              <div>
                <label className="text-sm font-medium text-text-primary block mb-1.5">Price (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-text-primary block mb-1.5">Area in Trichy *</label>
            <select
              required
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">Select area</option>
              {TRICHY_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-text-primary block mb-1.5">
              Photos <span className="text-text-secondary font-normal">(up to {MAX_IMAGES})</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div key={img.previewUrl} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.previewUrl} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    aria-label="Remove photo"
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {images.length < MAX_IMAGES && (
                <label className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-text-secondary cursor-pointer hover:border-primary hover:text-primary">
                  <ImagePlus className="w-5 h-5" />
                  <span className="text-xs">Add photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      handleImagesSelected(e.target.files);
                      e.target.value = '';
                    }}
                  />
                </label>
              )}
            </div>
            {imageError && <p className="text-sm text-primary mt-2">{imageError}</p>}
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={() => setStep(0)} className="flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            <Button type="submit" variant="primary" className="flex items-center gap-1 ml-auto">
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      )}

      {/* Step 2: Contact */}
      {step === 2 && (
        <form onSubmit={handleSubmit}>
          <h2 className="text-lg font-bold text-text-primary mb-4">Your contact details</h2>

          <div className="mb-4">
            <label className="text-sm font-medium text-text-primary block mb-1.5">Your Name *</label>
            <input
              required
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium text-text-primary block mb-1.5">Phone Number *</label>
            <input
              required
              type="tel"
              placeholder="+91 9XXXXXXXXX"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium text-text-primary block mb-1.5">Email (optional)</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <label className="flex items-center gap-2.5 mb-6 cursor-pointer">
            <input
              type="checkbox"
              checked={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.checked })}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm text-text-primary">Enable WhatsApp enquiries on this number</span>
          </label>

          <div className="p-4 bg-gray-50 rounded-xl mb-6 text-sm text-text-secondary">
            <p className="font-medium text-text-primary mb-1">Your ad will be published after review</p>
            <p>We review all listings within 2 hours to ensure quality. You&apos;ll receive a confirmation SMS once it&apos;s live.</p>
          </div>

          {submitError && <p className="text-sm text-primary mb-4">{submitError}</p>}

          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={() => setStep(1)} disabled={submitting} className="flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            <Button type="submit" variant="primary" disabled={submitting} className="ml-auto">
              {submitting ? 'Submitting...' : 'Submit Ad →'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
