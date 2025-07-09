import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import VendorCards from "./VendorCards";
import { getTableData } from "@/lib/supabase/server";

export default async function VendorPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // const { data: vendor } = await supabase.from('vendors').select().eq("slug", slug).single();
    // const { data: menuItems } = await supabase.from('menu_items').select().eq("id", vendor.id);

    const vendor = await getTableData('vendors', 'slug', slug);
    const menuItems = await getTableData('menu_items', 'id', vendor?.[0]?.id);

    console.log("Vendor:", vendor);
    console.log("Menu Items:", menuItems);

    if (vendor && menuItems) {
        return (
            <div>
                <VendorCards vendor={vendor[0]} menuItemsData={menuItems} />
            </div>
        );
    }
    else {
        return <div className="text-center text-red-500">Loading...</div>;
    }
}