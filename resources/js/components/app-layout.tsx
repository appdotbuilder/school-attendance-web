import React from 'react';
import { AppHeader } from '@/components/app-header';
import { usePage } from '@inertiajs/react';

interface AuthUser {
    id: number;
    name: string;
    email: string;
}

interface PageProps {
    auth?: {
        user?: AuthUser;
    };
    [key: string]: unknown;
}

interface Props {
    children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
    const { auth } = usePage<PageProps>().props;

    if (!auth?.user) {
        // For guests, just show the content without sidebar
        return (
            <div className="min-h-screen bg-gray-50">
                {children}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AppHeader />
            <main className="pt-16">
                {children}
            </main>
        </div>
    );
}