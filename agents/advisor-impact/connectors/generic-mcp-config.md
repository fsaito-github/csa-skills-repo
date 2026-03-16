# 🔌 Template Genérico: ITSM MCP Connector

> Use este template para integrar **qualquer ferramenta de ITSM** ao Advisor Impact Analyzer.
> Preencha os mapeamentos de API e deploy como um MCP server.

---

## Configuração Base

```json
{
  "mcpServers": {
    "itsm": {
      "command": "node",
      "args": ["./mcp-servers/<your-itsm>-mcp/index.js"],
      "env": {
        "ITSM_URL": "https://<instance-url>",
        "ITSM_AUTH_TYPE": "oauth2 | basic | api_key | bearer",
        "ITSM_AUTH_TOKEN": "${ITSM_TOKEN}"
      }
    }
  }
}
```

---

## Checklist de Implementação

Para cada tool MCP, preencha o mapeamento para a API do seu ITSM:

### ☐ Tool 1: `itsm_get_ci`

| Campo MCP | Endpoint da sua API | Campo na resposta |
|-----------|--------------------|--------------------|
| `ci_id` | | |
| `name` | | |
| `ci_class` | | |
| `environment` | | |
| `criticality` | | |
| `business_service` | | |
| `owner` | | |
| `azure_resource_id` | | |

**Sua API:** `GET ____________________?____________________`

---

### ☐ Tool 2: `itsm_get_ci_relationships`

| Campo MCP | Endpoint da sua API | Campo na resposta |
|-----------|--------------------|--------------------|
| `upstream[]` (CIs que dependem) | | |
| `downstream[]` (CIs de quem depende) | | |
| `relationship_type` | | |

**Sua API:** `GET ____________________?____________________`

---

### ☐ Tool 3: `itsm_list_incidents`

| Campo MCP | Endpoint da sua API | Campo na resposta |
|-----------|--------------------|--------------------|
| `incident_id` | | |
| `title` | | |
| `severity` (P1-P4) | | |
| `state` | | |
| `opened_at` | | |
| `resolved_at` | | |
| `root_cause` | | |

**Sua API:** `GET ____________________?____________________`

**Mapeamento de severidade:**
| Sua ferramenta | MCP padrão |
|---------------|------------|
| _____________ | P1 |
| _____________ | P2 |
| _____________ | P3 |
| _____________ | P4 |

---

### ☐ Tool 4: `itsm_list_changes`

| Campo MCP | Endpoint da sua API | Campo na resposta |
|-----------|--------------------|--------------------|
| `change_id` | | |
| `title` | | |
| `type` (standard/normal/emergency) | | |
| `state` | | |
| `risk` (high/medium/low) | | |
| `scheduled_start` | | |
| `scheduled_end` | | |

**Sua API:** `GET ____________________?____________________`

---

### ☐ Tool 5: `itsm_get_known_errors`

| Campo MCP | Endpoint da sua API | Campo na resposta |
|-----------|--------------------|--------------------|
| `problem_id` | | |
| `is_known_error` | | |
| `root_cause` | | |
| `workaround` | | |

**Sua API:** `GET ____________________?____________________`

---

### ☐ Tool 6: `itsm_get_sla`

| Campo MCP | Endpoint da sua API | Campo na resposta |
|-----------|--------------------|--------------------|
| `business_service` | | |
| `criticality` | | |
| `availability_sla.target_percent` | | |
| `maintenance_windows[]` | | |

**Sua API:** `GET ____________________?____________________`

---

## ITSMs Populares — Links de API

| ITSM | Documentação da API |
|------|-------------------|
| **ServiceNow** | [Table API](https://docs.servicenow.com/bundle/latest/page/integrate/inbound-rest/concept/c_TableAPI.html) |
| **Jira Service Management** | [REST API](https://developer.atlassian.com/cloud/jira/service-desk/rest/) |
| **BMC Helix ITSM** | [REST API](https://docs.bmc.com/docs/itsm/rest-api-overview-915370) |
| **Zendesk** | [API Reference](https://developer.zendesk.com/api-reference/) |
| **Freshservice** | [API v2](https://api.freshservice.com/v2/) |
| **ManageEngine** | [REST API](https://www.manageengine.com/products/service-desk/sdpod-v3-api/) |
| **Azure DevOps** | [Work Items API](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/) |
| **TOPdesk** | [REST API](https://developers.topdesk.com/documentation/) |

---

## Estrutura Mínima do MCP Server

```
your-itsm-mcp/
├── index.js          # Entry point — registra os 6 tools
├── tools/
│   ├── get-ci.js
│   ├── get-ci-relationships.js
│   ├── list-incidents.js
│   ├── list-changes.js
│   ├── get-known-errors.js
│   └── get-sla.js
├── lib/
│   ├── api-client.js  # HTTP client para a API do ITSM
│   └── field-mapper.js # Mapeia campos do ITSM para o schema MCP
├── package.json
└── README.md
```

---

## Validação

Após implementar, valide cada tool com o MCP Inspector:

```bash
npx @modelcontextprotocol/inspector node ./index.js
```

Teste cada tool com um CI real e verifique que os responses
seguem os schemas definidos em `itsm-mcp-spec.md`.
