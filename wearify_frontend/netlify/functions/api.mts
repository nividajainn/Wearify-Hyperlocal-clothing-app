import type { Config, Context } from "@netlify/functions";
import { getUser } from "@netlify/identity";
import { and, desc, eq, inArray, ne, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { cartItems, orderItems, orders, products, profiles, shops } from "../../db/schema.js";

type Role = "USER" | "SHOP" | "DELIVERY" | "ADMIN";
type Profile = typeof profiles.$inferSelect;

const DELIVERY_FEE = 49;
const ACTIVE_DELIVERY = ["ASSIGNED", "OUT_FOR_DELIVERY"];

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const json = (data: unknown, status = 200) => Response.json(data, { status });
const fail = (status: number, message: string): never => {
  throw new HttpError(status, message);
};

const toInt = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n) : NaN;
};

const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

async function body(req: Request): Promise<Record<string, any>> {
  try {
    const data = await req.json();
    return data && typeof data === "object" ? data : {};
  } catch {
    return {};
  }
}

// ---------- Auth ----------

const ROLE_FROM_IDENTITY: Record<string, Role> = {
  admin: "ADMIN",
  shop: "SHOP",
  delivery: "DELIVERY",
  customer: "USER",
};

async function currentProfile(): Promise<Profile | null> {
  const user = await getUser();
  if (!user) return null;

  const identityRoles = (user.roles ?? []).map((r) => r.toLowerCase());
  const isAdmin = identityRoles.includes("admin");

  const [existing] = await db.select().from(profiles).where(eq(profiles.id, user.id));
  if (existing) {
    // Admin access is granted from the Netlify dashboard, so keep it in sync with Identity.
    if (isAdmin && existing.role !== "ADMIN") {
      const [updated] = await db
        .update(profiles)
        .set({ role: "ADMIN" })
        .where(eq(profiles.id, user.id))
        .returning();
      return updated;
    }
    return existing;
  }

  // First request from this account: create the profile.
  const meta = (user.userMetadata ?? {}) as Record<string, unknown>;
  let role: Role = "USER";
  if (isAdmin) role = "ADMIN";
  else {
    const fromRoles = identityRoles.map((r) => ROLE_FROM_IDENTITY[r]).find(Boolean);
    const requested = String(meta.signup_role ?? "").toUpperCase();
    role = fromRoles ?? (["USER", "SHOP", "DELIVERY"].includes(requested) ? (requested as Role) : "USER");
  }

  const name = str(meta.full_name, 120) || user.name || (user.email ?? "").split("@")[0];
  const [created] = await db
    .insert(profiles)
    .values({
      id: user.id,
      email: user.email ?? "",
      name,
      phone: str(meta.phone, 30),
      role,
    })
    .onConflictDoNothing()
    .returning();

  const profile = created ?? (await db.select().from(profiles).where(eq(profiles.id, user.id)))[0];

  if (profile.role === "SHOP") {
    await db
      .insert(shops)
      .values({
        ownerId: profile.id,
        name: str(meta.shop_name, 120) || `${name}'s Shop`,
        email: profile.email,
        ownerName: name,
        status: "PENDING",
      })
      .onConflictDoNothing();
  }
  return profile;
}

async function requireRole(...roles: Role[]): Promise<Profile> {
  const profile = await currentProfile();
  if (!profile) fail(401, "Please sign in to continue.");
  if (roles.length && !roles.includes(profile!.role as Role)) fail(403, "You don't have access to this.");
  return profile!;
}

async function shopFor(profile: Profile) {
  const [shop] = await db.select().from(shops).where(eq(shops.ownerId, profile.id));
  if (!shop) fail(404, "No shop is linked to this account.");
  return shop!;
}

// ---------- Serializers ----------

function serializeProduct(p: typeof products.$inferSelect, shopName = "") {
  return {
    id: p.id,
    shopId: p.shopId,
    shopName,
    name: p.name,
    description: p.description,
    category: p.category,
    price: p.price,
    rentalPrice: p.rentalPrice,
    stock: p.stock,
    sizes: p.sizes ?? [],
    colors: p.colors ?? [],
    image: p.image,
    listed: p.available,
    available: p.available && p.stock > 0,
    createdAt: p.createdAt,
  };
}

