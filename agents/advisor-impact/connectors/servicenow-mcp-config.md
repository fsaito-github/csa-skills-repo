# 🔌 ServiceNow MCP Connector

> Mapeamento de API ServiceNow para os 6 tools MCP do ITSM specification.

---

## Configuração

```json
{
  "mcpServers": {
    "itsm": {
      "command": "node",
      "args": ["./mcp-servers/servicenow-mcp/index.js"],
      "env": {
        "SNOW_INSTANCE": "https://<instance>.service-now.com",
        "SNOW_AUTH_TYPE": "oauth2",
        "SNOW_CLIENT_ID": "${SNOW_CLIENT_ID}",
        "SNOW_CLIENT_SECRET": "${SNOW_CLIENT_SECRET}",
        "SNOW_USERNAME": "${SNOW_USERNAME}",
        "SNOW_PASSWORD": "${SNOW_PASSWORD}"
      }
    }
  }
}
```

### Autenticação suportada
| Método | Variáveis | Quando usar |
|--------|-----------|-------------|
| **OAuth 2.0** (recomendado) | `SNOW_CLIENT_ID`, `SNOW_CLIENT_SECRET` | Produção, integração server-to-server |
| **Basic Auth** | `SNOW_USERNAME`, `SNOW_PASSWORD` | Desenvolvimento, testes rápidos |
| **API Key** | `SNOW_API_KEY` | Quando OAuth não disponível |

---

## Mapeamento: MCP Tool → ServiceNow API

### 1. `itsm_get_ci` → Table API (cmdb_ci)
```
MCP Tool:  itsm_get_ci({ name: "app-server-prod-01" })
SNOW API:  GET /api/now/table/cmdb_ci
           ?sysparm_query=name=app-server-prod-01
           &sysparm_fields=sys_id,name,sys_class_name,environment,
             operational_status,business_criticality,
             u_business_service,owned_by,support_group,
             u_azure_resource_id

Field Mapping:
  ci_id           ← sys_id
  name            ← name
  ci_class        ← sys_class_name (cmdb_ci_server → "server", etc.)
  environment     ← environment ("Production" → "production")
  criticality     ← business_criticality ("1 - Critical" → "critical")
  business_service ← u_business_service.display_value
  owner           ← owned_by.display_value
  support_group   ← support_group.display_value
  azure_resource_id ← u_azure_resource_id (campo custom)
```

**Nota:** O campo `u_azure_resource_id` é customizado. Se o cliente não tem,
usar `name` para correlação com Azure Resource Graph.

---

### 2. `itsm_get_ci_relationships` → Table API (cmdb_rel_ci)
```
MCP Tool:  itsm_get_ci_relationships({ ci_id: "abc123", direction: "both" })
SNOW API:  GET /api/now/table/cmdb_rel_ci
           ?sysparm_query=parent=abc123^ORchild=abc123
           &sysparm_fields=parent,child,type

Relationship Types:
  "Runs on::Runs"      → "runs_on"
  "Depends on::Used by" → "depends_on"
  "Connected by::Connects to" → "connects_to"
  "Members Of::Contains" → "contains"

Upstream = registros onde child=<ci_id> (CIs que dependem deste)
Downstream = registros onde parent=<ci_id> (CIs dos quais este depende)
```

---

### 3. `itsm_list_incidents` → Table API (incident)
```
MCP Tool:  itsm_list_incidents({ ci_id: "abc123", days_back: 90 })
SNOW API:  GET /api/now/table/incident
           ?sysparm_query=cmdb_ci=abc123
             ^opened_at>javascript:gs.daysAgo(90)
           &sysparm_fields=number,short_description,priority,
             state,opened_at,resolved_at,close_notes,
             business_impact
           &sysparm_display_value=true
           &sysparm_limit=50

Field Mapping:
  incident_id      ← number
  title            ← short_description
  severity         ← priority ("1 - Critical" → "P1")
  state            ← state ("Resolved" → "resolved")
  opened_at        ← opened_at
  resolved_at      ← resolved_at
  root_cause       ← close_notes
  business_impact  ← business_impact

Stability Score:
  0 incidents     → "stable"
  1-3 incidents   → "moderate"
  >3 incidents    → "unstable"
```

---

### 4. `itsm_list_changes` → Table API (change_request)
```
MCP Tool:  itsm_list_changes({ ci_id: "abc123" })
SNOW API:  GET /api/now/table/change_request
           ?sysparm_query=cmdb_ci=abc123
             ^state!=7^state!=8
           &sysparm_fields=number,short_description,type,state,
             risk,start_date,end_date,description,assigned_to
           &sysparm_display_value=true

Field Mapping:
  change_id        ← number
  title            ← short_description
  type             ← type ("Normal" → "normal", "Standard" → "standard")
  state            ← state ("Approve" → "approved", "Scheduled" → "scheduled")
  risk             ← risk ("High" → "high")
  scheduled_start  ← start_date
  scheduled_end    ← end_date
  assigned_to      ← assigned_to.display_value

Conflict Detection:
  has_conflicts = true se existe CR com state in (approved, scheduled)
  e a data de execução proposta cai dentro de scheduled_start/end
```

---

### 5. `itsm_get_known_errors` → Table API (problem)
```
MCP Tool:  itsm_get_known_errors({ ci_id: "abc123" })
SNOW API:  GET /api/now/table/problem
           ?sysparm_query=cmdb_ci=abc123
             ^problem_state!=4
           &sysparm_fields=number,short_description,known_error,
             problem_state,cause_notes,fix_notes,
             related_incidents

Field Mapping:
  problem_id       ← number
  title            ← short_description
  is_known_error   ← known_error (boolean)
  state            ← problem_state ("Open" → "open")
  root_cause       ← cause_notes
  workaround       ← fix_notes
```

---

### 6. `itsm_get_sla` → Table API (service_offering + contract_sla)
```
MCP Tool:  itsm_get_sla({ ci_id: "abc123" })
SNOW API:
  Step 1: GET /api/now/table/cmdb_ci_service
          ?sysparm_query=sys_id=<business_service_id>
  Step 2: GET /api/now/table/contract_sla
          ?sysparm_query=cmdb_ci=<business_service_id>

Field Mapping:
  business_service ← cmdb_ci_service.name
  criticality      ← cmdb_ci_service.business_criticality
  target_percent   ← contract_sla.percentage
  maintenance_windows ← cmdb_ci_service.maintenance_schedule
```

---

## Campos Customizados Recomendados

Para melhor integração com Azure, recomendamos adicionar estes campos ao CMDB do ServiceNow:

| Campo | Table | Tipo | Propósito |
|-------|-------|------|-----------|
| `u_azure_resource_id` | cmdb_ci | String | Azure Resource ID para correlação |
| `u_azure_subscription` | cmdb_ci | String | Subscription ID |
| `u_azure_resource_group` | cmdb_ci | String | Resource Group |
| `u_cloud_provider` | cmdb_ci | Choice | Azure / AWS / GCP / On-prem |
