# 🔌 Jira Service Management MCP Connector

> Mapeamento de API Jira Service Management (Atlassian) para os 6 tools MCP.

---

## Configuração

```json
{
  "mcpServers": {
    "itsm": {
      "command": "node",
      "args": ["./mcp-servers/jira-sm-mcp/index.js"],
      "env": {
        "JIRA_URL": "https://<instance>.atlassian.net",
        "JIRA_EMAIL": "${JIRA_EMAIL}",
        "JIRA_API_TOKEN": "${JIRA_API_TOKEN}",
        "JIRA_SERVICE_DESK_ID": "${JIRA_SD_ID}"
      }
    }
  }
}
```

### Autenticação
| Método | Variáveis | Quando usar |
|--------|-----------|-------------|
| **API Token** (recomendado) | `JIRA_EMAIL`, `JIRA_API_TOKEN` | Cloud (Atlassian Cloud) |
| **OAuth 2.0** | `JIRA_CLIENT_ID`, `JIRA_CLIENT_SECRET` | Integrações enterprise |
| **PAT** | `JIRA_PAT` | Data Center (on-prem) |

---

## Mapeamento: MCP Tool → Jira SM API

### 1. `itsm_get_ci` → Assets API (Insight)
```
MCP Tool:  itsm_get_ci({ name: "app-server-prod-01" })
Jira API:  GET /rest/assets/1.0/object/aql
           ?ql=Name="app-server-prod-01"

Nota: Jira SM usa "Assets" (antigo Insight) como CMDB.
Assets são organizados por Object Schema e Object Type.

Field Mapping:
  ci_id            ← id
  name             ← label (ou atributo "Name")
  ci_class         ← objectType.name ("Server", "Database", etc.)
  environment      ← atributo "Environment"
  criticality      ← atributo "Criticality"
  business_service ← atributo "Business Service" (referência)
  owner            ← atributo "Owner" (referência a usuário)
  azure_resource_id ← atributo "Azure Resource ID" (custom)
```

---

### 2. `itsm_get_ci_relationships` → Assets References API
```
MCP Tool:  itsm_get_ci_relationships({ ci_id: "123" })
Jira API:  GET /rest/assets/1.0/object/{id}/references

Em Jira Assets, relações são definidas como "Reference" attributes.

Upstream:  Objetos que referenciam este CI via atributos de referência
Downstream: Objetos que este CI referencia

Relationship Types:
  "Depends On"  → "depends_on"
  "Runs On"     → "runs_on"
  "Connected To" → "connects_to"
```

---

### 3. `itsm_list_incidents` → Jira SM Issues API
```
MCP Tool:  itsm_list_incidents({ ci_id: "123", days_back: 90 })
Jira API:  POST /rest/api/3/search
           {
             "jql": "project = <SERVICE_DESK_PROJECT>
                     AND issuetype = Incident
                     AND 'Affected Asset' = '123'
                     AND created >= -90d",
             "fields": ["summary", "priority", "status",
                        "created", "resolutiondate",
                        "customfield_<root_cause>"]
           }

Field Mapping:
  incident_id      ← key (ex: "SD-1234")
  title            ← fields.summary
  severity         ← fields.priority.name ("Highest" → "P1", etc.)
  state            ← fields.status.name ("Done" → "resolved")
  opened_at        ← fields.created
  resolved_at      ← fields.resolutiondate
  root_cause       ← fields.customfield_<root_cause>
```

---

### 4. `itsm_list_changes` → Jira SM Issues API (Change type)
```
MCP Tool:  itsm_list_changes({ ci_id: "123" })
Jira API:  POST /rest/api/3/search
           {
             "jql": "project = <SERVICE_DESK_PROJECT>
                     AND issuetype = 'Change'
                     AND 'Affected Asset' = '123'
                     AND status != Done AND status != Cancelled",
             "fields": ["summary", "customfield_<change_type>",
                        "status", "customfield_<risk>",
                        "customfield_<planned_start>",
                        "customfield_<planned_end>",
                        "assignee"]
           }

Nota: Jira SM usa custom fields extensivamente.
Os nomes dos campos variam por instalação.
```

---

### 5. `itsm_get_known_errors` → Jira Issues API (Problem type)
```
MCP Tool:  itsm_get_known_errors({ ci_id: "123" })
Jira API:  POST /rest/api/3/search
           {
             "jql": "project = <SERVICE_DESK_PROJECT>
                     AND issuetype = 'Problem'
                     AND 'Affected Asset' = '123'
                     AND status != Done",
             "fields": ["summary", "labels",
                        "customfield_<root_cause>",
                        "customfield_<workaround>"]
           }

Known Error: issue com label "known-error" ou custom field boolean.
```

---

### 6. `itsm_get_sla` → Jira SM SLA API
```
MCP Tool:  itsm_get_sla({ ci_id: "123" })
Jira API:  GET /rest/servicedeskapi/request/{issueKey}/sla

Nota: SLAs em Jira SM são configurados por Request Type,
não diretamente por CI/Asset. O mapeamento requer:
1. Buscar o Business Service associado ao CI (via Assets)
2. Buscar SLAs configurados para o Service Desk desse serviço
```

---

## Diferenças Chave: Jira SM vs ServiceNow

| Aspecto | ServiceNow | Jira SM |
|---------|------------|---------|
| **CMDB** | cmdb_ci (nativo) | Assets/Insight (plugin) |
| **Relações** | cmdb_rel_ci table | Object References |
| **Incidents** | incident table | Issue type "Incident" |
| **Changes** | change_request table | Issue type "Change" |
| **Problems** | problem table | Issue type "Problem" |
| **SLAs** | contract_sla | SLA por Request Type |
| **API Style** | REST Table API | REST + JQL |
| **Auth** | OAuth2 / Basic | API Token / OAuth2 |
| **Customização** | u_ prefix fields | Custom fields (IDs numéricos) |
