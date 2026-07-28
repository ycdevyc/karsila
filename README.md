# Karsila

Karsila is a multilingual marketplace for private airport transfers in
Antalya, Türkiye. Travellers submit a route, verified local drivers send
fixed-price offers, and the traveller chooses the preferred driver.

## Application areas

- Public website: English, Russian and Turkish
- Transfer request and status portal: English and Russian
- Driver environment: Turkish
- Admin environment: English

## Technology

- Next.js App Router
- TypeScript
- Tailwind CSS and shadcn/ui
- Supabase Auth, Database and Storage

## Local development

Requirements:

- Node.js 20 or newer
- npm
- Access to the Karsila Supabase project

Create the local environment file:

```bash
cp .env.example .env.local
```

Enter the three Supabase values in `.env.local`, then install and start:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Required environment variables

| Variable | Exposure | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Browser-safe anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Private | Server-side registration and admin operations |

The service-role key must only be configured in the hosting environment. Never
commit `.env.local` and never expose this key with a `NEXT_PUBLIC_` prefix.

## Production checks

Run these checks before every production deployment:

```bash
npm run lint
npm run build
```

Also verify:

1. The public homepage works at `/en`, `/ru` and `/tr`.
2. The request flow works at `/en/request` and `/ru/request`.
3. A traveller can create a request and open the protected status link.
4. An approved driver can sign in, view open requests and send one offer.
5. The traveller can accept an offer.
6. The assigned ride appears in the driver dashboard.
7. An admin can review a pending driver application.

## Vercel deployment

1. Push the current repository to GitHub.
2. Import the repository in Vercel as a Next.js project.
3. Add all variables from `.env.example` under Production environment
   variables.
4. Deploy the production branch.
5. Add `karsila.app` and `www.karsila.app` to the Vercel project.
6. Copy the DNS records shown by Vercel into Dynadot.
7. Choose `karsila.app` as the primary domain and redirect `www` to it.

Do not change Dynadot DNS records until a successful Vercel preview deployment
has been tested.

## Supabase production settings

After the production domain is active:

1. Set the Supabase Site URL to `https://karsila.app`.
2. Add `https://karsila.app/**` to the allowed redirect URLs.
3. Keep `http://localhost:3000/**` as an allowed redirect URL for local
   development.
4. Confirm that the `driver-documents` bucket remains private.
5. Confirm that all migrations in `supabase/migrations` have been applied.
6. Never expose the service-role key in browser code, logs or screenshots.

## Database migrations

The production hardening migrations are stored in:

```text
supabase/migrations/
```

They cover atomic driver registration, driver-data RLS, ride/offer RLS and the
admin driver-review workflow. Apply migrations in filename order and verify the
security checks before deployment.

## Brand

The public brand assets are stored in:

```text
public/brand/
```

The canonical production URL is:

```text
https://karsila.app
```
