# 🔗 Dependency Mapping: KQL Queries para Azure Resource Graph

> Queries KQL para identificar dependências entre recursos Azure.
> Use estas queries para calcular o blast radius de uma mudança recomendada pelo Advisor.
> Execute no Azure Resource Graph Explorer ou via Azure CLI / PowerShell.

---

## Como usar

```bash
# Via Azure CLI
az graph query -q "<QUERY_KQL>" --subscriptions <subscription-id>

# Via PowerShell
Search-AzGraph -Query "<QUERY_KQL>" -Subscription <subscription-id>
```

---

## 1. Storage Account — Quem depende deste storage?

### 1.1 Function Apps usando este Storage Account
```kql
resources
| where type == "microsoft.web/sites"
| where kind contains "functionapp"
| extend storageAccount = properties.siteConfig.appSettings
| mv-expand setting = storageAccount
| where setting.name in ("AzureWebJobsStorage", "WEBSITE_CONTENTAZUREFILECONNECTIONSTRING")
| where setting.value contains "<STORAGE_ACCOUNT_NAME>"
| project name, resourceGroup, subscriptionId, location
```

### 1.2 Diagnostic settings apontando para este Storage
```kql
resources
| where type contains "diagnosticsettings"
| where properties.storageAccountId contains "<STORAGE_ACCOUNT_NAME>"
| project name, resourceGroup, type, subscriptionId
```

### 1.3 VMs com discos neste Storage Account
```kql
resources
| where type == "microsoft.compute/virtualmachines"
| extend osDisk = properties.storageProfile.osDisk
| extend dataDisks = properties.storageProfile.dataDisks
| where osDisk.vhd.uri contains "<STORAGE_ACCOUNT_NAME>"
    or dataDisks contains "<STORAGE_ACCOUNT_NAME>"
| project name, resourceGroup, subscriptionId
```

### 1.4 AKS Persistent Volumes neste Storage
```kql
resources
| where type == "microsoft.containerservice/managedclusters"
| where properties.addonProfiles contains "<STORAGE_ACCOUNT_NAME>"
    or properties.storageProfile contains "<STORAGE_ACCOUNT_NAME>"
| project name, resourceGroup, subscriptionId
```

---

## 2. Virtual Machine — Quem depende desta VM?

### 2.1 Load Balancers com esta VM no backend pool
```kql
resources
| where type == "microsoft.network/loadbalancers"
| mv-expand bePool = properties.backendAddressPools
| mv-expand beAddress = bePool.properties.backendAddresses
| where beAddress.properties.virtualMachine.id contains "<VM_NAME>"
| project lbName=name, resourceGroup, subscriptionId
```

### 2.2 Application Gateways com esta VM no backend
```kql
resources
| where type == "microsoft.network/applicationgateways"
| mv-expand bePool = properties.backendAddressPools
| mv-expand beAddress = bePool.properties.backendAddresses
| where beAddress.ipAddress == "<VM_PRIVATE_IP>"
    or beAddress.fqdn contains "<VM_NAME>"
| project appGwName=name, resourceGroup, subscriptionId
```

### 2.3 Network interfaces e NSGs associados
```kql
resources
| where type == "microsoft.network/networkinterfaces"
| where properties.virtualMachine.id contains "<VM_NAME>"
| project nicName=name, resourceGroup,
    nsg=properties.networkSecurityGroup.id,
    subnet=properties.ipConfigurations[0].properties.subnet.id,
    privateIp=properties.ipConfigurations[0].properties.privateIPAddress
```

### 2.4 VMs que dependem desta VM (DNS, AD, file shares)
```kql
// Encontrar VMs na mesma subnet (possíveis dependências de rede)
resources
| where type == "microsoft.network/networkinterfaces"
| where properties.ipConfigurations[0].properties.subnet.id == "<SUBNET_ID>"
| project vmId=properties.virtualMachine.id, privateIp=properties.ipConfigurations[0].properties.privateIPAddress
```

---

## 3. Cosmos DB — Quem consome este database?

### 3.1 Web Apps com connection string Cosmos DB
```kql
resources
| where type == "microsoft.web/sites"
| extend settings = properties.siteConfig.connectionStrings
| mv-expand setting = settings
| where setting.connectionString contains "<COSMOS_ACCOUNT_NAME>"
| project appName=name, resourceGroup, subscriptionId
```

### 3.2 Function Apps usando Cosmos DB bindings
```kql
resources
| where type == "microsoft.web/sites"
| where kind contains "functionapp"
| extend appSettings = properties.siteConfig.appSettings
| mv-expand setting = appSettings
| where setting.value contains "<COSMOS_ACCOUNT_NAME>"
| project functionName=name, resourceGroup, settingName=setting.name
```

### 3.3 Throughput atual e configuração
```kql
resources
| where type == "microsoft.documentdb/databaseaccounts"
| where name == "<COSMOS_ACCOUNT_NAME>"
| project name, resourceGroup, location,
    consistencyPolicy=properties.consistencyPolicy.defaultConsistencyLevel,
    locations=properties.locations,
    enableAutomaticFailover=properties.enableAutomaticFailover,
    enableMultipleWriteLocations=properties.enableMultipleWriteLocations
```

