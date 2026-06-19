import { Form, Head, Link } from '@inertiajs/react';
import TherapistController from '@/actions/App/Http/Controllers/Admin/TherapistController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes';
import { index as therapistsIndex } from '@/routes/admin/therapists';
import type { BreadcrumbItem } from '@/types';

export default function Create() {
    return (
        <>
            <Head title="Create Therapist" />

            <div className="flex items-center justify-between">
                <Heading
                    title="Create Therapist"
                    description="Add a new therapist"
                />
                <Button variant="ghost" asChild>
                    <Link href={therapistsIndex()}>Back</Link>
                </Button>
            </div>

            <div className="mt-6 max-w-xl">
                <Form
                    {...TherapistController.store.form()}
                    resetOnSuccess
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    placeholder="Therapist name"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone_number">
                                    Phone Number
                                </Label>
                                <Input
                                    id="phone_number"
                                    name="phone_number"
                                    required
                                    placeholder="+62 812 3456 7890"
                                />
                                <InputError message={errors.phone_number} />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    className="w-full sm:w-auto"
                                >
                                    {processing
                                        ? 'Creating...'
                                        : 'Create Therapist'}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Therapists', href: therapistsIndex() },
        { title: 'Create Therapist', href: therapistsIndex() },
    ] satisfies BreadcrumbItem[],
};
