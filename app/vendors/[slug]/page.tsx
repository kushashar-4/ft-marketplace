import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import VendorCards from "./VendorCards";

export default async function VendorPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const supabase = await createClient();
    const { data: vendor } = await supabase.from('vendors').select().eq("slug", slug).single();
    const { data: menuItems } = await supabase.from('menu_items').select().eq("id", vendor.id);

    if (vendor && menuItems) {
        return (
            <div>
                <VendorCards vendor={vendor} menuItemsData={menuItems} />
            </div>
        );
    }
    else {
        return <div className="text-center text-red-500">Loading...</div>;
    }
}