async function serializeOrders(rows: (typeof orders.$inferSelect)[]) {
  if (rows.length === 0) return [];
  const ids = rows.map((o) => o.id);
  const people = [...new Set(rows.flatMap((o) => [o.userId, o.deliveryAgentId]).filter(Boolean))] as string[];
  const shopIds = [...new Set(rows.map((o) => o.shopId))];

  const [items, peopleRows, shopRows] = await Promise.all([
    db.select().from(orderItems).where(inArray(orderItems.orderId, ids)),
    people.length ? db.select().from(profiles).where(inArray(profiles.id, people)) : Promise.resolve([]),
    db.select().from(shops).where(inArray(shops.id, shopIds)),
  ]);
  const personById = new Map(peopleRows.map((p) => [p.id, p]));
  const shopById = new Map(shopRows.map((s) => [s.id, s]));

  return rows.map((o) => {
    const customer = personById.get(o.userId);
    const agent = o.deliveryAgentId ? personById.get(o.deliveryAgentId) : undefined;
    return {
      id: o.id,
      status: o.status,
      userId: o.userId,
      userName: customer?.name ?? "",
      customerName: customer?.name ?? "Customer",
      shopId: o.shopId,
      shopName: shopById.get(o.shopId)?.name ?? "",
      deliveryAgentId: o.deliveryAgentId,
      deliveryAgentName: agent?.name ?? "",
      subtotal: o.subtotal,
      deliveryFee: o.deliveryFee,
      total: o.total,
      address: `${o.address}, ${o.city} – ${o.pincode}`,
      phone: o.phone,
      paymentMethod: o.paymentMethod,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
      items: items
        .filter((i) => i.orderId === o.id)
        .map((i) => ({
          name: i.name,
          qty: i.quantity,
          size: i.size,
          type: i.type,
          unitPrice: i.unitPrice,
          productId: i.productId,
        })),
    };
  });
}

// ---------- Order status transitions ----------

async function setOrderStatus(id: number, from: string[], to: string, extra: Partial<typeof orders.$inferInsert> = {}) {
  const [updated] = await db
    .update(orders)
    .set({ status: to, updatedAt: new Date(), ...extra })
    .where(and(eq(orders.id, id), inArray(orders.status, from)))
    .returning();
  if (!updated) fail(409, `This order can't be moved to ${to.replace(/_/g, " ").toLowerCase()} right now.`);
  return (await serializeOrders([updated!]))[0];
}

async function pickDeliveryAgent(): Promise<string | null> {
  const agents = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(and(eq(profiles.role, "DELIVERY"), eq(profiles.status, "ACTIVE")));
  if (agents.length === 0) return null;

  const loads = await db
    .select({ agent: orders.deliveryAgentId, n: sql<number>`count(*)::int` })
    .from(orders)
    .where(inArray(orders.status, ACTIVE_DELIVERY))
    .groupBy(orders.deliveryAgentId);
  const loadBy = new Map(loads.map((l) => [l.agent, Number(l.n)]));
  agents.sort((a, b) => (loadBy.get(a.id) ?? 0) - (loadBy.get(b.id) ?? 0));
  return agents[0].id;
}

async function dispatchOrder(id: number) {
  const agentId = await pickDeliveryAgent();
  if (!agentId) fail(409, "No delivery partners are registered yet. Ask a delivery partner to sign up first.");
  return setOrderStatus(id, ["PROCESSING"], "ASSIGNED", { deliveryAgentId: agentId });
}

async function cancelOrder(id: number, from: string[]) {
  const [order] = await db.select().from(orders).where(eq(orders.id, id));
  if (!order) fail(404, "Order not found.");
  const result = await setOrderStatus(id, from, "CANCELLED");
  // Put the items back in stock
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
  for (const item of items) {
    if (item.productId) {
      await db
        .update(products)
        .set({ stock: sql`${products.stock} + ${item.quantity}` })
        .where(eq(products.id, item.productId));
    }
  }
  return result;
}

// Shared shop/admin order actions: accept → dispatch (assign delivery) or cancel
async function orderAction(id: number, action: string) {
  if (action === "accept") return setOrderStatus(id, ["PENDING"], "PROCESSING");
  if (action === "dispatch") return dispatchOrder(id);
  if (action === "cancel") return cancelOrder(id, ["PENDING", "PROCESSING"]);
  return fail(404, "Unknown action.");
}

// ---------- Product input ----------

