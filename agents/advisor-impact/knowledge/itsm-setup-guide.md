# 🛠️ Guia: Como Adicionar um Novo ITSM ao Advisor Impact Analyzer

> 5 passos para integrar qualquer ferramenta de ITSM via MCP.

---

## Visão Geral

```
┌──────────────┐        ┌────────────────┐        ┌──────────────┐
│   Advisor    │  MCP   │  ITSM MCP      │  REST  │   Seu ITSM   │
│   Impact     │───────▶│  Server        │───────▶│  (ServiceNow │
│   Analyzer   │        │  (Você cria)   │        │   Jira, BMC) │
└──────────────┘        └────────────────┘        └──────────────┘
     O agente               Traduz MCP               Já existe
     não muda               → API do ITSM            no cliente
```

**O agente chama tools MCP padronizados. Você cria o MCP server que traduz.**

---

## Passo 1: Escolha seu ITSM e revise a API

Consulte a documentação da API REST do ITSM do cliente:

| ITSM | Precisa de |
|------|-----------|
| ServiceNow | Table API habilitada, credenciais OAuth2 |
| Jira SM | Assets/Insight configurado, API Token |
| BMC Helix | REST API habilitada, autenticação JWT |
| Outros | Qualquer API REST que exponha CMDB, incidents, changes |

**Mínimo necessário:** O ITSM deve ter API REST que permita consultar:
- ✅ Configuration Items (CMDB ou equivalente)
- ✅ Incidentes (por CI ou por filtro)
- ✅ Change Requests (por CI)
- 🟡 Problems/Known Errors (desejável, não obrigatório)
- 🟡 SLAs (desejável, não obrigatório)

---

## Passo 2: Mapeie os campos

Use o template em `connectors/generic-mcp-config.md` para mapear os campos
da API do seu ITSM para os schemas MCP definidos em `knowledge/itsm-mcp-spec.md`.

**Campos obrigatórios por tool:**

| Tool | Campos obrigatórios |
|------|--------------------|
| `itsm_get_ci` | ci_id, name, ci_class |
| `itsm_get_ci_relationships` | upstream[], downstream[] |
| `itsm_list_incidents` | incident_id, title, severity, state |
| `itsm_list_changes` | change_id, title, state |
| `itsm_get_known_errors` | problem_id, is_known_error |
| `itsm_get_sla` | business_service, criticality |

**Dica:** Campos não-obrigatórios podem retornar `null`. O agente lida gracefully.

---

## Passo 3: Implemente o MCP server

### Opção A: Node.js (recomendado)

```bash
mkdir my-itsm-mcp && cd my-itsm-mcp
npm init -y
npm install @modelcontextprotocol/sdk axios
```

**Estrutura:**
```
my-itsm-mcp/
├── index.js          # Registra os 6 tools
├── tools/
│   ├── get-ci.js
│   ├── get-ci-relationships.js
│   ├── list-incidents.js
│   ├── list-changes.js
│   ├── get-known-errors.js
│   └── get-sla.js
├── lib/
│   ├── api-client.js  # HTTP client com auth
│   └── field-mapper.js
└── package.json
```

**Exemplo: index.js**
```javascript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "itsm-connector",
  version: "1.0.0"
});

// Tool 1: itsm_get_ci
server.tool("itsm_get_ci",
  "Buscar Configuration Item no CMDB",
  {
    name: { type: "string", description: "Nome do CI" },
    azure_resource_id: { type: "string", description: "Azure Resource ID" },
    ci_class: { type: "string", description: "Classe do CI" }
  },
  async ({ name, azure_resource_id, ci_class }) => {
    // TODO: Chamar a API do seu ITSM aqui
    const ci = await yourItsmClient.getCi(name);
    return {
      content: [{
        type: "text",
        text: JSON.stringify(mapToMcpSchema(ci))
      }]
    };
  }
);

// Registrar os outros 5 tools seguindo o mesmo padrão...

const transport = new StdioServerTransport();
await server.connect(transport);
```

