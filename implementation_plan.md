# Deep Connection Plan (Frontend & Backend)

The initial base connection is working, but your frontend components (`Login.jsx`, `Browse.jsx`) are still using static mock data (`demoUsers`, `products` array). This plan details the surgical updates needed to replace all mock data with live database calls while ensuring we don't break your existing beautiful UI.

## User Review Required

> [!WARNING]
> To make the frontend aware of the user's role and details upon login, **I propose modifying the Spring Boot backend's `AuthController.java`**. Currently, `login()` returns only a raw JWT string. I will create an `AuthResponse` class so it returns both the token AND the `User` object (e.g. `{"token": "xyz", "user": { "role": "CUSTOMER", ... }}`). This is an industry standard and critical for the React frontend routing.

## Proposed Changes

### Backend Spring Boot Modifications

#### [NEW] `wearify/src/main/java/com/wearify/dto/AuthResponse.java`
Create a DTO class holding a `String token` and a `User user` object.

#### [MODIFY] `wearify/src/main/java/com/wearify/controller/AuthController.java`
Update the `login()` endpoint to return `AuthResponse` instead of `String`.

### Frontend Data Wiring

#### [MODIFY] `Vastra_Vogue/tsconfig.json`
Add `"allowJs": true` to stop the TypeScript compiler from showing error squiggles on `.jsx` files in your IDE.

#### [MODIFY] `Vastra_Vogue/src/services/productService.js`
Incorporate a data adapter. The backend `Product.java` model uses single strings for `size` and `color`, but the frontend `mockData` uses arrays `sizes: []` and `colors: []`. This adapter will automatically map the backend representation to fit precisely into the frontend UI gracefully without breaking any components.

#### [MODIFY] `Vastra_Vogue/src/pages/Login.jsx`
Remove `demoUsers`. Replace the `handleSubmit` logic to call `authService.login(email, password)`. Read the returned user's `role` and conditionally navigate to `/customer`, `/vendor`, or `/admin`.

#### [MODIFY] `Vastra_Vogue/src/pages/customer/Browse.jsx`
Introduce a `useEffect` hook to fetch products securely from `productService.getAllProducts()` on page mount and replace the static `products` array from `mockData.js`. Add a loading state spinner while data is being pulled.

## Open Questions

- We will modify `Browse.jsx` as a proof-of-concept. Shall we also directly modify the landing page product lists, or do you want to test `Browse` first?
- Please approve the slight backend adjustment (`AuthResponse`) to ensure clean authentication architecture!

## Verification Plan

### Test Plan
- Run the backend on port `8081`. 
- Start Vite frontend.
- Provide you with dummy login credentials (or utilize the register API) to attempt a genuine AuthContext login spanning end-to-end.
- Load the `/customer/browse` page and visually confirm that data is originating from MongoDB.
