
export const TWelcome = {
    id: {
        tagline: 'Kunjungan Ramah Perempuan',
        heroSub: 'Untuk perempuan & pasangan',
        heroTitle: 'Badan terasa lelah setelah seharian beraktivitas?',
        heroDesc:
            'Pesan sesi terapi panggilan yang nyaman di rumah. Cocok untuk Anda yang ingin merawat tubuh tanpa harus keluar lagi.',
        heroCta: 'Pesan Sekarang',
        book: 'Pesan',
        home: 'Beranda',
        cozyWellnessSetting: 'Suasana yang tenang dan nyaman',
        safetyFirstTitle: 'Kenyamanan Anda utama',
        safetyFirstSub: 'Ditangani dengan hati-hati',
        ourOfferings: 'Pilih Layanan Terapi',
        offeringsSub:
            'Pilih layanan yang sesuai dengan kebutuhan tubuh Anda, langsung dari rumah.',
        howItWorks: 'Cara Pemesanan',
        howItWorksSteps: [
            {
                step: 1,
                title: 'Pilih Layanan',
                desc: 'Pilih layanan terapi yang Anda butuhkan.',
            },
            {
                step: 2,
                title: 'Tentukan Jadwal',
                desc: 'Pilih tanggal dan jam yang paling nyaman.',
            },
            {
                step: 3,
                title: 'Isi Alamat',
                desc: 'Masukkan alamat rumah untuk kunjungan terapis.',
            },
            {
                step: 4,
                title: 'Tunggu Konfirmasi',
                desc: 'Tim kami akan menghubungi Anda melalui WhatsApp.',
            },
        ],
        trustSafetyTitle: 'Privasi alamat terjaga',
        trustSafetyDesc:
            'Alamat Anda hanya digunakan untuk keperluan janji temu.',
        trustDoorstepTitle: 'Terapis datang ke rumah',
        trustDoorstepDesc: 'Tidak perlu pergi ke klinik atau tempat terapi.',
        trustFlexibleTitle: 'Konfirmasi jelas',
        trustFlexibleDesc:
            'Tim kami akan menghubungi Anda untuk memastikan jadwal.',
        trustWhatsappTitle: 'Nyaman untuk perempuan',
        trustWhatsappDesc:
            'Layanan dibuat agar terasa aman, sopan, dan nyaman.',
        footerDesc:
            'Layanan terapi panggilan yang nyaman, aman, dan terpercaya di rumah Anda.',
        explore: 'Jelajahi',
        bookSession: 'Pesan Sesi',
        support: 'Dukungan',
        backToTop: 'Kembali ke Atas',
    },
    en: {
        tagline: 'Women-Friendly Visits',
        heroSub: 'For women & couples',
        heroTitle: 'Tired after a long day?',
        heroDesc:
            'Book a comfortable home therapy session without going out. Designed for women and couples who want safe, gentle care at home.',
        heroCta: 'Book Now',
        book: 'Book',
        home: 'Home',
        cozyWellnessSetting: 'Cozy wellness setting',
        safetyFirstTitle: 'Your safety first',
        safetyFirstSub: 'By our trusted team',
        ourOfferings: 'Select Therapy Services',
        offeringsSub:
            "Choose the service that fits your body's needs, directly at home.",
        howItWorks: 'How it works',
        howItWorksSteps: [
            {
                step: 1,
                title: 'Choose Service',
                desc: 'Choose the therapy service that you need.',
            },
            {
                step: 2,
                title: 'Choose Schedule',
                desc: 'Select the most convenient date and time.',
            },
            {
                step: 3,
                title: 'Fill Address',
                desc: 'Enter your home address for the visit.',
            },
            {
                step: 4,
                title: 'Wait for Confirmation',
                desc: 'Our team will contact you via WhatsApp.',
            },
        ],
        trustSafetyTitle: 'Address privacy secured',
        trustSafetyDesc:
            'Your address is only used for the appointment purpose.',
        trustDoorstepTitle: 'Therapist comes to you',
        trustDoorstepDesc: 'No need to go out to clinics or therapy centers.',
        trustFlexibleTitle: 'Clear confirmation',
        trustFlexibleDesc:
            'Our team will contact you to verify and confirm your schedule.',
        trustWhatsappTitle: 'Comfortable for women',
        trustWhatsappDesc:
            'Designed to feel safe, respectful, and highly comfortable.',
        footerDesc:
            'Comfortable, safe, and trusted home visit therapy services at your convenience.',
        explore: 'Explore',
        bookSession: 'Book Session',
        support: 'Support',
        backToTop: 'Back to Top',
    },
};

