"use client";

import { useState } from "react";
import { Upload, X, Send } from "lucide-react";
import Image from "next/image";
import { useFormSubmit } from "@/hooks/useFormSubmit";

type VendorForm = { vendorName: string; foodSpotName: string; city: string; famousFood: string; contactNumber: string; description: string; };

export default function VendorSection() {
  const [formData, setFormData] = useState<VendorForm>({
    vendorName: "",
    foodSpotName: "",
    city: "",
    famousFood: "",
    contactNumber: "",
    description: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const resetForm = () => {
    setFormData({ vendorName: "", foodSpotName: "", city: "", famousFood: "", contactNumber: "", description: "" });
    setImages([]);
    setPreviews([]);
  };

  const { status, apiMessage, submit, reset } = useFormSubmit<VendorForm>({
    url: "/api/vendor",
    onSuccess: resetForm,
    buildBody: (data) => {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => fd.append(k, v));
      images.forEach((img) => fd.append("images", img));
      return fd;
    },
  });

  const cities = [
    "Delhi", "Mumbai", "Varanasi", "Jaipur", "Agra",
    "Lucknow", "Amritsar", "Hyderabad", "Bangalore", "Kolkata", "Other",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const combined = [...images, ...files].slice(0, 5); // max 5 images
    setImages(combined);
    setPreviews(combined.map((f) => URL.createObjectURL(f)));
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    setPreviews(updated.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(formData);
  };

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-orange-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 md:mb-12 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            List Your Food Spot
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Are you a food vendor? Share your delicious offerings with food lovers across India
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-10">

            {status === "success" ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Listing Submitted!</h3>
                <p className="text-gray-500 text-base max-w-sm mx-auto">{apiMessage}</p>
                <button
                  onClick={reset}
                  className="mt-6 text-[#E23744] font-semibold hover:underline"
                >
                  Submit another listing
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Error banner */}
                {status === "error" && (
                  <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    <span className="mt-0.5">⚠️</span>
                    <span>{apiMessage}</span>
                  </div>
                )}

                {/* Vendor Name */}
                <div>
                  <label htmlFor="vendorName" className="block text-gray-700 font-semibold mb-2">
                    Vendor Name <span className="text-[#E23744]">*</span>
                  </label>
                  <input
                    type="text" id="vendorName" name="vendorName"
                    value={formData.vendorName} onChange={handleChange} required
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E23744] focus:border-transparent transition-all"
                  />
                </div>

                {/* Food Spot Name */}
                <div>
                  <label htmlFor="foodSpotName" className="block text-gray-700 font-semibold mb-2">
                    Food Spot Name <span className="text-[#E23744]">*</span>
                  </label>
                  <input
                    type="text" id="foodSpotName" name="foodSpotName"
                    value={formData.foodSpotName} onChange={handleChange} required
                    placeholder="Enter your food spot name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E23744] focus:border-transparent transition-all"
                  />
                </div>

                {/* City + Famous Food */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-gray-700 font-semibold mb-2">
                      City <span className="text-[#E23744]">*</span>
                    </label>
                    <select
                      id="city" name="city" value={formData.city} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E23744] focus:border-transparent transition-all"
                    >
                      <option value="">Select City</option>
                      {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="famousFood" className="block text-gray-700 font-semibold mb-2">
                      Famous Food Item <span className="text-[#E23744]">*</span>
                    </label>
                    <input
                      type="text" id="famousFood" name="famousFood"
                      value={formData.famousFood} onChange={handleChange} required
                      placeholder="e.g., Biryani, Kulcha"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E23744] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Contact Number */}
                <div>
                  <label htmlFor="contactNumber" className="block text-gray-700 font-semibold mb-2">
                    Contact Number <span className="text-[#E23744]">*</span>
                  </label>
                  <input
                    type="tel" id="contactNumber" name="contactNumber"
                    value={formData.contactNumber} onChange={handleChange} required
                    pattern="[0-9]{10}" placeholder="Enter 10-digit mobile number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E23744] focus:border-transparent transition-all"
                  />
                </div>

                {/* Image Upload — multiple, max 5 */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Upload Images <span className="text-[#E23744]">*</span>
                    <span className="text-gray-400 font-normal text-sm ml-2">(up to 5 images)</span>
                  </label>

                  {/* Previews */}
                  {previews.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-3">
                      {previews.map((src, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                          <Image src={src} alt={`preview-${i}`} fill className="object-cover" sizes="80px" />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute top-0.5 right-0.5 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload trigger */}
                  {images.length < 5 && (
                    <label
                      htmlFor="images"
                      className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#E23744] transition-all bg-gray-50 hover:bg-orange-50"
                    >
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 font-medium">Click to upload food images</p>
                        <p className="text-gray-400 text-sm mt-1">PNG, JPG up to 5MB each · {5 - images.length} remaining</p>
                      </div>
                      <input
                        type="file" id="images" name="images"
                        onChange={handleImageChange}
                        accept="image/*" multiple className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">
                    Short Description <span className="text-[#E23744]">*</span>
                  </label>
                  <textarea
                    id="description" name="description"
                    value={formData.description} onChange={handleChange} required rows={4}
                    placeholder="Tell us about your food spot and what makes it special..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E23744] focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-[#E23744] hover:bg-[#c72d38] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                  >
                    {status === "loading" ? (
                      <><span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />Submitting...</>
                    ) : (
                      "Submit Your Listing"
                    )}
                  </button>
                </div>

              </form>
            )}
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            Your listing will be reviewed by our team and published within 24–48 hours
          </p>
        </div>
      </div>
    </section>
  );
}
