"use client";

import { createClient, getAuth, getTableData, insertData } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";

type Order = {
    id: string,
    vendor_id: string, 
    user_id: string,
    total_price: number,
    client_email: string
}

type OrderItem = {
    id: string, 
    item_name: string,
    order_id: string
}

type MenuItem = {
    id: number,
    item_name: string,
    item_description: string,
    item_price: number
}

export default function VendorPage() {
    const params = useParams();
    const slug = params.slug as string;
    const supabase = createClient();

    const [vendor, setVendor] = useState<any>();
    const [orders, setOrders] = useState<any>([]);
    const [orderItems, setOrderItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState<string>("");

    useEffect(() => {
        const fetchEmail = async () => {
            const { data: authData } = await supabase.auth.getUser();
            setEmail(authData?.user?.email || "");
        }
        fetchEmail();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const user = await getAuth();
            const vendors = await getTableData('vendors', 'slug', slug);
            if(vendors && vendors[0]?.manager !== user?.id) {
                window.location.href = '/';
                return;
            }
            if(vendors) {
                setVendor(vendors[0]);
            }

            const orders = await getTableData('orders', 'vendor_id', vendors?.[0]?.id);
            setOrders(orders);

            const { data: orderItemsData } = await supabase.from('order_items').select();
            setOrderItems(orderItemsData || []);

            const orderItems = await getTableData('order_items', 'vendor_id', vendors?.[0]?.id);
            if(orderItems) {
                setOrderItems(orderItems);
            }
        }
        finally {
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
        await supabase.from("orders").delete().eq("id", orderId);
        
        await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, subject: 'Your FTMarketplace Order Completed', text: 'Your food is ready, please arrive soon!', html: '<strong>Your food is ready, please arrive soon!</strong>' }),
        });
        window.location.reload();
    };

    if (loading) {
        return <div className="text-center text-gray-500 dark:text-gray-400 py-10">Loading...</div>;
    }
    if (!vendor) {
        return <div className="text-center text-gray-500 dark:text-gray-400 py-10">Vendor not found.</div>;
    }

    const addToMenu = async (menuItem: MenuItem) => {
        await insertData('menu_items', menuItem)
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
                            orders.map((order: Order) => (
                                <div
                                    key={order.id}
                                    className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-6 hover:shadow-2xl transition-all duration-200"
                                >
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-bold mb-2 truncate">Order ID: <span className="font-mono text-base font-medium">{order.id}</span></h3>
                                        <h4 className="text-md font-semibold mb-1 text-blue-700 dark:text-blue-400">Items:</h4>
                                        <ul className="list-disc list-inside mb-3 pl-4">
                                            {orderItems.filter(item => item.order_id === order.id).map((item: OrderItem) => (
                                                <li key={item.id} className="text-base">{item.item_name}</li>
                                            ))}
                                        </ul>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">User Email: <span className="font-mono">{order.client_email}</span></p>
                                    </div>
                                    <div className="flex flex-col items-end min-w-[160px] md:ml-8 gap-3">
                                        <span className="text-lg font-semibold text-blue-700 dark:text-blue-400">Total: <span className="font-bold">${order.total_price}</span></span>
                                        <Button className="bg-green-600 hover:bg-green-700 text-white w-full px-6 py-2 rounded-lg shadow-md" onClick={() => resolveOrder(order.id)}>
                                            Resolve Order
                                        </Button>
                                    </div>
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