import { pgTable, serial, text, timestamp, integer, boolean, jsonb, index } from "drizzle-orm/pg-core";

// One row per Netlify Identity user. `id` is the Identity user id.
// role: USER | SHOP | DELIVERY | ADMIN
export const profiles = pgTable("profiles", {
  id: text().primaryKey(),
  email: text().notNull(),
  name: text().notNull().default(""),
  phone: text().notNull().default(""),
  role: text().notNull().default("USER"),
  status: text().notNull().default("ACTIVE"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// status: PENDING | APPROVED | REJECTED. ownerId is null for the seeded demo shops.
export const shops = pgTable("shops", {
  id: serial().primaryKey(),
  ownerId: text("owner_id").unique().references(() => profiles.id, { onDelete: "set null" }),
  name: text().notNull(),
  email: text().notNull().default(""),
  ownerName: text("owner_name").notNull().default(""),
  status: text().notNull().default("PENDING"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable(
  "products",
  {
    id: serial().primaryKey(),
    shopId: integer("shop_id").notNull().references(() => shops.id, { onDelete: "cascade" }),
    name: text().notNull(),
    description: text().notNull().default(""),
    category: text().notNull().default(""),
    price: integer().notNull(),
    rentalPrice: integer("rental_price"),
    stock: integer().notNull().default(1),
    sizes: jsonb().$type<string[]>().notNull().default([]),
    colors: jsonb().$type<string[]>().notNull().default([]),
    image: text().notNull().default(""),
    available: boolean().notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("products_shop_idx").on(t.shopId)]
);

// type: RENT | BUY
export const cartItems = pgTable(
  "cart_items",
  {
    id: serial().primaryKey(),
    userId: text("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    quantity: integer().notNull().default(1),
    size: text().notNull().default(""),
    type: text().notNull().default("RENT"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("cart_items_user_idx").on(t.userId)]
);

// status: PENDING | PROCESSING | ASSIGNED | OUT_FOR_DELIVERY | DELIVERED | CANCELLED
export const orders = pgTable(
  "orders",
  {
    id: serial().primaryKey(),
    userId: text("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    shopId: integer("shop_id").notNull().references(() => shops.id, { onDelete: "cascade" }),
    deliveryAgentId: text("delivery_agent_id").references(() => profiles.id, { onDelete: "set null" }),
    status: text().notNull().default("PENDING"),
    subtotal: integer().notNull(),
    deliveryFee: integer("delivery_fee").notNull().default(0),
    total: integer().notNull(),
    address: text().notNull(),
    city: text().notNull(),
    pincode: text().notNull(),
    phone: text().notNull(),
    paymentMethod: text("payment_method").notNull().default("COD"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("orders_user_idx").on(t.userId),
    index("orders_shop_idx").on(t.shopId),
    index("orders_agent_idx").on(t.deliveryAgentId),
  ]
);

export const orderItems = pgTable(
  "order_items",
  {
    id: serial().primaryKey(),
    orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
    productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
    name: text().notNull(),
    quantity: integer().notNull(),
    size: text().notNull().default(""),
    type: text().notNull().default("RENT"),
    unitPrice: integer("unit_price").notNull(),
  },
  (t) => [index("order_items_order_idx").on(t.orderId)]
);
