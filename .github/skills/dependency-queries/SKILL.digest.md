---
name: dependency-queries
tier: digest
---

# Dependency Queries (Digest)

Key queries by resource type:

**Storage:** Check Function Apps (`AzureWebJobsStorage`), Diagnostic Settings, VM disks
**VM:** Check Load Balancer backend pools, AppGW backends, Network Interfaces
**Cosmos DB:** Check Web App connection strings, Function App bindings
**Generic:** `resources | where resourceGroup == "<RG>"` for full inventory
**Advisor:** `advisorresources | where ... contains "<NAME>"` for recommendations
**Changes:** `resourcechanges | where ... > ago(30d)` for recent changes

Execute via: `azure-resource-graph-mcp/query_resources` or `az graph query -q`
