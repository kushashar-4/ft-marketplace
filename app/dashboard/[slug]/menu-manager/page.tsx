'use client';

import { deleteTableData, getTableData, insertTableData, updateTableData } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MenuItem } from "@/lib/globalTypes";


export default function MenuManager() {
    const params = useParams();
    const slug = params.slug;

    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [vendorID, setVendorID] = useState<number>(0);

    const [editItemID, setEditItemId] = useState<number>(0);
    const [addingItem, setAddingItem] = useState<boolean>(false);
    const [newItem, setNewItem] = useState<MenuItem>({ id: 0, item_name: '', item_description: '', item_price: 0 });
    const [currentEditItem, setCurrentEditItem] = useState<MenuItem>({ id: 0, item_name: '', item_description: '', item_price: 0 });

    useEffect(() => {
        const fetchMenuItems = async () => {
            const vendors = await getTableData('vendors', 'slug', slug)

            if(vendors) {
                const items = await getTableData('menu_items', 'vendor_id', vendors[0]?.id)
                setVendorID(vendors[0]?.id || 0);
                setMenuItems(items ?? []);
            }
        }
        fetchMenuItems();
    }, [slug])

    const deleteItem = async (itemID: number) => {
        await deleteTableData('menu_items', 'id', itemID);
    }

    const toggleEditing = (itemID: number, item: MenuItem) => {
        if(editItemID === itemID) {
            setEditItemId(0);
            setCurrentEditItem({ id: 0, item_name: '', item_description: '', item_price: 0 });
        } else {
            setEditItemId(itemID);
            setCurrentEditItem(item);
        }
    }

    const handleSubmit = async () => {
        await updateTableData('menu_items', {
            item_name: currentEditItem.item_name,
            item_description: currentEditItem.item_description,
            item_price: currentEditItem.item_price
        },
        'id', currentEditItem.id);
        window.location.reload(); 
    }

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        await insertTableData('menu_items', {
            item_name: newItem.item_name,
            item_description: newItem.item_description,
            item_price: newItem.item_price,
            vendor_id: vendorID
        });
        window.location.reload();
    }

    return(
        <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-950 via-gray-900 to-gray-950 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 py-12">
            <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 flex flex-col gap-8">
                <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-300 mb-4 text-center">Menu Manager for <span className="text-gray-800 dark:text-gray-100">{slug}</span></h1>
                {menuItems.length > 0 ? (
                    <ul className="space-y-6">
                        {menuItems.map((item: MenuItem) => (
                            <li key={item.id} className="bg-blue-50 dark:bg-gray-800 rounded-lg p-6 shadow border border-blue-100 dark:border-gray-800 flex flex-col gap-2">
                                {editItemID == item.id && (
                                    <div className="flex flex-col gap-3 mb-4">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                                        <input type="text" defaultValue={item.item_name} onChange={(e) => setCurrentEditItem((prev) => ({ ...prev, item_name: e.target.value }))} className="w-full p-2 rounded-lg border border-blue-300 dark:border-blue-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition" />
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                        <input type="text" defaultValue={item.item_description} onChange={(e) => setCurrentEditItem((prev) => ({ ...prev, item_description: e.target.value }))} className="w-full p-2 rounded-lg border border-blue-300 dark:border-blue-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition" />
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                                        <input type="number" defaultValue={item.item_price} onChange={(e) => setCurrentEditItem((prev) => ({ ...prev, item_price: Number(e.target.value) }))} className="w-full p-2 rounded-lg border border-blue-300 dark:border-blue-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition" />
                                    </div>
                                )}
                                <h2 className="text-xl font-bold text-blue-800 dark:text-blue-200">{item.item_name}</h2>
                                <p className="text-gray-700 dark:text-gray-300">{item.item_description}</p>
                                <p className="text-lg font-semibold text-blue-700 dark:text-blue-400">${item.item_price}</p>
                                <button className="mt-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-400 transition" onClick={() => {toggleEditing(item.id, item)}}>
                                    Edit Item
                                </button>
                                {editItemID == item.id && (
                                    <>
                                        <button onClick={() => deleteItem(item.id)} className="mt-2 px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-400 transition">
                                            Delete Item
                                        </button>
                                        <button className="mt-2 px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg font-semibold shadow hover:bg-green-700 dark:hover:bg-green-400 transition" onClick={handleSubmit}>
                                            Submit Changes
                                        </button>
                                    </>
                                )}

                            </li>
                        ))}
                        <button onClick={() => (setAddingItem(!addingItem))} className="mt-4 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-400 transition">
                            Add Item
                        </button>
                        {addingItem && (
                        <form onSubmit={handleAddItem} className="flex flex-col gap-4 mt-4 p-6 bg-blue-50 dark:bg-gray-800 rounded-lg shadow border border-blue-100 dark:border-gray-800">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Item Name</label>
                            <input type="text" value={newItem.item_name} onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })} placeholder="Item Name" required className="w-full p-2 rounded-lg border border-blue-300 dark:border-blue-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition" />
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Item Description</label>
                            <input type="text" value={newItem.item_description} onChange={(e) => setNewItem({ ...newItem, item_description: e.target.value })} placeholder="Item Description" required className="w-full p-2 rounded-lg border border-blue-300 dark:border-blue-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition" />
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Item Price</label>
                            <input type="number" onChange={(e) => setNewItem({ ...newItem, item_price: Number(e.target.value) })} placeholder="Item Price" required className="w-full p-2 rounded-lg border border-blue-300 dark:border-blue-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition" />
                            <button type="submit" className="mt-2 px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg font-semibold shadow hover:bg-green-700 dark:hover:bg-green-400 transition">Add Item</button>
                        </form>
                        )}
                    </ul>
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400">No menu items found.</div>
                )}
            </div>
        </main>
    )
}