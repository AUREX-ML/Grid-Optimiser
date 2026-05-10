import { useState } from 'react';
import { MermaidDiagram } from './components/MermaidDiagram';
import { MermaidEditor } from './components/MermaidEditor';
import { Layers, Workflow, Radio, Zap, Cpu, Cloud, Edit, Monitor } from 'lucide-react';

const architectureDiagrams = {
  'System Hierarchy': `
    graph TB
      subgraph Physical["PHYSICAL LAYER"]
        Solar[Solar Arrays]
        Battery[Battery Storage]
        Grid[Grid Connection]
        HVAC[HVAC Systems]
        Meters[Smart Meters]
        Genset[Generators]
      end

      subgraph Edge["EDGE LAYER - Site Node"]
        RPI[MyEMS on Raspberry Pi<br/>Local Energy Controller]
        ModbusRTU[Modbus RTU/TCP]
        BACnet[BACnet Protocol]
        RS485[RS485 Interface]
      end

      subgraph SiteUI["SITE USER INTERFACE"]
        AdminUI[MyEMS Admin UI<br/>Site Configuration]
        WebUI[MyEMS Web UI<br/>Site Monitoring]
      end

      subgraph Transport["TRANSPORT LAYER"]
        MQTT[MQTT Broker<br/>Bi-directional Messaging]
      end

      subgraph Cloud["CLOUD LAYER - VPP Orchestration"]
        TB[ThingsBoard<br/>Central Command Center]
        DevReg[Device Registry]
        RuleEngine[Rule Chains]
        Analytics[Analytics Engine]
      end

      subgraph HQUI["CENTRAL HQ INTERFACE"]
        TBDash[ThingsBoard Dashboard<br/>VPP Control Center]
      end

      Solar --> RPI
      Battery --> RPI
      Grid --> RPI
      HVAC --> RPI
      Meters --> RPI
      Genset --> RPI

      RPI --> ModbusRTU
      RPI --> BACnet
      RPI --> RS485

      RPI --> AdminUI
      RPI --> WebUI

      RPI -->|Publish Telemetry| MQTT
      MQTT -->|Subscribe| TB

      TB --> DevReg
      TB --> RuleEngine
      TB --> Analytics

      TB -->|Commands| MQTT
      MQTT -->|Control| RPI

      TB --> TBDash

      style RPI fill:#3b82f6,stroke:#60a5fa,stroke-width:3px
      style TB fill:#8b5cf6,stroke:#a78bfa,stroke-width:3px
      style MQTT fill:#10b981,stroke:#34d399,stroke-width:3px
      style AdminUI fill:#f59e0b,stroke:#fbbf24,stroke-width:2px
      style WebUI fill:#f59e0b,stroke:#fbbf24,stroke-width:2px
      style TBDash fill:#ec4899,stroke:#f472b6,stroke-width:2px
  `,

  'Data Flow': `
    graph LR
      subgraph Site1["Site Node 1"]
        E1[Edge Controller<br/>MyEMS]
        D1[(Local Buffer)]
      end

      subgraph Site2["Site Node 2"]
        E2[Edge Controller<br/>MyEMS]
        D2[(Local Buffer)]
      end

      subgraph SiteN["Site Node N"]
        EN[Edge Controller<br/>MyEMS]
        DN[(Local Buffer)]
      end

      subgraph Broker["Message Broker"]
        MQTT[MQTT Broker<br/>TLS Encrypted]
      end

      subgraph VPP["VPP Control Center"]
        TB[ThingsBoard]
        TSDB[(Time Series DB)]
        Cache[(Redis Cache)]
      end

      subgraph Apps["Applications"]
        Web[Web Dashboard]
        Mobile[Mobile App]
        External[External APIs]
      end

      E1 -->|Telemetry| D1
      E2 -->|Telemetry| D2
      EN -->|Telemetry| DN

      D1 -->|MQTT Pub| MQTT
      D2 -->|MQTT Pub| MQTT
      DN -->|MQTT Pub| MQTT

      MQTT -->|Subscribe| TB
      TB --> TSDB
      TB --> Cache

      TB -->|Commands| MQTT
      MQTT -->|Control| E1
      MQTT -->|Control| E2
      MQTT -->|Control| EN

      TB --> Web
      TB --> Mobile
      TB --> External

      style E1 fill:#3b82f6,stroke:#60a5fa
      style E2 fill:#3b82f6,stroke:#60a5fa
      style EN fill:#3b82f6,stroke:#60a5fa
      style TB fill:#8b5cf6,stroke:#a78bfa,stroke-width:3px
      style MQTT fill:#10b981,stroke:#34d399,stroke-width:3px
  `,

  'MQTT Topic Architecture': `
    graph TB
      Root[gridoptimiser/]

      Root --> Site1[site_001/]
      Root --> Site2[site_002/]
      Root --> SiteN[site_nnn/]

      Site1 --> S1Solar[solar/]
      Site1 --> S1Battery[battery/]
      Site1 --> S1Grid[grid/]
      Site1 --> S1HVAC[hvac/]
      Site1 --> S1Gen[generator/]
      Site1 --> S1Status[status/]
      Site1 --> S1Control[control/]

      S1Solar --> S1SPower[power]
      S1Solar --> S1SVoltage[voltage]
      S1Solar --> S1SCurrent[current]
      S1Solar --> S1SEnergy[energy]

      S1Battery --> S1BSOC[soc]
      S1Battery --> S1BPower[power]
      S1Battery --> S1BVoltage[voltage]
      S1Battery --> S1BTemp[temperature]
      S1Battery --> S1BHealth[health]

      S1Grid --> S1GImport[import]
      S1Grid --> S1GExport[export]
      S1Grid --> S1GFreq[frequency]
      S1Grid --> S1GVoltage[voltage]

      S1Control --> S1CCharge[charge_cmd]
      S1Control --> S1CDischarge[discharge_cmd]
      S1Control --> S1CLoad[load_shed_cmd]
      S1Control --> S1CGenset[genset_cmd]

      S1Status --> S1STHealth[health]
      S1Status --> S1STAlarm[alarms]
      S1Status --> S1STConn[connectivity]

      style Root fill:#8b5cf6,stroke:#a78bfa,stroke-width:3px
      style Site1 fill:#3b82f6,stroke:#60a5fa,stroke-width:2px
      style S1Control fill:#ef4444,stroke:#f87171,stroke-width:2px
      style S1Status fill:#10b981,stroke:#34d399,stroke-width:2px
  `,

  'Control Command Flow': `
    sequenceDiagram
      participant Operator
      participant Dashboard
      participant ThingsBoard
      participant MQTT
      participant EdgeController
      participant DER as DER Assets

      Operator->>Dashboard: Initiate DR Event
      Dashboard->>ThingsBoard: POST /api/control/demand-response

      ThingsBoard->>ThingsBoard: Validate Command<br/>Check Authorization<br/>Select Target Sites

      ThingsBoard->>MQTT: Publish Command<br/>gridoptimiser/site_001/control/load_shed_cmd

      MQTT->>EdgeController: Deliver Command

      EdgeController->>EdgeController: Validate Safety<br/>Check Local Constraints<br/>Calculate Response

      EdgeController->>DER: Execute Control<br/>• Shed Non-Critical Loads<br/>• Discharge Battery<br/>• Ramp Down HVAC

      DER->>EdgeController: Acknowledge Execution

      EdgeController->>MQTT: Publish Status<br/>gridoptimiser/site_001/status/health

      MQTT->>ThingsBoard: Status Update

      ThingsBoard->>Dashboard: Real-time Event Update

      Dashboard->>Operator: Display Response Confirmation

      Note over EdgeController,DER: Local Failover:<br/>If MQTT unavailable,<br/>continue autonomous operation
  `,

  'Site Node Architecture': `
    graph TB
      subgraph Hardware["HARDWARE LAYER"]
        RPI[Raspberry Pi 4<br/>Industrial SSD]
      end

      subgraph OS["OPERATING SYSTEM"]
        Linux[Linux OS<br/>Real-Time Kernel]
      end

      subgraph MyEMS["MyEMS APPLICATION"]
        Core[Core Engine]
        Collector[Data Collector]
        Optimizer[Local Optimizer]
        Protocol[Protocol Adapters]
        Buffer[Store & Forward Buffer]
      end

      subgraph Protocols["PROTOCOL LAYER"]
        Modbus[Modbus RTU/TCP]
        BACnet[BACnet/IP]
        RS485[RS485]
        SNMP[SNMP]
      end

      subgraph Interfaces["PHYSICAL INTERFACES"]
        USB[USB]
        Ethernet[Ethernet]
        Serial[Serial Ports]
        GPIO[GPIO Pins]
      end

      subgraph Assets["CONNECTED ASSETS"]
        Inverter[Solar Inverter]
        BMS[Battery BMS]
        Meter[Smart Meter]
        HVAC_Ctrl[HVAC Controller]
        Relay[Smart Relays]
      end

      subgraph Network["NETWORK LAYER"]
        MQTT_Client[MQTT Client<br/>TLS 1.3]
        VPN[VPN Tunnel]
        Firewall[Local Firewall]
      end

      subgraph Cloud_Link["CLOUD CONNECTION"]
        Internet[Internet<br/>4G/5G/Fiber]
      end

      RPI --> Linux
      Linux --> MyEMS

      Core --> Collector
      Core --> Optimizer
      Core --> Protocol
      Core --> Buffer

      Protocol --> Modbus
      Protocol --> BACnet
      Protocol --> RS485
      Protocol --> SNMP

      Modbus --> USB
      BACnet --> Ethernet
      RS485 --> Serial

      USB --> Inverter
      Ethernet --> Meter
      Serial --> BMS
      GPIO --> Relay
      Ethernet --> HVAC_Ctrl

      Buffer --> MQTT_Client
      MQTT_Client --> VPN
      VPN --> Firewall
      Firewall --> Internet

      Internet -->|Upstream| Cloud_Link

      style RPI fill:#3b82f6,stroke:#60a5fa,stroke-width:3px
      style Core fill:#8b5cf6,stroke:#a78bfa,stroke-width:3px
      style MQTT_Client fill:#10b981,stroke:#34d399,stroke-width:2px
      style Buffer fill:#f59e0b,stroke:#fbbf24,stroke-width:2px
  `,

  'VPP Orchestration Layer': `
    graph TB
      subgraph Ingestion["DATA INGESTION"]
        MQTT_Sub[MQTT Subscriber]
        Validator[Data Validator]
        Parser[Message Parser]
      end

      subgraph Core["THINGSBOARD CORE"]
        DevRegistry[Device Registry<br/>Site Metadata]
        RuleChains[Rule Chains<br/>Event Processing]
        Telemetry[Telemetry Service]
      end

      subgraph Storage["STORAGE LAYER"]
        PostgreSQL[(PostgreSQL<br/>Metadata)]
        Cassandra[(Cassandra<br/>Time Series)]
        Redis[(Redis<br/>Cache)]
      end

      subgraph Intelligence["INTELLIGENCE LAYER"]
        Forecasting[Load/Solar Forecasting]
        Optimization[Portfolio Optimizer]
        DR_Engine[Demand Response Engine]
        Tariff[Tariff Optimizer]
      end

      subgraph Control["CONTROL LAYER"]
        Command_Gen[Command Generator]
        Safety[Safety Validator]
        Dispatcher[Command Dispatcher]
      end

      subgraph Integration["INTEGRATION LAYER"]
        REST_API[REST API]
        WebSocket[WebSocket Server]
        Webhooks[Webhook Service]
        Grid_API[Grid Operator API]
      end

      subgraph UI["USER INTERFACES"]
        Fleet_Dash[Fleet Dashboard]
        Site_Dash[Site Dashboards]
        Control_Center[Control Center]
        Mobile[Mobile Apps]
      end

      MQTT_Sub --> Validator
      Validator --> Parser
      Parser --> RuleChains

      RuleChains --> DevRegistry
      RuleChains --> Telemetry

      DevRegistry --> PostgreSQL
      Telemetry --> Cassandra
      RuleChains --> Redis

      Telemetry --> Forecasting
      Telemetry --> Optimization

      Forecasting --> DR_Engine
      Optimization --> Tariff

      DR_Engine --> Command_Gen
      Tariff --> Command_Gen

      Command_Gen --> Safety
      Safety --> Dispatcher

      Dispatcher -->|MQTT Pub| Control

      Telemetry --> REST_API
      Telemetry --> WebSocket
      RuleChains --> Webhooks

      REST_API --> Fleet_Dash
      WebSocket --> Site_Dash
      REST_API --> Control_Center
      REST_API --> Mobile

      Command_Gen --> Grid_API

      style RuleChains fill:#8b5cf6,stroke:#a78bfa,stroke-width:3px
      style Optimization fill:#f59e0b,stroke:#fbbf24,stroke-width:3px
      style Safety fill:#ef4444,stroke:#f87171,stroke-width:3px
      style Dispatcher fill:#10b981,stroke:#34d399,stroke-width:3px
  `,

  'UI Allocation': `
    graph TB
      subgraph Sites["SITE LEVEL - Edge Nodes"]
        subgraph Site1["Site 001 - Industrial Park"]
          EMS1[MyEMS Controller]
          Admin1[MyEMS Admin UI<br/>👤 Site Admin]
          Web1[MyEMS Web UI<br/>👤 Site Operator]
          EMS1 --> Admin1
          EMS1 --> Web1
        end

        subgraph Site2["Site 002 - Shopping Mall"]
          EMS2[MyEMS Controller]
          Admin2[MyEMS Admin UI<br/>👤 Site Admin]
          Web2[MyEMS Web UI<br/>👤 Site Operator]
          EMS2 --> Admin2
          EMS2 --> Web2
        end

        subgraph SiteN["Site NNN - Hospital"]
          EMSN[MyEMS Controller]
          AdminN[MyEMS Admin UI<br/>👤 Site Admin]
          WebN[MyEMS Web UI<br/>👤 Site Operator]
          EMSN --> AdminN
          EMSN --> WebN
        end
      end

      subgraph Transport["TRANSPORT LAYER"]
        MQTT[MQTT Broker]
      end

      subgraph HQ["CENTRAL HQ - VPP Control Center"]
        TB[ThingsBoard Platform]
        HQUI[ThingsBoard Dashboard<br/>👤 VPP Operator<br/>👤 Portfolio Manager<br/>👤 Grid Coordinator]
        TB --> HQUI
      end

      EMS1 -->|Telemetry| MQTT
      EMS2 -->|Telemetry| MQTT
      EMSN -->|Telemetry| MQTT

      MQTT --> TB
      TB -->|Commands| MQTT

      MQTT -.->|Control| EMS1
      MQTT -.->|Control| EMS2
      MQTT -.->|Control| EMSN

      style Admin1 fill:#f59e0b,stroke:#fbbf24,stroke-width:2px
      style Web1 fill:#f59e0b,stroke:#fbbf24,stroke-width:2px
      style Admin2 fill:#f59e0b,stroke:#fbbf24,stroke-width:2px
      style Web2 fill:#f59e0b,stroke:#fbbf24,stroke-width:2px
      style AdminN fill:#f59e0b,stroke:#fbbf24,stroke-width:2px
      style WebN fill:#f59e0b,stroke:#fbbf24,stroke-width:2px
      style HQUI fill:#ec4899,stroke:#f472b6,stroke-width:3px
      style EMS1 fill:#3b82f6,stroke:#60a5fa
      style EMS2 fill:#3b82f6,stroke:#60a5fa
      style EMSN fill:#3b82f6,stroke:#60a5fa
      style TB fill:#8b5cf6,stroke:#a78bfa,stroke-width:3px
      style MQTT fill:#10b981,stroke:#34d399,stroke-width:2px
  `,
};

