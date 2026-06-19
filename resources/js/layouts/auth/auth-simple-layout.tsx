import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-violet-50/30 p-6 dark:bg-neutral-950/60 md:p-10">
            <div className="w-full max-w-md">
                <Card className="rounded-2xl border border-neutral-100 bg-white shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900/40">
                    <CardHeader className="flex flex-col items-center gap-4 px-8 pt-8 pb-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                                <AppLogoIcon className="size-5 text-primary-foreground" />
                            </div>
                        </Link>
                        <div className="space-y-1.5 text-center mt-2">
                            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                                {title}
                            </h1>
                            <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                                {description}
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 pt-2">
                        {children}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