function productInput(b: Record<string, any>, partial = false) {
  const values: Partial<typeof products.$inferInsert> = {};
  if (!partial || b.name !== undefined) values.name = str(b.name, 160);
  if (!partial || b.description !== undefined) values.description = str(b.description, 2000);
  if (!partial || b.category !== undefined) values.category = str(b.category, 60);
  if (!partial || b.price !== undefined) values.price = toInt(b.price);
  if (!partial || b.rentalPrice !== undefined)
    values.rentalPrice = b.rentalPrice === "" || b.rentalPrice == null ? null : toInt(b.rentalPrice);
  if (!partial || b.stock !== undefined) values.stock = b.stock === "" || b.stock == null ? 1 : toInt(b.stock);
  if (!partial || b.sizes !== undefined)
    values.sizes = Array.isArray(b.sizes) ? b.sizes.map((s: unknown) => str(s, 20)).filter(Boolean).slice(0, 12) : [];
  if (!partial || b.colors !== undefined)
    values.colors = Array.isArray(b.colors) ? b.colors.map((s: unknown) => str(s, 30)).filter(Boolean).slice(0, 12) : [];
  if (!partial || b.image !== undefined) {
    const image = str(b.image, 1000);
    if (image && !/^https?:\/\//i.test(image)) fail(400, "Image must be a link starting with http:// or https://");
    values.image = image;
  }
  if (!partial || b.available !== undefined) values.available = b.available !== false;

  if (values.name !== undefined && !values.name) fail(400, "Product name is required.");
  if (values.category !== undefined && !values.category) fail(400, "Category is required.");
  if (values.price !== undefined && (!Number.isFinite(values.price) || values.price! <= 0))
    fail(400, "Buy price must be a positive number.");
  if (values.rentalPrice != null && (!Number.isFinite(values.rentalPrice) || values.rentalPrice < 0))
    fail(400, "Rental price must be a positive number.");
  if (values.stock !== undefined && (!Number.isFinite(values.stock) || values.stock! < 0))
    fail(400, "Stock must be zero or more.");
  return values;
}

// ---------- Router ----------

type Handler = (req: Request, params: Record<string, string>) => Promise<Response>;
const routes: { method: string; pattern: URLPattern; handler: Handler }[] = [];
const route = (method: string, path: string, handler: Handler) =>
  routes.push({ method, pattern: new URLPattern({ pathname: `/api${path}` }), handler });

// Profile
route("GET", "/me", async () => {
  const profile = await requireRole();
  const shop = profile.role === "SHOP" ? (await db.select().from(shops).where(eq(shops.ownerId, profile.id)))[0] : null;
  return json({ ...profile, shop: shop ?? null });
});

// Catalogue (public)
route("GET", "/products", async () => {
  const rows = await db
    .select({ product: products, shopName: shops.name })
    .from(products)
    .innerJoin(shops, eq(products.shopId, shops.id))
    .where(eq(shops.status, "APPROVED"))
    .orderBy(desc(products.createdAt));
  return json(rows.filter((r) => r.product.available).map((r) => serializeProduct(r.product, r.shopName)));
});

route("GET", "/products/:id", async (_req, { id }) => {
  const [row] = await db
    .select({ product: products, shopName: shops.name, shopStatus: shops.status })
    .from(products)
    .innerJoin(shops, eq(products.shopId, shops.id))
    .where(eq(products.id, toInt(id)));
  if (!row || row.shopStatus !== "APPROVED") fail(404, "Product not found.");
  return json(serializeProduct(row!.product, row!.shopName));
});

// Cart
async function cartFor(userId: string) {
  const rows = await db
    .select({ item: cartItems, product: products, shopName: shops.name })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .innerJoin(shops, eq(products.shopId, shops.id))
    .where(eq(cartItems.userId, userId))
    .orderBy(cartItems.createdAt);
  return rows.map(({ item, product, shopName }) => ({
    id: item.id,
    productId: product.id,
    productName: product.name,
    shopId: product.shopId,
    shopName,
    image: product.image,
    type: item.type,
    size: item.size,
    quantity: item.quantity,
    price: item.type === "BUY" ? product.price : product.rentalPrice ?? product.price,
    stock: product.stock,
    available: product.available && product.stock > 0,
  }));
}

route("GET", "/cart/my", async () => {
  const me = await requireRole("USER");
  return json(await cartFor(me.id));
});

route("POST", "/cart/add", async (req) => {
  const me = await requireRole("USER");
  const b = await body(req);
  const productId = toInt(b.productId);
  const quantity = Math.max(1, toInt(b.quantity) || 1);
  const type = b.type === "BUY" ? "BUY" : "RENT";
  const size = str(b.size, 20);

  const [product] = await db.select().from(products).where(eq(products.id, productId));
  if (!product || !product.available || product.stock < 1) fail(400, "This product isn't available right now.");
  if (type === "RENT" && product!.rentalPrice == null) fail(400, "This product can only be bought.");

  const [existing] = await db
    .select()
    .from(cartItems)
    .where(
      and(eq(cartItems.userId, me.id), eq(cartItems.productId, productId), eq(cartItems.type, type), eq(cartItems.size, size))
    );
  const newQty = (existing?.quantity ?? 0) + quantity;
  if (newQty > product!.stock) fail(400, `Only ${product!.stock} left in stock.`);

  if (existing) {
    await db.update(cartItems).set({ quantity: newQty }).where(eq(cartItems.id, existing.id));
  } else {
    await db.insert(cartItems).values({ userId: me.id, productId, quantity, size, type });
  }
  return json(await cartFor(me.id), 201);
});

route("PUT", "/cart/update", async (req) => {
  const me = await requireRole("USER");
  const b = await body(req);
  const id = toInt(b.cartItemId);
  const quantity = toInt(b.quantity);
  if (!(quantity >= 1)) fail(400, "Quantity must be at least 1.");
  const [row] = await db
    .select({ item: cartItems, stock: products.stock })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(and(eq(cartItems.id, id), eq(cartItems.userId, me.id)));
  if (!row) fail(404, "Cart item not found.");
  if (quantity > row!.stock) fail(400, `Only ${row!.stock} left in stock.`);
  await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id));
  return json(await cartFor(me.id));
});

