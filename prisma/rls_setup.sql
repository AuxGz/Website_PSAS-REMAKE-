-- ============================================================================
-- PSAS RLS (Row Level Security) Full Setup
-- Run this in Supabase SQL Editor or via psql
-- ============================================================================

BEGIN;

-- ============================================================================
-- STEP 1: Enable RLS on all tables
-- ============================================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_addresses ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 2: Admin Helper Function (reads from JWT app_metadata)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN',
    FALSE
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================================
-- STEP 3: Sync profile role -> auth.users raw_app_meta_data (trigger)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.sync_profile_role_to_user_claims()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = 
    COALESCE(raw_app_meta_data, '{}'::jsonb) || 
    jsonb_build_object('role', NEW.role::text)
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS sync_profile_role_trigger ON public.profiles;
CREATE TRIGGER sync_profile_role_trigger
  AFTER INSERT OR UPDATE OF role ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_profile_role_to_user_claims();

-- ============================================================================
-- STEP 4: Role Escalation Protection (prevent users from changing own role)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.check_profile_role_update()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'Unauthorized: you cannot change your own role.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS enforce_profile_role_protection ON public.profiles;
CREATE TRIGGER enforce_profile_role_protection
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.check_profile_role_update();

-- ============================================================================
-- STEP 5: One-time migration — sync existing profiles to auth.users
-- ============================================================================

UPDATE auth.users u
SET raw_app_meta_data = 
  COALESCE(u.raw_app_meta_data, '{}'::jsonb) || 
  jsonb_build_object('role', p.role::text)
FROM public.profiles p
WHERE u.id = p.user_id;

-- ============================================================================
-- STEP 6: RLS Policies
-- ============================================================================

-- ─────────────────────────────────────────────
-- 6A. PRODUCTS — public read, admin write
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS "Allow public read products" ON public.products;
DROP POLICY IF EXISTS "Allow admin manage products" ON public.products;

CREATE POLICY "Allow public read products" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Allow admin manage products" ON public.products
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─────────────────────────────────────────────
-- 6B. CATEGORIES — public read, admin write
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS "Allow public read categories" ON public.categories;
DROP POLICY IF EXISTS "Allow admin manage categories" ON public.categories;

CREATE POLICY "Allow public read categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Allow admin manage categories" ON public.categories
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─────────────────────────────────────────────
-- 6C. PRODUCT_IMAGES — public read, admin write
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS "Allow public read product_images" ON public.product_images;
DROP POLICY IF EXISTS "Allow admin manage product_images" ON public.product_images;

CREATE POLICY "Allow public read product_images" ON public.product_images
  FOR SELECT USING (true);

CREATE POLICY "Allow admin manage product_images" ON public.product_images
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─────────────────────────────────────────────
-- 6D. PROFILES — own data only (+ admin read all)
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS "Allow users to read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to delete own profile" ON public.profiles;

CREATE POLICY "Allow users to read own profile" ON public.profiles
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Allow users to insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow users to update own profile" ON public.profiles
  FOR UPDATE 
  USING (user_id = auth.uid() OR public.is_admin()) 
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Allow users to delete own profile" ON public.profiles
  FOR DELETE USING (user_id = auth.uid() OR public.is_admin());

-- ─────────────────────────────────────────────
-- 6E. ORDERS — own only (+ admin read/manage all)
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS "Allow users to read own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow users to insert own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow users to update own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow users to delete own orders" ON public.orders;

