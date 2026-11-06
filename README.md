# Data Centers Tracker

A growing inventory and energy-footprint dashboard for data center infrastructure. Track facilities, owners/operators, locations, project status, IT capacity, estimated annual energy demand, PUE and on-site generation.

> **Data note:** The included facility records are illustrative demo data only, not a verified list of real facilities or a worldwide census. The global number of data centers is not inferred from this sample. Verify records and attach sources before using them for research or reporting.

## What the app currently does

- Dashboard metrics for tracked facilities, operational IT capacity, estimated annual demand and on-site generation.
- Region summary and searchable/filterable facility inventory.
- Facility records include owner/operator, city/country, region, status, IT load (MW), PUE, on-site generation capacity and energy-mix notes.
- Add facilities from the dashboard; additions persist in the current browser using local storage.
- Responsive layout for desktop and mobile.

## Energy calculation

For operational facilities with IT capacity and PUE entered:

`estimated annual energy demand (GWh/year) = IT capacity (MW) × PUE × 8,760 hours/year ÷ 1,000`

This is a simple estimate, not metered consumption. Planned and under-construction records are excluded from demand totals. On-site generation is recorded capacity in MW, not actual annual generation. Renewable power purchase agreements are not treated as on-site generation.

## Run locally

Requirements: Node.js 18+ and npm.

```bash
cd frontend
npm install
npm run start
```

Open the local URL printed by Vite. Create a production build with:

```bash
npm run build
```

The current dashboard runs without a backend. User-added records are stored in the browser that created them; they are not shared across users or devices. The existing backend and Docker scaffolding from the former DealTracker project have not yet been converted to a persistent data-center API.

## Suggested next steps

1. Replace demo records with sourced facility data and record source URL, verification date, confidence and capacity definition for each field.
2. Add a shared API and database with facility history, source provenance, user contributions and review workflows.
3. Distinguish facility count, campus count and building count; normalize operator/subsidiary relationships.
4. Capture measured consumption and generation periods separately from estimates and nameplate capacity.
5. Add a world map, data export and scheduled source refresh only after reliable data sources are selected.

## License

See the repository's `LICENSE` file.
