import { Head, Link, useForm } from '@inertiajs/react';
import { Check, ChevronDown, ChevronUp, Lock, MapPin } from 'lucide-react';
import { useState } from 'react';
import { store as bookingStore } from '@/routes/booking';

type Service = {
    id: number; name: string; description: string | null;
    duration_minutes: number; price: number; is_main_service: boolean;
};
type BookingForm = {
    service_ids: number[]; date: string; time: string;
    name: string; phone_number: string; address: string;
    maps_url: string; location_note: string; customer_note: string;
};

function formatPrice(p: number) {
    return `Rp ${p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

function getNext7Days() {
    const days: { dayName: string; label: string; value: string }[] = [];
    const now = new Date();
    const DN = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const MN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    for (let i = 0; i < 7; i++) {
        const d = new Date(now); d.setDate(now.getDate() + i);
        days.push({ dayName: i === 0 ? 'Today' : DN[d.getDay()], label: `${d.getDate()} ${MN[d.getMonth()]}`, value: d.toISOString().slice(0, 10) });
    }

    return days;
}

const PREF_TIMES = ['09:00','10:30','13:00','15:00','17:00'];
const MAIN_PREVIEW = 4;
const INP = 'w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all focus:border-[#B98CFF] focus:ring-2 focus:ring-[#B98CFF]/20';
const INP_S = { backgroundColor:'var(--pub-surface-container)', borderColor:'var(--pub-border)', color:'var(--pub-text)' };

function SvcCard({ service, selected, onToggle, accent }: { service: Service; selected: boolean; onToggle: () => void; accent: string }) {
    return (
        <button type="button" onClick={onToggle}
            className="pub-card w-full rounded-xl p-4 text-left transition-all"
            style={{ border: selected ? `2px solid ${accent}` : '2px solid transparent', transform: selected ? 'translateY(-1px)' : undefined }}>
            <div className="flex items-center gap-3">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all"
                    style={selected ? { backgroundColor: accent, borderColor: accent, color:'#fff' } : { borderColor:'var(--pub-border)' }}>
                    {selected && <Check className="size-3" />}
                </span>
                <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold" style={{ color:'var(--pub-text)' }}>{service.name}</p>
                        {service.description && (
                            <p className="line-clamp-1 text-xs" style={{ color:'var(--pub-text-muted)' }}>{service.description}</p>
                        )}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className="text-sm font-bold" style={{ color: accent }}>{formatPrice(service.price)}</span>
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                            style={{ backgroundColor: selected ? `${accent}18` : 'var(--pub-rose-fixed)', color: selected ? accent : 'var(--pub-text-sub)' }}>
                            {service.duration_minutes}min
                        </span>
                    </div>
                </div>
            </div>
        </button>
    );
}

export default function Show({ services }: { services: Service[] }) {
    const mainServices = services.filter(s => s.is_main_service);
    const addonServices = services.filter(s => !s.is_main_service);
    const days = getNext7Days();

    const [showAllMain, setShowAllMain] = useState(false);
    const [showAddons, setShowAddons] = useState(false);

    const visibleMain = showAllMain ? mainServices : mainServices.slice(0, MAIN_PREVIEW);

    const { data, setData, post, processing, errors } = useForm<BookingForm>({
        service_ids:[], date:'', time:'', name:'', phone_number:'',
        address:'', maps_url:'', location_note:'', customer_note:'',
    });

    function toggleService(id: number) {
        setData('service_ids', data.service_ids.includes(id)
            ? data.service_ids.filter(s => s !== id)
            : [...data.service_ids, id]);
    }

    const selectedServices = services.filter(s => data.service_ids.includes(s.id));
    const hasMainSelected = selectedServices.some(s => s.is_main_service);
    const totalDuration = selectedServices.reduce((a,s) => a + s.duration_minutes, 0);
    const serviceTotal = selectedServices.reduce((a,s) => a + s.price, 0);
    const dpAmount = 50000;
    const remaining = Math.max(0, serviceTotal - dpAmount);

    function handleSubmit(e: React.FormEvent) {
 e.preventDefault(); post(bookingStore.url(), { preserveScroll: true }); 
}

    return (
        <>
            <Head>
                <title>Book a Session — Home Care Therapy</title>
                <meta name="description" content="Book a calm home therapy session at your doorstep." />
            </Head>

            <div className="public-page relative min-h-screen overflow-x-hidden">
                <div aria-hidden className="pub-blob pub-blob-rose fixed -right-20 -top-20 h-[400px] w-[400px]" />
                <div aria-hidden className="pub-blob pub-blob-lavender fixed -left-24 bottom-[10%] h-[340px] w-[340px]" />

                {/* Header */}
                <header className="sticky top-0 z-50 w-full"
                    style={{ backgroundColor:'rgba(255,248,241,0.95)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)' }}>
                    <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 md:px-10">
                        <Link href="/" className="flex size-10 items-center justify-center rounded-full text-lg transition-all hover:-translate-y-0.5"
                            style={{ backgroundColor:'var(--pub-surface)', color:'var(--pub-text-sub)', boxShadow:'0 4px 14px -4px rgba(114,70,180,0.12)' }}>←</Link>
                        <span className="pub-heading text-lg font-semibold italic" style={{ color:'var(--pub-lavender)' }}>Book a Session</span>
                        <div className="size-10" />
                    </div>
                </header>

                <main className="relative z-10 mx-auto max-w-5xl px-5 pb-16 pt-8 md:px-10">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_380px] md:items-start">

                            {/* ═══ LEFT: Service selection ════════════════ */}
                            <div className="flex flex-col gap-5">
                                <div>
                                    <h1 className="pub-heading mb-1 text-2xl font-semibold" style={{ color:'var(--pub-text)' }}>Select your treatment</h1>
                                    <p className="text-sm" style={{ color:'var(--pub-text-muted)' }}>Choose at least one main service. Add-ons can be combined with a main service.</p>
                                </div>

                                {/* Main services */}
                                <div className="flex flex-col gap-2">
                                    {visibleMain.map(s => (
                                        <SvcCard key={s.id} service={s} selected={data.service_ids.includes(s.id)}
                                            onToggle={() => toggleService(s.id)} accent="var(--pub-cta)" />
                                    ))}
                                </div>

                                {mainServices.length > MAIN_PREVIEW && (
                                    <button type="button" onClick={() => setShowAllMain(v => !v)}
                                        className="flex items-center gap-1.5 self-start rounded-full px-4 py-2 text-sm font-semibold transition-all hover:opacity-80"
                                        style={{ border:'1px solid var(--pub-border)', color:'var(--pub-lavender)', backgroundColor:'var(--pub-surface)' }}>
                                        {showAllMain ? <><ChevronUp className="size-4" />Show fewer</> : <><ChevronDown className="size-4" />Show all services ({mainServices.length - MAIN_PREVIEW} more)</>}
                                    </button>
                                )}

                                {errors.service_ids && <p className="text-sm text-red-600">{errors.service_ids}</p>}

                                {selectedServices.length > 0 && !hasMainSelected && (
                                    <p className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor:'rgba(255,218,169,0.3)', color:'#92400e' }}>
                                        ⚠ Please also select at least one main service. Add-ons cannot be booked alone.
                                    </p>
                                )}

                                {/* Add-ons accordion */}
                                {addonServices.length > 0 && (
                                    <div className="rounded-xl overflow-hidden" style={{ border:'1px solid var(--pub-border)' }}>
                                        <button type="button" onClick={() => setShowAddons(v => !v)}
                                            className="flex w-full items-center justify-between px-4 py-3 transition-all hover:opacity-80"
                                            style={{ backgroundColor:'var(--pub-surface-low)' }}>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold" style={{ color:'var(--pub-text)' }}>
                                                    {showAddons ? 'Hide extra care' : 'Add extra care'}
                                                </span>
                                                {data.service_ids.some(id => addonServices.find(s => s.id === id)) && (
                                                    <span className="rounded-full px-2 py-0.5 text-xs font-bold"
                                                        style={{ backgroundColor:'var(--pub-sage-fixed)', color:'var(--pub-sage)' }}>
                                                        {data.service_ids.filter(id => addonServices.find(s => s.id === id)).length} added
                                                    </span>
                                                )}
                                            </div>
                                            {showAddons ? <ChevronUp className="size-4" style={{ color:'var(--pub-text-muted)' }} /> : <ChevronDown className="size-4" style={{ color:'var(--pub-text-muted)' }} />}
                                        </button>
                                        {showAddons && (
                                            <div className="flex flex-col gap-2 p-3" style={{ backgroundColor:'var(--pub-surface)' }}>
                                                <p className="px-1 text-xs" style={{ color:'var(--pub-text-muted)' }}>Add-ons must be combined with a main service.</p>
                                                {addonServices.map(s => (
                                                    <SvcCard key={s.id} service={s} selected={data.service_ids.includes(s.id)}
                                                        onToggle={() => toggleService(s.id)} accent="var(--pub-sage-container)" />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Selected mini-summary */}
                                {selectedServices.length > 0 && (
                                    <div className="rounded-xl p-4" style={{ backgroundColor:'var(--pub-surface-low)' }}>
                                        <p className="mb-2 text-xs font-bold uppercase tracking-wider" style={{ color:'var(--pub-text-muted)' }}>
                                            {selectedServices.length} selected · {totalDuration} min total
                                        </p>
                                        {selectedServices.map(s => (
                                            <div key={s.id} className="flex justify-between text-sm">
                                                <span style={{ color:'var(--pub-text-sub)' }}>{s.name}</span>
                                                <span className="font-medium" style={{ color:'var(--pub-text)' }}>{formatPrice(s.price)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* ═══ RIGHT: Schedule + Details + Summary ════ */}
                            <div className="flex flex-col gap-5 md:sticky md:top-[72px]">

                                {/* Schedule card */}
                                <section className="pub-card-solid rounded-2xl p-5">
                                    <h2 className="pub-heading mb-4 text-xl font-semibold" style={{ color:'var(--pub-text)' }}>Choose your schedule</h2>

                                    <p className="mb-2 text-xs font-bold uppercase tracking-wider" style={{ color:'var(--pub-text-muted)' }}>Date</p>
                                    <div className="mb-1 flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth:'none', msOverflowStyle:'none' }}>
                                        {days.map(d => {
                                            const sel = data.date === d.value;

                                            return (
                                                <button key={d.value} type="button" onClick={() => setData('date', d.value)}
                                                    className="flex shrink-0 flex-col items-center rounded-xl px-3 py-2.5 transition-all"
                                                    style={sel
                                                        ? { backgroundColor:'var(--pub-lavender)', color:'#fff', boxShadow:'0 4px 12px rgba(114,70,180,0.25)', transform:'translateY(-2px)' }
                                                        : { backgroundColor:'var(--pub-surface-container)', color:'var(--pub-text-sub)' }}>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider"
                                                        style={{ color: sel ? 'rgba(255,255,255,0.8)' : 'var(--pub-text-muted)' }}>{d.dayName}</span>
                                                    <span className="text-sm font-bold">{d.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {errors.date && <p className="mb-2 text-xs text-red-600">{errors.date}</p>}

                                    <p className="mb-2 mt-4 text-xs font-bold uppercase tracking-wider" style={{ color:'var(--pub-text-muted)' }}>Preferred time</p>
                                    <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-3">
                                        {PREF_TIMES.map(t => {
                                            const sel = data.time === t;

                                            return (
                                                <button key={t} type="button" onClick={() => setData('time', t)}
                                                    className="rounded-xl py-2.5 text-sm font-semibold transition-all"
                                                    style={sel
                                                        ? { backgroundColor:'var(--pub-cta)', color:'#fff', boxShadow:'0 4px 12px rgba(185,140,255,0.35)', transform:'translateY(-1px)' }
                                                        : { border:'1px solid var(--pub-border)', color:'var(--pub-text-sub)', backgroundColor:'var(--pub-surface-container)' }}>
                                                    {t}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <label className="mb-1 block text-xs" style={{ color:'var(--pub-text-muted)' }}>Or enter a custom time:</label>
                                    <input id="time" type="time" step="3600" value={data.time}
                                        onChange={e => setData('time', e.target.value)} className={INP} style={INP_S} />
                                    {errors.time && <p className="mt-1 text-xs text-red-600">{errors.time}</p>}
                                </section>

                                {/* Customer details */}
                                <section className="pub-card-solid rounded-2xl p-5">
                                    <h2 className="pub-heading mb-4 text-xl font-semibold" style={{ color:'var(--pub-text)' }}>Your details</h2>
                                    <div className="flex flex-col gap-3">
                                        <div>
                                            <label htmlFor="name" className="mb-1.5 block text-sm font-semibold" style={{ color:'var(--pub-text)' }}>Full Name <span className="text-red-500">*</span></label>
                                            <input id="name" type="text" autoComplete="name" value={data.name}
                                                onChange={e => setData('name', e.target.value)} placeholder="e.g. Siti Aminah" className={INP} style={INP_S} />
                                            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="phone_number" className="mb-1.5 block text-sm font-semibold" style={{ color:'var(--pub-text)' }}>WhatsApp Number <span className="text-red-500">*</span></label>
                                            <input id="phone_number" type="tel" autoComplete="tel" value={data.phone_number}
                                                onChange={e => setData('phone_number', e.target.value)} placeholder="e.g. 08123456789" className={INP} style={INP_S} />
                                            {errors.phone_number && <p className="mt-1 text-xs text-red-600">{errors.phone_number}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="customer_note" className="mb-1.5 block text-sm font-semibold" style={{ color:'var(--pub-text)' }}>
                                                Additional Notes <span className="font-normal" style={{ color:'var(--pub-text-muted)' }}>(optional)</span>
                                            </label>
                                            <textarea id="customer_note" rows={2} value={data.customer_note}
                                                onChange={e => setData('customer_note', e.target.value)}
                                                placeholder="Any special requests or conditions..." className={INP} style={{ ...INP_S, resize:'none' }} />
                                            {errors.customer_note && <p className="mt-1 text-xs text-red-600">{errors.customer_note}</p>}
                                        </div>
                                    </div>
                                </section>

                                {/* Address */}
                                <section className="pub-card-solid rounded-2xl p-5">
                                    <h2 className="pub-heading mb-1 text-xl font-semibold" style={{ color:'var(--pub-text)' }}>Where should we come?</h2>
                                    <p className="mb-4 text-sm" style={{ color:'var(--pub-text-muted)' }}>Enter your home address so our therapist can find you.</p>
                                    <div className="flex flex-col gap-3">
                                        <div>
                                            <label htmlFor="address" className="mb-1.5 block text-sm font-semibold" style={{ color:'var(--pub-text)' }}>Full Address <span className="text-red-500">*</span></label>
                                            <textarea id="address" rows={3} value={data.address}
                                                onChange={e => setData('address', e.target.value)}
                                                placeholder="Street, RT/RW, Kelurahan, Kecamatan, City..." className={INP} style={{ ...INP_S, resize:'none' }} />
                                            {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="location_note" className="mb-1.5 block text-sm font-semibold" style={{ color:'var(--pub-text)' }}>
                                                Location Note <span className="font-normal" style={{ color:'var(--pub-text-muted)' }}>(optional)</span>
                                            </label>
                                            <input id="location_note" type="text" value={data.location_note}
                                                onChange={e => setData('location_note', e.target.value)}
                                                placeholder="e.g. Red gate, 2nd house from the left" className={INP} style={INP_S} />
                                            {errors.location_note && <p className="mt-1 text-xs text-red-600">{errors.location_note}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="maps_url" className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold" style={{ color:'var(--pub-text)' }}>
                                                <MapPin className="size-3.5" style={{ color:'var(--pub-lavender)' }} />
                                                Google Maps Link <span className="font-normal" style={{ color:'var(--pub-text-muted)' }}>(optional)</span>
                                            </label>
                                            <input id="maps_url" type="url" value={data.maps_url}
                                                onChange={e => setData('maps_url', e.target.value)}
                                                placeholder="https://maps.google.com/..." className={INP} style={INP_S} />
                                            {errors.maps_url && <p className="mt-1 text-xs text-red-600">{errors.maps_url}</p>}
                                        </div>
                                        <div className="flex items-start gap-3 rounded-xl p-4"
                                            style={{ backgroundColor:'rgba(149,170,130,0.12)', border:'1px solid var(--pub-sage-container)' }}>
                                            <Lock className="mt-0.5 size-4 shrink-0" style={{ color:'var(--pub-sage)' }} />
                                            <p className="text-xs leading-relaxed" style={{ color:'var(--pub-sage)' }}>
                                                Your address is used only for this appointment. No data is shared.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Order summary + submit */}
                                <section className="rounded-2xl p-5"
                                    style={{ backgroundColor:'var(--pub-surface)', boxShadow:'0 10px 40px -10px rgba(114,70,180,0.08)', border:'1px solid rgba(204,195,212,0.35)' }}>
                                    <h2 className="pub-heading mb-4 text-xl font-semibold" style={{ color:'var(--pub-text)' }}>Order Summary</h2>
                                    {selectedServices.length === 0
                                        ? <p className="text-sm" style={{ color:'var(--pub-text-muted)' }}>No services selected yet.</p>
                                        : (
                                            <div className="space-y-2 text-sm">
                                                {selectedServices.map(s => (
                                                    <div key={s.id} className="flex justify-between">
                                                        <span style={{ color:'var(--pub-text-sub)' }}>{s.name} ({s.duration_minutes}min)</span>
                                                        <span className="font-medium" style={{ color:'var(--pub-text)' }}>{formatPrice(s.price)}</span>
                                                    </div>
                                                ))}
                                                <div className="border-t pt-3" style={{ borderColor:'rgba(204,195,212,0.4)' }}>
                                                    <div className="flex justify-between font-semibold">
                                                        <span style={{ color:'var(--pub-text)' }}>Total</span>
                                                        <span style={{ color:'var(--pub-lavender)' }}>{formatPrice(serviceTotal)}</span>
                                                    </div>
                                                    <div className="mt-1 flex justify-between text-xs" style={{ color:'var(--pub-text-muted)' }}>
                                                        <span>DP (required to confirm)</span><span>{formatPrice(dpAmount)}</span>
                                                    </div>
                                                    <div className="mt-1 flex justify-between text-xs" style={{ color:'var(--pub-text-muted)' }}>
                                                        <span>Remaining (paid to therapist)</span><span>{formatPrice(remaining)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    <button type="submit"
                                        disabled={processing || data.service_ids.length === 0 || !hasMainSelected}
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                                        style={{ backgroundColor:'var(--pub-cta)' }}>
                                        {processing ? 'Submitting…' : 'Confirm Booking'}
                                    </button>
                                    {!hasMainSelected && data.service_ids.length > 0 && (
                                        <p className="mt-2 text-center text-xs" style={{ color:'#92400e' }}>
                                            Select at least one main service to continue.
                                        </p>
                                    )}
                                    <p className="mt-3 text-center text-xs" style={{ color:'var(--pub-text-muted)' }}>
                                        We will contact you via WhatsApp to confirm your booking.
                                    </p>
                                </section>
                            </div>{/* end RIGHT */}
                        </div>
                    </form>
                </main>

                <footer className="relative z-10 mt-8 rounded-t-xl py-6 text-center text-xs"
                    style={{ backgroundColor:'var(--pub-surface-low)', color:'var(--pub-text-muted)' }}>
                    <p>© {new Date().getFullYear()} Home Care Therapy Service</p>
                    <Link href="/" className="mt-1 block transition-opacity hover:opacity-70" style={{ color:'var(--pub-lavender)' }}>
                        ← Back to home
                    </Link>
                </footer>
            </div>
        </>
    );
}