CREATE POLICY "Allow users to read own orders" ON public.orders
  FOR SELECT USING (
    profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "Allow users to insert own orders" ON public.orders
  FOR INSERT WITH CHECK (
    profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Allow users to update own orders" ON public.orders
  FOR UPDATE USING (
    profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR public.is_admin()
  ) WITH CHECK (
    profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "Allow users to delete own orders" ON public.orders
  FOR DELETE USING (
    profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR public.is_admin()
  );

-- ─────────────────────────────────────────────
-- 6F. CART_ITEMS — own only
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS "Allow users to read own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Allow users to insert own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Allow users to update own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Allow users to delete own cart items" ON public.cart_items;

CREATE POLICY "Allow users to read own cart items" ON public.cart_items
  FOR SELECT USING (
    profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Allow users to insert own cart items" ON public.cart_items
  FOR INSERT WITH CHECK (
    profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Allow users to update own cart items" ON public.cart_items
  FOR UPDATE USING (
    profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  ) WITH CHECK (
    profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Allow users to delete own cart items" ON public.cart_items
  FOR DELETE USING (
    profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- ─────────────────────────────────────────────
-- 6G. ORDER_ITEMS — own only (via order ownership)
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS "Allow users to read own order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow users to insert own order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow users to update own order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow users to delete own order items" ON public.order_items;

CREATE POLICY "Allow users to read own order items" ON public.order_items
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM public.orders 
      WHERE profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
    OR public.is_admin()
  );

CREATE POLICY "Allow users to insert own order items" ON public.order_items
  FOR INSERT WITH CHECK (
    order_id IN (
      SELECT id FROM public.orders 
      WHERE profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Allow users to update own order items" ON public.order_items
  FOR UPDATE USING (
    order_id IN (
      SELECT id FROM public.orders 
      WHERE profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
    OR public.is_admin()
  ) WITH CHECK (
    order_id IN (
      SELECT id FROM public.orders 
      WHERE profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
    OR public.is_admin()
  );

CREATE POLICY "Allow users to delete own order items" ON public.order_items
  FOR DELETE USING (
    order_id IN (
      SELECT id FROM public.orders 
      WHERE profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
    OR public.is_admin()
  );

-- ─────────────────────────────────────────────
-- 6H. REVIEWS — public read, authenticated write (purchased only)
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS "Allow public read reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow authenticated insert own reviews for purchased products" ON public.reviews;
DROP POLICY IF EXISTS "Allow users to update own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow users to delete own reviews" ON public.reviews;

CREATE POLICY "Allow public read reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert own reviews for purchased products" ON public.reviews
  FOR INSERT TO authenticated WITH CHECK (
    profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.orders o
      JOIN public.order_items oi ON oi.order_id = o.id
      WHERE o.profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
        AND oi.product_id = reviews.product_id
        AND o.status::text IN ('PAID', 'PROCESSING')
    )
  );

CREATE POLICY "Allow users to update own reviews" ON public.reviews
  FOR UPDATE USING (
    profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  ) WITH CHECK (
    profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Allow users to delete own reviews" ON public.reviews
  FOR DELETE USING (
    profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR public.is_admin()
  );

-- ─────────────────────────────────────────────
-- 6I. SHIPPING_ADDRESSES — own only
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS "Allow users to read own addresses" ON public.shipping_addresses;
DROP POLICY IF EXISTS "Allow users to insert own addresses" ON public.shipping_addresses;
DROP POLICY IF EXISTS "Allow users to update own addresses" ON public.shipping_addresses;
DROP POLICY IF EXISTS "Allow users to delete own addresses" ON public.shipping_addresses;

CREATE POLICY "Allow users to read own addresses" ON public.shipping_addresses
  FOR SELECT USING (
    profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "Allow users to insert own addresses" ON public.shipping_addresses
  FOR INSERT WITH CHECK (
    profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Allow users to update own addresses" ON public.shipping_addresses
  FOR UPDATE USING (
    profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  ) WITH CHECK (
    profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Allow users to delete own addresses" ON public.shipping_addresses
  FOR DELETE USING (
    profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- ============================================================================
-- STEP 7: Performance Indexes for RLS subqueries
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_profile_id ON public.orders(profile_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_profile_id ON public.cart_items(profile_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_profile_id ON public.reviews(profile_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_shipping_addresses_profile_id ON public.shipping_addresses(profile_id);

COMMIT;

-- ============================================================================
-- VERIFICATION: Run this after to confirm everything is enabled
-- ============================================================================
-- SELECT tablename, rowsecurity AS rls_enabled
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- ORDER BY tablename;
