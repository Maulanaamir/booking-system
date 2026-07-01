// Centralized Admin Color Mapping system using static Tailwind strings

export type BadgeConfig = {
    label: string;
    className: string;
};

export const STATUS_BADGES: Record<string, BadgeConfig> = {
    pending_approval: {
        label: 'Pending Approval',
        className: 'text-amber-700 bg-amber-50 border-amber-200/60 dark:text-amber-400 dark:bg-amber-950/20 dark:border-amber-900/40 font-semibold',
    },
    pending_dp: {
        label: 'Pending DP',
        className: 'text-amber-700 bg-amber-50 border-amber-200/60 dark:text-amber-400 dark:bg-amber-950/20 dark:border-amber-900/40 font-semibold',
    },
    confirmed: {
        label: 'Confirmed',
        className: 'text-emerald-700 bg-emerald-50 border-emerald-200/60 dark:text-emerald-400 dark:bg-emerald-950/20 dark:border-emerald-900/40 font-semibold',
    },
    completed: {
        label: 'Completed',
        className: 'text-emerald-700 bg-emerald-50 border-emerald-200/60 dark:text-emerald-400 dark:bg-emerald-950/20 dark:border-emerald-900/40 font-semibold',
    },
    cancelled: {
        label: 'Cancelled',
        className: 'text-rose-700 bg-rose-50 border-rose-200/60 dark:text-rose-400 dark:bg-rose-950/20 dark:border-rose-900/40 font-semibold',
    },
    expired: {
        label: 'Expired',
        className: 'text-rose-700 bg-rose-50 border-rose-200/60 dark:text-rose-400 dark:bg-rose-950/20 dark:border-rose-900/40 font-semibold',
    },
};

export const PAYMENT_BADGES: Record<string, BadgeConfig> = {
    unpaid: {
        label: 'Unpaid',
        className: 'text-neutral-600 bg-neutral-100 border-neutral-200/60 dark:text-neutral-400 dark:bg-neutral-900/30 dark:border-neutral-700/40 font-semibold',
    },
    dp_pending: {
        label: 'DP Pending',
        className: 'text-amber-700 bg-amber-50 border-amber-200/60 dark:text-amber-400 dark:bg-amber-950/20 dark:border-amber-900/40 font-semibold',
    },
    dp_paid: {
        label: 'DP Paid',
        className: 'text-emerald-700 bg-emerald-50 border-emerald-200/60 dark:text-emerald-400 dark:bg-emerald-950/20 dark:border-emerald-900/40 font-semibold',
    },
    fully_paid: {
        label: 'Fully Paid',
        className: 'text-emerald-700 bg-emerald-50 border-emerald-200/60 dark:text-emerald-400 dark:bg-emerald-950/20 dark:border-emerald-900/40 font-semibold',
    },
    expired: {
        label: 'Expired',
        className: 'text-orange-700 bg-orange-50 border-orange-200/60 dark:text-orange-400 dark:bg-orange-950/20 dark:border-orange-900/40 font-semibold',
    },
    failed: {
        label: 'Failed',
        className: 'text-rose-700 bg-rose-50 border-rose-200/60 dark:text-rose-400 dark:bg-rose-950/20 dark:border-rose-900/40 font-semibold',
    },
    cancelled: {
        label: 'Cancelled',
        className: 'text-rose-700 bg-rose-50 border-rose-200/60 dark:text-rose-400 dark:bg-rose-950/20 dark:border-rose-900/40 font-semibold',
    },
};
