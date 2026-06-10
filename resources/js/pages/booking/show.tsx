import { Head, Link, useForm } from '@inertiajs/react';
import { Check, Clock, MapPin } from 'lucide-react';
import { store as bookingStore } from '@/routes/booking';

type Service = {
    id: number;
    name: string;
    description: string | null;
    duration_minutes: number;
    price: number;
    is_main_service: boolean;
};

type BookingForm = {
    service_ids: number[];
    date: string;
    time: string;
    name: string;
    phone_number: string;
    address: string;
    maps_url: string;
    location_note: string;
    customer_note: string;
};

function formatPrice(price: number): string {
    return `Rp ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

function todayString(): string {
    const d = new Date();

    return d.toISOString().slice(0, 10);
}

export default function Show({ services }: { services: Service[] }) {
    const mainServices = services.filter((s) => s.is_main_service);
    const addonServices = services.filter((s) => !s.is_main_service);

    const { data, setData, post, processing, errors } = useForm<BookingForm>({
        service_ids: [],
        date: '',
        time: '',
        name: '',
        phone_number: '',
        address: '',
        maps_url: '',
        location_note: '',
        customer_note: '',
    });

    function toggleService(id: number) {
        setData(
            'service_ids',
            data.service_ids.includes(id)
                ? data.service_ids.filter((s) => s !== id)
                : [...data.service_ids, id],
        );
    }

    const selectedServices = services.filter((s) =>
        data.service_ids.includes(s.id),
    );
    const hasMainSelected = selectedServices.some((s) => s.is_main_service);
    const totalDuration = selectedServices.reduce(
        (acc, s) => acc + s.duration_minutes,
        0,
    );
    const serviceTotal = selectedServices.reduce((acc, s) => acc + s.price, 0);
    const dpAmount = 50000;
    const remaining = serviceTotal - dpAmount;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(bookingStore.url(), { preserveScroll: true });
    }

    return (
        <>
            <Head title="Book a Session" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
                {/* Header */}
                <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80">
                    <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
                        <div>
                            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                Book a Session
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Home care therapy service
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </header>

                <main className="mx-auto max-w-4xl px-4 py-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* ── Step 1: Service Selection ───────────────────── */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <h2 className="mb-1 text-base font-semibold text-slate-900 dark:text-slate-100">
                                1. Select Services
                            </h2>
                            <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
                                Choose at least one main service. Add-ons can be
                                combined with a main service.
                            </p>

                            {/* Main services */}
                            <p className="mb-3 text-xs font-semibold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                                Main Services
                            </p>
                            <div className="mb-6 grid gap-3 sm:grid-cols-2">
                                {mainServices.map((service) => {
                                    const selected =
                                        data.service_ids.includes(service.id);

                                    return (
                                        <button
                                            key={service.id}
                                            type="button"
                                            onClick={() =>
                                                toggleService(service.id)
                                            }
                                            className={`relative flex flex-col gap-1 rounded-xl border-2 p-4 text-left transition-all ${
                                                selected
                                                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/40'
                                                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                                            }`}
                                        >
                                            {selected && (
                                                <span className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-violet-500 text-white">
                                                    <Check className="size-3" />
                                                </span>
                                            )}
                                            <span className="pr-6 font-medium text-slate-900 dark:text-slate-100">
                                                {service.name}
                                            </span>
                                            {service.description && (
                                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                                    {service.description}
                                                </span>
                                            )}
                                            <div className="mt-2 flex items-center gap-3">
                                                <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                                    <Clock className="size-3" />
                                                    {service.duration_minutes}{' '}
                                                    min
                                                </span>
                                                <span className="text-sm font-semibold text-violet-700 dark:text-violet-400">
                                                    {formatPrice(service.price)}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Add-ons */}
                            {addonServices.length > 0 && (
                                <>
                                    <p className="mb-3 text-xs font-semibold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                                        Add-ons
                                    </p>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {addonServices.map((service) => {
                                            const selected =
                                                data.service_ids.includes(
                                                    service.id,
                                                );

                                            return (
                                                <button
                                                    key={service.id}
                                                    type="button"
                                                    onClick={() =>
                                                        toggleService(service.id)
                                                    }
                                                    className={`relative flex flex-col gap-1 rounded-xl border-2 p-4 text-left transition-all ${
                                                        selected
                                                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40'
                                                            : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                                                    }`}
                                                >
                                                    {selected && (
                                                        <span className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-teal-500 text-white">
                                                            <Check className="size-3" />
                                                        </span>
                                                    )}
                                                    <span className="pr-6 font-medium text-slate-900 dark:text-slate-100">
                                                        {service.name}
                                                    </span>
                                                    {service.description && (
                                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                                            {
                                                                service.description
                                                            }
                                                        </span>
                                                    )}
                                                    <div className="mt-2 flex items-center gap-3">
                                                        <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                                            <Clock className="size-3" />
                                                            {
                                                                service.duration_minutes
                                                            }{' '}
                                                            min
                                                        </span>
                                                        <span className="text-sm font-semibold text-teal-700 dark:text-teal-400">
                                                            {formatPrice(
                                                                service.price,
                                                            )}
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </>
                            )}

                            {/* Validation error */}
                            {errors.service_ids && (
                                <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                                    {errors.service_ids}
                                </p>
                            )}

                            {/* Selection summary */}
                            {selectedServices.length > 0 && (
                                <div className="mt-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                                    <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Selected ({selectedServices.length}):
                                    </p>
                                    <ul className="mb-3 space-y-1">
                                        {selectedServices.map((s) => (
                                            <li
                                                key={s.id}
                                                className="flex justify-between text-sm"
                                            >
                                                <span className="text-slate-600 dark:text-slate-400">
                                                    {s.name}
                                                </span>
                                                <span className="font-medium text-slate-800 dark:text-slate-200">
                                                    {formatPrice(s.price)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="flex justify-between border-t border-slate-200 pt-2 dark:border-slate-700">
                                        <span className="text-sm text-slate-500 dark:text-slate-400">
                                            Total duration
                                        </span>
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                            {totalDuration} min
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Warning when only add-ons are selected */}
                            {selectedServices.length > 0 && !hasMainSelected && (
                                <p className="mt-3 rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                                    ⚠ Please also select at least one main
                                    service. Add-ons cannot be booked alone.
                                </p>
                            )}
                        </section>

                        {/* ── Step 2: Date & Time ─────────────────────────── */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <h2 className="mb-5 text-base font-semibold text-slate-900 dark:text-slate-100">
                                2. Schedule
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="date"
                                        className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                    >
                                        Date{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="date"
                                        type="date"
                                        min={todayString()}
                                        value={data.date}
                                        onChange={(e) =>
                                            setData('date', e.target.value)
                                        }
                                        className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm text-slate-900 shadow-xs outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                    />
                                    {errors.date && (
                                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                            {errors.date}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="time"
                                        className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                    >
                                        Time{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="time"
                                        type="time"
                                        step="3600"
                                        value={data.time}
                                        onChange={(e) =>
                                            setData('time', e.target.value)
                                        }
                                        className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm text-slate-900 shadow-xs outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                    />
                                    {errors.time && (
                                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                            {errors.time}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* ── Step 3: Customer Info ───────────────────────── */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <h2 className="mb-5 text-base font-semibold text-slate-900 dark:text-slate-100">
                                3. Your Details
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                    >
                                        Full Name{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        autoComplete="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="e.g. Siti Aminah"
                                        className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm text-slate-900 shadow-xs outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="phone_number"
                                        className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                    >
                                        WhatsApp Number{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="phone_number"
                                        type="tel"
                                        autoComplete="tel"
                                        value={data.phone_number}
                                        onChange={(e) =>
                                            setData(
                                                'phone_number',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="e.g. 08123456789"
                                        className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm text-slate-900 shadow-xs outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                                    />
                                    {errors.phone_number && (
                                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                            {errors.phone_number}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="customer_note"
                                        className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                    >
                                        Additional Notes{' '}
                                        <span className="text-slate-400 dark:text-slate-500">
                                            (optional)
                                        </span>
                                    </label>
                                    <textarea
                                        id="customer_note"
                                        rows={2}
                                        value={data.customer_note}
                                        onChange={(e) =>
                                            setData(
                                                'customer_note',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Any special requests or conditions to inform the therapist..."
                                        className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-xs outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                                    />
                                    {errors.customer_note && (
                                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                            {errors.customer_note}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* ── Step 4: Location ────────────────────────────── */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <h2 className="mb-5 text-base font-semibold text-slate-900 dark:text-slate-100">
                                4. Your Address
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="address"
                                        className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                    >
                                        Full Address{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="address"
                                        rows={3}
                                        value={data.address}
                                        onChange={(e) =>
                                            setData('address', e.target.value)
                                        }
                                        placeholder="Street, RT/RW, Kelurahan, Kecamatan, City..."
                                        className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-xs outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                                    />
                                    {errors.address && (
                                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                            {errors.address}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="location_note"
                                        className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                    >
                                        Location Note{' '}
                                        <span className="text-slate-400 dark:text-slate-500">
                                            (optional)
                                        </span>
                                    </label>
                                    <input
                                        id="location_note"
                                        type="text"
                                        value={data.location_note}
                                        onChange={(e) =>
                                            setData(
                                                'location_note',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="e.g. Red gate, 2nd house from the left"
                                        className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm text-slate-900 shadow-xs outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                                    />
                                    {errors.location_note && (
                                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                            {errors.location_note}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="maps_url"
                                        className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300"
                                    >
                                        <MapPin className="size-3.5" />
                                        Google Maps Link{' '}
                                        <span className="text-slate-400 dark:text-slate-500">
                                            (optional)
                                        </span>
                                    </label>
                                    <input
                                        id="maps_url"
                                        type="url"
                                        value={data.maps_url}
                                        onChange={(e) =>
                                            setData('maps_url', e.target.value)
                                        }
                                        placeholder="https://maps.google.com/..."
                                        className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm text-slate-900 shadow-xs outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                                    />
                                    {errors.maps_url && (
                                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                            {errors.maps_url}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* ── Order Summary & Submit ──────────────────────── */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <h2 className="mb-5 text-base font-semibold text-slate-900 dark:text-slate-100">
                                Order Summary
                            </h2>

                            {selectedServices.length === 0 ? (
                                <p className="text-sm text-slate-400 dark:text-slate-500">
                                    No services selected yet.
                                </p>
                            ) : (
                                <div className="space-y-2 text-sm">
                                    {selectedServices.map((s) => (
                                        <div
                                            key={s.id}
                                            className="flex justify-between"
                                        >
                                            <span className="text-slate-600 dark:text-slate-400">
                                                {s.name} ({s.duration_minutes}{' '}
                                                min)
                                            </span>
                                            <span className="font-medium text-slate-800 dark:text-slate-200">
                                                {formatPrice(s.price)}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="border-t border-slate-100 pt-2 dark:border-slate-800">
                                        <div className="flex justify-between font-semibold">
                                            <span className="text-slate-700 dark:text-slate-300">
                                                Service Total
                                            </span>
                                            <span className="text-slate-900 dark:text-slate-100">
                                                {formatPrice(serviceTotal)}
                                            </span>
                                        </div>
                                        <div className="mt-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                                            <span>
                                                DP (down payment required)
                                            </span>
                                            <span>
                                                {formatPrice(dpAmount)}
                                            </span>
                                        </div>
                                        <div className="mt-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                                            <span>Remaining (paid to therapist)</span>
                                            <span>
                                                {formatPrice(
                                                    remaining > 0
                                                        ? remaining
                                                        : 0,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={
                                    processing ||
                                    data.service_ids.length === 0 ||
                                    !hasMainSelected
                                }
                                className="mt-6 w-full rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-violet-700 dark:hover:bg-violet-600"
                            >
                                {processing
                                    ? 'Submitting…'
                                    : 'Confirm Booking'}
                            </button>

                            {!hasMainSelected && data.service_ids.length > 0 && (
                                <p className="mt-2 text-center text-xs text-amber-600 dark:text-amber-400">
                                    Select at least one main service to continue.
                                </p>
                            )}
                        </section>
                    </form>
                </main>

                {/* Footer */}
                <footer className="mt-16 border-t border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-600">
                    <p>© {new Date().getFullYear()} Home Care Therapy Service</p>
                </footer>
            </div>
        </>
    );
}
