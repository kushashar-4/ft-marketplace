import { getAuth, getTableData } from "@/lib/supabase/server";
import VendorApplication from "./VendorApplication";
import Link from 'next/link';

export default async function AdminDashboard() {
    const user = await getAuth();
    const admins = await getTableData('administrators', 'admin_id', user?.id);
    const applications = await getTableData('vendor_applications');

    if(admins?.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">Access Denied</h1>
            </div>
        );
    } else if (applications?.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <h1 className="text-2xl font-bold text-gray-600 dark:text-gray-400">No Vendor Applications Found</h1>
            </div>
        );
    } return (
        <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-950 via-gray-900 to-gray-950 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
                <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
                    <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                        <div className="flex gap-5 items-center font-semibold text-blue-700 dark:text-blue-300">
                            <Link href="/" className="text-2xl tracking-tight font-bold hover:text-blue-900 dark:hover:text-blue-200 transition">NYC Food Truck Market</Link>
                        </div>
                    </div>
                </nav>
                <section className="w-full max-w-xl mt-16 flex flex-col items-center gap-8">
                    <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-2">Admin Dashboard</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-6">View Food Truck Applications</p>
                    {applications?.map((application) => (
                        <VendorApplication application={application} key={application.id} />
                    ))}
                </section>
            </div>
        </main>
    );
}