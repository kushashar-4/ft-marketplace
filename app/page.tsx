import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {redirect} from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default async function Home() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const { data: vendors } = await supabase.from('vendors').select().eq("manager", authData?.user?.id);
  const isManager = vendors && vendors.length > 0;

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
              {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
            </div>
          </div>
        </nav>
        <section className="w-full max-w-xl mt-16 flex flex-col items-center gap-8">
          <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-2">Welcome to the NYC Food Truck Marketplace</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-6">Discover, order, and manage food trucks all in one place.</p>
          <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
            {isManager && (
              <Link href="/dashboard" className="w-full md:w-auto">
                <Button className="w-full md:w-auto bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow dark:bg-blue-800 dark:hover:bg-blue-900">Dashboard</Button>
              </Link>
            )}
            <Link href="/vendors" className="w-full md:w-auto">
              <Button className="w-full md:w-auto bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold border border-blue-300 shadow dark:bg-gray-800 dark:text-blue-200 dark:border-blue-900 dark:hover:bg-gray-700">Browse Vendors</Button>
            </Link>
          </div>
        </section>
      </div>
      <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-8 text-gray-400 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
        <p>
          Powered by <a href="https://supabase.com/" target="_blank" className="font-bold hover:underline text-blue-700 dark:text-blue-300" rel="noreferrer">Supabase</a>
        </p>
      </footer>
    </main>
  );
}
