'use client';

import { deleteTableData, getTableData } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type MenuItem = {
    id: number,
    item_name: string,
    item_description: string,
    item_price: number
}

export default function MenuManager() {
    const params = useParams();
    const slug = params.slug;

    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

    useEffect(() => {
        const fetchMenuItems = async () => {
            const vendors = await getTableData('vendors', 'slug', slug)

            if(vendors) {
                // Use vendor_id instead of id for menu_items
                const items = await getTableData('menu_items', 'vendor_id', vendors[0]?.id)
                setMenuItems(items ?? []);
            }
        }
        fetchMenuItems();
    }, [slug])

    const deleteItem = async (itemID: number) => {
        await deleteTableData('menu_items', 'id', itemID);
    }

    return(
        <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-950 via-gray-900 to-gray-950 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 py-12">
            <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 flex flex-col gap-8">
                <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-300 mb-4 text-center">Menu Manager for <span className="text-gray-800 dark:text-gray-100">{slug}</span></h1>
                {menuItems.length > 0 ? (
                    <ul className="space-y-6">
                        {menuItems.map((item: MenuItem) => (
                            <li key={item.id} className="bg-blue-50 dark:bg-gray-800 rounded-lg p-6 shadow border border-blue-100 dark:border-gray-800 flex flex-col gap-2">
                                <h2 className="text-xl font-bold text-blue-800 dark:text-blue-200">{item.item_name}</h2>
                                <p className="text-gray-700 dark:text-gray-300">{item.item_description}</p>
                                <p className="text-lg font-semibold text-blue-700 dark:text-blue-400">${item.item_price}</p>
                                <button className="mt-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-400 transition">
                                    Edit Item
                                </button>
                                <button onClick={() => deleteItem(item.id)} className="mt-2 px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-400 transition">
                                    Delete Item
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400">No menu items found.</div>
                )}
            </div>
        </main>
    )
}