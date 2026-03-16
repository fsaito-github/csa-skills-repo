import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { execSync } from "child_process";

const server = new McpServer({
  name: "azure-resource-graph-mcp",
  version: "1.0.0",
  description: "MCP server for Azure Resource Graph KQL queries"
});

// Tool: query_resources
server.tool(
  "query_resources",
  "Executa uma query KQL no Azure Resource Graph",
  {
    query: { type: "string", description: "Query KQL para o Resource Graph" },
    subscriptions: {
      type: "string",
      description: "Subscription IDs separados por vírgula"
    }
  },
  async ({ query, subscriptions }) => {
    try {
      let cmd = `az graph query -q "${query.replace(/"/g, '\\"')}"`;
      if (subscriptions) cmd += ` --subscriptions ${subscriptions}`;
      cmd += " --first 100 -o json";

      const result = execSync(cmd, { encoding: "utf-8", timeout: 60000 });
      return { content: [{ type: "text", text: result }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  }
);

// Tool: get_resource_details
server.tool(
  "get_resource_details",
  "Obtém detalhes de um recurso Azure específico",
  {
    resource_id: { type: "string", description: "Azure Resource ID completo" }
  },
  async ({ resource_id }) => {
    try {
      const query = `resources | where id == '${resource_id}'`;
      const cmd = `az graph query -q "${query}" -o json`;
      const result = execSync(cmd, { encoding: "utf-8", timeout: 30000 });
      return { content: [{ type: "text", text: result }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  }
);

// Tool: get_dependencies
server.tool(
  "get_dependencies",
  "Mapeia dependências de um recurso Azure usando queries pré-definidas",
  {
    resource_name: { type: "string", description: "Nome do recurso Azure" },
    resource_type: {
      type: "string",
      description: "Tipo: vm, storage, cosmosdb, aks, sql, network"
    },
    subscription_id: { type: "string", description: "Subscription ID" }
  },
  async ({ resource_name, resource_type, subscription_id }) => {
    try {
      const queries = {
        storage: [
          `resources | where type == "microsoft.web/sites" | where properties.siteConfig.appSettings contains "${resource_name}" | project name, type, resourceGroup`,
          `resources | where type contains "diagnosticsettings" | where properties.storageAccountId contains "${resource_name}" | project name, type`
        ],
        vm: [
          `resources | where type == "microsoft.network/loadbalancers" | where properties contains "${resource_name}" | project name, resourceGroup`,
          `resources | where type == "microsoft.network/applicationgateways" | where properties contains "${resource_name}" | project name, resourceGroup`,
          `resources | where type == "microsoft.network/networkinterfaces" | where properties.virtualMachine.id contains "${resource_name}" | project name, properties.ipConfigurations[0].properties.privateIPAddress`
        ],
        cosmosdb: [
          `resources | where type == "microsoft.web/sites" | where properties contains "${resource_name}" | project name, type, resourceGroup`
        ],
        aks: [
          `resources | where type == "microsoft.containerservice/managedclusters" | where name == "${resource_name}" | project name, properties.kubernetesVersion, properties.agentPoolProfiles`
        ]
      };

      const typeQueries = queries[resource_type] || [
        `resources | where name == "${resource_name}" | project name, type, resourceGroup, tags`
      ];

      const results = [];
      for (const q of typeQueries) {
        try {
          let cmd = `az graph query -q "${q.replace(/"/g, '\\"')}"`;
          if (subscription_id) cmd += ` --subscriptions ${subscription_id}`;
          cmd += " -o json";
          const r = execSync(cmd, { encoding: "utf-8", timeout: 30000 });
          results.push(JSON.parse(r));
        } catch { /* skip failed queries */ }
      }

      return {
        content: [{
          type: "text",
          text: JSON.stringify({ resource: resource_name, type: resource_type, dependencies: results }, null, 2)
        }]
      };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
