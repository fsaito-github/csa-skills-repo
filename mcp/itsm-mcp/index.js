import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

/**
 * ITSM MCP Server — Pluggable connector for any ITSM tool.
 *
 * This is a TEMPLATE. To connect to your specific ITSM:
 * 1. Implement the API calls in each tool handler
 * 2. Map fields from your ITSM API to the MCP schema
 * 3. See connectors/ for ServiceNow and Jira SM examples
 *
 * Supported ITSM types (via ITSM_TYPE env var):
 * - servicenow
 * - jira-sm
 * - custom (implement your own)
 */

const ITSM_TYPE = process.env.ITSM_TYPE || "servicenow";
const ITSM_URL = process.env.ITSM_URL;
const ITSM_AUTH_TOKEN = process.env.ITSM_AUTH_TOKEN;

const server = new McpServer({
  name: "itsm-mcp",
  version: "1.0.0",
  description: `MCP server for ITSM integration (${ITSM_TYPE})`
});

// Tool 1: itsm_get_ci
server.tool(
  "itsm_get_ci",
  "Buscar Configuration Item (CI) no CMDB do ITSM",
  {
    name: { type: "string", description: "Nome do CI (ex: app-server-prod-01)" },
    azure_resource_id: { type: "string", description: "Azure Resource ID (opcional)" },
    ci_class: { type: "string", description: "Classe do CI: server, database, storage (opcional)" }
  },
  async ({ name, azure_resource_id, ci_class }) => {
    // TODO: Implement API call to your ITSM
    // See connectors/servicenow-mcp-config.md for ServiceNow mapping
    // See connectors/jira-sm-mcp-config.md for Jira SM mapping
    return {
      content: [{ type: "text", text: JSON.stringify({
        ci_id: "PLACEHOLDER",
        name: name,
        ci_class: ci_class || "unknown",
        environment: "production",
        criticality: "high",
        business_service: "PLACEHOLDER — implement API call",
        owner: "PLACEHOLDER",
        message: `ITSM type: ${ITSM_TYPE}. Implement API call to ${ITSM_URL}`
      }, null, 2)}]
    };
  }
);

// Tool 2: itsm_get_ci_relationships
server.tool(
  "itsm_get_ci_relationships",
  "Obter relações upstream/downstream de um CI no CMDB",
  {
    ci_id: { type: "string", description: "ID do CI no ITSM" },
    direction: { type: "string", description: "upstream, downstream, ou both (default: both)" },
    depth: { type: "number", description: "Profundidade de traversal (default: 2)" }
  },
  async ({ ci_id, direction = "both", depth = 2 }) => {
    return {
      content: [{ type: "text", text: JSON.stringify({
        ci_id, upstream: [], downstream: [],
        total_upstream: 0, total_downstream: 0,
        message: "PLACEHOLDER — implement CMDB relationship API call"
      }, null, 2)}]
    };
  }
);

// Tool 3: itsm_list_incidents
server.tool(
  "itsm_list_incidents",
  "Listar incidentes recentes para um CI",
  {
    ci_id: { type: "string", description: "ID do CI no ITSM" },
    days_back: { type: "number", description: "Buscar últimos N dias (default: 90)" }
  },
  async ({ ci_id, days_back = 90 }) => {
    return {
      content: [{ type: "text", text: JSON.stringify({
        ci_id, total_incidents: 0, incidents: [],
        summary: { p1_count: 0, p2_count: 0, p3_count: 0, p4_count: 0,
          avg_resolution_hours: 0, stability_score: "stable" },
        message: "PLACEHOLDER — implement incident API call"
      }, null, 2)}]
    };
  }
);

// Tool 4: itsm_list_changes
server.tool(
  "itsm_list_changes",
  "Listar Change Requests para um CI",
  {
    ci_id: { type: "string", description: "ID do CI no ITSM" },
    days_back: { type: "number", description: "Incluir últimos N dias (default: 30)" }
  },
  async ({ ci_id, days_back = 30 }) => {
    return {
      content: [{ type: "text", text: JSON.stringify({
        ci_id, total_changes: 0, changes: [],
        has_conflicts: false, next_maintenance_window: null,
        message: "PLACEHOLDER — implement change request API call"
      }, null, 2)}]
    };
  }
);

// Tool 5: itsm_get_known_errors
server.tool(
  "itsm_get_known_errors",
  "Buscar Known Errors e Problems ativos para um CI",
  {
    ci_id: { type: "string", description: "ID do CI no ITSM" },
    include_resolved: { type: "boolean", description: "Incluir resolvidos (default: false)" }
  },
  async ({ ci_id, include_resolved = false }) => {
    return {
      content: [{ type: "text", text: JSON.stringify({
        ci_id, total_problems: 0, problems: [],
        has_active_problems: false,
        message: "PLACEHOLDER — implement problem API call"
      }, null, 2)}]
    };
  }
);

// Tool 6: itsm_get_sla
server.tool(
  "itsm_get_sla",
  "Obter SLA/OLA do Business Service associado a um CI",
  {
    ci_id: { type: "string", description: "ID do CI no ITSM" },
    business_service_name: { type: "string", description: "Nome do Business Service (alternativa)" }
  },
  async ({ ci_id, business_service_name }) => {
    return {
      content: [{ type: "text", text: JSON.stringify({
        business_service: business_service_name || "PLACEHOLDER",
        criticality: "high",
        availability_sla: { target_percent: 99.95, current_percent: null, remaining_downtime_minutes: null },
        maintenance_windows: [],
        escalation_contacts: [],
        message: "PLACEHOLDER — implement SLA API call"
      }, null, 2)}]
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
