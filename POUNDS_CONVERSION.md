# Price System Conversion: Pence to Pounds

## Overview
Successfully converted the entire application from storing prices in pence (integer) to storing prices in pounds (decimal). This simplifies the codebase and makes it more intuitive.

## Changes Made

### 1. Constants Updated
**File:** `lib/constants.ts`
- `DEFAULT_DELIVERY_FEE`: 5000 → 50 (£50.00)
- `FREE_DELIVERY_THRESHOLD`: 10000 → 100 (£100.00)
- `MIN_ORDER_AMOUNT`: 500 → 5 (£5.00)

### 2. Customer Frontend Pages

#### Cart Page (`app/(customer)/cart/page.tsx`)
- ✅ Removed all pence conversions
- ✅ Calculations now use pounds directly
- ✅ Updated free delivery threshold calculation
- ✅ Price display: `price.toFixed(2)` instead of `(price / 100).toFixed(2)`

#### Checkout Page (`app/(customer)/checkout/page.tsx`)
- ✅ Removed subtotalInPence/deliveryFeeInPence variables
- ✅ Order creation sends pounds values
- ✅ All calculations in pounds

#### Shop Page (`app/(customer)/shop/page.tsx`)
- ✅ Product price display updated
- ✅ Cart item creation uses pounds

#### Product Detail Page (`app/(customer)/shop/[slug]/page.tsx`)
- ✅ Main price display updated
- ✅ Size variation prices updated
- ✅ Related products prices updated
- ✅ Price per unit display updated

#### Home Page (`app/(customer)/page.tsx`)
- ✅ Featured product prices updated
- ✅ Cart item creation uses pounds

### 3. Admin Pages

#### Admin Products (`app/admin/products/page.tsx`)
- ✅ Product creation: removed `* 100` conversion
- ✅ Product editing: removed `/ 100` conversion
- ✅ Price display: direct pounds display

#### Admin Orders (`app/admin/orders/page.tsx`)
- ✅ Order total display updated
- ✅ Removed `/ 100` conversions

#### Admin Settings (`app/admin/settings/page.tsx`)
- ✅ Removed pence conversions on load
- ✅ Removed pence conversions on save
- ✅ Form now works directly in pounds

### 4. API Routes

#### Order Creation (`app/api/orders/create/route.ts`)
- ✅ Updated comments: prices now in pounds
- ✅ Delivery fee calculation updated (100 instead of 5000)
- ✅ Removed integer forcing (`| 0`)
- ✅ Server-side validation uses pounds

#### Payment Intent (`app/api/payment/create-intent/route.ts`)
- ✅ Added conversion to pence for Stripe: `Math.round(order.total * 100)`
- ℹ️ **Note:** Stripe requires amounts in smallest currency unit (pence for GBP)
- ✅ Payment records stored in pounds

#### Products API (`app/api/products/route.ts`)
- ✅ Removed `Math.round(parseFloat(price) * 100)`
- ✅ Now stores `parseFloat(price)` directly

### 5. Database Schema

#### Convex Schema (`convex/schema.ts`)
All comments updated:
- ✅ Products: `price: v.number() // Store as pounds (decimal)`
- ✅ Orders: `subtotal/deliveryFee/total // in pounds (decimal)`
- ✅ Order Items: `price/subtotal // in pounds (decimal)`
- ✅ Payments: `amount // in pounds (decimal)`
- ✅ Settings: `deliveryFee/freeDeliveryThreshold // in pounds (decimal)`

#### Seed Data (`convex/seed.ts`)
- ✅ `deliveryFee`: 500 → 50
- ✅ `freeDeliveryThreshold`: 5000 → 100
- ✅ Comments updated

### 6. Data Migration

#### Migration Script (`convex/migrate-prices-to-pounds.ts`)
Created comprehensive migration script:
- Converts all product prices (÷ 100)
- Converts all order amounts (÷ 100)
- Converts all order item prices (÷ 100)
- Converts all payment amounts (÷ 100)
- Converts settings values (÷ 100)
- Includes safety check: only migrates if value > 10 (assumes pence)
- Includes status checker: `checkMigrationStatus`

