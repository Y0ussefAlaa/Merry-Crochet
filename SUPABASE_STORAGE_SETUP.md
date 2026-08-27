# Supabase Storage Setup

The web app keeps Firebase for authentication and Firestore product documents. Supabase is used only for product image files.

## Dashboard setup

1. Open Supabase Dashboard for project `cewwvigjufvoehrbzzvm`.
2. Go to **Storage** and create a bucket named `images`.
3. Set the bucket to **Public** because the storefront displays product image URLs directly.
4. Run `SUPABASE_STORAGE_POLICIES.sql` in the Supabase SQL Editor.

The policies allow browser uploads and deletes only below `products/`. This is necessary because Firebase Authentication does not populate Supabase's `auth.uid()` context.

## Security note

The browser uses only the publishable key. Never put a Supabase `service_role` key in `.env`, source code, or a browser bundle.

A public bucket means anyone who knows a file URL can read that file. The current product images are intended to be public. For private files, keep the bucket private and move upload/delete authorization to a trusted server or Supabase Edge Function that verifies the Firebase ID token; generate signed URLs for reads instead of calling `getPublicUrl`.

## Test flow

1. Sign in to the existing Firebase admin account.
2. Open **Admin > Products > Add Product**.
3. Select an image smaller than 10 MB.
4. Submit the product form.
5. Confirm the file appears under `images/products/{generated-id}/image.ext`.
6. Confirm the Firestore `products/{id}` document contains the Supabase public URL in `image`.
7. Refresh the product list and storefront; the image should still load from the saved URL.
