"use client";
import { useEffect, useState } from "react";
import { createClient, insertTableData, getTableData } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { MenuItem, Vendor } from "@/lib/globalTypes";

interface VendorCardsProps {
    vendor: Vendor,
    menuItemsData: MenuItem[],
}

export default function VendorCards({ vendor, menuItemsData }: VendorCardsProps) {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [userEmail, setUserEmail] = useState<string>("");

    const supabase = createClient();

    useEffect(() => {
        const fetchUserEmail = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setUserEmail(user?.email || "");
        };
        fetchUserEmail();
    }, []);

    useEffect(() => {
        setMenuItems(menuItemsData);
    }, [vendor]);

    const addToOrder = (item: string) => {
        setSelectedItems([...selectedItems, item]);
        const itemPrice = menuItems.find((menuItem: MenuItem) => menuItem.item_name === item)?.item_price || 0;
        setTotalPrice(totalPrice + itemPrice);
    }

    const submitOrder = async () => {
        await insertTableData('orders', {
            vendor_id: vendor.id,
            total_price: totalPrice,
            client_email: userEmail
        });

        const orders = await getTableData('orders', 'vendor_id', vendor.id);
        await insertTableData('order_items', selectedItems.map((item) => ({order_id: orders?.[orders.length - 1].id, item_name: item})));

        setSelectedItems([]);
        setTotalPrice(0);

        await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: userEmail, subject : 'Your FTMarketplace Order Confirmation', 
            text: 'Your food will be ready soon!', 
            html: 
            '<div><h1>Your food will be ready soon!</h1><h2>Your food items</h2><ul>' + selectedItems.map((item) => '<li>' + item + '</li>').join('') + '</ul><h2>Total price: $' + totalPrice + '</h2></div>' }),
        });

        console.log(vendor.manager_email);

        await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: vendor.manager_email, subject : 'New Order Notification', 
            text: 'You have a new order!', 
            html: 
            '<div><h1>You have a new order!</h1><h2>Items to prepare</h2><ul>' + selectedItems.map((item) => '<li>' + item + '</li>').join('') + '</ul><h2>Total price: $' + totalPrice + '</h2></div>' + `<h2>Customer Email: ${userEmail}</h2>` }),
        });
    }

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">{vendor.name}</h1>
            <h2 className="text-lg text-gray-600 dark:text-gray-300 mb-2 text-center">Location: {vendor.location}</h2>
            <h2 className="text-xl font-semibold mb-6 text-gray-700 dark:text-gray-200 text-center">Menu Items</h2>
                <div className="space-y-4 mb-8">
                    {menuItems && menuItems.length > 0 ? (
                        menuItems.map((item: MenuItem) => (
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
        )
}