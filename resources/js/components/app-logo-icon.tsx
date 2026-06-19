import { Leaf } from 'lucide-react';
import type { ComponentProps } from 'react';

export default function AppLogoIcon({ className, ...props }: ComponentProps<typeof Leaf>) {
    return (
        <Leaf className={className} {...props} />
    );
}
