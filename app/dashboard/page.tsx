import { createClient, getTableData } from "@/lib/supabase/server";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { getAuth } from "@/lib/supabase/server";

type Vendor = {
    id: number,
    name: string,
    location: string,
    slug: string
}

export default async function Dashboard() {
    const user = await getAuth();
    const vendors = await getTableData('vendors', 'manager', user?.id);

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
                </nav>
                <section className="w-full max-w-xl mt-16 flex flex-col items-center gap-8">
                    <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-2">Dashboard</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-6">Your Food Trucks</p>
                    <div className="space-y-4 w-full">
                        {vendors && vendors.length > 0 ? (
                            vendors.map((vendor: Vendor) => (
                                <Link
                                    key={vendor.id}
                                    href={`/dashboard/${vendor.slug}`}
                                    className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-300 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-300"
                                >
                                    <span className="text-xl font-semibold">{vendor.name}</span>
                                    {vendor.location && (
                                        <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">{vendor.location}</span>
                                    )}
                                </Link>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 dark:text-gray-400">No vendors found</p>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}