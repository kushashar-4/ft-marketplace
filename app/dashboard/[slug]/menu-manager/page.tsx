'use client';

import { getTableData } from "@/lib/supabase/client";
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
                const items = await getTableData('menu_items', 'id', vendors[0]?.id)
                console.log(items)
                setMenuItems(items ?? []);
            }
        }
        fetchMenuItems();
    }, [])

    return(
        <div>
            <h1>Menu Manager for {slug}</h1>
            {menuItems.map((item: MenuItem) => <><h2>{item.item_name}</h2><p>{item.item_description}</p><p>${item.item_price}</p></>)}
        </div>
    )
}