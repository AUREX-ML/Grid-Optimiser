# Go-To-Market (GTM) — Kenya CRE VPP

This is a starter GTM document for the **VPP for Commercial Real Estate (CRE)** concept. It focuses on how to acquire pilot sites, prove value quickly, and scale across a portfolio.

## 1) Target Customers

### Primary
- Mall operators
- Business parks / office parks
- Warehouses / logistics hubs

### Secondary / Influencers
- Solar EPCs and O&M providers serving C&I customers
- Battery and inverter vendors
- Property management firms

## 2) Buyer Personas & Incentives

- **Property owner / asset manager:** wants ROI, lower utility spend, higher tenant satisfaction.
- **Facility manager:** wants reliability, simpler monitoring, fewer outages/complaints.
- **Finance team:** wants predictable energy costs and payback clarity.
- **Tenants:** want stable power, lower tariffs (internal trading concept), and ESG benefits.

## 3) Value Proposition (what you sell)

### Core value (Staging)
- Reduce peak demand charges / bills via optimization.
- Improve reliability via coordinated storage dispatch.
- Single-pane monitoring of PV + batteries + major loads.

### Future value (Pro)
- Bi-directional export / grid services revenue (subject to regulation).
- P2P / internal energy trading mechanisms for multi-tenant sites.

## 4) Pricing (starter options)

Pick a model that matches CRE procurement realities.

1. **SaaS per site per month**
   - Tier by number of meters/assets or kW capacity.
2. **Performance fee**
   - % of verified savings (requires baseline + M&V discipline).
3. **Hybrid**
   - Low platform fee + performance bonus on DR events.

## 5) Pilot Strategy (first 90 days)

### Pilot goals
- Demonstrate measurable peak shaving / energy shifting.
- Validate telemetry + control loop reliability.
- Produce a case study with before/after metrics.

### Pilot package
- 1 gateway (Raspberry Pi) + edge integration
- Portfolio dashboard (ThingsBoard)
- 1–2 dispatch playbooks (peak window + outage prevention)

### What you need from the site
- DER inventory and access to inverter/BMS data
- Permission to install gateway and connect to LAN/4G
- Agreement on comfort constraints (HVAC) and critical loads

## 6) Partnerships

- **Solar EPCs:** channel partner; bundle VPP monitoring/control with new PV installs.
- **Battery vendors:** co-marketing; integrate BMS APIs; possibly offer financing.
- **Telecoms/ISPs:** connectivity bundles for reliable telemetry.
- **Property management firms:** faster multi-site rollout.

## 7) Sales Motion

1. Identify high-consumption CRE assets with PV/battery installations or plans.
2. Offer a short diagnostic: tariff + interval data review + DER readiness check.
3. Close a pilot (paid if possible) with clear success metrics.
4. Convert to annual contract; expand to additional buildings.

## 8) Proof & Trust Assets (what to build early)

- Security overview (TLS, device identity, access controls)
- Uptime/monitoring status page (internal)
- Case study template
- ROI calculator spreadsheet (simple, transparent assumptions)

## 9) Key KPIs

- Pilot conversions to annual contracts
- kW peak reduction and kWh shifted
- Platform uptime and response latency
- Cost savings per site (monthly)
- Gross margin per site (after connectivity/support costs)
