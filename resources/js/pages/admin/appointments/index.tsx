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
    ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { STATUS_BADGES, PAYMENT_BADGES } from '@/lib/admin-colors';
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
    dp_amount?: number;
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

    const handleFilter = (
        newSearch = search,
        newStatus = status,
        newDate = date,
    ) => {
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
        router.get(
            appointmentsIndex().url,
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
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
            <Card className="mb-6 rounded-2xl border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                <CardContent className="p-4 md:p-6">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="flex flex-col gap-4"
                    >
                        <div className="flex flex-col gap-3 md:flex-row md:items-center">
                            {/* Search Input */}
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                                <Input
                                    type="text"
                                    placeholder="Search customer name, phone, or therapist..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-10 w-full rounded-xl border-neutral-200/80 bg-neutral-50/50 pl-9 focus:bg-white dark:border-neutral-800 dark:bg-neutral-900/30"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch('');
                                            handleFilter('', status, date);
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
                                    onChange={(e) =>
                                        handleStatusChange(e.target.value)
                                    }
                                    className="h-10 w-full rounded-xl border border-neutral-200/80 bg-neutral-50/50 px-3 py-1 text-sm text-neutral-800 shadow-xs transition-[color,box-shadow] outline-none focus:bg-white focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:border-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-200"
                                >
                                    <option value="">All Statuses</option>
                                    {Object.entries(STATUS_LABELS).map(
                                        ([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ),
                                    )}
                                </select>
                            </div>

                            {/* Date Input */}
                            <div className="w-full md:w-44">
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) =>
                                        handleDateChange(e.target.value)
                                    }
                                    className="h-10 w-full rounded-xl border border-neutral-200/80 bg-neutral-50/50 px-3 py-1 text-sm text-neutral-800 shadow-xs transition-[color,box-shadow] outline-none focus:bg-white focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:border-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-200"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex w-full gap-2 md:w-auto">
                                <Button
                                    type="submit"
                                    className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-white transition-colors hover:bg-violet-700 md:flex-none dark:bg-violet-700 dark:hover:bg-violet-800"
                                >
                                    <Filter className="size-4" />
                                    <span>Filter</span>
                                </Button>

                                {isFilterActive && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleReset}
                                        className="h-10 flex-1 rounded-xl border-neutral-200 px-4 text-neutral-600 hover:bg-neutral-100 md:flex-none dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
                                    >
                                        <X className="mr-1.5 size-4" />
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
                <Card className="mt-6 rounded-2xl border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                    <CardContent className="flex flex-col items-center gap-2 py-16">
                        <CalendarDays className="size-16 animate-pulse text-neutral-300 dark:text-neutral-700" />
                        <p className="text-base font-medium text-neutral-700 dark:text-neutral-300">
                            No appointments found.
                        </p>
                        <p className="text-sm text-neutral-400">
                            {isFilterActive
                                ? 'Try adjusting your search filters.'
                                : 'There are currently no bookings in the database.'}
                        </p>
                        {isFilterActive && (
                            <Button
                                variant="link"
                                onClick={handleReset}
                                className="mt-2 text-violet-600 dark:text-violet-400"
                            >
                                Clear all filters
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm md:block dark:border-neutral-800 dark:bg-neutral-900/50">
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
                                    const statusConfig = STATUS_BADGES[
                                        appointment.status
                                    ] || {
                                        label: appointment.status,
                                        className:
                                            'text-neutral-700 bg-neutral-50 border-neutral-200',
                                    };
                                    const paymentConfig = PAYMENT_BADGES[
                                        appointment.payment_status
                                    ] || {
                                        label: appointment.payment_status,
                                        className:
                                            'text-neutral-700 bg-neutral-50 border-neutral-200',
                                    };

                                    return (
                                        <tr
                                            key={appointment.id}
                                            className="border-b border-neutral-100/70 transition-colors last:border-b-0 hover:bg-neutral-50/30 dark:border-neutral-800 dark:hover:bg-neutral-900/20"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                                                    {appointment.customer.name}
                                                </div>
                                                <div className="mt-0.5 text-xs text-neutral-400 dark:text-neutral-500">
                                                    {
                                                        appointment.customer
                                                            .phone_number
                                                    }
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 font-medium text-neutral-700 dark:text-neutral-300">
                                                {appointment.therapist.name}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="font-medium text-neutral-800 dark:text-neutral-200">
                                                    {formatDate(
                                                        appointment.start_at,
                                                    )}
                                                </div>
                                                <div className="mt-1 flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500">
                                                    <Clock className="size-3 text-neutral-400" />
                                                    {formatTime(
                                                        appointment.start_at,
                                                    )}
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
                                                {formatPrice(
                                                    appointment.total_price,
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex items-center gap-1 rounded-xl border-neutral-200 shadow-none transition-all hover:border-violet-300 hover:bg-violet-50/30 hover:text-violet-700 dark:border-neutral-800 dark:hover:border-violet-800 dark:hover:bg-violet-950/20 dark:hover:text-violet-300"
                                                    asChild
                                                >
                                                    <Link
                                                        href={appointmentsShow(
                                                            appointment.id,
                                                        )}
                                                    >
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
                            const statusConfig = STATUS_BADGES[
                                appointment.status
                            ] || {
                                label: appointment.status,
                                className:
                                    'text-neutral-700 bg-neutral-50 border-neutral-200',
                            };
                            const paymentConfig = PAYMENT_BADGES[
                                appointment.payment_status
                            ] || {
                                label: appointment.payment_status,
                                className:
                                    'text-neutral-700 bg-neutral-50 border-neutral-200',
                            };

                            return (
                                <Card
                                    key={appointment.id}
                                    className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/40"
                                >
                                    <CardContent className="p-5">
                                        {/* Customer & Status Header */}
                                        <div className="flex items-start justify-between gap-2 border-b border-neutral-100/70 pb-3 dark:border-neutral-800">
                                            <div>
                                                <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                                                    {appointment.customer.name}
                                                </div>
                                                <div className="mt-0.5 text-xs text-neutral-400">
                                                    {
                                                        appointment.customer
                                                            .phone_number
                                                    }
                                                </div>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className={`rounded-full ${statusConfig.className}`}
                                            >
                                                {statusConfig.label}
                                            </Badge>
                                        </div>

                                        {/* Schedule, Therapist & Payment info */}
                                        <div className="space-y-3 py-4 text-sm">
                                            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                                                <Calendar className="size-4 shrink-0 text-neutral-400" />
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                                                        {formatDate(
                                                            appointment.start_at,
                                                        )}
                                                    </span>
                                                    <span className="mt-0.5 text-xs text-neutral-400">
                                                        {formatTime(
                                                            appointment.start_at,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                                                <User className="size-4 shrink-0 text-neutral-400" />
                                                <span>
                                                    Therapist:{' '}
                                                    <strong className="font-semibold text-neutral-700 dark:text-neutral-300">
                                                        {
                                                            appointment
                                                                .therapist.name
                                                        }
                                                    </strong>
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between border-t border-neutral-100/70 pt-3 dark:border-neutral-800">
                                                <div>
                                                    <span className="mb-0.5 block text-xs text-neutral-400">
                                                        Payment
                                                    </span>
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        <Badge
                                                            variant="outline"
                                                            className={`rounded-full ${paymentConfig.className}`}
                                                        >
                                                            {
                                                                paymentConfig.label
                                                            }
                                                        </Badge>
                                                        {appointment.dp_amount !==
                                                            undefined &&
                                                            appointment.dp_amount >
                                                                0 && (
                                                                <span className="text-[10px] font-medium text-muted-foreground">
                                                                    (DP:{' '}
                                                                    {formatPrice(
                                                                        appointment.dp_amount,
                                                                    )}
                                                                    )
                                                                </span>
                                                            )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="mb-0.5 block text-xs text-neutral-400">
                                                        Total Price
                                                    </span>
                                                    <span className="text-base font-bold text-neutral-800 dark:text-neutral-200">
                                                        {formatPrice(
                                                            appointment.total_price,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <Button
                                            variant="secondary"
                                            className="flex w-full items-center justify-center gap-1.5 rounded-xl transition-colors hover:bg-violet-50/50 hover:text-violet-700 dark:hover:bg-violet-950/20 dark:hover:text-violet-300"
                                            asChild
                                        >
                                            <Link
                                                href={appointmentsShow(
                                                    appointment.id,
                                                )}
                                            >
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
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-1">
                            {appointments.links.map((link, i) => (
                                <Button
                                    key={i}
                                    variant={link.active ? 'default' : 'ghost'}
                                    size="sm"
                                    className={`rounded-lg ${link.active ? 'dark:hover:bg-violet-800 bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-700' : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'}`}
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
