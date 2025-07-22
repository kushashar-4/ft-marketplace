import VendorCards from "./VendorCards";
import { getTableData } from "@/lib/supabase/server";
import { Vendor } from "@/lib/globalTypes";

export default async function VendorPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const vendor = await getTableData('vendors', 'slug', slug);
    const menuItems = await getTableData('menu_items', 'vendor_id', vendor?.[0]?.id);

    if (vendor && menuItems) {
        return (
            <div>
                <VendorCards vendor={vendor[0] as Vendor} menuItemsData={menuItems} />
            </div>
        );
    }
    else {
        return <div className="text-center text-red-500">Loading...</div>;
    }
}