route("DELETE", "/cart/:id", async (_req, { id }) => {
  const me = await requireRole("USER");
  await db.delete(cartItems).where(and(eq(cartItems.id, toInt(id)), eq(cartItems.userId, me.id)));
  return json(await cartFor(me.id));
});

// Orders (customer)
route("POST", "/orders/checkout", async (req) => {
  const me = await requireRole("USER");
  const b = await body(req);
  const address = str(b.address, 300);
  const city = str(b.city, 80);
  const pincode = str(b.pincode, 10);
  const phone = str(b.phone, 30);
  const paymentMethod = ["COD", "UPI", "CARD"].includes(b.paymentMethod) ? b.paymentMethod : "COD";
  if (!address || !city || !pincode || !phone) fail(400, "Please fill in all delivery details.");
  if (!/^\d{6}$/.test(pincode)) fail(400, "PIN code must be 6 digits.");

  const cart = await cartFor(me.id);
  if (cart.length === 0) fail(400, "Your cart is empty.");
  const unavailable = cart.find((i) => !i.available || i.quantity > i.stock);
  if (unavailable) fail(400, `"${unavailable.productName}" is no longer available in that quantity.`);

  // One order per shop, since each shop packs and hands over its own items.
  const byShop = new Map<number, typeof cart>();
  for (const item of cart) byShop.set(item.shopId, [...(byShop.get(item.shopId) ?? []), item]);

  const created = await db.transaction(async (tx) => {
    const out: (typeof orders.$inferSelect)[] = [];
    for (const [shopId, items] of byShop) {
      for (const item of items) {
        const [ok] = await tx
          .update(products)
          .set({ stock: sql`${products.stock} - ${item.quantity}` })
          .where(and(eq(products.id, item.productId), sql`${products.stock} >= ${item.quantity}`))
          .returning({ id: products.id });
        if (!ok) throw new HttpError(409, `"${item.productName}" just sold out. Please update your cart.`);
      }
      const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
      const [order] = await tx
        .insert(orders)
        .values({
          userId: me.id,
          shopId,
          subtotal,
          deliveryFee: DELIVERY_FEE,
          total: subtotal + DELIVERY_FEE,
          address,
          city,
          pincode,
          phone,
          paymentMethod,
        })
        .returning();
      await tx.insert(orderItems).values(
        items.map((i) => ({
          orderId: order.id,
          productId: i.productId,
          name: i.productName,
          quantity: i.quantity,
          size: i.size,
          type: i.type,
          unitPrice: i.price,
        }))
      );
      out.push(order);
    }
    await tx.delete(cartItems).where(eq(cartItems.userId, me.id));
    return out;
  });

  if (!me.phone) await db.update(profiles).set({ phone }).where(eq(profiles.id, me.id));
  return json(await serializeOrders(created), 201);
});

