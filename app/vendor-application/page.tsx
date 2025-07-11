"use client";

import { useState } from "react";
import { getAuth, insertTableData } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function VendorApplication() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [location, setLocation] = useState("");
    const [cuisine, setCuisine] = useState("");
    const [manager, setManager] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const authData = await getAuth();
        const manager = authData?.id;

        await insertTableData('vendor_applications', { name, slug, location, manager, cuisine });

        await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: 'kushashar13@gmail.com', subject: `New Vendor Application: ${name}`, text: `Name: ${name}\nSlug: ${slug}\nLocation: ${location}\nManager: ${manager}\nCuisine: ${cuisine}`, html: `<strong>Name:</strong> ${name}<br><strong>Slug:</strong> ${slug}<br><strong>Location:</strong> ${location}<br><strong>Manager:</strong> ${manager}<br><strong>Cuisine:</strong> ${cuisine}` }),
        })

        setName("");
        setSlug("");
        setLocation("");
        setCuisine("");
        setLoading(false);

        router.push('/vendor-application/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-gray-900 to-gray-950 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col gap-3 max-w-md w-full hover:shadow-2xl transition-all duration-200">
                <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2">Vendor Application</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Vendor Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Slug</label>
                        <input type="text" value={slug} onChange={e => setSlug(e.target.value)} required className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Location</label>
                        <input type="text" value={location} onChange={e => setLocation(e.target.value)} required className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Cuisine</label>
                        <input type="text" value={cuisine} onChange={e => setCuisine(e.target.value)} required className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
                    </div>
                    <button type="submit" disabled={loading} className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded transition disabled:opacity-50">
                        {loading ? "Submitting..." : "Submit Application"}
                    </button>
                </form>
            </div>
        </div>
    );
}