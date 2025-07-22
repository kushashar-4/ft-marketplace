'use client';

import { deleteTableData, insertTableData } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import type { VendorApplication } from "@/lib/globalTypes";

interface VendorApplicationProps {
    application: VendorApplication
}

export default function VendorApplication({ application }: VendorApplicationProps) {
    const handleSubmit = async (isAccepted: boolean) => {
        if(isAccepted) {
            await insertTableData('vendors', {
                name: application.name,
                location: application.location,
                slug: application.slug,
                manager: application.manager,
                manager_email: application.manager_email
            });

            await deleteTableData('vendor_applications', 'id', application.id)
        } else {
            await deleteTableData('vendor_applications', 'id', application.id)
        }

        window.location.reload();
    }

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
            <div className="flex gap-4 mt-4">
                <Button
                    onClick={() => handleSubmit(true)}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition-colors"
                >
                    Accept Application
                </Button>
                <Button
                    onClick={() => handleSubmit(false)}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition-colors"
                >
                    Decline Application
                </Button>
            </div>
        </div>
    );
}
