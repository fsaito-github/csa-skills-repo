import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { execSync } from "child_process";

const server = new McpServer({
  name: "azure-advisor-mcp",
  version: "1.0.0",
  description: "MCP server for Azure Advisor recommendations"
});

// Tool: list_recommendations
server.tool(
  "list_recommendations",
  "Lista recomendações do Azure Advisor para uma subscription",
  {
    subscription_id: { type: "string", description: "Azure Subscription ID" },
    category: {
      type: "string",
      description: "Filtrar por categoria: Cost, HighAvailability, Security, Performance, OperationalExcellence",
    },
    resource_group: { type: "string", description: "Filtrar por Resource Group (opcional)" },
    top: { type: "number", description: "Limitar número de resultados (default: 20)" }
  },
  async ({ subscription_id, category, resource_group, top = 20 }) => {
    try {
      let cmd = `az advisor recommendation list --subscription ${subscription_id}`;
      if (category) cmd += ` --category ${category}`;
      if (resource_group) cmd += ` --resource-group ${resource_group}`;
      cmd += ` --top ${top} -o json`;

      const result = execSync(cmd, { encoding: "utf-8", timeout: 30000 });
      return { content: [{ type: "text", text: result }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  }
);

// Tool: get_recommendation
server.tool(
  "get_recommendation",
  "Obtém detalhes de uma recomendação específica do Advisor",
  {
    recommendation_id: { type: "string", description: "ID da recomendação do Advisor" },
    subscription_id: { type: "string", description: "Azure Subscription ID" }
  },
  async ({ recommendation_id, subscription_id }) => {
    try {
      const cmd = `az advisor recommendation show --ids ${recommendation_id} --subscription ${subscription_id} -o json`;
      const result = execSync(cmd, { encoding: "utf-8", timeout: 30000 });
      return { content: [{ type: "text", text: result }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  }
);

// Tool: get_advisor_score
server.tool(
  "get_advisor_score",
  "Obtém o Advisor Score da subscription",
  {
    subscription_id: { type: "string", description: "Azure Subscription ID" }
  },
  async ({ subscription_id }) => {
    try {
      const cmd = `az advisor recommendation list --subscription ${subscription_id} -o json`;
      const result = execSync(cmd, { encoding: "utf-8", timeout: 30000 });
      const recs = JSON.parse(result);
      const summary = {
        total: recs.length,
        byCategory: {},
        byImpact: {}
      };
      recs.forEach(r => {
        summary.byCategory[r.category] = (summary.byCategory[r.category] || 0) + 1;
        summary.byImpact[r.impact] = (summary.byImpact[r.impact] || 0) + 1;
      });
      return { content: [{ type: "text", text: JSON.stringify(summary, null, 2) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