### Opção B: Python

```bash
pip install mcp httpx
```

```python
from mcp.server import Server
from mcp.server.stdio import stdio_server

app = Server("itsm-connector")

@app.tool()
async def itsm_get_ci(name: str, azure_resource_id: str = None):
    """Buscar Configuration Item no CMDB"""
    ci = await your_itsm_client.get_ci(name)
    return map_to_mcp_schema(ci)

async def main():
    async with stdio_server() as (read, write):
        await app.run(read, write)
```

---

## Passo 4: Configure no ambiente

Adicione o MCP server ao arquivo de configuração do seu ambiente Copilot:

**VS Code (`settings.json`):**
```json
{
  "github.copilot.chat.mcpServers": {
    "itsm": {
      "command": "node",
      "args": ["C:/path/to/my-itsm-mcp/index.js"],
      "env": {
        "ITSM_URL": "https://instance.service-now.com",
        "ITSM_AUTH_TOKEN": "your-token"
      }
    }
  }
}
```

**GitHub Copilot CLI (`.github/copilot/mcp.json`):**
```json
{
  "servers": {
    "itsm": {
      "type": "stdio",
      "command": "node",
      "args": ["./mcp-servers/my-itsm-mcp/index.js"],
      "env": {
        "ITSM_URL": "https://instance.service-now.com",
        "ITSM_AUTH_TOKEN": "your-token"
      }
    }
  }
}
```

---

## Passo 5: Teste e valide

### 5.1 Teste com MCP Inspector
```bash
npx @modelcontextprotocol/inspector node ./my-itsm-mcp/index.js
```

### 5.2 Teste cada tool individualmente
```
1. itsm_get_ci({ name: "um-ci-real-do-cliente" })
   → Deve retornar ci_id, name, ci_class, criticality

2. itsm_get_ci_relationships({ ci_id: "<id-do-passo-1>" })
   → Deve retornar upstream e downstream

3. itsm_list_incidents({ ci_id: "<id-do-passo-1>", days_back: 90 })
   → Deve retornar lista de incidentes (ou vazia se estável)

4. itsm_list_changes({ ci_id: "<id-do-passo-1>" })
   → Deve retornar CRs abertas (ou vazio)

5. itsm_get_known_errors({ ci_id: "<id-do-passo-1>" })
   → Deve retornar problems (ou vazio)

6. itsm_get_sla({ ci_id: "<id-do-passo-1>" })
   → Deve retornar SLA e janelas de manutenção
```

### 5.3 Teste end-to-end com o agente
```
@advisor-impact Analisar recomendação:
"Enable soft delete for Storage Account 'stproddata01'"
```
O agente deve automaticamente chamar os tools MCP do ITSM.

---

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| Tool não aparece | MCP server não registrou o tool | Verificar `server.tool()` |
| Auth error (401/403) | Credenciais inválidas ou expiradas | Verificar env vars |
| Timeout | API do ITSM lenta | Aumentar timeout no api-client |
| Campo retorna null | Mapeamento incorreto | Revisar field-mapper |
| CI não encontrado | Nome diferente entre Azure e CMDB | Usar azure_resource_id |
| "MCP server not found" | Caminho do server incorreto | Verificar `args` no config |

---

## FAQ

**P: Preciso implementar todos os 6 tools?**
R: Não. Os 2 obrigatórios são `itsm_get_ci` e `itsm_list_incidents`. Os outros são
desejáveis. O agente funciona com dados parciais — ele indica o que não conseguiu buscar.

**P: E se o cliente não tem CMDB?**
R: O agente ainda funciona com Resource Graph + WorkIQ. O ITSM é uma camada adicional.

**P: Posso usar o mesmo MCP server para múltiplos clientes?**
R: Sim, parametrize via env vars (ITSM_URL, ITSM_AUTH_TOKEN) para cada instância.

**P: O MCP server precisa rodar onde?**
R: Localmente na máquina do CSA/operador. Não precisa de server na nuvem.
