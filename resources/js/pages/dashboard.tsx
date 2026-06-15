import { Head, Link } from '@inertiajs/react';
import { 
    CalendarDays, 
    Clock, 
    CreditCard, 
    BadgeCheck, 
    Users, 
    ClipboardList, 
    Calendar,
    ChevronRight,
    Leaf
} from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';
import {
    index as appointmentsIndex,
    show as appointmentsShow,
} from '@/routes/admin/appointments';
import { index as servicesIndex } from '@/routes/admin/services';
import { index as therapistsIndex } from '@/routes/admin/therapists';
import type { BreadcrumbItem } from '@/types';

type DashboardStats = {
    total_appointments: number;
    pending_approval_count: number;
    pending_dp_count: number;
    confirmed_count: number;
    completed_count: number;
};

type UpcomingAppointmentItem = {
    id: string;
    customer: {
        id: number;
        name: string;
        phone_number: string;
    };
    therapist: {
        id: number;
        name: string;
    };
    start_at: string;
    status: string;
    payment_status: string;
    total_price: number;
};

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
    pending_approval: {
        label: 'Pending Approval',
        className: 'text-amber-700 bg-amber-50 border-amber-200/60 dark:text-amber-400 dark:bg-amber-955/20 dark:border-amber-900/40 font-medium',
    },
    pending_dp: {
        label: 'Pending DP',
        className: 'text-orange-700 bg-orange-50 border-orange-200/60 dark:text-orange-400 dark:bg-orange-955/20 dark:border-orange-900/40 font-medium',
    },
    confirmed: {
        label: 'Confirmed',
        className: 'text-emerald-700 bg-emerald-50 border-emerald-200/60 dark:text-emerald-450 dark:bg-emerald-955/20 dark:border-emerald-900/40 font-medium',
    },
    completed: {
        label: 'Completed',
        className: 'text-blue-700 bg-blue-50 border-blue-200/60 dark:text-blue-455 dark:bg-blue-955/20 dark:border-blue-900/40 font-medium',
    },
    cancelled: {
        label: 'Cancelled',
        className: 'text-rose-700 bg-rose-50 border-rose-200/60 dark:text-rose-455 dark:bg-rose-955/20 dark:border-rose-900/40 font-medium',
    },
    expired: {
        label: 'Expired',
        className: 'text-gray-600 bg-gray-50 border-gray-200/60 dark:text-gray-450 dark:bg-gray-955/20 dark:border-gray-900/40 font-medium',
    },
};

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
    });
}

function formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function Dashboard({
    stats = {
        total_appointments: 0,
        pending_approval_count: 0,
        pending_dp_count: 0,
        confirmed_count: 0,
        completed_count: 0,
    },
    upcomingAppointments = [],
}: {
    stats?: DashboardStats;
    upcomingAppointments?: UpcomingAppointmentItem[];
}) {
    return (
        <>
            <Head title="Dashboard" />

            <div className="flex items-center justify-between mb-4">
                <Heading
                    title="Dashboard"
                    description="Operational overview of Home Care Therapy bookings"
                />
            </div>

            {/* Main Dashboard Workspace */}
            <div className="flex h-full flex-1 flex-col gap-6">
                
                {/* Stats Cards Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Total Bookings */}
                    <Card className="border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 rounded-2xl overflow-hidden">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                                    Total Bookings
                                </span>
                                <span className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 block">
                                    {stats.total_appointments}
                                </span>
                                <span className="text-[10px] text-muted-foreground block">
                                    All-time cumulative bookings
                                </span>
                            </div>
                            <div className="p-3 bg-violet-50 dark:bg-violet-955/20 text-violet-650 dark:text-violet-400 rounded-2xl">
                                <CalendarDays className="size-5" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pending Approvals */}
                    <Card className="border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 rounded-2xl overflow-hidden">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                                    Pending Approval
                                </span>
                                <span className="text-2xl font-bold text-amber-700 dark:text-amber-400 block">
                                    {stats.pending_approval_count}
                                </span>
                                <span className="text-[10px] text-muted-foreground block">
                                    Awaiting administrator review
                                </span>
                            </div>
                            <div className="p-3 bg-amber-50 dark:bg-amber-955/20 text-amber-600 dark:text-amber-400 rounded-2xl">
                                <Clock className="size-5" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pending Deposit */}
                    <Card className="border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 rounded-2xl overflow-hidden">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                                    Pending Deposit
                                </span>
                                <span className="text-2xl font-bold text-orange-700 dark:text-orange-450 block">
                                    {stats.pending_dp_count}
                                </span>
                                <span className="text-[10px] text-muted-foreground block">
                                    Awaiting client DP confirmation
                                </span>
                            </div>
                            <div className="p-3 bg-orange-50 dark:bg-orange-955/20 text-orange-600 dark:text-orange-400 rounded-2xl">
                                <CreditCard className="size-5" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Confirmed Upcoming */}
                    <Card className="border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 rounded-2xl overflow-hidden">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                                    Confirmed / Active
                                </span>
                                <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-450 block">
                                    {stats.confirmed_count}
                                </span>
                                <span className="text-[10px] text-muted-foreground block">
                                    Scheduled sessions upcoming
                                </span>
                            </div>
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-955/20 text-emerald-600 dark:text-emerald-450 rounded-2xl">
                                <BadgeCheck className="size-5" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Secondary operational splits */}
                <div className="grid gap-6 lg:grid-cols-3">
                    
                    {/* Upcoming / Active Bookings list */}
                    <Card className="lg:col-span-2 border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 rounded-2xl">
                        <CardHeader className="pb-3 flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                                Upcoming &amp; Active Bookings
                            </CardTitle>
                            <Button variant="link" className="text-violet-600 dark:text-violet-400 p-0 h-auto font-medium" asChild>
                                <Link href={appointmentsIndex()}>View All</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {upcomingAppointments.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground text-sm italic">
                                    No upcoming active appointments.
                                </div>
                            ) : (
                                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {upcomingAppointments.map((app) => (
                                        <div key={app.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-semibold text-neutral-805 dark:text-neutral-200 truncate">
                                                        {app.customer.name}
                                                    </span>
                                                    <Badge variant="outline" className={`rounded-full text-[10px] px-1.5 py-0 ${
                                                        STATUS_BADGES[app.status]?.className || ''
                                                    }`}>
                                                        {STATUS_BADGES[app.status]?.label || app.status}
                                                    </Badge>
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="size-3 text-neutral-450" />
                                                        {formatDate(app.start_at)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="size-3 text-neutral-450" />
                                                        {formatTime(app.start_at)}
                                                    </span>
                                                    <span className="text-neutral-400 dark:text-neutral-500 font-medium">
                                                        Therapist: {app.therapist.name}
                                                    </span>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-xl border-neutral-200 hover:border-violet-300 hover:bg-violet-50/20 hover:text-violet-750 dark:border-neutral-800 shrink-0 flex items-center gap-1 shadow-none transition-all"
                                                asChild
                                            >
                                                <Link href={appointmentsShow(app.id)}>
                                                    <span>View</span>
                                                    <ChevronRight className="size-3.5" />
                                                </Link>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick navigation actions panel */}
                    <div className="space-y-6">
                        <Card className="border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 rounded-2xl">
                            <CardHeader className="pb-3 flex flex-row items-center justify-between">
                                <CardTitle className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                                    Quick Directory Access
                                </CardTitle>
                                <Leaf className="size-4 text-violet-500" />
                            </CardHeader>
                            <CardContent className="grid gap-3">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start h-12 rounded-xl border-neutral-150 hover:bg-violet-50/30 hover:text-violet-750 dark:border-neutral-850 dark:hover:bg-violet-955/20 text-neutral-700 dark:text-neutral-350 transition-colors"
                                    asChild
                                >
                                    <Link href={appointmentsIndex()}>
                                        <Calendar className="size-4 mr-2.5 text-violet-500 shrink-0" />
                                        <span className="font-semibold text-sm">Appointments Ledger</span>
                                    </Link>
                                </Button>
                                
                                <Button
                                    variant="outline"
                                    className="w-full justify-start h-12 rounded-xl border-neutral-150 hover:bg-emerald-50/30 hover:text-emerald-750 dark:border-neutral-850 dark:hover:bg-emerald-955/20 text-neutral-700 dark:text-neutral-350 transition-colors"
                                    asChild
                                >
                                    <Link href={servicesIndex()}>
                                        <ClipboardList className="size-4 mr-2.5 text-emerald-500 shrink-0" />
                                        <span className="font-semibold text-sm">Services Configuration</span>
                                    </Link>
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full justify-start h-12 rounded-xl border-neutral-150 hover:bg-amber-50/30 hover:text-amber-750 dark:border-neutral-850 dark:hover:bg-amber-955/20 text-neutral-700 dark:text-neutral-350 transition-colors"
                                    asChild
                                >
                                    <Link href={therapistsIndex()}>
                                        <Users className="size-4 mr-2.5 text-amber-500 shrink-0" />
                                        <span className="font-semibold text-sm">Therapists Registry</span>
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Completed Sessions Count Card */}
                        <Card className="border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 rounded-2xl overflow-hidden">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                                        Completed Sessions
                                    </span>
                                    <span className="text-xl font-bold text-neutral-700 dark:text-neutral-300 block">
                                        {stats.completed_count} sessions
                                    </span>
                                    <span className="text-[10px] text-muted-foreground block">
                                        Total therapies completed successfully
                                    </span>
                                </div>
                                <div className="p-2.5 bg-neutral-100 dark:bg-neutral-850 text-neutral-550 dark:text-neutral-400 rounded-xl">
                                    <BadgeCheck className="size-4" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ] satisfies BreadcrumbItem[],
};
