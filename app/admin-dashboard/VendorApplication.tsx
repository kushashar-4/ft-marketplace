'use client';

import { createClient } from "@/lib/supabase/client";

type VendorApplication = {
    id: number,
    name: string,
    location: string,
    slug: string
}

interface VendorApplicationProps {
    application: VendorApplication
}

export default function VendorApplication({ application }: VendorApplicationProps) {
    const supabase = createClient();

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col gap-3 max-w-md w-full hover:shadow-2xl transition-all duration-200">
            <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2">{application.name}</h2>
            <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500 dark:text-gray-400">Location:</span>
                <span className="text-lg font-medium text-gray-800 dark:text-gray-100">{application.location}</span>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500 dark:text-gray-400">Slug:</span>
                <span className="text-lg font-mono text-gray-700 dark:text-gray-200">{application.slug}</span>
            </div>
        </div>
    );
}
