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
                <div className="mt-6 overflow-x-auto rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
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
                                                <Link href={edit(therapist.id)}>
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