const diagramConfig = {
  'System Hierarchy': {
    icon: Layers,
    color: 'from-blue-500 to-blue-600',
    description: 'Complete 5-layer stack',
  },
  'UI Allocation': {
    icon: Monitor,
    color: 'from-pink-500 to-pink-600',
    description: 'Site vs HQ interfaces',
  },
  'Data Flow': {
    icon: Workflow,
    color: 'from-green-500 to-green-600',
    description: 'Multi-site telemetry',
  },
  'MQTT Topic Architecture': {
    icon: Radio,
    color: 'from-purple-500 to-purple-600',
    description: 'Message namespace',
  },
  'Control Command Flow': {
    icon: Zap,
    color: 'from-orange-500 to-orange-600',
    description: 'DR orchestration',
  },
  'Site Node Architecture': {
    icon: Cpu,
    color: 'from-cyan-500 to-cyan-600',
    description: 'Edge controller internals',
  },
  'VPP Orchestration Layer': {
    icon: Cloud,
    color: 'from-violet-500 to-violet-600',
    description: 'Cloud services',
  },
};

export default function App() {
  const [selectedDiagram, setSelectedDiagram] = useState<keyof typeof architectureDiagrams>('System Hierarchy');
  const [mode, setMode] = useState<'gallery' | 'editor'>('gallery');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-blue-400">GRID OPTIMISER</h1>
            <p className="text-xl text-slate-400">System Architecture Documentation</p>
            <p className="text-sm text-slate-500 mt-2">Edge-to-Cloud VPP Operating System for Distributed Energy Assets</p>
          </div>
          <div className="flex gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setMode('gallery')}
              className={`px-4 py-2 rounded flex items-center gap-2 transition-colors ${
                mode === 'gallery' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              Gallery
            </button>
            <button
              onClick={() => setMode('editor')}
              className={`px-4 py-2 rounded flex items-center gap-2 transition-colors ${
                mode === 'editor' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Edit className="w-4 h-4" />
              Editor
            </button>
          </div>
        </header>

        {mode === 'gallery' ? (
          <>
            <nav className="mb-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(diagramConfig).map(([diagram, config]) => {
                const Icon = config.icon;
                const isSelected = selectedDiagram === diagram;

                return (
                  <button
                    key={diagram}
                    onClick={() => setSelectedDiagram(diagram as keyof typeof architectureDiagrams)}
                    className={`relative group overflow-hidden rounded-xl transition-all duration-300 ${
                      isSelected
                        ? 'ring-2 ring-white shadow-2xl scale-105'
                        : 'hover:scale-102 hover:shadow-xl'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-${isSelected ? '100' : '80'} group-hover:opacity-100 transition-opacity`}></div>
                    <div className="relative p-6 flex flex-col items-center justify-center text-center h-32">
                      <Icon className={`w-10 h-10 mb-2 ${isSelected ? 'animate-pulse' : ''}`} strokeWidth={2} />
                      <p className="text-xs font-medium leading-tight">{config.description}</p>
                    </div>
                    {isSelected && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white"></div>
                    )}
                  </button>
                );
              })}
            </nav>

            <main>
              <div className="bg-slate-900 rounded-xl p-6 shadow-2xl border border-slate-800">
                <div className="flex items-center gap-3 mb-4">
                  {(() => {
                    const Icon = diagramConfig[selectedDiagram].icon;
                    return <Icon className="w-8 h-8 text-blue-400" />;
                  })()}
                  <h2 className="text-2xl font-semibold text-slate-200">{selectedDiagram}</h2>
                </div>
                <MermaidDiagram
                  chart={architectureDiagrams[selectedDiagram]}
                  id={`diagram-${selectedDiagram.replace(/\s+/g, '-').toLowerCase()}`}
                />
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative overflow-hidden bg-slate-900 p-6 rounded-lg border border-slate-800 group hover:border-orange-500 transition-colors">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500 opacity-10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform"></div>
                  <div className="relative">
                    <Monitor className="w-12 h-12 text-orange-400 mb-3" />
                    <h3 className="text-lg font-semibold text-orange-400 mb-2">Site Level UI</h3>
                    <p className="text-sm text-slate-400">MyEMS Admin UI (configuration) + MyEMS Web UI (monitoring) - Site operators and administrators</p>
                  </div>
                </div>
                <div className="relative overflow-hidden bg-slate-900 p-6 rounded-lg border border-slate-800 group hover:border-blue-500 transition-colors">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform"></div>
                  <div className="relative">
                    <Cpu className="w-12 h-12 text-blue-400 mb-3" />
                    <h3 className="text-lg font-semibold text-blue-400 mb-2">Edge Layer</h3>
                    <p className="text-sm text-slate-400">MyEMS on Raspberry Pi - Local energy management and autonomous control</p>
                  </div>
                </div>
                <div className="relative overflow-hidden bg-slate-900 p-6 rounded-lg border border-slate-800 group hover:border-pink-500 transition-colors">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500 opacity-10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform"></div>
                  <div className="relative">
                    <Cloud className="w-12 h-12 text-pink-400 mb-3" />
                    <h3 className="text-lg font-semibold text-pink-400 mb-2">Central HQ UI</h3>
                    <p className="text-sm text-slate-400">ThingsBoard Dashboard - VPP operators, portfolio managers, and grid coordinators</p>
                  </div>
                </div>
              </div>
            </main>
          </>
        ) : (
          <main className="h-[calc(100vh-12rem)]">
            <MermaidEditor />
          </main>
        )}
      </div>
    </div>
  );
}