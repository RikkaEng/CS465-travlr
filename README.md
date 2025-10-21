# Travlr Getaways Project - CS465

A full‑stack web application that serves a public customer site and an authenticated admin SPA. The final iteration adds secure admin login and polishes the docs with this README and a short reflective journal.

---

##  Project Overview

- **Public site (server‑rendered):** Express + Handlebars (HBS) renders the customer‑facing pages.
- **REST API:** Express routes under `/api/*` expose trip data backed by MongoDB/Mongoose.
- **Admin site (SPA):** Angular app (`app_admin/`) for CRUD on trips and authentication‑gated features.
- **Database:** MongoDB (NoSQL), modeled with Mongoose schemas.
- **Security (Module 7):** Admin login on the Express backend, auth wrapping on API calls, and auth handling in the Angular SPA.

---

## Architecture

### Front end
- **Express + HBS (SSR):** Initial public pages began as static HTML, then were refactored into Handlebars templates with header/footer partials and data passed from controllers.
- **Angular SPA (Admin):** Created in `app_admin/` via Angular CLI. Features a trip listing component, data service, and forms for Add/Edit operations. The SPA calls the Express API and manages auth state on the client side.

### Backend
- **Express API:** Routes live under `app_api/` (`app_api/routes/index.js). Controllers in `app_api/controllers/` use Mongoose models to query MongoDB.
- **Mongoose models:** The `Trip` schema captures fields like `code`, `name`, `length`, `start`, `resort`, `perPerson`, `image`, and `description`.

### Why MongoDB? (NoSQL)
- Trip content fits naturally as JSON documents and evolves without costly migrations.
- Rapid prototyping: seeding and iterating on document fields is simple.
- Flexible querying and indexing across frequently queried fields (e.g., `code`, `name`).

---

## Getting Started

### Prereqs
- Node.js (LTS)
- **MongoDB Server running** locally or in Docker (Compass is optional but helpful)
- Angular CLI 

### Install & seed
```bash
# from repo root
npm install

# Ensure MongoDB *server* is running first (as a service or in Docker).
# start MongoDB locally first, then seed:
node app_api/models/seed.js
```

### Run
```bash
# 1) Express server (serves public site + REST API at http://localhost:3000)
npm start

# 2) Angular admin SPA (in another terminal)
cd app_admin
npm install
ng serve  # http://localhost:4200
```

#### (Optional) Connect with MongoDB Compass
- Use your local connection string (for example):
  - `mongodb://localhost:27017/travlr` 
- Verify `trips` collection contents after running `seed.js`.

---

## API examples

Base: `http://localhost:3000/api`

- **GET** `/trips` → list all trips  
- **GET** `/trips/:tripCode` → single trip by code  
- **POST** `/trips` → create new trip (admin only; requires auth)  
  - Body (JSON or form): `code, name, length, start, resort, perPerson, image, description`

> Note: Protected endpoints require valid authentication (e.g., token/cookie).

---

##  Testing

### Testing tools used
- **Postman** — exercised API endpoints, verified status codes/bodies, and tested auth‑required routes with/without credentials.
- **MongoDB Compass** — connected to the running MongoDB server to inspect collections, confirm `seed.js` results, and verify CRUD changes from the SPA/API.

### What we tested
- **Endpoints:** they are (200/201/400/401/403/404); payload structure for list vs. detail; error cases for invalid/missing fields.
- **Auth flow:** successful login issues tokens; protected routes reject unauthenticated calls; SPA gracefully redirects to login when needed.
- **SPA behavior:** form validation, optimistic UI updates, re‑fetch after create/update/delete, and proper error display on failures.

---

## Refactoring & Reuse

- **Static → templated:** Replaced large static HTML blocks with Handlebars templates and partials (header/footer) to remove duplication.
- **JSON‑driven views:** Controllers fetch data (initially local JSON for prototyping, then the API) and pass it into the view renderer.
- **Reusable Angular components/services:** Trip cards/table and a shared data service reduce duplication and centralize REST logic.
- **Seeding script:** `seed.js` programmatically clears and inserts seed data—handy for repeatable test setups.

---

## JSON vs. JavaScript (and how JSON ties front & back)

- **JavaScript** is a programming language; **JSON** is a text data format.
- The API returns JSON payloads; the frontends (Express or Angular) parse that JSON into JS objects to render UI and submit changes back to the server.
- This contract lets the API and front‑ends evolve independently while staying interoperable.

---

## Security (Module 7)

- **Backend:** Added user registration and login endpoints; middleware guards protect admin API routes.
- **API wrapping:** Front‑end requests include the appropriate auth (e.g., Bearer token or cookie) and handle 401/403 redirects to login.
- **SPA auth state:** Angular stores the user/auth state and conditionally shows admin features only to authenticated users.

> Be sure to create your admin user and verify protected route behavior before submitting.

---

## Repo Map

├─ app_api/
│  ├─ controllers/         # Express API controllers (trips, auth)
│  ├─ models/              # Mongoose models, db.js, seed.js
│  └─ routes/              # /api routes
├─ app_server/
│  ├─ controllers/         # SSR controllers (public site)
│  ├─ views/               # Handlebars templates (+ partials, layouts)
│  └─ routes/              # public routes
├─ app_admin/              # Angular admin SPA
└─ public/                 # static assets (css/images) for SSR site


---

## Seeding Data

If you change the schema or want a clean slate, re‑run:

```bash
node app_api/models/seed.js
```

This clears existing `trips` and inserts the latest seed data.

---

## Reflection (Journal)

**How this course moved me toward my goals.**  
Building a real, end‑to‑end app gave me confidence with the full lifecycle: environment setup, version control, SSR templating, REST design, an SPA front end, database modeling, and auth. I can now speak to how pieces fit together and why specific choices (like MongoDB for JSON‑shaped data) sped up iteration.

**Skills I developed.**  
- Express routing, middleware, and RESTful design
- Mongoose schema design, indexing, and seeding
- Angular components, services, and reactive forms
- API testing with **Postman**; DB inspection with **MongoDB Compass**
- Authentication paths across backend and SPA (login, protecting routes)
- Practical refactoring (partials/components), and clean code patterns

**Marketability.**  
I now have a working repository that demonstrates: (1) a documented full‑stack architecture, (2) secure admin features, (3) API + SPA collaboration, and (4) disciplined git usage. This project is portfolio‑ready and maps directly to junior full‑stack and front‑end roles that expect CRUD apps with auth, form handling, and basic API design.
