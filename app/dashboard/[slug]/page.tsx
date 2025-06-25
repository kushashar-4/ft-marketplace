"use client";

import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function VendorPage() {
    const params = useParams();
    const slug = params.slug as string;
    const supabase = createClient();

    const [vendor, setVendor] = useState<any>();
    const [orders, setOrders] = useState<any>([]);
    const [orderItems, setOrderItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data: authData, error: authError } = await supabase.auth.getUser();
            if (authError) throw authError;
            const { data: vendorData, error: vendorError } = await supabase.from('vendors').select().eq("slug", slug).single();
            if (vendorError) throw vendorError;
            if(vendorData && vendorData.manager !== authData?.user?.id) {
                window.location.href = '/';
                return;
            }
            setVendor(vendorData);

            const { data: orderData, error: orderError } = await supabase.from('orders').select().eq("vendor_id", vendorData.id);
            if (orderError) throw orderError;
            setOrders(orderData);

            const { data: orderItemsData, error: orderItemsError } = await supabase.from('order_items').select();
            if (orderItemsError) throw orderItemsError;
            setOrderItems(orderItemsData || []);
        } catch (err: any) {
            setError(err.message || "An error occurred fetching data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (slug) fetchData();
        const ordersSub = supabase
            .channel('orders-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
                fetchData();
            })
            .subscribe();
        const orderItemsSub = supabase
            .channel('order-items-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'order_items' }, () => {
                fetchData();
            })
            .subscribe();
        return () => {
            supabase.removeChannel(ordersSub);
            supabase.removeChannel(orderItemsSub);
        };
    }, [slug]);

    const resolveOrder = async (orderId: string) => {
        try {
            const { error } = await supabase.from("orders").delete().eq("id", orderId);
            if (error) setError(error.message);
        } catch (err: any) {
            setError(err.message || "Failed to resolve order.");
        }
    };

    if (loading) {
        return <div className="text-center text-gray-500 dark:text-gray-400 py-10">Loading...</div>;
    }
    if (error) {
        return <div className="text-center text-red-500 dark:text-red-400 py-10">{error}</div>;
    }
    if (!vendor) {
        return <div className="text-center text-gray-500 dark:text-gray-400 py-10">Vendor not found.</div>;
    }

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
                    <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-2">{vendor.name}</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-6">Current Orders</p>
                    <div className="space-y-6 w-full">
                        {orders && orders.length > 0 ? (
                            orders.map((order: any) => (
                                <div key={order.id} className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                                    <h3 className="text-lg font-semibold mb-2">Order ID: {order.id}</h3>
                                    <h4 className="text-md font-medium mb-1">Items:</h4>
                                    <ul className="list-disc list-inside mb-3">
                                        {orderItems.filter(item => item.order_id === order.id).map((item: any) => (
                                            <li key={item.id}>{item.item_name} - ${item.item_price}</li>
                                        ))}
                                    </ul>
                                    <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => resolveOrder(order.id)}>
                                        Resolve Order
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 dark:text-gray-400">No current orders.</p>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}