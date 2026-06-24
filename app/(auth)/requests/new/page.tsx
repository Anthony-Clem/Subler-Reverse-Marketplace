"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateRequest } from "@/hooks/use-requests";
import { toast } from "sonner";
import {
  Activity,
  Users,
  Video,
  Sparkles,
  Music,
  HelpCircle,
  Building,
  Home,
  Compass,
  BookOpen,
  Briefcase,
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  DollarSign,
  Info,
  MapPin,
  Flame,
  Dumbbell,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { eventTypes, spaceTypes } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateTimePicker } from "@/components/ui/date-time-picker";

type Step = 1 | 2 | 3 | 4;

interface FormState {
  eventType: (typeof eventTypes)[number] | "";
  spaceType: (typeof spaceTypes)[number] | "";
  startDate: string;
  endDate: string;
  budget: string;
  headcount: string;
  amenities: string; // Stored as comma-separated string for DB
  locationPreference: string;
  notes: string;
}

const AMENITY_OPTIONS = [
  "WiFi",
  "Sound System",
  "Mirrors",
  "Air Conditioning",
  "Heating",
  "Parking",
  "Restrooms",
  "Natural Light",
  "Projector / Screen",
  "Tables & Chairs",
  "Kitchen / Prep Area",
  "Wheelchair Accessible",
] as const;

