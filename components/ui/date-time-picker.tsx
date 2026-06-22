"use client";

import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  value: string; // ISO String
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
  minDate?: Date;
}

export function DateTimePicker({
  value,
  onChange,
  className,
  placeholder = "Pick date and time",
  minDate,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current value
  const dateValue = value ? new Date(value) : undefined;

  // Handle date selection from Calendar
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    const newDate = new Date(selectedDate);
    if (dateValue) {
      newDate.setHours(dateValue.getHours());
      newDate.setMinutes(dateValue.getMinutes());
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);
    } else {
      newDate.setHours(12); // Default to noon
      newDate.setMinutes(0);
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);
    }
    onChange(newDate.toISOString());
  };

  // Handle time selection
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeVal = e.target.value; // "HH:MM"
    if (!timeVal) return;
    const [hours, minutes] = timeVal.split(":").map(Number);
    const newDate = dateValue ? new Date(dateValue) : new Date();
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    onChange(newDate.toISOString());
  };

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const formattedValue = dateValue ? format(dateValue, "PPP p") : placeholder;
  const currentTimeString = dateValue
    ? `${String(dateValue.getHours()).padStart(2, "0")}:${String(dateValue.getMinutes()).padStart(2, "0")}`
    : "12:00";

  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Disable dates before minDate (normalized to midnight of that day) or tomorrow
  const disableBeforeLimit = minDate
    ? new Date(new Date(minDate).setHours(0, 0, 0, 0))
    : tomorrow;

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-11 w-full items-center justify-between rounded-lg border border-input bg-white px-3 py-2 text-left text-body-sm text-foreground shadow-xs hover:bg-neutral-50/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer"
      >
        <span className={cn("truncate", !value && "text-muted-foreground")}>
          {formattedValue}
        </span>
        <CalendarIcon className="h-4.5 w-4.5 text-muted-foreground shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute left-0 bottom-full z-50 mb-2 w-fit rounded-xl border border-border bg-white p-4 shadow-lg animate-in fade-in-0 zoom-in-95 duration-100 flex flex-col gap-3 min-w-[280px]">
          {/* Calendar Picker */}
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={handleDateSelect}
            disabled={{ before: disableBeforeLimit }}
            className="rounded-md border border-border bg-white shadow-xs p-3"
          />

          {/* Time Picker */}
          <div className="flex items-center justify-between gap-4 pt-2 border-t border-border/80">
            <span className="text-caption font-semibold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
              <Clock className="h-4 w-4 text-primary" /> Time Selection
            </span>
            <input
              type="time"
              value={currentTimeString}
              onChange={handleTimeChange}
              className="h-8.5 rounded-lg border border-border text-caption font-semibold px-2 bg-white text-foreground focus:ring-1 focus:ring-primary focus:border-primary outline-none cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
