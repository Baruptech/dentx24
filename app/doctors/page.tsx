
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Search,
  ShieldCheck,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Dentist = {
  id: string;
  full_name: string;
  specialty: string;
  qualifications: string | null;
  bio: string | null;
  clinic_name: string | null;
  city: string | null;
  state: string | null;
  address: string | null;
  photo_url: string | null;
  consultation_fee: number | null;
};

type Slot = {
  id: string;
  dentist_id: string;
  starts_at: string;
  ends_at: string;
};

const specialties = [
  "All specialties",
  "General Dentistry",
  "Orthodontics",
  "Endodontics",
  "Periodontics",
  "Pediatric Dentistry",
  "Oral Surgery",
  "Cosmetic Dentistry",
];

function localDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(`${value}T12:00:00`));
}

function formatNaira(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function DoctorsPage() {
  const router = useRouter();

  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All specialties");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDentist, setSelectedDentist] =
    useState<Dentist | null>(null);

  // Dates are initialized after mounting to avoid prerendering errors.
  const [selectedDate, setSelectedDate] = useState("");
  const [today, setToday] = useState("");
  const [dateOptions, setDateOptions] = useState<string[]>([]);

  const [selectedSlot, setSelectedSlot] = useState("");
  const [reason, setReason] = useState("");
  const [booking, setBooking] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [slotsLoading, setSlotsLoading] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  // IMPORTANT: This effect belongs inside DoctorsPage,
  // after the useState declarations and before the data-loading effects.
  useEffect(() => {
    const timer = setTimeout(() => {
      const now = new Date();
      const currentDate = localDateString(now);

      const options = Array.from({ length: 14 }, (_, index) => {
        const date = new Date(now);
        date.setDate(date.getDate() + index);
        return localDateString(date);
      });

      setToday(currentDate);
      setDateOptions(options);
      setSelectedDate((previousDate) => previousDate || currentDate);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const loadDentists = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: queryError } = await supabase
        .from("dentist_profiles")
        .select(
          "id, full_name, specialty, qualifications, bio, clinic_name, city, state, address, photo_url, consultation_fee",
        )
        .eq("is_active", true)
        .order("full_name");

      if (queryError) {
        setError(
          "We couldn't load dentists right now. Please check your connection and try again.",
        );
        setDentists([]);
        return;
      }

      setDentists((data ?? []) as Dentist[]);
    } catch {
      setError("A network error occurred while loading dentists.");
      setDentists([]);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const loadSlots = useCallback(async () => {
    if (!selectedDentist || !selectedDate) {
      setSlots([]);
      return;
    }

    setSlotsLoading(true);
    setSlots([]);
    setSelectedSlot("");
    setBookingError("");

    try {
      // Use local calendar boundaries and convert them to UTC for Supabase.
      const start = new Date(`${selectedDate}T00:00:00`);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      const now = new Date().toISOString();

      const { data, error: queryError } = await supabase
        .from("dentist_appointment_slots")
        .select("id, dentist_id, starts_at, ends_at")
        .eq("dentist_id", selectedDentist.id)
        .eq("is_available", true)
        .gte("starts_at", start.toISOString())
        .lt("starts_at", end.toISOString())
        .gt("starts_at", now)
        .order("starts_at");

      if (queryError) {
        setBookingError("Unable to load available times. Please try again.");
        setSlots([]);
        return;
      }

      setSlots((data ?? []) as Slot[]);
    } catch {
      setBookingError("A network error occurred while loading times.");
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, [selectedDentist, selectedDate, supabase]);

  // Load the dentist directory on mount.
  useEffect(() => {
    const timer = setTimeout(() => {
      void loadDentists();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadDentists]);

  // Reload available times when the selected dentist or date changes.
  useEffect(() => {
    const timer = setTimeout(() => {
      void loadSlots();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadSlots]);

  const filteredDentists = useMemo(() => {
    const term = search.trim().toLowerCase();
    const place = location.trim().toLowerCase();

    return dentists.filter((dentist) => {
      const searchableValues = [
        dentist.full_name,
        dentist.specialty,
        dentist.qualifications,
        dentist.clinic_name,
        dentist.city,
        dentist.state,
      ];

      const matchesSearch =
        !term ||
        searchableValues.some((value) =>
          value?.toLowerCase().includes(term),
        );

      const matchesSpecialty =
        specialty === "All specialties" ||
        dentist.specialty === specialty;

      const matchesLocation =
        !place ||
        [dentist.city, dentist.state, dentist.address].some((value) =>
          value?.toLowerCase().includes(place),
        );

      return matchesSearch && matchesSpecialty && matchesLocation;
    });
  }, [dentists, search, specialty, location]);

  async function bookAppointment() {
    if (!selectedDentist || !selectedSlot) {
      setBookingError("Please select an appointment time.");
      return;
    }

    if (reason.trim().length > 1000) {
      setBookingError("Your appointment reason is too long.");
      return;
    }

    setBooking(true);
    setBookingError("");
    setBookingMessage("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/login?next=%2Fdoctors");
        return;
      }

      const chosenSlot = slots.find((slot) => slot.id === selectedSlot);

      if (!chosenSlot || new Date(chosenSlot.starts_at) <= new Date()) {
        setBookingError(
          "This time is no longer valid. Please select another slot.",
        );
        await loadSlots();
        return;
      }

      const { data, error: rpcError } = await supabase.rpc(
        "book_dentist_appointment",
        {
          p_slot_id: selectedSlot,
          p_reason: reason.trim() || null,
        },
      );

      if (rpcError) {
        const message = rpcError.message.toLowerCase();

        if (message.includes("no longer available")) {
          setBookingError(
            "Sorry, that time has just been booked. Please choose another.",
          );
        } else if (message.includes("sign in") || message.includes("auth")) {
          setBookingError("Please sign in before booking an appointment.");
        } else {
          setBookingError(
            "We couldn't complete your booking. Please try again.",
          );
        }

        await loadSlots();
        return;
      }

      if (!data) {
        setBookingError(
          "We couldn't confirm your booking. Please check your appointments.",
        );
        return;
      }

      setBookingMessage(
        `Your appointment is confirmed. Reference: ${String(data)}`,
      );
      setSelectedSlot("");
      setReason("");
      await loadSlots();
    } catch {
      setBookingError(
        "A network error occurred. Please check your connection and try again.",
      );
    } finally {
      setBooking(false);
    }
  }

  function openBooking(dentist: Dentist) {
    setSelectedDentist(dentist);
    setSelectedDate(today);
    setSelectedSlot("");
    setReason("");
    setBookingMessage("");
    setBookingError("");
  }

  function closeBooking() {
    if (booking) return;
    setSelectedDentist(null);
    setSelectedSlot("");
    setBookingMessage("");
    setBookingError("");
  }

  return (
    <main className="min-h-screen bg-[#f6fafb] text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#087ca7] text-white">
              <Stethoscope size={22} />
            </span>
            <span>
              <span className="block text-lg font-bold tracking-tight text-slate-900">
                DentX24
              </span>
              <span className="block text-xs text-slate-500">
                Your smile, our priority
              </span>
            </span>
          </Link>

          <Link
            href="/login"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold transition hover:border-[#087ca7] hover:text-[#087ca7]"
          >
            Sign in
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#073b50]">
        <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-[#087ca7]/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-cyan-200">
            <ShieldCheck size={18} />
            Care you can feel confident about
          </p>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Find the right dentist.
            <span className="mt-2 block text-cyan-200">
              Book your next visit.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
            Explore dental professionals, compare specialties, and choose an
            appointment time that works for you.
          </p>

          <div className="mt-9 grid gap-3 rounded-2xl bg-white p-3 shadow-2xl shadow-black/10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
            <label className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
              <Search size={19} className="shrink-0 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Dentist, clinic or specialty"
                className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
                aria-label="Search dentists"
              />
            </label>

            <label className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
              <Stethoscope size={19} className="shrink-0 text-slate-400" />
              <select
                value={specialty}
                onChange={(event) => setSpecialty(event.target.value)}
                className="w-full min-w-0 bg-transparent text-sm outline-none"
                aria-label="Filter by specialty"
              >
                {specialties.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
              <MapPin size={19} className="shrink-0 text-slate-400" />
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="City or state"
                className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
                aria-label="Filter by location"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSpecialty("All specialties");
                setLocation("");
              }}
              className="rounded-xl bg-[#087ca7] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#066589]"
            >
              Clear filters
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-8">
          <p className="text-sm font-semibold text-[#087ca7]">
            YOUR DENTAL CARE
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Explore our dentists
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {loading
              ? "Finding available professionals..."
              : `${filteredDentists.length} ${
                  filteredDentists.length === 1 ? "dentist" : "dentists"
                } found`}
          </p>
        </div>

        {error && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => void loadDentists()}
              className="font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-2xl border border-slate-100 bg-white"
              />
            ))}
          </div>
        ) : filteredDentists.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-[#087ca7]">
              <Stethoscope size={30} />
            </span>
            <h3 className="mt-5 text-xl font-bold text-slate-900">
              {dentists.length === 0
                ? "Your dental directory is getting ready"
                : "No dentists match your search"}
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
              {dentists.length === 0
                ? "No active dentist profiles are available yet. Add verified dentist profiles in Supabase and they will appear here automatically."
                : "Try a different name, specialty, city, or state. You can also clear your filters to see all available dentists."}
            </p>

            {dentists.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSpecialty("All specialties");
                  setLocation("");
                }}
                className="mt-6 rounded-xl bg-[#087ca7] px-5 py-3 text-sm font-semibold text-white hover:bg-[#066589]"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredDentists.map((dentist) => (
              <article
                key={dentist.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-slate-200/60"
              >
                <div className="flex items-start gap-4 p-5">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-cyan-50 text-[#087ca7]">
                    {dentist.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={dentist.photo_url}
                        alt={dentist.full_name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <UserRound size={36} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900">
                      {dentist.full_name}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-[#087ca7]">
                      {dentist.specialty}
                    </p>
                    {dentist.qualifications && (
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {dentist.qualifications}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3 px-5 pb-5">
                  {(dentist.clinic_name || dentist.city || dentist.state) && (
                    <p className="flex items-start gap-2 text-sm text-slate-600">
                      <MapPin
                        size={17}
                        className="mt-0.5 shrink-0 text-slate-400"
                      />
                      <span>
                        {[dentist.clinic_name, dentist.city, dentist.state]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </p>
                  )}

                  {dentist.bio && (
                    <p className="line-clamp-3 text-sm leading-6 text-slate-500">
                      {dentist.bio}
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-xs text-slate-400">
                        Consultation fee
                      </p>
                      <p className="mt-1 font-bold text-slate-900">
                        {dentist.consultation_fee == null
                          ? "Contact clinic"
                          : formatNaira(dentist.consultation_fee)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => openBooking(dentist)}
                      disabled={!today}
                      className="rounded-xl bg-[#087ca7] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#066589] disabled:opacity-50"
                    >
                      Book visit
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-cyan-100 bg-cyan-50/70 p-6 sm:flex-row sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#087ca7] shadow-sm">
              <ShieldCheck size={23} />
            </span>
            <div>
              <h3 className="font-bold text-slate-900">
                Your care, your choice
              </h3>
              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-600">
                Review provider details and available times before confirming
                an appointment.
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="shrink-0 text-sm font-semibold text-[#087ca7] hover:underline"
          >
            Back to home →
          </Link>
        </div>
      </section>

      {selectedDentist && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeBooking();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            className="max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#087ca7]">
                  Appointment booking
                </p>
                <h2
                  id="booking-title"
                  className="mt-2 text-2xl font-bold text-slate-900"
                >
                  Book a visit
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {selectedDentist.full_name} · {selectedDentist.specialty}
                </p>
              </div>

              <button
                type="button"
                onClick={closeBooking}
                disabled={booking}
                aria-label="Close booking dialog"
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={21} />
              </button>
            </div>

            <div className="mt-6">
              <label
                htmlFor="appointment-date"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                <CalendarDays className="mr-2 inline" size={17} />
                Choose a date
              </label>

              <input
                id="appointment-date"
                type="date"
                min={today}
                value={selectedDate}
                onChange={(event) => {
                  setSelectedDate(event.target.value);
                  setBookingMessage("");
                  setBookingError("");
                }}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#087ca7] focus:ring-2 focus:ring-cyan-100"
              />

              <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                {dateOptions.map((date) => (
                  <button
                    type="button"
                    key={date}
                    onClick={() => {
                      setSelectedDate(date);
                      setBookingMessage("");
                      setBookingError("");
                    }}
                    className={`shrink-0 rounded-xl border px-3 py-2 text-xs font-semibold ${
                      selectedDate === date
                        ? "border-[#087ca7] bg-[#087ca7] text-white"
                        : "border-slate-200 text-slate-600 hover:border-[#087ca7]"
                    }`}
                  >
                    {date === today ? "Today" : formatDate(date)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-700">
                <Clock3 className="mr-2 inline" size={17} />
                Available times
              </h3>

              {bookingError && (
                <p
                  role="alert"
                  className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700"
                >
                  {bookingError}
                </p>
              )}

              {bookingMessage && (
                <div
                  role="status"
                  className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
                >
                  <CheckCircle2 className="mr-2 inline" size={18} />
                  {bookingMessage}
                </div>
              )}

              {slotsLoading ? (
                <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                  Loading available times...
                </p>
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {slots.map((slot) => (
                    <button
                      type="button"
                      key={slot.id}
                      onClick={() => {
                        setSelectedSlot(slot.id);
                        setBookingError("");
                        setBookingMessage("");
                      }}
                      className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                        selectedSlot === slot.id
                          ? "border-[#087ca7] bg-cyan-50 text-[#087ca7] ring-2 ring-cyan-100"
                          : "border-slate-200 text-slate-700 hover:border-[#087ca7]"
                      }`}
                    >
                      {formatTime(slot.starts_at)}
                    </button>
                  ))}
                </div>
              )}

              {!slotsLoading && slots.length === 0 && !bookingError && (
                <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                  No available times for this date. Please choose another day.
                </p>
              )}
            </div>

            <div className="mt-6">
              <label
                htmlFor="appointment-reason"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                What would you like help with?{" "}
                <span className="font-normal text-slate-400">(optional)</span>
              </label>

              <textarea
                id="appointment-reason"
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value.slice(0, 1000))
                }
                placeholder="Briefly describe your dental concern"
                rows={3}
                maxLength={1000}
                className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#087ca7] focus:ring-2 focus:ring-cyan-100"
              />

              <p className="mt-1 text-right text-xs text-slate-400">
                {reason.length}/1000
              </p>
            </div>

            <button
              type="button"
              onClick={() => void bookAppointment()}
              disabled={
                booking ||
                slotsLoading ||
                !selectedSlot ||
                !!bookingMessage
              }
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#087ca7] px-5 py-4 font-semibold text-white transition hover:bg-[#066589] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {booking ? "Confirming appointment..." : "Confirm appointment"}
            </button>

            <p className="mt-3 text-center text-xs leading-5 text-slate-400">
              Sign-in is required. Your selected time is confirmed only when
              the server successfully reserves it.
            </p>
          </section>
        </div>
      )}
    </main>
  );
}
