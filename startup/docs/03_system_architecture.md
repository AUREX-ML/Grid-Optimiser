# System Architecture: Distributed VPP for Commercial Real Estate

This is a modular architecture bridging local operational control (Edge) and centralized grid intelligence (Cloud).

## 1. Edge Layer: Site-Level Management (MyEMS)
Each site (mall/office park) has a Raspberry Pi Gateway as an Intelligent Edge Node.

- **Service layer:** local MyEMS (CE) manages energy data lifecycle.
- **DER integration:** solar PV, batteries, HVAC via Modbus-TCP and industrial protocols.
- **Operational logic:** real-time business logic, site reporting, local dashboards.
- **Resilience:** site remains functional if cloud connectivity is interrupted.

## 2. Communication Layer: Data Orchestration (MQTT)
Each MyEMS instance wrapped with an MQTT post service.

- **Payload:** structured JSON telemetry + DER status.
- **Security:** secure, async transmission edge → cloud.

## 3. Cloud Layer: Centralized Command Center (ThingsBoard CE)
ThingsBoard (CE) acts as the VPP “brain”.

- **Asset hierarchy:** Telemetry → Site Node → Asset Group → National VPP
- **Aggregation:** real-time calculations to derive total system capacity.

## 4. Control Logic: Grid-Responsive Optimization
Demand response + optimization algorithm:

- **Threshold monitoring:** compare VPP capacity vs live national grid demand/load.
- **Automated dispatch:** on critical threshold, trigger optimization event.
- **Downstream control:** send commands back to edge to discharge batteries or shed non-critical loads.

## 5. Roadmap
- **Staging (current):** demand-side management + internal optimization (reduce bills, reduce strain).
- **Pro version:** bi-directional energy flow + net metering / P2P trading marketplace.

## 6. Graphical design (multi-site VPP topology)

```mermaid
flowchart TD
    %% Virtual Power Plant (VPP) Architectural Design

    subgraph SITE1["SITE-1"]
        DER1A["DER-1"]
        DER2A["DER-2"]
        DER3A["DER-3"]
        DER4A["DER-4"]

        PI1["Raspberry Pi (MyEMS Edge Gateway)"]

        DER1A --> PI1
        DER2A --> PI1
        DER3A --> PI1
        DER4A --> PI1
    end

    subgraph SITE2["SITE-2"]
        DER1B["DER-1"]
        DER2B["DER-2"]
        DER3B["DER-3"]
        DER4B["DER-4"]

        PI2["Raspberry Pi (MyEMS Edge Gateway)"]

        DER1B --> PI2
        DER2B --> PI2
        DER3B --> PI2
        DER4B --> PI2
    end

    TB["ThingsBoard Central Dashboard / VPP Controller"]

    PI1 <--> |MQTT| TB
    PI2 <--> |MQTT| TB
```
