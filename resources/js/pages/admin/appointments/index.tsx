import { Head, Link, router } from '@inertiajs/react';
import { 
    CalendarDays, 
    Search, 
    X, 
    Calendar, 
    User, 
    Clock, 
    ArrowRight, 
    Filter,
    ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { dashboard } from '@/routes';
import {
    index as appointmentsIndex,
    show as appointmentsShow,
} from '@/routes/admin/appointments';
import type { BreadcrumbItem } from '@/types';

type Customer = {
    id: number;
    name: string;
    phone_number: string;
};

type Therapist = {
    id: number;
    name: string;
};

type AppointmentListItem = {
    id: string;
    customer: Customer;
    therapist: Therapist;
    start_at: string;
    status: string;
    payment_status: string;
    total_price: number;
};

type PaginatedAppointments = {
    data: AppointmentListItem[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    current_page: number;
    last_page: number;
    total: number;
};

function formatPrice(price: number): string {
    return `Rp ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

const STATUS_LABELS: Record<string, string> = {
    pending_approval: 'Pending Approval',
    pending_dp: 'Pending DP',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    expired: 'Expired',
};

// Premium Soft Wellness color styles
const STATUS_BADGES: Record<string, { label: string; className: string }> = {
    pending_approval: {
        label: 'Pending Approval',
        className: 'text-amber-700 bg-amber-50 border-amber-200/60 dark:text-amber-450 dark:bg-amber-950/20 dark:border-amber-900/40 font-medium',
    },
    pending_dp: {
        label: 'Pending DP',
        className: 'text-orange-700 bg-orange-50 border-orange-200/60 dark:text-orange-450 dark:bg-orange-950/20 dark:border-orange-900/40 font-medium',
    },
    confirmed: {
        label: 'Confirmed',
        className: 'text-emerald-700 bg-emerald-50 border-emerald-200/60 dark:text-emerald-450 dark:bg-emerald-950/20 dark:border-emerald-900/40 font-medium',
    },
    completed: {
        label: 'Completed',
        className: 'text-blue-700 bg-blue-50 border-blue-200/60 dark:text-blue-455 dark:bg-blue-950/20 dark:border-blue-900/40 font-medium',
    },
    cancelled: {
        label: 'Cancelled',
        className: 'text-rose-700 bg-rose-50 border-rose-200/60 dark:text-rose-450 dark:bg-rose-950/20 dark:border-rose-900/40 font-medium',
    },
    expired: {
        label: 'Expired',
        className: 'text-gray-600 bg-gray-50 border-gray-200/60 dark:text-gray-450 dark:bg-gray-950/20 dark:border-gray-900/40 font-medium',
    },
};

const PAYMENT_BADGES: Record<string, { label: string; className: string }> = {
    unpaid: {
        label: 'Unpaid',
        className: 'text-rose-700 bg-rose-50 border-rose-200/60 dark:text-rose-450 dark:bg-rose-950/20 dark:border-rose-900/40 font-medium',
    },
    dp_paid: {
        label: 'DP Paid',
        className: 'text-blue-700 bg-blue-50 border-blue-200/60 dark:text-blue-455 dark:bg-blue-950/20 dark:border-blue-900/40 font-medium',
    },
    fully_paid: {
        label: 'Fully Paid',
        className: 'text-emerald-700 bg-emerald-50 border-emerald-200/60 dark:text-emerald-450 dark:bg-emerald-950/20 dark:border-emerald-900/40 font-medium',
    },
};

export default function Index({
    appointments,
    filters = {},
}: {
    appointments: PaginatedAppointments;
    filters?: {
        search?: string;
        status?: string;
        date?: string;
    };
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [date, setDate] = useState(filters.date || '');

    const handleFilter = (newSearch = search, newStatus = status, newDate = date) => {
        const query: Record<string, string> = {};

        if (newSearch.trim()) {
query.search = newSearch.trim();
}

        if (newStatus) {
query.status = newStatus;
}

        if (newDate) {
query.date = newDate;
}

        router.get(appointmentsIndex().url, query, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilter(search, status, date);
    };

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        handleFilter(search, newStatus, date);
    };

    const handleDateChange = (newDate: string) => {
        setDate(newDate);
        handleFilter(search, status, newDate);
    };

    const handleReset = () => {
        setSearch('');
        setStatus('');
        setDate('');
        router.get(appointmentsIndex().url, {}, {
            preserveState: true,
            replace: true,
        });
    };

    const isFilterActive = !!(filters.search || filters.status || filters.date);

    return (
        <>
            <Head title="Appointments" />

            <div className="flex items-center justify-between">
                <Heading
                    title="Appointments"
                    description="View and manage customer appointments"
                />
            </div>

            {/* Filter Toolbar Card */}
            <Card className="mb-6 bg-white border-neutral-100 shadow-sm dark:bg-neutral-900/50 dark:border-neutral-800 rounded-2xl">
                <CardContent className="p-4 md:p-6">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center">
                            {/* Search Input */}
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                                <Input
                                    type="text"
                                    placeholder="Search customer name, phone, or therapist..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 h-10 w-full rounded-xl border-neutral-200/80 bg-neutral-50/50 focus:bg-white dark:border-neutral-800 dark:bg-neutral-900/30"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => {
 setSearch(''); handleFilter('', status, date); 
}}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-0.5 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                    >
                                        <X className="size-3.5 text-neutral-400" />
                                    </button>
                                )}
                            </div>

                            {/* Status Dropdown */}
                            <div className="w-full md:w-48">
                                <select
                                    value={status}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    className="h-10 w-full rounded-xl border border-neutral-200/80 bg-neutral-50/50 px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus:bg-white dark:border-neutral-800 dark:bg-neutral-900/30 text-neutral-800 dark:text-neutral-200"
                                >
                                    <option value="">All Statuses</option>
                                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Date Input */}
                            <div className="w-full md:w-44">
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                    className="h-10 w-full rounded-xl border border-neutral-200/80 bg-neutral-50/50 px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus:bg-white dark:border-neutral-800 dark:bg-neutral-900/30 text-neutral-800 dark:text-neutral-200"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <Button type="submit" className="h-10 rounded-xl px-4 flex-1 md:flex-none flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-700 dark:hover:bg-violet-800 transition-colors">
                                    <Filter className="size-4" />
                                    <span>Filter</span>
                                </Button>

                                {isFilterActive && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleReset}
                                        className="h-10 rounded-xl px-4 flex-1 md:flex-none border-neutral-200 hover:bg-neutral-100 text-neutral-600 dark:border-neutral-800 dark:hover:bg-neutral-800 dark:text-neutral-400"
                                    >
                                        <X className="size-4 mr-1.5" />
                                        <span>Reset</span>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Content list */}
            {appointments.data.length === 0 ? (
                <Card className="mt-6 border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 rounded-2xl">
                    <CardContent className="flex flex-col items-center gap-2 py-16">
                        <CalendarDays className="size-16 text-neutral-300 dark:text-neutral-700 animate-pulse" />
                        <p className="text-base font-medium text-neutral-700 dark:text-neutral-300">
                            No appointments found.
                        </p>
                        <p className="text-sm text-neutral-400">
                            {isFilterActive ? 'Try adjusting your search filters.' : 'There are currently no bookings in the database.'}
                        </p>
                        {isFilterActive && (
                            <Button variant="link" onClick={handleReset} className="text-violet-600 dark:text-violet-400 mt-2">
                                Clear all filters
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-neutral-100 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-900/20">
                                    <th className="px-5 py-4 text-left font-semibold text-neutral-600 dark:text-neutral-400">
                                        Customer
                                    </th>
                                    <th className="px-5 py-4 text-left font-semibold text-neutral-600 dark:text-neutral-400">
                                        Therapist
                                    </th>
                                    <th className="px-5 py-4 text-left font-semibold text-neutral-600 dark:text-neutral-400">
                                        Schedule
                                    </th>
                                    <th className="px-5 py-4 text-left font-semibold text-neutral-600 dark:text-neutral-400">
                                        Status
                                    </th>
                                    <th className="px-5 py-4 text-left font-semibold text-neutral-600 dark:text-neutral-400">
                                        Payment
                                    </th>
                                    <th className="px-5 py-4 text-left font-semibold text-neutral-600 dark:text-neutral-400">
                                        Total
                                    </th>
                                    <th className="px-5 py-4 text-right font-semibold text-neutral-600 dark:text-neutral-400">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.data.map((appointment) => {
                                    const statusConfig = STATUS_BADGES[appointment.status] || {
                                        label: appointment.status,
                                        className: 'text-neutral-700 bg-neutral-50 border-neutral-200',
                                    };
                                    const paymentConfig = PAYMENT_BADGES[appointment.payment_status] || {
                                        label: appointment.payment_status,
                                        className: 'text-neutral-700 bg-neutral-50 border-neutral-200',
                                    };

                                    return (
                                        <tr
                                            key={appointment.id}
                                            className="border-b border-neutral-100/70 last:border-b-0 hover:bg-neutral-50/30 dark:border-neutral-800 dark:hover:bg-neutral-900/20 transition-colors"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                                                    {appointment.customer.name}
                                                </div>
                                                <div className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                                                    {appointment.customer.phone_number}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 font-medium text-neutral-700 dark:text-neutral-300">
                                                {appointment.therapist.name}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="font-medium text-neutral-800 dark:text-neutral-200">
                                                    {formatDate(appointment.start_at)}
                                                </div>
                                                <div className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 flex items-center gap-1">
                                                    <Clock className="size-3 text-neutral-400" />
                                                    {formatTime(appointment.start_at)}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <Badge
                                                    variant="outline"
                                                    className={`rounded-full px-2.5 py-0.5 ${statusConfig.className}`}
                                                >
                                                    {statusConfig.label}
                                                </Badge>
                                            </td>
                                            <td className="px-5 py-4">
                                                <Badge
                                                    variant="outline"
                                                    className={`rounded-full px-2.5 py-0.5 ${paymentConfig.className}`}
                                                >
                                                    {paymentConfig.label}
                                                </Badge>
                                            </td>
                                            <td className="px-5 py-4 font-semibold text-neutral-800 dark:text-neutral-200">
                                                {formatPrice(appointment.total_price)}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-xl border-neutral-200 hover:border-violet-300 hover:bg-violet-50/30 hover:text-violet-700 dark:border-neutral-800 dark:hover:border-violet-800 dark:hover:bg-violet-950/20 dark:hover:text-violet-300 flex items-center gap-1 shadow-none transition-all"
                                                    asChild
                                                >
                                                    <Link href={appointmentsShow(appointment.id)}>
                                                        <span>View</span>
                                                        <ChevronRight className="size-3.5" />
                                                    </Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card Grid View */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {appointments.data.map((appointment) => {
                            const statusConfig = STATUS_BADGES[appointment.status] || {
                                        label: appointment.status,
                                        className: 'text-neutral-700 bg-neutral-50 border-neutral-200',
                                    };
                            const paymentConfig = PAYMENT_BADGES[appointment.payment_status] || {
                                        label: appointment.payment_status,
                                        className: 'text-neutral-700 bg-neutral-50 border-neutral-200',
                                    };

                            return (
                                <Card key={appointment.id} className="overflow-hidden border border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/40 rounded-2xl">
                                    <CardContent className="p-5">
                                        {/* Customer & Status Header */}
                                        <div className="flex items-start justify-between gap-2 border-b border-neutral-100/70 pb-3 dark:border-neutral-800">
                                            <div>
                                                <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                                                    {appointment.customer.name}
                                                </div>
                                                <div className="text-xs text-neutral-400 mt-0.5">
                                                    {appointment.customer.phone_number}
                                                </div>
                                            </div>
                                            <Badge variant="outline" className={`rounded-full ${statusConfig.className}`}>
                                                {statusConfig.label}
                                            </Badge>
                                        </div>

                                        {/* Schedule, Therapist & Payment info */}
                                        <div className="space-y-3 py-4 text-sm">
                                            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                                                <Calendar className="size-4 text-neutral-400 shrink-0" />
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                                                        {formatDate(appointment.start_at)}
                                                    </span>
                                                    <span className="text-xs text-neutral-400 mt-0.5">
                                                        {formatTime(appointment.start_at)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                                                <User className="size-4 text-neutral-400 shrink-0" />
                                                <span>
                                                    Therapist:{' '}
                                                    <strong className="font-semibold text-neutral-700 dark:text-neutral-300">
                                                        {appointment.therapist.name}
                                                    </strong>
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between border-t border-neutral-100/70 pt-3 dark:border-neutral-800">
                                                <div>
                                                    <span className="text-xs text-neutral-400 block mb-0.5">Payment</span>
                                                    <Badge variant="outline" className={`rounded-full ${paymentConfig.className}`}>
                                                        {paymentConfig.label}
                                                    </Badge>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs text-neutral-400 block mb-0.5">Total Price</span>
                                                    <span className="font-bold text-base text-neutral-800 dark:text-neutral-200">
                                                        {formatPrice(appointment.total_price)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <Button
                                            variant="secondary"
                                            className="w-full rounded-xl hover:bg-violet-50/50 hover:text-violet-700 dark:hover:bg-violet-950/20 dark:hover:text-violet-300 transition-colors flex items-center justify-center gap-1.5"
                                            asChild
                                        >
                                            <Link href={appointmentsShow(appointment.id)}>
                                                <span>View Details</span>
                                                <ArrowRight className="size-4" />
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {appointments.last_page > 1 && (
                        <div className="mt-6 flex items-center justify-center gap-1">
                            {appointments.links.map((link, i) => (
                                <Button
                                    key={i}
                                    variant={link.active ? 'default' : 'ghost'}
                                    size="sm"
                                    className={`rounded-lg ${link.active ? 'bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-850' : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'}`}
                                    asChild={link.url !== null}
                                    disabled={link.url === null}
                                >
                                    {link.url !== null ? (
                                        <Link
                                            href={link.url}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ) : (
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    )}
                                </Button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Appointments',
            href: appointmentsIndex(),
        },
    ] satisfies BreadcrumbItem[],
};
