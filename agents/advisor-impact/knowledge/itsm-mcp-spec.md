# 📐 ITSM MCP Server Specification

> Contrato padronizado para MCP servers de ITSM.
> Qualquer ferramenta de ITSM (ServiceNow, Jira SM, BMC, Zendesk, etc.) pode ser
> integrada ao Advisor Impact Analyzer implementando estas 6 tools MCP.

---

## Arquitetura

```
┌─────────────────────────┐     ┌─────────────────────────┐     ┌──────────────┐
│   Advisor Impact        │     │    ITSM MCP Server      │     │    ITSM      │
│   Analyzer Agent        │────▶│    (implementa o        │────▶│  Backend     │
│                         │ MCP │     contrato abaixo)    │ API │  (ServiceNow │
│   Chama tools MCP:      │     │                         │     │   Jira, BMC) │
│   - itsm_get_ci         │     │   Traduz MCP → API      │     │              │
│   - itsm_list_incidents │     │   do ITSM específico    │     │              │
│   - itsm_list_changes   │     │                         │     │              │
│   - ...                 │     │                         │     │              │
└─────────────────────────┘     └─────────────────────────┘     └──────────────┘
```

**Princípio:** O agente **nunca sabe** qual ITSM está por trás. Ele chama tools MCP
padronizados. O MCP server traduz para a API específica do ITSM.

---

## Tools MCP Obrigatórios (6 tools)

### 1. `itsm_get_ci` — Buscar Configuration Item

Busca um CI (Configuration Item) no CMDB pelo nome, ID, ou atributos Azure.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Nome do CI (ex: 'app-server-prod-01', 'stproddata01')"
    },
    "azure_resource_id": {
      "type": "string",
      "description": "Azure Resource ID completo (se disponível)"
    },
    "ci_class": {
      "type": "string",
      "description": "Classe do CI para filtrar (ex: 'server', 'database', 'storage')"
    }
  },
  "required": ["name"]
}
```

**Output Schema:**
```json
{
  "type": "object",
  "properties": {
    "ci_id": {
      "type": "string",
      "description": "ID único do CI no ITSM"
    },
    "name": {
      "type": "string",
      "description": "Nome do CI"
    },
    "ci_class": {
      "type": "string",
      "description": "Classe do CI (server, database, application, network, storage)"
    },
    "environment": {
      "type": "string",
      "description": "Ambiente (production, staging, development, dr)"
    },
    "criticality": {
      "type": "string",
      "enum": ["critical", "high", "medium", "low"],
      "description": "Criticidade do CI"
    },
    "business_service": {
      "type": "string",
      "description": "Nome do Business Service que este CI suporta"
    },
    "owner": {
      "type": "string",
      "description": "Owner/responsável pelo CI"
    },
    "support_group": {
      "type": "string",
      "description": "Grupo de suporte responsável"
    },
    "azure_resource_id": {
      "type": "string",
      "description": "Azure Resource ID mapeado"
    },
    "attributes": {
      "type": "object",
      "description": "Atributos adicionais específicos do CI"
    }
  },
  "required": ["ci_id", "name", "ci_class"]
}
```

---

### 2. `itsm_get_ci_relationships` — Relações do CI

Retorna os relacionamentos upstream (quem depende deste CI) e downstream (de quem este CI depende).

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "ci_id": {
      "type": "string",
      "description": "ID do CI no ITSM (obtido via itsm_get_ci)"
    },
    "direction": {
      "type": "string",
      "enum": ["upstream", "downstream", "both"],
      "default": "both",
      "description": "Direção dos relacionamentos"
    },
    "depth": {
      "type": "integer",
      "default": 2,
      "description": "Profundidade de traversal (1=direto, 2=2 níveis)"
    }
  },
  "required": ["ci_id"]
}
```

