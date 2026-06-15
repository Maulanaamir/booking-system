import { Head, Link, useForm } from '@inertiajs/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// @ts-expect-error - leaflet assets do not have typescript declarations
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
// @ts-expect-error - leaflet assets do not have typescript declarations
// @ts-expect-error - leaflet assets do not have typescript declarations
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import { Check, ChevronDown, ChevronUp, Lock, MapPin, Navigation } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { store as bookingStore } from '@/routes/booking';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

type Service = {
    id: number; name: string; description: string | null;
    duration_minutes: number; price: number; is_main_service: boolean;
};
type BookingForm = {
    service_ids: number[]; date: string; time: string;
    name: string; phone_number: string; address: string;
    maps_url: string; location_note: string; customer_note: string;
    latitude: number | null; longitude: number | null;
};

function formatPrice(p: number) {
    return `Rp ${p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

function getNext7Days(lang: 'id' | 'en') {
    const days: { dayName: string; label: string; value: string }[] = [];
    const now = new Date();
    
    const DN = lang === 'id' 
        ? ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'] 
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
    const MN = lang === 'id'
        ? ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const todayLabel = lang === 'id' ? 'Hari Ini' : 'Today';

    for (let i = 0; i < 7; i++) {
        const d = new Date(now); d.setDate(now.getDate() + i);
        days.push({ dayName: i === 0 ? todayLabel : DN[d.getDay()], label: `${d.getDate()} ${MN[d.getMonth()]}`, value: d.toISOString().slice(0, 10) });
    }

    return days;
}

const PREF_TIMES = ['09:00','10:30','13:00','15:00','17:00'];
const MAIN_PREVIEW = 4;
const INP = 'w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all focus:border-[#B98CFF] focus:ring-2 focus:ring-[#B98CFF]/20';
const INP_S = { backgroundColor:'var(--pub-surface-container)', borderColor:'var(--pub-border)', color:'var(--pub-text)' };

const T = {
    id: {
        title: 'Formulir Pemesanan Sesi — Home Care Therapy',
        headerText: 'Pesan Sesi Terapi',
        treatmentTitle: 'Pilih Layanan Terapi',
        treatmentDesc: 'Pilih minimal satu layanan utama. Layanan add-on dapat ditambahkan bersama layanan utama.',
        showFewer: 'Tampilkan lebih sedikit',
        showAll: (count: number) => `Tampilkan semua layanan (${count} lagi)`,
        mainRequiredWarning: '⚠ Harap pilih minimal satu layanan utama. Add-on tidak dapat dipesan sendiri.',
        addExtraCare: 'Tambah layanan tambahan',
        hideExtraCare: 'Sembunyikan layanan tambahan',
        addedBadge: (count: number) => `${count} ditambahkan`,
        addonsCombinedDesc: 'Add-on harus digabungkan dengan layanan utama.',
        selectedBadge: (count: number, mins: number) => `${count} dipilih · ${mins} menit total`,
        chooseSchedule: 'Pilih Jadwal Terapi',
        dateLabel: 'Tanggal',
        timeLabel: 'Jam Pilihan',
        customTimeLabel: 'Atau masukkan jam kustom:',
        detailsTitle: 'Informasi Diri Anda',
        fullNameLabel: 'Nama Lengkap',
        fullNamePlaceholder: 'cth. Siti Aminah',
        whatsappLabel: 'Nomor WhatsApp',
        whatsappPlaceholder: 'cth. 08123456789',
        additionalNotesLabel: 'Catatan Tambahan',
        additionalNotesPlaceholder: 'cth. Keluhan fisik atau instruksi khusus...',
        locationTitle: 'Alamat Kunjungan',
        locationDesc: 'Tulis alamat lengkap Anda agar terapis kami dapat menuju ke lokasi.',
        addressLabel: 'Alamat Lengkap',
        addressPlaceholder: 'Jalan, RT/RW, Kelurahan, Kecamatan, Kota...',
        locationNoteLabel: 'Patokan Lokasi',
        locationNotePlaceholder: 'cth. Pagar merah, rumah ke-2 dari kiri',
        mapsLabel: 'Link Google Maps',
        mapsPlaceholder: 'https://maps.google.com/...',
        safetyNotice: 'Alamat Anda hanya digunakan untuk keperluan janji temu ini. Keamanan data terjamin.',
        summaryTitle: 'Ringkasan Pemesanan',
        noServicesSelected: 'Belum ada layanan yang dipilih.',
        total: 'Total Biaya',
        dpAmount: 'Uang Muka (DP)',
        remaining: 'Sisa Pembayaran (bayar ke terapis)',
        submitting: 'Mengirim...',
        confirmBtn: 'Konfirmasi Pemesanan',
        selectMainToContinue: 'Pilih minimal satu layanan utama untuk melanjutkan.',
        whatsappContactNotice: 'Kami akan menghubungi Anda melalui WhatsApp untuk mengonfirmasi pemesanan.',
        backToHome: 'Kembali ke beranda',
        useCurrentLocation: 'Gunakan Lokasi Saya',
        locating: 'Mencari...',
        mapInstruction: 'Geser penanda (marker) atau klik pada peta untuk menentukan posisi akurat Anda.',
        coordinatesLabel: 'Koordinat',
    },
    en: {
        title: 'Book a Session — Home Care Therapy',
        headerText: 'Book a Session',
        treatmentTitle: 'Select your treatment',
        treatmentDesc: 'Choose at least one main service. Add-ons can be combined with a main service.',
        showFewer: 'Show fewer',
        showAll: (count: number) => `Show all services (${count} more)`,
        mainRequiredWarning: '⚠ Please also select at least one main service. Add-ons cannot be booked alone.',
        addExtraCare: 'Add extra care',
        hideExtraCare: 'Hide extra care',
        addedBadge: (count: number) => `${count} added`,
        addonsCombinedDesc: 'Add-ons must be combined with a main service.',
        selectedBadge: (count: number, mins: number) => `${count} selected · ${mins} min total`,
        chooseSchedule: 'Choose your schedule',
        dateLabel: 'Date',
        timeLabel: 'Preferred time',
        customTimeLabel: 'Or enter a custom time:',
        detailsTitle: 'Your details',
        fullNameLabel: 'Full Name',
        fullNamePlaceholder: 'e.g. Siti Aminah',
        whatsappLabel: 'WhatsApp Number',
        whatsappPlaceholder: 'e.g. 08123456789',
        additionalNotesLabel: 'Additional Notes',
        additionalNotesPlaceholder: 'Any special requests or conditions...',
        locationTitle: 'Where should we come?',
        locationDesc: 'Enter your home address so our therapist can find you.',
        addressLabel: 'Full Address',
        addressPlaceholder: 'Street, RT/RW, Kelurahan, Kecamatan, City...',
        locationNoteLabel: 'Location Note',
        locationNotePlaceholder: 'e.g. Red gate, 2nd house from the left',
        mapsLabel: 'Google Maps Link',
        mapsPlaceholder: 'https://maps.google.com/...',
        safetyNotice: 'Your address is used only for this appointment. No data is shared.',
        summaryTitle: 'Order Summary',
        noServicesSelected: 'No services selected yet.',
        total: 'Total',
        dpAmount: 'DP (required to confirm)',
        remaining: 'Remaining (paid to therapist)',
        submitting: 'Submitting...',
        confirmBtn: 'Confirm Booking',
        selectMainToContinue: 'Select at least one main service to continue.',
        whatsappContactNotice: 'We will contact you via WhatsApp to confirm your booking.',
        backToHome: 'Back to home',
        useCurrentLocation: 'Use My Current Location',
        locating: 'Locating...',
        mapInstruction: 'Drag the marker or click on the map to pinpoint your exact location.',
        coordinatesLabel: 'Coordinates',
    }
};

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
                            <p className="whitespace-normal break-words leading-relaxed text-xs" style={{ color:'var(--pub-text-muted)' }}>{service.description}</p>
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
    const [lang, setLang] = useState<'id' | 'en'>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('pub-lang') as 'id' | 'en') || 'id';
        }

        return 'id';
    });

    const changeLang = (newLang: 'id' | 'en') => {
        setLang(newLang);
        localStorage.setItem('pub-lang', newLang);
    };

    const mainServices = services.filter(s => s.is_main_service);
    const addonServices = services.filter(s => !s.is_main_service);
    const days = getNext7Days(lang);

    const [showAllMain, setShowAllMain] = useState(false);
    const [showAddons, setShowAddons] = useState(false);

    const visibleMain = showAllMain ? mainServices : mainServices.slice(0, MAIN_PREVIEW);

    const { data, setData, post, processing, errors } = useForm<BookingForm>({
        service_ids:[], date:'', time:'', name:'', phone_number:'',
        address:'', maps_url:'', location_note:'', customer_note:'',
        latitude: null, longitude: null,
    });

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const [geoLoading, setGeoLoading] = useState(false);
    const [geoError, setGeoError] = useState<string | null>(null);

    const defaultCenter: [number, number] = [-6.2, 106.8]; // Jakarta/Tangerang/Bekasi
    const defaultZoom = 12;

    const updateCoordinates = (lat: number, lng: number) => {
        setData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            maps_url: `https://www.google.com/maps?q=${lat},${lng}`,
        }));
    };

    useEffect(() => {
        if (!mapContainerRef.current) {
return;
}

        // Initialize map
        const map = L.map(mapContainerRef.current).setView(
            data.latitude && data.longitude ? [data.latitude, data.longitude] : defaultCenter,
            defaultZoom
        );
        mapRef.current = map;

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add draggable marker
        const markerLatLng = data.latitude && data.longitude ? L.latLng(data.latitude, data.longitude) : L.latLng(defaultCenter);
        const marker = L.marker(markerLatLng, { draggable: true }).addTo(map);
        markerRef.current = marker;

        // Update coordinate states on drag end
        marker.on('dragend', () => {
            const position = marker.getLatLng();
            updateCoordinates(position.lat, position.lng);
        });

        // Click map to reposition marker
        map.on('click', (e) => {
            marker.setLatLng(e.latlng);
            updateCoordinates(e.latlng.lat, e.latlng.lng);
        });

        return () => {
            map.remove();
            mapRef.current = null;
            markerRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Geolocation handler
    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            setGeoError(lang === 'id' ? 'Geolokasi tidak didukung oleh browser Anda.' : 'Geolocation is not supported by your browser.');

            return;
        }

        setGeoLoading(true);
        setGeoError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                updateCoordinates(latitude, longitude);

                // Update map view and marker position
                if (mapRef.current) {
                    mapRef.current.setView([latitude, longitude], 15);
                }

                if (markerRef.current) {
                    markerRef.current.setLatLng([latitude, longitude]);
                }

                setGeoLoading(false);
            },
            (error) => {
                setGeoLoading(false);
                let msg = '';

                if (error.code === error.PERMISSION_DENIED) {
                    msg = lang === 'id' 
                        ? 'Izin geolokasi ditolak. Silakan pilih lokasi Anda secara manual di peta.'
                        : 'Geolocation permission denied. Please select your location manually on the map.';
                } else {
                    msg = lang === 'id'
                        ? 'Gagal mendapatkan lokasi Anda. Silakan pilih di peta secara manual.'
                        : 'Failed to retrieve your location. Please select it manually on the map.';
                }

                setGeoError(msg);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

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
                <title>{T[lang].title}</title>
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
                        
                        <span className="pub-heading text-lg font-semibold italic" style={{ color:'var(--pub-lavender)' }}>
                            {T[lang].headerText}
                        </span>

                        {/* Language Selector */}
                        <div className="flex items-center gap-1 rounded-full border p-1" style={{ borderColor: 'var(--pub-border)', backgroundColor: 'var(--pub-surface)' }}>
                            <button
                                type="button"
                                onClick={() => changeLang('id')}
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition-all ${
                                    lang === 'id'
                                        ? 'bg-violet-600 text-white'
                                        : 'text-neutral-500 hover:opacity-80'
                                }`}
                            >
                                ID
                            </button>
                            <button
                                type="button"
                                onClick={() => changeLang('en')}
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition-all ${
                                    lang === 'en'
                                        ? 'bg-violet-600 text-white'
                                        : 'text-neutral-500 hover:opacity-80'
                                }`}
                            >
                                EN
                            </button>
                        </div>
                    </div>
                </header>

                <main className="relative z-10 mx-auto max-w-5xl px-5 pb-16 pt-8 md:px-10">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_380px] md:items-start">

                            {/* ═══ LEFT: Service selection ════════════════ */}
                            <div className="flex flex-col gap-5">
                                <div>
                                    <h1 className="pub-heading mb-1 text-2xl font-semibold" style={{ color:'var(--pub-text)' }}>{T[lang].treatmentTitle}</h1>
                                    <p className="text-sm" style={{ color:'var(--pub-text-muted)' }}>{T[lang].treatmentDesc}</p>
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
                                        {showAllMain ? <><ChevronUp className="size-4" />{T[lang].showFewer}</> : <><ChevronDown className="size-4" />{T[lang].showAll(mainServices.length - MAIN_PREVIEW)}</>}
                                    </button>
                                )}

                                {errors.service_ids && <p className="text-sm text-red-650">{errors.service_ids}</p>}

                                {selectedServices.length > 0 && !hasMainSelected && (
                                    <p className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor:'rgba(255,218,169,0.3)', color:'#92400e' }}>
                                        {T[lang].mainRequiredWarning}
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
                                                    {showAddons ? T[lang].hideExtraCare : T[lang].addExtraCare}
                                                </span>
                                                {data.service_ids.some(id => addonServices.find(s => s.id === id)) && (
                                                    <span className="rounded-full px-2 py-0.5 text-xs font-bold"
                                                        style={{ backgroundColor:'var(--pub-sage-fixed)', color:'var(--pub-sage)' }}>
                                                        {T[lang].addedBadge(data.service_ids.filter(id => addonServices.find(s => s.id === id)).length)}
                                                    </span>
                                                )}
                                            </div>
                                            {showAddons ? <ChevronUp className="size-4" style={{ color:'var(--pub-text-muted)' }} /> : <ChevronDown className="size-4" style={{ color:'var(--pub-text-muted)' }} />}
                                        </button>
                                        {showAddons && (
                                            <div className="flex flex-col gap-2 p-3" style={{ backgroundColor:'var(--pub-surface)' }}>
                                                <p className="px-1 text-xs" style={{ color:'var(--pub-text-muted)' }}>{T[lang].addonsCombinedDesc}</p>
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
                                            {T[lang].selectedBadge(selectedServices.length, totalDuration)}
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
                                    <h2 className="pub-heading mb-4 text-xl font-semibold" style={{ color:'var(--pub-text)' }}>{T[lang].chooseSchedule}</h2>

                                    <p className="mb-2 text-xs font-bold uppercase tracking-wider" style={{ color:'var(--pub-text-muted)' }}>{T[lang].dateLabel}</p>
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
                                    {errors.date && <p className="mb-2 text-xs text-red-650">{errors.date}</p>}

                                    <p className="mb-2 mt-4 text-xs font-bold uppercase tracking-wider" style={{ color:'var(--pub-text-muted)' }}>{T[lang].timeLabel}</p>
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

                                    <label className="mb-1 block text-xs" style={{ color:'var(--pub-text-muted)' }}>{T[lang].customTimeLabel}</label>
                                    <input id="time" type="time" step="3600" value={data.time}
                                        onChange={e => setData('time', e.target.value)} className={INP} style={INP_S} />
                                    {errors.time && <p className="mt-1 text-xs text-red-655">{errors.time}</p>}
                                </section>

                                {/* Customer details */}
                                <section className="pub-card-solid rounded-2xl p-5">
                                    <h2 className="pub-heading mb-4 text-xl font-semibold" style={{ color:'var(--pub-text)' }}>{T[lang].detailsTitle}</h2>
                                    <div className="flex flex-col gap-3">
                                        <div>
                                            <label htmlFor="name" className="mb-1.5 block text-sm font-semibold" style={{ color:'var(--pub-text)' }}>{T[lang].fullNameLabel} <span className="text-red-500">*</span></label>
                                            <input id="name" type="text" autoComplete="name" value={data.name}
                                                onChange={e => setData('name', e.target.value)} placeholder={T[lang].fullNamePlaceholder} className={INP} style={INP_S} />
                                            {errors.name && <p className="mt-1 text-xs text-red-655">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="phone_number" className="mb-1.5 block text-sm font-semibold" style={{ color:'var(--pub-text)' }}>{T[lang].whatsappLabel} <span className="text-red-500">*</span></label>
                                            <input id="phone_number" type="tel" autoComplete="tel" value={data.phone_number}
                                                onChange={e => setData('phone_number', e.target.value)} placeholder={T[lang].whatsappPlaceholder} className={INP} style={INP_S} />
                                            {errors.phone_number && <p className="mt-1 text-xs text-red-655">{errors.phone_number}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="customer_note" className="mb-1.5 block text-sm font-semibold" style={{ color:'var(--pub-text)' }}>
                                                {T[lang].additionalNotesLabel} <span className="font-normal" style={{ color:'var(--pub-text-muted)' }}>(optional)</span>
                                            </label>
                                            <textarea id="customer_note" rows={2} value={data.customer_note}
                                                onChange={e => setData('customer_note', e.target.value)}
                                                placeholder={T[lang].additionalNotesPlaceholder} className={INP} style={{ ...INP_S, resize:'none' }} />
                                            {errors.customer_note && <p className="mt-1 text-xs text-red-655">{errors.customer_note}</p>}
                                        </div>
                                    </div>
                                </section>

                                {/* Address */}
                                <section className="pub-card-solid rounded-2xl p-5">
                                    <h2 className="pub-heading mb-1 text-xl font-semibold" style={{ color:'var(--pub-text)' }}>{T[lang].locationTitle}</h2>
                                    <p className="mb-4 text-sm" style={{ color:'var(--pub-text-muted)' }}>{T[lang].locationDesc}</p>
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label htmlFor="address" className="mb-1.5 block text-sm font-semibold" style={{ color:'var(--pub-text)' }}>{T[lang].addressLabel} <span className="text-red-500">*</span></label>
                                            <textarea id="address" rows={3} value={data.address}
                                                onChange={e => setData('address', e.target.value)}
                                                placeholder={T[lang].addressPlaceholder} className={INP} style={{ ...INP_S, resize:'none' }} />
                                            {errors.address && <p className="mt-1 text-xs text-red-655">{errors.address}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="location_note" className="mb-1.5 block text-sm font-semibold" style={{ color:'var(--pub-text)' }}>
                                                {T[lang].locationNoteLabel} <span className="font-normal" style={{ color:'var(--pub-text-muted)' }}>(optional)</span>
                                            </label>
                                            <input id="location_note" type="text" value={data.location_note}
                                                onChange={e => setData('location_note', e.target.value)}
                                                placeholder={T[lang].locationNotePlaceholder} className={INP} style={INP_S} />
                                            {errors.location_note && <p className="mt-1 text-xs text-red-655">{errors.location_note}</p>}
                                        </div>

                                        {/* Map coordinates picker */}
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <label className="flex items-center gap-1.5 text-sm font-semibold" style={{ color:'var(--pub-text)' }}>
                                                    <MapPin className="size-3.5" style={{ color:'var(--pub-lavender)' }} />
                                                    <span>Pinpoint Location</span>
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={handleUseCurrentLocation}
                                                    disabled={geoLoading}
                                                    className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50"
                                                    style={{
                                                        borderColor: 'var(--pub-border)',
                                                        backgroundColor: 'var(--pub-surface-container)',
                                                        color: 'var(--pub-text)',
                                                    }}
                                                >
                                                    <Navigation className={`size-3.5 ${geoLoading ? 'animate-spin' : ''}`} style={{ color: 'var(--pub-lavender)' }} />
                                                    <span>{geoLoading ? T[lang].locating : T[lang].useCurrentLocation}</span>
                                                </button>
                                            </div>

                                            <div className="relative w-full rounded-xl overflow-hidden border border-neutral-200" style={{ height: '260px', zIndex: 10 }}>
                                                <div ref={mapContainerRef} className="w-full h-full text-black" />
                                            </div>
                                            
                                            <p className="text-xs leading-relaxed" style={{ color:'var(--pub-text-muted)' }}>
                                                {T[lang].mapInstruction}
                                            </p>

                                            {geoError && (
                                                <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-1">
                                                    {geoError}
                                                </p>
                                            )}

                                            {data.latitude && data.longitude && (
                                                <div className="text-xs p-3 rounded-xl border space-y-1" style={{ backgroundColor: 'var(--pub-surface-container)', borderColor: 'var(--pub-border)', color: 'var(--pub-text)' }}>
                                                    <p><span className="font-semibold">{T[lang].coordinatesLabel}:</span> {data.latitude.toFixed(6)}, {data.longitude.toFixed(6)}</p>
                                                    <p className="truncate"><span className="font-semibold">URL:</span> <span className="opacity-80">{data.maps_url}</span></p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-start gap-3 rounded-xl p-4"
                                            style={{ backgroundColor:'rgba(149,170,130,0.12)', border:'1px solid var(--pub-sage-container)' }}>
                                            <Lock className="mt-0.5 size-4 shrink-0" style={{ color:'var(--pub-sage)' }} />
                                            <p className="text-xs leading-relaxed" style={{ color:'var(--pub-sage)' }}>
                                                {T[lang].safetyNotice}
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Order summary + submit */}
                                <section className="rounded-2xl p-5"
                                    style={{ backgroundColor:'var(--pub-surface)', boxShadow:'0 10px 40px -10px rgba(114,70,180,0.08)', border:'1px solid rgba(204,195,212,0.35)' }}>
                                    <h2 className="pub-heading mb-4 text-xl font-semibold" style={{ color:'var(--pub-text)' }}>{T[lang].summaryTitle}</h2>
                                    {selectedServices.length === 0
                                        ? <p className="text-sm" style={{ color:'var(--pub-text-muted)' }}>{T[lang].noServicesSelected}</p>
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
                                                        <span style={{ color:'var(--pub-text)' }}>{T[lang].total}</span>
                                                        <span style={{ color:'var(--pub-lavender)' }}>{formatPrice(serviceTotal)}</span>
                                                    </div>
                                                    <div className="mt-1 flex justify-between text-xs" style={{ color:'var(--pub-text-muted)' }}>
                                                        <span>{T[lang].dpAmount}</span><span>{formatPrice(dpAmount)}</span>
                                                    </div>
                                                    <div className="mt-1 flex justify-between text-xs" style={{ color:'var(--pub-text-muted)' }}>
                                                        <span>{T[lang].remaining}</span><span>{formatPrice(remaining)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    <button type="submit"
                                        disabled={processing || data.service_ids.length === 0 || !hasMainSelected}
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                                        style={{ backgroundColor:'var(--pub-cta)' }}>
                                        {processing ? T[lang].submitting : T[lang].confirmBtn}
                                    </button>
                                    {!hasMainSelected && data.service_ids.length > 0 && (
                                        <p className="mt-2 text-center text-xs" style={{ color:'#92400e' }}>
                                            {T[lang].selectMainToContinue}
                                        </p>
                                    )}
                                    <p className="mt-3 text-center text-xs" style={{ color:'var(--pub-text-muted)' }}>
                                        {T[lang].whatsappContactNotice}
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
                        {T[lang].backToHome}
                    </Link>
                </footer>
            </div>
        </>
    );
}
