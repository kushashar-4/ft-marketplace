export type MenuItem = {
    item_name: string,
    item_price: number,
    item_description: string,
}

export type Vendor = {
    id: number,
    name: string,
    location: string,
    slug: string
}

export type Order = {
    id: string,
    vendor_id: string, 
    user_id: string,
    total_price: number,
    client_email: string
}

export type OrderItem = {
    id: string, 
    item_name: string,
    order_id: string
}