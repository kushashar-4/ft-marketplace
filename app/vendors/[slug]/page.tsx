"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function VendorPage() {
    const params = useParams();
    const slug = params.slug as string;
    const supabase = createClient();
    const router = useRouter();

    const [vendor, setVendor] = useState<any>(null);
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data: vendorData, error: vendorError } = await supabase.from('vendors').select().eq("slug", slug).single();
                if (vendorError) throw vendorError;
                setVendor(vendorData);
                if (vendorData) {
                    const { data: menuData, error: menuError } = await supabase.from('menu_items').select().eq("id", vendorData.id);
                    if (menuError) throw menuError;
                    setMenuItems(menuData || []);
                }
            } catch (err: any) {
                setError(err.message || "An error occurred fetching data.");
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchData();
    }, [slug]);

    const addToOrder = (item: string) => {
        setSelectedItems([...selectedItems, item]);
        setTotalPrice(totalPrice + (menuItems.find((menuItem: any) => menuItem.item_name === item)?.item_price || 0));
    };

    const submitOrder = async () => {
        setError(null);
        try {
            const { data: order, error: orderError } = await supabase.from('orders').insert({
                vendor_id: vendor.id,
            }).select().single();
            if (orderError) throw orderError;

            if (menuItems && order) {
                for (const item of selectedItems) {
                    const { error: itemError } = await supabase.from('order_items').insert({
                        order_id: order.id,
                        item_name: item,
                        item_price: menuItems.find((menuItem: any) => menuItem.item_name === item)?.item_price,
                    });
                    if (itemError) throw itemError;
                }
            }
            router.push('/vendors');
        } catch (err: any) {
            setError(err.message || "Failed to submit order.");
        }
    };

    if (loading) return <div className="text-center text-gray-500 dark:text-gray-400 py-10">Loading...</div>;
    if (error) return <div className="text-center text-red-500 dark:text-red-400 py-10">{error}</div>;
    if (!vendor) return <div className="text-center text-gray-500 dark:text-gray-400 py-10">Vendor not found.</div>;

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">{vendor.name}</h1>
            <h2 className="text-lg text-gray-600 dark:text-gray-300 mb-2 text-center">Location: {vendor.location}</h2>
            <h2 className="text-xl font-semibold mb-6 text-gray-700 dark:text-gray-200 text-center">Menu Items</h2>
            <div className="space-y-4 mb-8">
                {menuItems && menuItems.length > 0 ? (
                    menuItems.map((item: any) => (
                        <div key={item.id} className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <span className="text-lg font-medium text-gray-900 dark:text-gray-100">{item.item_name}</span>
                                <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">{item.item_description}</div>
                                <span className="text-blue-700 dark:text-blue-400 font-semibold">${item.item_price}</span>
                            </div>
                            <Button className="mt-2 md:mt-0 md:ml-4" onClick={() => addToOrder(item.item_name)}>
                                Add to order
                            </Button>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400">No menu items found.</div>
                )}
            </div>
            <div className="flex flex-col items-center">
                <Button className="w-full max-w-xs" onClick={submitOrder} disabled={selectedItems.length === 0}>
                    Submit Order
                </Button>
                {selectedItems.length > 0 && (
                    <div className="mt-4 w-full max-w-xs bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded p-3 text-blue-900 dark:text-blue-100">
                        <div className="font-semibold mb-2">Selected Items:</div>
                        <ul className="list-disc list-inside">
                            {selectedItems.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                        <p className="mt-2">Total Price: ${totalPrice}</p>
                    </div>
                )}
            </div>
        </div>
    );
}