route("GET", "/orders/my", async () => {
  const me = await requireRole("USER");
  const rows = await db.select().from(orders).where(eq(orders.userId, me.id)).orderBy(desc(orders.createdAt));
  return json(await serializeOrders(rows));
});

route("PUT", "/orders/:id/cancel", async (_req, { id }) => {
  const me = await requireRole("USER");
  const [order] = await db.select().from(orders).where(and(eq(orders.id, toInt(id)), eq(orders.userId, me.id)));
  if (!order) fail(404, "Order not found.");
  return json(await cancelOrder(order!.id, ["PENDING"]));
});

// Shop owner
route("GET", "/shop/me", async () => {
  const me = await requireRole("SHOP");
  return json(await shopFor(me));
});

route("GET", "/shop/products", async () => {
  const me = await requireRole("SHOP");
  const shop = await shopFor(me);
  const rows = await db.select().from(products).where(eq(products.shopId, shop.id)).orderBy(desc(products.createdAt));
  return json(rows.map((p) => serializeProduct(p, shop.name)));
});

route("POST", "/shop/products", async (req) => {
  const me = await requireRole("SHOP");
  const shop = await shopFor(me);
  const values = productInput(await body(req));
  const [created] = await db
    .insert(products)
    .values({ ...(values as typeof products.$inferInsert), shopId: shop.id })
    .returning();
  return json(serializeProduct(created, shop.name), 201);
});

route("PUT", "/shop/products/:id", async (req, { id }) => {
  const me = await requireRole("SHOP");
  const shop = await shopFor(me);
  const values = productInput(await body(req), true);
  const [updated] = await db
    .update(products)
    .set(values)
    .where(and(eq(products.id, toInt(id)), eq(products.shopId, shop.id)))
    .returning();
  if (!updated) fail(404, "Product not found.");
  return json(serializeProduct(updated!, shop.name));
});

route("DELETE", "/shop/products/:id", async (_req, { id }) => {
  const me = await requireRole("SHOP");
  const shop = await shopFor(me);
  const [deleted] = await db
    .delete(products)
    .where(and(eq(products.id, toInt(id)), eq(products.shopId, shop.id)))
    .returning({ id: products.id });
  if (!deleted) fail(404, "Product not found.");
  return json({ ok: true });
});

route("GET", "/shop/orders", async () => {
  const me = await requireRole("SHOP");
  const shop = await shopFor(me);
  const rows = await db.select().from(orders).where(eq(orders.shopId, shop.id)).orderBy(desc(orders.createdAt));
  return json(await serializeOrders(rows));
});

route("PUT", "/shop/orders/:id/:action", async (_req, { id, action }) => {
  const me = await requireRole("SHOP");
  const shop = await shopFor(me);
  const [order] = await db.select().from(orders).where(and(eq(orders.id, toInt(id)), eq(orders.shopId, shop.id)));
  if (!order) fail(404, "Order not found.");
  return json(await orderAction(order!.id, action));
});

// Delivery partner
route("GET", "/delivery/orders/assigned", async () => {
  const me = await requireRole("DELIVERY");
  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.deliveryAgentId, me.id))
    .orderBy(desc(orders.updatedAt));
  return json(await serializeOrders(rows));
});

const DELIVERY_STEPS: Record<string, { from: string[]; to: string }> = {
  pickup: { from: ["ASSIGNED"], to: "OUT_FOR_DELIVERY" },
  "out-for-delivery": { from: ["ASSIGNED"], to: "OUT_FOR_DELIVERY" },
  delivered: { from: ["OUT_FOR_DELIVERY"], to: "DELIVERED" },
};

route("PUT", "/delivery/orders/:id/:step", async (_req, { id, step }) => {
  const me = await requireRole("DELIVERY");
  const transition = DELIVERY_STEPS[step];
  if (!transition) fail(404, "Unknown action.");
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, toInt(id)), eq(orders.deliveryAgentId, me.id)));
  if (!order) fail(404, "Order not found.");
  return json(await setOrderStatus(order!.id, transition!.from, transition!.to));
});