**To run migration:**
```bash
npx convex run migrate-prices-to-pounds:migrateAllPricesToPounds
```

**To check if migration is needed:**
```bash
npx convex run migrate-prices-to-pounds:checkMigrationStatus
```

## Before vs After

### Before (Pence System)
```typescript
// Product creation
price: Math.round(parseFloat(price) * 100) // 15.99 → 1599

// Product display
£{(product.price / 100).toFixed(2)} // 1599 → £15.99

// Calculations
const subtotalInPence = getTotalPrice(); // 1599
const deliveryFeeInPence = 500; // £5.00
const total = (subtotalInPence + deliveryFeeInPence) / 100; // £21.99

// Constants
DEFAULT_DELIVERY_FEE = 5000 // £50.00
```

### After (Pounds System)
```typescript
// Product creation
price: parseFloat(price) // 15.99 → 15.99

// Product display
£{product.price.toFixed(2)} // 15.99 → £15.99

// Calculations
const subtotal = getTotalPrice(); // 15.99
const deliveryFee = 50; // £50.00
const total = subtotal + deliveryFee; // 65.99

// Constants
DEFAULT_DELIVERY_FEE = 50 // £50.00
```

## Important Notes

1. **Stripe Integration**
   - Stripe still requires pence (smallest currency unit)
   - Conversion happens in payment intent creation: `Math.round(order.total * 100)`
   - This is the ONLY place where pence conversion is needed

2. **Data Types**
   - Changed from `number (integer)` to `number (decimal)`
   - Use `.toFixed(2)` for display formatting
   - No more `Math.round()` needed for storage

3. **Migration**
   - Must run migration script ONCE before deployment
   - Script includes safety checks (only migrates if price > 10)
   - Can check status before running full migration

4. **Benefits**
   - ✅ Simpler code (no conversions needed)
   - ✅ More intuitive (matches what users see)
   - ✅ Easier to maintain
   - ✅ Fewer bugs (no conversion errors)
   - ✅ Better developer experience

## Testing Checklist

- [ ] Run migration script on production database
- [ ] Verify existing products display correctly
- [ ] Test creating new products (enter 15.99, should store 15.99)
- [ ] Test cart calculations (subtotal, delivery, total)
- [ ] Test checkout flow
- [ ] Test payment integration (Stripe receives correct pence amount)
- [ ] Test admin order display
- [ ] Test admin settings (delivery fee, threshold)
- [ ] Verify existing orders display correctly

## Files Modified

### Frontend Pages (10 files)
1. `app/(customer)/cart/page.tsx`
2. `app/(customer)/checkout/page.tsx`
3. `app/(customer)/shop/page.tsx`
4. `app/(customer)/shop/[slug]/page.tsx`
5. `app/(customer)/page.tsx`
6. `app/admin/products/page.tsx`
7. `app/admin/orders/page.tsx`
8. `app/admin/settings/page.tsx`

### API Routes (3 files)
9. `app/api/orders/create/route.ts`
10. `app/api/payment/create-intent/route.ts`
11. `app/api/products/route.ts`

### Configuration (3 files)
12. `lib/constants.ts`
13. `convex/schema.ts`
14. `convex/seed.ts`

### Migration (1 file)
15. `convex/migrate-prices-to-pounds.ts` (NEW)

## Rollback Plan

If issues occur:
1. Revert all code changes (git revert)
2. Run reverse migration (multiply by 100 instead of divide)
3. Redeploy previous version

## Completion Status

✅ All code converted
✅ All comments updated
✅ Migration script created
⏳ Migration script needs to be run on database
⏳ Testing needed

## Next Steps

1. **Test in development:**
   ```bash
   npx convex run migrate-prices-to-pounds:checkMigrationStatus
   npx convex run migrate-prices-to-pounds:migrateAllPricesToPounds
   ```

2. **Verify changes:**
   - Check product prices in admin panel
   - Place a test order
   - Verify payment flow

3. **Deploy to production:**
   - Deploy code changes
   - Run migration script
   - Monitor for issues

---

**Conversion completed:** [Current Date]
**Migrated by:** GitHub Copilot
**Status:** Code complete, migration pending