**Output Schema:**
```json
{
  "type": "object",
  "properties": {
    "ci_id": { "type": "string" },
    "ci_name": { "type": "string" },
    "upstream": {
      "type": "array",
      "description": "CIs que DEPENDEM deste CI (serão impactados por mudança)",
      "items": {
        "type": "object",
        "properties": {
          "ci_id": { "type": "string" },
          "ci_name": { "type": "string" },
          "ci_class": { "type": "string" },
          "relationship_type": {
            "type": "string",
            "description": "Tipo de relação (runs_on, connects_to, uses, depends_on)"
          },
          "criticality": { "type": "string" },
          "depth": { "type": "integer" }
        }
      }
    },
    "downstream": {
      "type": "array",
      "description": "CIs dos quais este CI DEPENDE",
      "items": {
        "type": "object",
        "properties": {
          "ci_id": { "type": "string" },
          "ci_name": { "type": "string" },
          "ci_class": { "type": "string" },
          "relationship_type": { "type": "string" },
          "criticality": { "type": "string" },
          "depth": { "type": "integer" }
        }
      }
    },
    "total_upstream": { "type": "integer" },
    "total_downstream": { "type": "integer" }
  }
}
```

---

### 3. `itsm_list_incidents` — Incidentes Recentes

Lista incidentes associados a um CI em um período.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "ci_id": {
      "type": "string",
      "description": "ID do CI no ITSM"
    },
    "days_back": {
      "type": "integer",
      "default": 90,
      "description": "Buscar incidentes dos últimos N dias"
    },
    "severity_filter": {
      "type": "array",
      "items": { "type": "string", "enum": ["P1", "P2", "P3", "P4"] },
      "description": "Filtrar por severidade (opcional)"
    }
  },
  "required": ["ci_id"]
}
```

**Output Schema:**
```json
{
  "type": "object",
  "properties": {
    "ci_id": { "type": "string" },
    "total_incidents": { "type": "integer" },
    "incidents": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "incident_id": { "type": "string" },
          "title": { "type": "string" },
          "severity": { "type": "string", "enum": ["P1", "P2", "P3", "P4"] },
          "state": { "type": "string", "enum": ["open", "in_progress", "resolved", "closed"] },
          "opened_at": { "type": "string", "format": "date-time" },
          "resolved_at": { "type": "string", "format": "date-time" },
          "resolution_time_hours": { "type": "number" },
          "short_description": { "type": "string" },
          "root_cause": { "type": "string" },
          "business_impact": { "type": "string" }
        }
      }
    },
    "summary": {
      "type": "object",
      "properties": {
        "p1_count": { "type": "integer" },
        "p2_count": { "type": "integer" },
        "p3_count": { "type": "integer" },
        "p4_count": { "type": "integer" },
        "avg_resolution_hours": { "type": "number" },
        "stability_score": {
          "type": "string",
          "enum": ["stable", "moderate", "unstable"],
          "description": "0 incidents=stable, 1-3=moderate, >3=unstable"
        }
      }
    }
  }
}
```

---

### 4. `itsm_list_changes` — Change Requests

Lista change requests abertas, pendentes ou recentes para um CI.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "ci_id": {
      "type": "string",
      "description": "ID do CI no ITSM"
    },
    "state_filter": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": ["open", "approved", "scheduled", "in_progress", "completed", "cancelled"]
      },
      "default": ["open", "approved", "scheduled", "in_progress"],
      "description": "Filtrar por estado"
    },
    "days_back": {
      "type": "integer",
      "default": 30,
      "description": "Incluir changes dos últimos N dias"
    }
  },
  "required": ["ci_id"]
}
```