// Admin
route("GET", "/admin/dashboard", async () => {
  await requireRole("ADMIN");
  const [[users], [shopCounts], [orderCounts], [agents]] = await Promise.all([
    db.select({ n: sql<number>`count(*)::int` }).from(profiles).where(eq(profiles.role, "USER")),
    db
      .select({
        approved: sql<number>`count(*) filter (where ${shops.status} = 'APPROVED')::int`,
        pending: sql<number>`count(*) filter (where ${shops.status} = 'PENDING')::int`,
      })
      .from(shops),
    db
      .select({
        n: sql<number>`count(*)::int`,
        revenue: sql<number>`coalesce(sum(${orders.total}) filter (where ${orders.status} = 'DELIVERED'), 0)::int`,
      })
      .from(orders)
      .where(ne(orders.status, "CANCELLED")),
    db.select({ n: sql<number>`count(*)::int` }).from(profiles).where(eq(profiles.role, "DELIVERY")),
  ]);
  return json({
    totalUsers: users.n,
    totalShops: shopCounts.approved,
    pendingShops: shopCounts.pending,
    totalOrders: orderCounts.n,
    totalRevenue: orderCounts.revenue,
    activeDelivery: agents.n,
  });
});

route("GET", "/admin/users", async () => {
  await requireRole("ADMIN");
  return json(await db.select().from(profiles).where(eq(profiles.role, "USER")).orderBy(desc(profiles.createdAt)));
});

route("GET", "/admin/shops", async () => {
  await requireRole("ADMIN");
  return json(await db.select().from(shops).orderBy(desc(shops.createdAt)));
});

route("GET", "/admin/shops/pending", async () => {
  await requireRole("ADMIN");
  return json(await db.select().from(shops).where(eq(shops.status, "PENDING")).orderBy(desc(shops.createdAt)));
});

route("PUT", "/admin/shops/:id/:decision", async (_req, { id, decision }) => {
  await requireRole("ADMIN");
  const status = decision === "approve" ? "APPROVED" : decision === "reject" ? "REJECTED" : null;
  if (!status) fail(404, "Unknown action.");
  const [updated] = await db.update(shops).set({ status: status! }).where(eq(shops.id, toInt(id))).returning();
  if (!updated) fail(404, "Shop not found.");
  return json(updated);
});

route("GET", "/admin/delivery", async () => {
  await requireRole("ADMIN");
  const [agents, counts] = await Promise.all([
    db.select().from(profiles).where(eq(profiles.role, "DELIVERY")).orderBy(desc(profiles.createdAt)),
    db
      .select({
        agent: orders.deliveryAgentId,
        delivered: sql<number>`count(*) filter (where ${orders.status} = 'DELIVERED')::int`,
        active: sql<number>`count(*) filter (where ${orders.status} in ('ASSIGNED', 'OUT_FOR_DELIVERY'))::int`,
      })
      .from(orders)
      .groupBy(orders.deliveryAgentId),
  ]);
  const byAgent = new Map(counts.map((c) => [c.agent, c]));
  return json(
    agents.map((a) => ({
      ...a,
      deliveredCount: byAgent.get(a.id)?.delivered ?? 0,
      activeCount: byAgent.get(a.id)?.active ?? 0,
    }))
  );
});

route("GET", "/admin/orders", async () => {
  await requireRole("ADMIN");
  return json(await serializeOrders(await db.select().from(orders).orderBy(desc(orders.createdAt))));
});

route("PUT", "/admin/orders/:id/:action", async (_req, { id, action }) => {
  await requireRole("ADMIN");
  return json(await orderAction(toInt(id), action));
});

// ---------- Entry point ----------

export default async (req: Request, _context: Context) => {
  const url = new URL(req.url);
  try {
    for (const r of routes) {
      if (r.method !== req.method) continue;
      const match = r.pattern.exec({ pathname: url.pathname });
      if (match) return await r.handler(req, (match.pathname.groups ?? {}) as Record<string, string>);
    }
    return json({ message: "Not found" }, 404);
  } catch (err) {
    if (err instanceof HttpError) return json({ message: err.message }, err.status);
    console.error(err);
    return json({ message: "Something went wrong. Please try again." }, 500);
  }
};

export const config: Config = {
  path: "/api/*",
};
