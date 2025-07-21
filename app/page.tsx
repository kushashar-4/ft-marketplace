import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAuth, getTableData } from "@/lib/supabase/server";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default async function Home() {
  const user = await getAuth();
  let vendors = [];
  let admins = [];

  if(user) {
    vendors = (await getTableData('vendors', 'manager', user.id)) ?? [];
    admins = (await getTableData('administrators', 'admin_id', user.id)) ?? [];
  }

  const isManager = vendors && vendors.length > 0;
  const isAdmin = admins && admins.length > 0;

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-950 via-gray-900 to-gray-950 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      <div className="flex-1 w-full flex flex-col gap-12 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 bg-white/80 dark:bg-gray-900/80 backdrop-blur sticky top-0 z-20">
          <div className="w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center p-2 sm:p-3 px-2 sm:px-5 text-sm gap-2 sm:gap-0">
            <div className="flex gap-3 sm:gap-5 items-center font-semibold text-blue-700 dark:text-blue-300 w-full sm:w-auto justify-center sm:justify-start">
              <Link href={"/"} className="text-xl sm:text-2xl tracking-tight font-bold hover:text-blue-900 dark:hover:text-blue-200 transition whitespace-nowrap">NYC Food Truck Market</Link>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center sm:justify-end">
              <ThemeSwitcher />
              {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
            </div>
          </div>
        </nav>
        <section className="w-full max-w-xl mt-10 sm:mt-16 flex flex-col items-center gap-6 sm:gap-8 px-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-2">Welcome to the NYC Food Truck Marketplace</h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 text-center mb-4 sm:mb-6">Discover, order, and manage food trucks all in one place.</p>
          <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-xs mx-auto justify-center items-center">
            {!user && (
              <Link href="/auth" className="w-full">
                <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white shadow dark:bg-blue-800 dark:hover:bg-blue-900 py-3 text-base sm:text-lg">Sign In / Sign Up</Button>
              </Link>
            )}
            {isManager && (
              <Link href="/dashboard" className="w-full">
                <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white shadow dark:bg-blue-800 dark:hover:bg-blue-900 py-3 text-base sm:text-lg">Vendor Dashboard</Button>
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin-dashboard" className="w-full">
                <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white shadow dark:bg-blue-800 dark:hover:bg-blue-900 py-3 text-base sm:text-lg">Admin Dashboard</Button>
              </Link>
            )}
            <Link href="/vendors" className="w-full">
              <Button className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-300 shadow dark:bg-gray-800 dark:text-blue-200 dark:border-blue-900 dark:hover:bg-gray-700 py-3 text-base sm:text-lg">Browse Vendors</Button>
            </Link>
            <Link href="/vendor-application" className="w-full">
              <Button className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-300 shadow dark:bg-gray-800 dark:text-blue-200 dark:border-blue-900 dark:hover:bg-gray-700 py-3 text-base sm:text-lg">Apply to be a Vendor</Button>
            </Link>
          </div>
        </section>
      </div>
      <footer className="w-full flex flex-col sm:flex-row items-center justify-center border-t mx-auto text-center text-xs gap-4 sm:gap-8 py-6 sm:py-8 text-gray-400 bg-white/80 dark:bg-gray-900/80 backdrop-blur px-2">
        <p>
          Powered by <a href="https://supabase.com/" target="_blank" className="font-bold hover:underline text-blue-700 dark:text-blue-300" rel="noreferrer">Supabase</a>
        </p>
      </footer>
    </main>
  );
}
