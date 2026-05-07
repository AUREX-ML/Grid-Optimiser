# Digital Energy Challenge 2026 — Challenge Fit Matrix (VPP for Kenyan CRE)

This document maps the **VPP for Commercial Real Estate (CRE) in Kenya** concept to the **Digital Energy Challenge 2026** requirements and focus areas, and outlines a delivery plan that is implementable within **12 months**.

## 1) Program Track Fit

### Recommended track: Tech Accelerator
- Geographic fit: applicable across African countries (explicitly includes Kenya).
- Project type: digital energy solution (software/data/cloud/telecom).
- Grant: up to **€150,000**.

### Not targeted: Partnership Challenge
- Partnership Challenge is specific to Nigeria with AEDC.

## 2) Eligibility Checklist (Self-Assessment)

> Update this table with your company’s actual details before submission.

| Requirement | Stated requirement | Project position / evidence to provide |
|---|---|---|
| Organization type | Innovative SME | Company registration docs; pitch deck |
| Size | < 250 employees | HR/org chart |
| Turnover | < €50M | Latest financials or management accounts |
| Stage | Beyond ideation; already piloted | Pilot site(s) MoU, pilot report, telemetry screenshots |
| Implementation | Implementable within 12 months | Workplan + milestones (Section 5) |
| Digital nature | Software/data/telecom/cloud | Architecture (MyEMS+MQTT+ThingsBoard), data model |

## 3) Focus Area Alignment

Digital Energy Challenge focus areas (from notes):
- Grid planning
- Microgrid / distributed energy management
- Integrated network visibility

### How the VPP-for-CRE aligns

| Focus area | What the challenge wants | What we provide |
|---|---|---|
| Integrated network visibility | Better visibility of distributed assets | ThingsBoard aggregates multi-site telemetry into a portfolio view; site dashboards via MyEMS |
| Distributed energy management | Control/optimization of DERs | Dispatch signals to batteries/loads; local logic at edge; cloud optimization events |
| Grid planning (data) | Data to support planning and operations | Time-series data on available flexible capacity, load profiles, PV generation, battery SOC |

## 4) Innovation Summary (for application narrative)

### Problem
Kenyan CRE sites are rapidly adopting captive solar and storage for reliability and cost control, but these assets are mostly **isolated** and do not contribute systematically to grid flexibility.

### Solution
A **distributed VPP** that aggregates CRE DERs (PV, batteries, controllable loads, EV charging) and coordinates them as a single resource for:
- peak shaving and demand response
- improved reliability at site and portfolio level
- future bi-directional grid services / trading where regulations allow

### Differentiators
- **Edge resiliency:** sites keep operating even if cloud connectivity is intermittent.
- **Open-source backbone:** MyEMS CE + ThingsBoard CE + MQTT reduces vendor lock-in and costs.
- **Portfolio scaling:** repeatable edge node pattern (Raspberry Pi gateway) allows rapid replication across buildings.

## 5) 12-Month Implementation Plan (deliverable within the challenge window)

### Phase 0 (Weeks 1–4): Mobilization & Design
- Confirm pilot sites (at least 1–3 CRE buildings).
- Define DER inventory per site (PV, battery specs, major controllable loads).
- Data & control requirements definition (telemetry frequency, command set).
- Security baseline: device identity, TLS for MQTT, access controls.

**Deliverables:** solution design, site integration plan, risk register, M&E baseline.

### Phase 1 (Months 2–4): Edge Integration (MyEMS + Gateway)
- Deploy Raspberry Pi gateway at each pilot site.
- Integrate DERs via Modbus-TCP (or available protocols).
- Implement MQTT post service with structured JSON telemetry.
- Validate local dashboards and offline operations.

**Deliverables:** working edge node(s), validated telemetry, site dashboards.

### Phase 2 (Months 4–6): Cloud Aggregation (ThingsBoard)
- Deploy ThingsBoard CE instance.
- Model asset hierarchy (Site → Assets → Portfolio).
- Implement aggregation KPIs: total available capacity, SOC, forecasted flexibility.
- Build NOC-style dashboard for portfolio monitoring.

**Deliverables:** portfolio view, dashboards, alerting.

### Phase 3 (Months 6–9): Control & Optimization MVP
- Define dispatch events (peak window, price signals, grid stress triggers).
- Implement threshold-based optimization events.
- Send control commands to edge: discharge/charge, load shed, HVAC setpoint adjustments.
- Safety and constraint handling (battery SOC limits, tenant comfort bounds).

**Deliverables:** closed-loop control MVP, event logs, safety constraints.

### Phase 4 (Months 9–12): Demonstration, M&E, and Scale Plan
- Run measured demand response events.
- Quantify impact: kW reduced, kWh shifted, reliability, cost savings.
- Prepare scale replication kit: onboarding checklist, standard gateway image, integration templates.
- Produce final report and investor/funder materials.

**Deliverables:** pilot results report, scale plan, replication toolkit.

## 6) Monitoring & Evaluation (M&E) Metrics (starter set)

- **Flexible capacity (kW):** dispatchable power available per site and portfolio.
- **Energy shifted (kWh):** during peak windows.
- **Peak reduction (%):** reduction vs baseline.
- **Uptime (%):** edge node and cloud availability.
- **Response time (seconds/minutes):** event trigger → DER response.
- **CO2 avoided (tCO2e):** if displacing thermal peaker generation (assumptions documented).

## 7) Risks & Mitigations (starter set)

- **Connectivity variability:** edge-first logic; store-and-forward MQTT.
- **DER integration complexity:** prioritize common inverters/BMS; staged integration.
- **Operational safety:** hard limits at edge; human override; audit logs.
- **Regulatory constraints on export/trading:** start with behind-the-meter optimization; keep grid export as roadmap.
