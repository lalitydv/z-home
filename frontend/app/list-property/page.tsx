"use client";

import { RoleBasedHeader } from "@/components/role-based-header";
import { Footer } from "@/components/footer";
import { LocationPicker } from "@/components/location-picker";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, X, Check, ChevronRight, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";

const listingSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  price: z.number().min(1000, "Price must be at least ₹1000"),
  category: z.enum(["rent", "sale"]),
  bedrooms: z.number().min(1).max(10),
  bathrooms: z.number().min(1).max(10),
  area_sqm: z.number().min(10, "Area must be at least 10 sqm"),
  furnished: z.enum(["furnished", "semi-furnished", "unfurnished"]),
  description: z.string().min(50, "Description must be at least 50 characters"),
  address: z.string().min(10, "Please enter a valid address"),
  city: z.string().min(2),
  amenities: z.array(z.string()),
});

type ListingFormData = z.infer<typeof listingSchema>;

const steps = [
  { id: 1, name: "Basic Details" },
  { id: 2, name: "Location" },
  { id: 3, name: "Media" },
  { id: 4, name: "Amenities" },
  { id: 5, name: "Review" },
];

const amenityOptions = [
  "wifi",
  "parking",
  "laundry",
  "security",
  "elevator",
  "gym",
  "swimming-pool",
  "garden",
  "maid-room",
  "power-backup",
];