---

## 4. AKS — O que roda neste cluster?

### 4.1 Detalhes do cluster e node pools
```kql
resources
| where type == "microsoft.containerservice/managedclusters"
| where name == "<AKS_CLUSTER_NAME>"
| project name, resourceGroup, kubernetesVersion=properties.kubernetesVersion,
    powerState=properties.powerState.code,
    nodeCount=properties.agentPoolProfiles[0].count,
    vmSize=properties.agentPoolProfiles[0].vmSize
```

### 4.2 Node pools detalhados
```kql
resources
| where type == "microsoft.containerservice/managedclusters/agentpools"
| where id contains "<AKS_CLUSTER_NAME>"
| project poolName=name, vmSize=properties.vmSize,
    count=properties.count, minCount=properties.minCount,
    maxCount=properties.maxCount,
    enableAutoScaling=properties.enableAutoScaling,
    mode=properties.mode
```

### 4.3 Recursos associados ao AKS (VNet, NSG, public IP)
```kql
resources
| where resourceGroup contains "MC_<RESOURCE_GROUP>_<AKS_NAME>"
| project name, type, resourceGroup
| order by type
```

---

## 5. SQL Database / Managed Instance — Dependências

### 5.1 Databases no mesmo server
```kql
resources
| where type == "microsoft.sql/servers/databases"
| where id contains "<SQL_SERVER_NAME>"
| project dbName=name, tier=sku.tier, capacity=sku.capacity,
    maxSizeBytes=properties.maxSizeBytes, status=properties.status
```

### 5.2 Failover groups configurados
```kql
resources
| where type == "microsoft.sql/servers/failovergroups"
| where id contains "<SQL_SERVER_NAME>"
| project name, readWriteEndpoint=properties.readWriteEndpoint,
    partnerServers=properties.partnerServers
```

### 5.3 Private endpoints para SQL
```kql
resources
| where type == "microsoft.network/privateendpoints"
| where properties.privateLinkServiceConnections[0].properties.privateLinkServiceId contains "<SQL_SERVER_NAME>"
| project name, resourceGroup, subnet=properties.subnet.id
```

---

## 6. Networking — Análise de dependências de rede

### 6.1 Recursos em uma subnet específica
```kql
resources
| where type == "microsoft.network/networkinterfaces"
| where properties.ipConfigurations[0].properties.subnet.id contains "<SUBNET_NAME>"
| project name, vmId=properties.virtualMachine.id,
    privateIp=properties.ipConfigurations[0].properties.privateIPAddress
```

### 6.2 ExpressRoute connections e peerings
```kql
resources
| where type == "microsoft.network/expressroutecircuits"
| project name, resourceGroup, serviceProviderName=properties.serviceProviderProperties.serviceProviderName,
    peeringLocation=properties.serviceProviderProperties.peeringLocation,
    bandwidthInMbps=properties.serviceProviderProperties.bandwidthInMbps,
    circuitProvisioningState=properties.circuitProvisioningState
```

### 6.3 Application Gateway backends (todas)
```kql
resources
| where type == "microsoft.network/applicationgateways"
| mv-expand bePool = properties.backendAddressPools
| mv-expand beAddress = bePool.properties.backendAddresses
| project appGwName=name, backendPool=bePool.name,
    target=coalesce(beAddress.ipAddress, beAddress.fqdn)
```

---

## 7. Queries Genéricas (Cross-Resource)

### 7.1 Todos os recursos em um Resource Group
```kql
resources
| where resourceGroup == "<RESOURCE_GROUP_NAME>"
| summarize count() by type
| order by count_ desc
```

### 7.2 Recursos com tag específica
```kql
resources
| where tags.criticality == "high" or tags.env == "production"
| project name, type, resourceGroup, tags
| order by type
```

### 7.3 Advisor recommendations para um recurso específico
```kql
advisorresources
| where properties.resourceMetadata.resourceId contains "<RESOURCE_NAME>"
| project recommendationId=name,
    category=properties.category,
    impact=properties.impact,
    description=properties.shortDescription.solution
```

### 7.4 Health events para um recurso
```kql
healthresources
| where id contains "<RESOURCE_NAME>"
| project name, type, properties.availabilityState,
    properties.title, properties.summary
```

### 7.5 Mudanças recentes em um recurso (Change Analysis)
```kql
resourcechanges
| where properties.targetResourceId contains "<RESOURCE_NAME>"
| where properties.changeAttributes.timestamp > ago(30d)
| project changeTime=properties.changeAttributes.timestamp,
    changeType=properties.changeType,
    changes=properties.changes
| order by changeTime desc
| take 10
```

---

## Dicas de Uso

1. **Substitua placeholders** (`<STORAGE_ACCOUNT_NAME>`, `<VM_NAME>`, etc.) pelo nome real do recurso
2. **Combine queries** para mapear o blast radius completo de uma mudança
3. **Execute no Resource Graph Explorer** (portal) para visualização rápida
4. **Exporte para CSV** para análise offline ou relatório
5. **Scope**: por padrão queries rodam em todas as subscriptions — use `-Subscription` para limitar