export const TBooking = {
    id: {
        title: 'Formulir Pemesanan Sesi — Home Care Therapy',
        headerText: 'Pesan Sesi Terapi',
        treatmentTitle: 'Pilih Layanan Terapi',
        treatmentDesc:
            'Pilih minimal satu layanan utama. Layanan add-on dapat ditambahkan bersama layanan utama.',
        showFewer: 'Tampilkan lebih sedikit',
        showAll: (count: number) => `Tampilkan semua layanan (${count} lagi)`,
        mainRequiredWarning:
            '⚠ Harap pilih minimal satu layanan utama. Add-on tidak dapat dipesan sendiri.',
        addExtraCare: 'Tambah layanan tambahan',
        hideExtraCare: 'Sembunyikan layanan tambahan',
        addedBadge: (count: number) => `${count} ditambahkan`,
        addonsCombinedDesc: 'Add-on harus digabungkan dengan layanan utama.',
        selectedBadge: (count: number, mins: number) =>
            `${count} dipilih · ${mins} menit total`,
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
        additionalNotesPlaceholder:
            'cth. Keluhan fisik atau instruksi khusus...',
        locationTitle: 'Alamat Kunjungan',
        locationDesc:
            'Tulis alamat lengkap Anda agar terapis kami dapat menuju ke lokasi.',
        addressLabel: 'Alamat Lengkap',
        addressPlaceholder: 'Jalan, RT/RW, Kelurahan, Kecamatan, Kota...',
        locationNoteLabel: 'Patokan Lokasi',
        locationNotePlaceholder: 'cth. Pagar merah, rumah ke-2 dari kiri',
        mapsLabel: 'Link Google Maps',
        mapsPlaceholder: 'https://maps.google.com/...',
        safetyNotice:
            'Alamat Anda hanya digunakan untuk keperluan janji temu ini. Keamanan data terjamin.',
        summaryTitle: 'Ringkasan Pemesanan',
        noServicesSelected: 'Belum ada layanan yang dipilih.',
        total: 'Total Biaya',
        dpAmount: 'Uang Muka (DP)',
        remaining: 'Sisa Pembayaran (bayar ke terapis)',
        submitting: 'Mengirim...',
        confirmBtn: 'Konfirmasi Pemesanan',
        selectMainToContinue:
            'Pilih minimal satu layanan utama untuk melanjutkan.',
        whatsappContactNotice:
            'Kami akan menghubungi Anda melalui WhatsApp untuk mengonfirmasi pemesanan.',
        backToHome: 'Kembali ke beranda',
        useCurrentLocation: 'Gunakan Lokasi Saya',
        locating: 'Mencari...',
        mapInstruction:
            'Geser penanda (marker) atau klik pada peta untuk menentukan posisi akurat Anda.',
        coordinatesLabel: 'Koordinat',
        mapHelper:
            'Gunakan lokasi saya hanya jika Anda sedang berada di alamat kunjungan. Jika titik belum tepat, geser pin pada peta.',
        lowAccuracyWarning:
            'Lokasi mungkin belum akurat. Silakan geser pin agar sesuai alamat.',
        noCoordinatesInfo:
            'Belum ada titik koordinat terpilih. Anda tetap dapat mengisi alamat dan memilih titik secara manual di peta.',
    },
    en: {
        title: 'Book a Session — Home Care Therapy',
        headerText: 'Book a Session',
        treatmentTitle: 'Select your treatment',
        treatmentDesc:
            'Choose at least one main service. Add-ons can be combined with a main service.',
        showFewer: 'Show fewer',
        showAll: (count: number) => `Show all services (${count} more)`,
        mainRequiredWarning:
            '⚠ Please also select at least one main service. Add-ons cannot be booked alone.',
        addExtraCare: 'Add extra care',
        hideExtraCare: 'Hide extra care',
        addedBadge: (count: number) => `${count} added`,
        addonsCombinedDesc: 'Add-ons must be combined with a main service.',
        selectedBadge: (count: number, mins: number) =>
            `${count} selected · ${mins} min total`,
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
        safetyNotice:
            'Your address is used only for this appointment. No data is shared.',
        summaryTitle: 'Order Summary',
        noServicesSelected: 'No services selected yet.',
        total: 'Total Price',
        dpAmount: 'Down Payment (DP)',
        remaining: 'Remaining (pay to therapist)',
        submitting: 'Submitting...',
        confirmBtn: 'Confirm Booking',
        selectMainToContinue:
            'Select at least one main service to continue.',
        whatsappContactNotice:
            'We will contact you via WhatsApp to confirm your booking request.',
        backToHome: 'Back to home',
        useCurrentLocation: 'Use My Location',
        locating: 'Locating...',
        mapInstruction:
            'Drag the marker or click on the map to accurately place your visit location.',
        coordinatesLabel: 'Coordinates',
        mapHelper:
            'Use current location only if you are currently at the visit address. If the marker is not exact, drag it on the map.',
        lowAccuracyWarning:
            'Location might not be accurate. Please drag the marker to your actual address.',
        noCoordinatesInfo:
            'No coordinates selected. You can still enter your address and pick a spot manually on the map.',
    },
};