export default function ListPropertyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      category: "rent",
      bedrooms: 1,
      bathrooms: 1,
      amenities: [],
    },
  });

  const watchedAmenities = watch("amenities") || [];

  const toggleAmenity = (amenity: string) => {
    const current = watchedAmenities;
    const newAmenities = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    setValue("amenities", newAmenities);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + uploadedImages.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }
    setUploadedImages([...uploadedImages, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages([...images, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const nextStep = async () => {
    let isValid = false;
    switch (currentStep) {
      case 1:
        isValid = await trigger(["title", "price", "category", "bedrooms", "bathrooms", "area_sqm", "furnished", "description"]);
        break;
      case 2:
        isValid = await trigger(["address", "city"]);
        break;
      case 3:
        isValid = images.length >= 1;
        if (!isValid) toast.error("Please upload at least one image");
        break;
      case 4:
        isValid = true;
        break;
      default:
        isValid = true;
    }
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: ListingFormData) => {
    console.log("Form submitted:", data, images);
    toast.success("Property listed successfully!");
    // Reset form
    setCurrentStep(1);
    setImages([]);
    setUploadedImages([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zh-soft pb-16 md:pb-0">
      <RoleBasedHeader />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        currentStep > step.id
                          ? "bg-zh-pink text-zh-navy"
                          : currentStep === step.id
                          ? "bg-zh-blue text-zh-navy"
                          : "bg-white border-2 border-zh-gray-light text-zh-gray"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 text-center ${
                        currentStep >= step.id ? "text-zh-navy font-medium" : "text-zh-gray"
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 ${
                        currentStep > step.id ? "bg-zh-pink" : "bg-zh-gray-light"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-zh-gray-light p-6 md:p-8">
            {/* Step 1: Basic Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-zh-navy mb-6">Basic Details</h2>
                
                <div>
                  <label className="block text-sm font-medium text-zh-navy mb-2">
                    Property Title *
                  </label>
                  <input
                    {...register("title")}
                    type="text"
                    placeholder="e.g., Spacious 2BHK Flat near MR-9"
                    className="w-full px-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                  />
                  {errors.title && (
                    <p className="text-zh-danger text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zh-navy mb-2">
                      Price (₹) *
                    </label>
                    <input
                      {...register("price", { valueAsNumber: true })}
                      type="number"
                      placeholder="8500"
                      className="w-full px-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                    />
                    {errors.price && (
                      <p className="text-zh-danger text-sm mt-1">{errors.price.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zh-navy mb-2">
                      Category *
                    </label>
                    <select
                      {...register("category")}
                      className="w-full px-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                    >
                      <option value="rent">For Rent</option>
                      <option value="sale">For Sale</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zh-navy mb-2">
                      Bedrooms *
                    </label>
                    <input
                      {...register("bedrooms", { valueAsNumber: true })}
                      type="number"
                      min="1"
                      max="10"
                      className="w-full px-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zh-navy mb-2">
                      Bathrooms *
                    </label>
                    <input
                      {...register("bathrooms", { valueAsNumber: true })}
                      type="number"
                      min="1"
                      max="10"
                      className="w-full px-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zh-navy mb-2">
                      Area (sqm) *
                    </label>
                    <input
                      {...register("area_sqm", { valueAsNumber: true })}
                      type="number"
                      min="10"
                      className="w-full px-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zh-navy mb-2">
                    Furnishing *
                  </label>
                  <select
                    {...register("furnished")}
                    className="w-full px-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                  >
                    <option value="furnished">Furnished</option>
                    <option value="semi-furnished">Semi-Furnished</option>
                    <option value="unfurnished">Unfurnished</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zh-navy mb-2">
                    Description *
                  </label>
                  <textarea
                    {...register("description")}
                    rows={5}
                    placeholder="Describe your property in detail..."
                    className="w-full px-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                  />
                  {errors.description && (
                    <p className="text-zh-danger text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-zh-navy mb-6">Location</h2>
                
                <LocationPicker
                  onLocationSelect={(location) => {
                    setValue("address", location.address);
                    setValue("city", location.city);
                    trigger(["address", "city"]);
                  }}
                  initialLocation={{
                    address: watch("address"),
                    city: watch("city"),
                  }}
                />
                
                {errors.address && (
                  <p className="text-zh-danger text-sm mt-1">{errors.address.message}</p>
                )}
                {errors.city && (
                  <p className="text-zh-danger text-sm mt-1">{errors.city.message}</p>
                )}
              </div>
            )}

            {/* Step 3: Media */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-zh-navy mb-6">Photos</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {images.length < 10 && (
                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-zh-gray-light rounded-lg cursor-pointer hover:border-zh-pink transition-colors">
                      <Upload className="w-8 h-8 text-zh-gray mb-2" />
                      <span className="text-sm text-zh-gray">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <p className="text-sm text-zh-gray">
                  Upload at least 1 image (max 10). Minimum size: 800x600px
                </p>
              </div>
            )}

            {/* Step 4: Amenities */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-zh-navy mb-6">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {amenityOptions.map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center space-x-2 p-3 border border-zh-gray-light rounded-lg cursor-pointer hover:border-zh-pink transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={watchedAmenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="w-4 h-4 text-zh-pink border-zh-gray-light rounded focus:ring-zh-pink"
                      />
                      <span className="text-sm text-zh-navy capitalize">
                        {amenity.replace("-", " ")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-zh-navy mb-6">Review & Submit</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-zh-soft rounded-lg">
                    <h3 className="font-semibold text-zh-navy mb-2">Basic Details</h3>
                    <p className="text-sm text-zh-gray-dark">
                      {watch("title")} • ₹{watch("price")}/{watch("category") === "rent" ? "month" : ""}
                    </p>
                    <p className="text-sm text-zh-gray-dark">
                      {watch("bedrooms")} BHK • {watch("bathrooms")} Bath • {watch("area_sqm")} sqm
                    </p>
                  </div>
                  <div className="p-4 bg-zh-soft rounded-lg">
                    <h3 className="font-semibold text-zh-navy mb-2">Location</h3>
                    <p className="text-sm text-zh-gray-dark">
                      {watch("address")}, {watch("city")}
                    </p>
                  </div>
                  <div className="p-4 bg-zh-soft rounded-lg">
                    <h3 className="font-semibold text-zh-navy mb-2">Photos</h3>
                    <p className="text-sm text-zh-gray-dark">{images.length} images uploaded</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-zh-gray-light">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2 px-6 py-2 border border-zh-gray-light rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zh-soft transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Previous</span>
              </button>
              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center space-x-2 px-6 py-2 bg-zh-pink text-zh-navy font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  <span>Next</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 bg-zh-pink text-zh-navy font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Submit Listing
                </button>
              )}
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

