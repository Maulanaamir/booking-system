import { Head, Link, router } from '@inertiajs/react';
import { Users } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { dashboard } from '@/routes';
import {
    create,
    edit,
    index as therapistsIndex,
    toggleActive,
} from '@/routes/admin/therapists';
import type { BreadcrumbItem } from '@/types';

type Therapist = {
    id: number;
    name: string;
    phone_number: string;
    is_active: boolean;
};

export default function Index({ therapists }: { therapists: Therapist[] }) {
    function handleToggleActive(therapist: Therapist) {
        if (
            confirm(
                `Are you sure you want to ${therapist.is_active ? 'deactivate' : 'activate'} "${therapist.name}"?`,
            )
        ) {
            router.patch(toggleActive.url(therapist.id));
        }
    }

    return (
        <>
            <Head title="Therapists" />

            <div className="flex items-center justify-between">
                <Heading
                    title="Therapists"
                    description="Manage your therapists"
                />
                <Button asChild>
                    <Link href={create()}>Create Therapist</Link>
                </Button>
            </div>

            {therapists.length === 0 ? (
                <Card className="mt-6">
                    <CardContent className="flex flex-col items-center gap-2 py-12">
                        <Users className="size-12 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            No therapists yet.
                        </p>
                        <Button asChild variant="outline">
                            <Link href={create()}>
                                Create your first therapist
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="mt-6 hidden overflow-x-auto rounded-xl border border-sidebar-border/70 bg-white md:block dark:border-sidebar-border dark:bg-neutral-900/50">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-sidebar-border/70 dark:border-sidebar-border">
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Phone
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {therapists.map((therapist) => (
                                    <tr
                                        key={therapist.id}
                                        className="border-b border-sidebar-border/70 last:border-b-0 dark:border-sidebar-border"
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            {therapist.name}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {therapist.phone_number}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                variant={
                                                    therapist.is_active
                                                        ? 'default'
                                                        : 'destructive'
                                                }
                                            >
                                                {therapist.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={edit(
                                                            therapist.id,
                                                        )}
                                                    >
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleToggleActive(
                                                            therapist,
                                                        )
                                                    }
                                                >
                                                    {therapist.is_active
                                                        ? 'Deactivate'
                                                        : 'Activate'}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card Grid View */}
                    <div className="mt-6 grid grid-cols-1 gap-4 md:hidden">
                        {therapists.map((therapist) => (
                            <Card
                                key={therapist.id}
                                className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50"
                            >
                                <div className="space-y-4 p-5">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-neutral-800 truncate text-sm font-semibold dark:text-neutral-200">
                                            {therapist.name}
                                        </h3>
                                        <Badge
                                            variant={
                                                therapist.is_active
                                                    ? 'default'
                                                    : 'destructive'
                                            }
                                            className="rounded-full px-1.5 py-0 text-[10px]"
                                        >
                                            {therapist.is_active
                                                ? 'Active'
                                                : 'Inactive'}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-neutral-50 pt-3 text-xs dark:border-neutral-800/60">
                                        <span className="text-muted-foreground">
                                            Phone Number:
                                        </span>
                                        <a
                                            href={`tel:${therapist.phone_number}`}
                                            className="text-violet-650 font-medium hover:underline dark:text-violet-400"
                                        >
                                            {therapist.phone_number}
                                        </a>
                                    </div>

                                    <div className="flex items-center gap-2 pt-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="dark:border-neutral-800 h-9 flex-1 rounded-xl border-neutral-200"
                                            asChild
                                        >
                                            <Link href={edit(therapist.id)}>
                                                Edit
                                            </Link>
                                        </Button>
                                        <Button
                                            variant={
                                                therapist.is_active
                                                    ? 'outline'
                                                    : 'default'
                                            }
                                            size="sm"
                                            className={`h-9 flex-1 rounded-xl ${
                                                therapist.is_active
                                                    ? 'dark:text-rose-400 dark:hover:bg-rose-950/10 border-rose-200 text-rose-600 shadow-none hover:bg-rose-50/30 hover:text-rose-700 dark:border-rose-900/40'
                                                    : 'border-none bg-emerald-600 text-white shadow-none hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800'
                                            }`}
                                            onClick={() =>
                                                handleToggleActive(therapist)
                                            }
                                        >
                                            {therapist.is_active
                                                ? 'Deactivate'
                                                : 'Activate'}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </>
            )}
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Therapists', href: therapistsIndex() },
    ] satisfies BreadcrumbItem[],
};