export const TSuccess = {
    id: {
        title: 'Pemesanan Diterima — Home Care Therapy',
        receivedTag: 'Pemesanan Diterima',
        allSetTitle: 'Semua Sudah Siap',
        successDesc:
            'Permintaan pemesanan terapi di rumah Anda telah kami terima. Kami akan menghubungi Anda segera melalui WhatsApp untuk mengonfirmasi sesi dan metode pembayaran DP.',
        reference: 'Nomor Referensi',
        schedule: 'Jadwal Sesi',
        endsApprox: (timeStr: string) => `Selesai sekitar jam ${timeStr}`,
        paymentDetails: 'Rincian Pembayaran',
        total: 'Total Biaya',
        dpToConfirm: 'DP untuk Konfirmasi',
        remaining: 'Sisa Pembayaran',
        safetyNotice:
            'Alamat Anda hanya digunakan untuk janji temu ini. Keamanan dan kenyamanan Anda adalah prioritas kami.',
        nextStepsTitle: 'Langkah Selanjutnya: Pembayaran DP',
        nextStepsDesc: (priceStr: string) =>
            `Silakan selesaikan pembayaran DP sebesar ${priceStr} untuk mengamankan slot jadwal Anda. Anda dapat membayar menggunakan tombol di bawah ini.`,
        bookAnother: 'Pesan Sesi Lainnya',
        backToHome: 'Kembali ke Beranda',
        payDpNow: 'Bayar DP Sekarang',
        paymentStatusLabel: 'Status Pembayaran',
        unpaidStatus: 'Belum Dibayar',
        paidStatus: 'Sudah Dibayar',
        fallbackMessage:
            'Link pembayaran otomatis belum tersedia. Silakan hubungi admin untuk konfirmasi pembayaran DP.',
    },
    en: {
        title: 'Booking Received — Home Care Therapy',
        receivedTag: 'Booking received',
        allSetTitle: "You're all set",
        successDesc:
            "Your booking request has been received. We'll contact you via WhatsApp to confirm your session and DP payment.",
        reference: 'Reference',
        schedule: 'Schedule',
        endsApprox: (timeStr: string) => `Ends approx. ${timeStr}`,
        paymentDetails: 'Payment details',
        total: 'Total',
        dpToConfirm: 'DP to confirm',
        remaining: 'Remaining',
        safetyNotice:
            'Your address is used only for this appointment. Your comfort and safety come first.',
        nextStepsTitle: 'Next: Complete DP Payment',
        nextStepsDesc: (priceStr: string) =>
            `Please complete the DP payment of ${priceStr} to secure your slot. You can pay using the button below.`,
        bookAnother: 'Book Another Session',
        backToHome: 'Back to Home',
        payDpNow: 'Pay DP Now',
        paymentStatusLabel: 'Payment Status',
        unpaidStatus: 'Unpaid',
        paidStatus: 'Paid',
        fallbackMessage:
            'Automatic payment link is not available yet. Please contact admin to confirm your DP payment.',
    },
};