export default function NewRequestPage() {
  const router = useRouter();
  const createRequest = useCreateRequest();
  const [step, setStep] = useState<Step>(1);

  const [formData, setFormData] = useState<FormState>({
    eventType: "",
    spaceType: "",
    startDate: "",
    endDate: "",
    budget: "",
    headcount: "",
    amenities: "",
    locationPreference: "",
    notes: "",
  });

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  // Lists of options with metadata for premium selectors
  const eventOptions = [
    {
      value: "athletic",
      label: "Athletic / Fitness",
      desc: "Yoga classes, gymnastics, dance practice",
      icon: Activity,
    },
    {
      value: "conference",
      label: "Conference / Seminar",
      desc: "Keynotes, large corporate presentations",
      icon: Building,
    },
    {
      value: "film_production",
      label: "Film / Production",
      desc: "Video shoot, photo studio, interview setups",
      icon: Video,
    },
    {
      value: "event",
      label: "Event / Celebration",
      desc: "Parties, tech meetups, networking mixers",
      icon: Sparkles,
    },
    {
      value: "rehearsal",
      label: "Rehearsal / Performing",
      desc: "Theater practice, band sessions, arts",
      icon: Music,
    },
    {
      value: "meeting",
      label: "Meeting / Workshop",
      desc: "Team offsites, study groups, presentations",
      icon: Users,
    },
    {
      value: "other",
      label: "Other Activity",
      desc: "Custom requirements",
      icon: HelpCircle,
    },
  ] as const;

  const spaceOptions = [
    {
      value: "studio",
      label: "Creative Studio",
      desc: "Hardwood floors, dance space, photography",
      icon: Flame,
    },
    {
      value: "warehouse",
      label: "Warehouse",
      desc: "Raw, industrial, large open storage/production",
      icon: Home,
    },
    {
      value: "event_hall",
      label: "Event Hall",
      desc: "Staging, bar setup, reception capacities",
      icon: Building,
    },
    {
      value: "outdoor",
      label: "Outdoor Space",
      desc: "Rooftops, gardens, parking lots",
      icon: Compass,
    },
    {
      value: "gym",
      label: "Gym / Court",
      desc: "Basketball courts, tracks, training facilities",
      icon: Dumbbell,
    },
    {
      value: "classroom",
      label: "Classroom / Lab",
      desc: "Desks, whiteboards, presentation screens",
      icon: BookOpen,
    },
    {
      value: "office",
      label: "Office / Coworking",
      desc: "Boardrooms, desks, focus areas",
      icon: Briefcase,
    },
    {
      value: "other",
      label: "Other Space Type",
      desc: "Custom venues",
      icon: HelpCircle,
    },
  ] as const;

  const toggleAmenity = (amenity: string) => {
    let updated: string[];
    if (selectedAmenities.includes(amenity)) {
      updated = selectedAmenities.filter((a) => a !== amenity);
    } else {
      updated = [...selectedAmenities, amenity];
    }
    setSelectedAmenities(updated);
    setFormData((prev) => ({ ...prev, amenities: updated.join(", ") }));
    setValidationErrors((prev) => ({ ...prev, amenities: undefined }));
  };

  const validateStep = (currentStep: Step): boolean => {
    const errors: Partial<Record<keyof FormState, string>> = {};

    if (currentStep === 1) {
      if (!formData.eventType)
        errors.eventType = "Please select an event category";
      if (!formData.spaceType)
        errors.spaceType = "Please select a space layout";
    }

    if (currentStep === 2) {
      if (!formData.startDate)
        errors.startDate = "Start date and time is required";
      if (!formData.endDate) errors.endDate = "End date and time is required";
      if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate).getTime();
        const end = new Date(formData.endDate).getTime();
        if (end <= start) {
          errors.endDate = "End date must occur after the start date";
        }
      }
      if (!formData.headcount || parseInt(formData.headcount) <= 0) {
        errors.headcount = "Please enter a valid capacity headcount";
      }
    }

    if (currentStep === 3) {
      if (!formData.budget || parseFloat(formData.budget) <= 0) {
        errors.budget = "Please enter a valid hourly rate budget";
      }
      if (
        !formData.locationPreference ||
        formData.locationPreference.trim().length < 3
      ) {
        errors.locationPreference =
          "Please describe location preference (min. 3 characters)";
      }
      if (selectedAmenities.length === 0) {
        errors.amenities = "Please select at least one required amenity";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => (prev + 1) as Step);
    }
  };

  const handleBack = () => {
    setStep((prev) => (prev - 1) as Step);
  };

  const handlePublish = async () => {
    if (!validateStep(3)) return; // Re-validate step 3 contents before submission

    try {
      // Format inputs for API request
      const requestPayload = {
        eventType: formData.eventType,
        spaceType: formData.spaceType,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        budget: parseFloat(formData.budget),
        headcount: parseInt(formData.headcount),
        amenities: formData.amenities,
        locationPreference: formData.locationPreference,
        notes: formData.notes.trim() || undefined,
      };

      await createRequest.mutateAsync(requestPayload);
      toast.success("Space request published successfully!");
      router.push("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to publish request";
      toast.error(message);
    }
  };

  const getFormatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 pb-6 border-b border-border">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-body-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </Link>
        <h1 className="text-h1 text-foreground">Post space requirements</h1>
        <p className="text-body-sm text-muted-foreground mt-0.5">
          Submit your event needs. Matches and pitches will be sent directly by
          verified hosts.
        </p>
      </div>

      {/* Progress Indicators */}
      <div className="relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-200 -translate-y-1/2 -z-10" />
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((i) => {
            const stepNum = i as Step;
            const isCompleted = step > stepNum;
            const isActive = step === stepNum;
            return (
              <div key={i} className="flex flex-col items-center gap-2">
                <div
                  className={`h-9 w-9 rounded-full border-2 flex items-center justify-center font-semibold text-caption transition-all ${
                    isCompleted
                      ? "bg-primary border-primary text-white"
                      : isActive
                        ? "bg-white border-primary text-primary ring-4 ring-primary/10 shadow-sm"
                        : "bg-white border-neutral-300 text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : i}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider hidden sm:inline ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {i === 1 && "Category"}
                  {i === 2 && "Dates & Size"}
                  {i === 3 && "Specs & Budget"}
                  {i === 4 && "Review"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wizard Step Boxes */}
      <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 md:p-8 shadow-xs">
        {/* STEP 1: Categories */}
        {step === 1 && (
          <div className="space-y-8">
            {/* Event Selection */}
            <div className="space-y-4">
              <div>
                <h3 className="font-display font-semibold text-body text-foreground">
                  What activity are you planning?
                </h3>
                <p className="text-caption text-muted-foreground mt-0.5">
                  Select the category that best matches your booking
                  requirements.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {eventOptions.map((opt) => {
                  const Selected = formData.eventType === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, eventType: opt.value });
                        setValidationErrors({
                          ...validationErrors,
                          eventType: undefined,
                        });
                      }}
                      className={`flex items-start text-left gap-3.5 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        Selected
                          ? "bg-primary/5 border-primary shadow-sm"
                          : "bg-white border-border hover:border-neutral-300"
                      }`}
                    >
                      <div
                        className={`h-9 w-9 rounded-lg flex items-center justify-center border shrink-0 ${
                          Selected
                            ? "bg-primary/10 text-primary border-primary/10"
                            : "bg-neutral-50 text-muted-foreground border-border/80"
                        }`}
                      >
                        <opt.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-body-sm text-foreground">
                          {opt.label}
                        </h4>
                        <p className="text-caption text-muted-foreground leading-relaxed mt-0.5">
                          {opt.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
              {validationErrors.eventType && (
                <p className="text-caption text-red-600 flex items-center gap-1">
                  <Info className="h-3.5 w-3.5" /> {validationErrors.eventType}
                </p>
              )}
            </div>

            {/* Space Selection */}
            <div className="space-y-4 pt-4 border-t border-border/60">
              <div>
                <h3 className="font-display font-semibold text-body text-foreground">
                  What type of space is needed?
                </h3>
                <p className="text-caption text-muted-foreground mt-0.5">
                  Choose the ideal layout and facility category for this
                  booking.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {spaceOptions.map((opt) => {
                  const Selected = formData.spaceType === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, spaceType: opt.value });
                        setValidationErrors({
                          ...validationErrors,
                          spaceType: undefined,
                        });
                      }}
                      className={`flex items-start text-left gap-3.5 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        Selected
                          ? "bg-primary/5 border-primary shadow-sm"
                          : "bg-white border-border hover:border-neutral-300"
                      }`}
                    >
                      <div
                        className={`h-9 w-9 rounded-lg flex items-center justify-center border shrink-0 ${
                          Selected
                            ? "bg-primary/10 text-primary border-primary/10"
                            : "bg-neutral-50 text-muted-foreground border-border/80"
                        }`}
                      >
                        <opt.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-body-sm text-foreground">
                          {opt.label}
                        </h4>
                        <p className="text-caption text-muted-foreground leading-relaxed mt-0.5">
                          {opt.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
              {validationErrors.spaceType && (
                <p className="text-caption text-red-600 flex items-center gap-1">
                  <Info className="h-3.5 w-3.5" /> {validationErrors.spaceType}
                </p>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: Timing & Size */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="font-display font-semibold text-body text-foreground pb-4 border-b border-border/60">
              Dates, Capacity & Size
            </h3>

            {/* Date Time selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-caption font-semibold text-foreground flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" /> Start Date &
                  Time
                </label>
                <DateTimePicker
                  value={formData.startDate}
                  onChange={(val) => {
                    const newStart = new Date(val);
                    const newEnd = formData.endDate
                      ? new Date(formData.endDate)
                      : null;
                    if (!newEnd || newEnd.getTime() <= newStart.getTime()) {
                      // Default end date to 2 hours after start date
                      const adjustedEnd = new Date(
                        newStart.getTime() + 2 * 60 * 60 * 1000,
                      );
                      setFormData({
                        ...formData,
                        startDate: val,
                        endDate: adjustedEnd.toISOString(),
                      });
                    } else {
                      setFormData({ ...formData, startDate: val });
                    }
                    setValidationErrors({
                      ...validationErrors,
                      startDate: undefined,
                      endDate: undefined,
                    });
                  }}
                  placeholder="Select start date and time"
                />
                {validationErrors.startDate && (
                  <p className="text-caption text-red-600 flex items-center gap-1">
                    <Info className="h-3.5 w-3.5" />{" "}
                    {validationErrors.startDate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-caption font-semibold text-foreground flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" /> End Date & Time
                </label>
                <DateTimePicker
                  value={formData.endDate}
                  onChange={(val) => {
                    const newEnd = new Date(val);
                    const start = formData.startDate
                      ? new Date(formData.startDate)
                      : null;
                    if (start && newEnd.getTime() <= start.getTime()) {
                      toast.error("End date must occur after the start date");
                      return;
                    }
                    setFormData({ ...formData, endDate: val });
                    setValidationErrors({
                      ...validationErrors,
                      endDate: undefined,
                    });
                  }}
                  minDate={
                    formData.startDate
                      ? new Date(formData.startDate)
                      : undefined
                  }
                  placeholder="Select end date and time"
                />
                {validationErrors.endDate && (
                  <p className="text-caption text-red-600 flex items-center gap-1">
                    <Info className="h-3.5 w-3.5" /> {validationErrors.endDate}
                  </p>
                )}
              </div>
            </div>

            {/* Headcount selection */}
            <div className="space-y-2 max-w-sm pt-4">
              <label className="text-caption font-semibold text-foreground flex items-center gap-1.5">
                <Users className="h-4 w-4 text-primary" /> Expected Headcount
              </label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="e.g. 35"
                  value={formData.headcount}
                  onChange={(e) => {
                    setFormData({ ...formData, headcount: e.target.value });
                    setValidationErrors({
                      ...validationErrors,
                      headcount: undefined,
                    });
                  }}
                  className="h-11 rounded-lg pr-20 bg-white text-foreground"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-caption text-muted-foreground font-semibold">
                  people
                </span>
              </div>
              {validationErrors.headcount && (
                <p className="text-caption text-red-600 flex items-center gap-1">
                  <Info className="h-3.5 w-3.5" /> {validationErrors.headcount}
                </p>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Specs & Budget */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="font-display font-semibold text-body text-foreground pb-4 border-b border-border/60">
              Budget, Location & Amenities
            </h3>

            {/* Budget */}
            <div className="space-y-2 max-w-sm">
              <label className="text-caption font-semibold text-foreground flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-primary" /> Maximum Hourly
                Budget (USD)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="e.g. 150"
                  value={formData.budget}
                  onChange={(e) => {
                    setFormData({ ...formData, budget: e.target.value });
                    setValidationErrors({
                      ...validationErrors,
                      budget: undefined,
                    });
                  }}
                  className="h-11 rounded-lg pl-9 pr-14 bg-white text-foreground"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-body-sm font-semibold text-muted-foreground">
                  $
                </span>
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-caption text-muted-foreground font-semibold">
                  / hr
                </span>
              </div>
              {validationErrors.budget && (
                <p className="text-caption text-red-600 flex items-center gap-1">
                  <Info className="h-3.5 w-3.5" /> {validationErrors.budget}
                </p>
              )}
            </div>

            {/* Location Preference */}
            <div className="space-y-2 pt-2">
              <label className="text-caption font-semibold text-foreground flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" /> Preferred Location /
                Neighborhoods
              </label>
              <Input
                type="text"
                placeholder="e.g. Williamsburg, Brooklyn or SOMA, SF"
                value={formData.locationPreference}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    locationPreference: e.target.value,
                  });
                  setValidationErrors({
                    ...validationErrors,
                    locationPreference: undefined,
                  });
                }}
                className="h-11 rounded-lg bg-white text-foreground"
              />
              {validationErrors.locationPreference && (
                <p className="text-caption text-red-600 flex items-center gap-1">
                  <Info className="h-3.5 w-3.5" />{" "}
                  {validationErrors.locationPreference}
                </p>
              )}
            </div>

            {/* Amenities Options Selector */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-caption font-semibold text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-primary" /> Required
                  Amenities & Features
                </label>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Select all required features for your booking. At least one
                  amenity must be selected.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-1.5">
                {AMENITY_OPTIONS.map((item) => {
                  const isSelected = selectedAmenities.includes(item);
                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => toggleAmenity(item)}
                      className={`px-4 py-2 rounded-lg border text-caption font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-primary text-white border-primary shadow-xs"
                          : "bg-white border-border hover:border-neutral-300 text-muted-foreground"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
              {validationErrors.amenities && (
                <p className="text-caption text-red-600 flex items-center gap-1">
                  <Info className="h-3.5 w-3.5" /> {validationErrors.amenities}
                </p>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: Review & Publish */}
        {step === 4 && (
          <div className="space-y-6">
            <h3 className="font-display font-semibold text-body text-foreground pb-4 border-b border-border/60">
              Review Space Requirements
            </h3>

            {/* Summary details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-body-sm">
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                  Activity / Space
                </p>
                <p className="font-semibold text-foreground pt-1 capitalize">
                  {formData.eventType.replace(/_/g, " ")} /{" "}
                  {formData.spaceType === "other"
                    ? "Space"
                    : formData.spaceType.replace(/_/g, " ")}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                  Budget / Headcount
                </p>
                <p className="font-semibold text-foreground pt-1">
                  ${formData.budget}/hr max • {formData.headcount} capacity
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                  Event Schedule
                </p>
                <p className="font-semibold text-foreground pt-1">
                  {getFormatDate(formData.startDate)} <br />
                  <span className="text-caption text-muted-foreground">
                    to
                  </span>{" "}
                  {getFormatDate(formData.endDate)}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                  Location Preference
                </p>
                <p className="font-semibold text-foreground pt-1">
                  {formData.locationPreference}
                </p>
              </div>

              <div className="space-y-1 md:col-span-2">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                  Amenities Specified
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {selectedAmenities.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1 rounded-lg bg-neutral-50 border border-border text-caption font-semibold text-foreground/80"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Describe your event Input */}
            <div className="space-y-2 pt-4 border-t border-border/60">
              <label className="text-caption font-semibold text-foreground flex items-center gap-1.5">
                Describe your event (Optional)
              </label>
              <textarea
                placeholder="Include additional context such as noise levels, rules, setup requests, or details about your activity..."
                rows={4}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full border border-border focus:ring-1 focus:ring-primary focus:border-primary rounded-lg p-3.5 text-body-sm bg-white text-foreground"
              />
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between border-t border-border/60 pt-6 mt-8">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={createRequest.isPending}
              className="h-10 px-6 rounded-lg cursor-pointer"
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex h-10 items-center justify-center px-6 rounded-lg bg-[#1E2D8C] text-white hover:bg-[#1E2D8C]/95 text-body-sm font-semibold transition-all cursor-pointer gap-1"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              disabled={createRequest.isPending}
              className="inline-flex h-10 items-center justify-center px-6 rounded-lg bg-[#FDC800] text-black hover:bg-[#FDC800]/90 text-body-sm font-bold transition-all active:scale-[0.98] cursor-pointer gap-1.5"
            >
              {createRequest.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Publishing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4.5 w-4.5" /> Publish Request
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
