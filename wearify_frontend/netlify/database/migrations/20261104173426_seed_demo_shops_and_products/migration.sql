-- Demo partner shops (no owner account) so customers have something to browse right away
INSERT INTO "shops" ("name", "email", "owner_name", "status") VALUES
  ('Trendy Threads', 'trendy@wearify.demo', 'Amit Singh', 'APPROVED'),
  ('Style Hub', 'stylehub@wearify.demo', 'Meera Nair', 'APPROVED'),
  ('Urban Drip', 'urban@wearify.demo', 'Karan Patel', 'APPROVED'),
  ('Ethnic Elegance', 'ethnic@wearify.demo', 'Riya Desai', 'APPROVED');
--> statement-breakpoint
INSERT INTO "products" ("shop_id", "name", "description", "category", "price", "rental_price", "stock", "sizes", "colors", "image", "available")
SELECT s.id, p.name, p.description, p.category, p.price, p.rental_price, p.stock, p.sizes::jsonb, p.colors::jsonb, p.image, p.available
FROM (VALUES
  ('Trendy Threads', 'Floral Summer Dress', 'A breathable cotton dress with elegant floral prints, perfect for brunches, beach trips and festive gatherings.', 'Dresses', 299, 99, 4, '["XS","S","M","L","XL"]', '["Multicolor","Blue","Pink"]', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80', true),
  ('Style Hub', 'Classic Formal Blazer', 'Tailored single-breasted blazer in a wool blend. Ideal for interviews, meetings and receptions.', 'Formals', 1200, 299, 3, '["S","M","L","XL"]', '["Black","Navy"]', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80', true),
  ('Urban Drip', 'Denim Jacket', 'Washed denim jacket with a relaxed fit. Layers easily over tees and dresses.', 'Jackets', 899, 199, 5, '["S","M","L","XL"]', '["Blue"]', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80', true),
  ('Ethnic Elegance', 'Silk Saree', 'Pure silk saree with a zari border, finished with a matching blouse piece.', 'Ethnic', 2500, 499, 2, '["Free Size"]', '["Maroon","Gold"]', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80', true),
  ('Trendy Threads', 'Casual Linen Shirt', 'Lightweight linen shirt that stays cool on hot days.', 'Casuals', 450, 120, 0, '["M","L","XL"]', '["White","Beige"]', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80', false),
  ('Style Hub', 'Party Gown', 'Floor-length evening gown with a flowing skirt for weddings and parties.', 'Party Wear', 3200, 799, 2, '["S","M","L"]', '["Wine","Emerald"]', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80', true),
  ('Urban Drip', 'Leather Biker Jacket', 'Genuine leather biker jacket with asymmetric zip and quilted shoulders.', 'Jackets', 2800, 450, 2, '["M","L","XL"]', '["Black"]', 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=800&q=80', true),
  ('Ethnic Elegance', 'Cotton Kurta Set', 'Hand-block printed cotton kurta with matching pants and dupatta.', 'Ethnic', 1500, 350, 6, '["S","M","L","XL","XXL"]', '["Indigo","Mustard"]', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80', true)
) AS p(shop_name, name, description, category, price, rental_price, stock, sizes, colors, image, available)
JOIN "shops" s ON s.name = p.shop_name AND s.owner_id IS NULL;
