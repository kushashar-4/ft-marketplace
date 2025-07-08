"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Vendors() {
    const supabase = createClient();
    const [vendors, setVendors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [cuisineQuery, setCuisineQuery] = useState("")

    useEffect(() => {
        const fetchVendors = async () => {
            const { data } = await supabase.from('vendors').select();
            setVendors(data || []);
            setLoading(false);
        };
        fetchVendors();
    }, []);

    return (
        <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-950 via-gray-900 to-gray-950 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
                <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
                    <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                        <div className="flex gap-5 items-center font-semibold text-blue-700 dark:text-blue-300">
                            <Link href={"/"} className="text-2xl tracking-tight font-bold hover:text-blue-900 dark:hover:text-blue-200 transition">NYC Food Truck Market</Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <ThemeSwitcher />
                        </div>
                    </div>
                    <input type="text" onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search vendors..." className="w-full max-w-xs p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition" />
                </nav>
                <section className="w-full max-w-xl mt-16 flex flex-col items-center gap-8">
                    <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-2">Vendors</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-6">Browse all available food trucks below.</p>
                    {loading ? (
                        <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
                    ) : (
                        <ul className="space-y-4 w-full">
                            {vendors.length > 0 ? (
                                vendors.filter(vendor => vendor.name.toLowerCase().includes(searchQuery.toLowerCase())).map((vendor: any) => (
                                    <li key={vendor.id}>
                                        <Link
                                            href={`/vendors/${vendor.slug}`}
                                            className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-300 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-300"
                                        >
                                            <span className="text-xl font-semibold">{vendor.name}</span>
                                            {vendor.location && (
                                                <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">{vendor.location}</span>
                                            )}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li className="text-center text-gray-500 dark:text-gray-400">No vendors found.</li>
                            )}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
}