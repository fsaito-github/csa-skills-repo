---
name: dependency-queries
description: >
  KQL queries para Azure Resource Graph que mapeiam dependências entre recursos Azure.
  Usado pelo Advisor Impact Analyzer para calcular blast radius.
  Execute via azure-resource-graph-mcp/query_resources ou az graph query.
metadata:
  author: fsaito
  version: "1.0"
  category: azure-resource-graph
---

# Dependency Queries — KQL para Azure Resource Graph

## Como Usar

```bash
# Via MCP tool
azure-resource-graph-mcp/query_resources({ query: "<KQL>", subscriptions: ["sub-id"] })

# Via Azure CLI
az graph query -q "<KQL>" --subscriptions <sub-id>
```

---

## Storage Account — Dependências

### Function Apps usando este Storage
```kql
resources
| where type == "microsoft.web/sites" and kind contains "functionapp"
| extend settings = properties.siteConfig.appSettings
| mv-expand s = settings
| where s.name in ("AzureWebJobsStorage","WEBSITE_CONTENTAZUREFILECONNECTIONSTRING")
| where s.value contains "<STORAGE_NAME>"
| project name, resourceGroup, subscriptionId
```

### Diagnostic settings apontando para este Storage
```kql
resources
| where type contains "diagnosticsettings"
| where properties.storageAccountId contains "<STORAGE_NAME>"
| project name, resourceGroup, type
```

---

## Virtual Machine — Dependências

### Load Balancers com esta VM
```kql
resources
| where type == "microsoft.network/loadbalancers"
| mv-expand pool = properties.backendAddressPools
| mv-expand addr = pool.properties.backendAddresses
| where addr.properties.virtualMachine.id contains "<VM_NAME>"
| project lbName=name, resourceGroup
```

### Application Gateways com esta VM
```kql
resources
| where type == "microsoft.network/applicationgateways"
| mv-expand pool = properties.backendAddressPools
| mv-expand addr = pool.properties.backendAddresses
| where addr.ipAddress == "<VM_IP>" or addr.fqdn contains "<VM_NAME>"
| project appGwName=name, resourceGroup
```

### Network Interfaces
```kql
resources
| where type == "microsoft.network/networkinterfaces"
| where properties.virtualMachine.id contains "<VM_NAME>"
| project nicName=name, nsg=properties.networkSecurityGroup.id,
    privateIp=properties.ipConfigurations[0].properties.privateIPAddress
```

---

## Cosmos DB — Dependências

### Web Apps com connection string Cosmos
```kql
resources
| where type == "microsoft.web/sites"
| extend conns = properties.siteConfig.connectionStrings
| mv-expand c = conns
| where c.connectionString contains "<COSMOS_NAME>"
| project appName=name, resourceGroup
```

---

## Cross-Resource — Queries Genéricas

### Todos os recursos no Resource Group
```kql
resources
| where resourceGroup == "<RG_NAME>"
| summarize count() by type
| order by count_ desc
```

### Advisor recommendations para um recurso
```kql
advisorresources
| where properties.resourceMetadata.resourceId contains "<RESOURCE_NAME>"
| project category=properties.category, impact=properties.impact,
    description=properties.shortDescription.solution
```

### Health events
```kql
healthresources
| where id contains "<RESOURCE_NAME>"
| project name, properties.availabilityState, properties.title
```

### Mudanças recentes (Change Analysis)
```kql
resourcechanges
| where properties.targetResourceId contains "<RESOURCE_NAME>"
| where properties.changeAttributes.timestamp > ago(30d)
| project changeTime=properties.changeAttributes.timestamp,
    changeType=properties.changeType
| order by changeTime desc
| take 10
```