**Output Schema:**
```json
{
  "type": "object",
  "properties": {
    "ci_id": { "type": "string" },
    "total_changes": { "type": "integer" },
    "changes": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "change_id": { "type": "string" },
          "title": { "type": "string" },
          "type": {
            "type": "string",
            "enum": ["standard", "normal", "emergency"],
            "description": "Tipo de change request"
          },
          "state": { "type": "string" },
          "risk": { "type": "string", "enum": ["high", "medium", "low"] },
          "scheduled_start": { "type": "string", "format": "date-time" },
          "scheduled_end": { "type": "string", "format": "date-time" },
          "description": { "type": "string" },
          "assigned_to": { "type": "string" }
        }
      }
    },
    "has_conflicts": {
      "type": "boolean",
      "description": "True se há changes pendentes que podem conflitar"
    },
    "next_maintenance_window": {
      "type": "string",
      "format": "date-time",
      "description": "Próxima janela de manutenção disponível"
    }
  }
}
```

---

### 5. `itsm_get_known_errors` — Known Errors e Problems

Busca known errors e problems ativos associados a um CI.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "ci_id": {
      "type": "string",
      "description": "ID do CI no ITSM"
    },
    "include_resolved": {
      "type": "boolean",
      "default": false,
      "description": "Incluir problems resolvidos nos últimos 90 dias"
    }
  },
  "required": ["ci_id"]
}
```

**Output Schema:**
```json
{
  "type": "object",
  "properties": {
    "ci_id": { "type": "string" },
    "total_problems": { "type": "integer" },
    "problems": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "problem_id": { "type": "string" },
          "title": { "type": "string" },
          "is_known_error": { "type": "boolean" },
          "state": { "type": "string", "enum": ["open", "investigating", "resolved", "closed"] },
          "root_cause": { "type": "string" },
          "workaround": { "type": "string" },
          "related_incidents_count": { "type": "integer" },
          "description": { "type": "string" }
        }
      }
    },
    "has_active_problems": { "type": "boolean" }
  }
}
```

---

### 6. `itsm_get_sla` — SLA do Business Service

Retorna informações de SLA/OLA do Business Service associado ao CI.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "ci_id": {
      "type": "string",
      "description": "ID do CI no ITSM"
    },
    "business_service_name": {
      "type": "string",
      "description": "Nome do Business Service (alternativa ao ci_id)"
    }
  }
}
```

**Output Schema:**
```json
{
  "type": "object",
  "properties": {
    "business_service": { "type": "string" },
    "criticality": { "type": "string", "enum": ["critical", "high", "medium", "low"] },
    "availability_sla": {
      "type": "object",
      "properties": {
        "target_percent": { "type": "number", "description": "Ex: 99.95" },
        "current_percent": { "type": "number" },
        "remaining_downtime_minutes": {
          "type": "number",
          "description": "Minutos de downtime restantes antes de breach no período"
        }
      }
    },
    "maintenance_windows": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "day_of_week": { "type": "string" },
          "start_time": { "type": "string" },
          "end_time": { "type": "string" },
          "timezone": { "type": "string" },
          "approved_by_cab": { "type": "boolean" }
        }
      }
    },
    "escalation_contacts": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "role": { "type": "string" },
          "contact": { "type": "string" }
        }
      }
    }
  }
}
```

---

## Como Implementar um Novo ITSM MCP Server

### Passo 1: Implementar os 6 tools
Cada tool deve seguir os schemas acima. O MCP server traduz as chamadas
para a API do ITSM específico.

### Passo 2: Registrar no MCP config
Adicionar o server ao arquivo de configuração MCP do ambiente:

```json
{
  "mcpServers": {
    "itsm": {
      "command": "node",
      "args": ["path/to/itsm-mcp-server/index.js"],
      "env": {
        "ITSM_URL": "https://instance.service-now.com",
        "ITSM_AUTH_TOKEN": "${ITSM_TOKEN}"
      }
    }
  }
}
```

### Passo 3: Testar
Verificar que cada tool responde corretamente:
```bash
# Teste rápido via MCP Inspector
npx @modelcontextprotocol/inspector node path/to/itsm-mcp-server/index.js
```

Consulte `itsm-setup-guide.md` para o guia completo passo-a-passo.
