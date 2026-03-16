# 📚 Impact Profiles: Base de Conhecimento

> Referência de impacto por resource type e tipo de recomendação do Azure Advisor.
> Use esta base para classificar risco, identificar falsos positivos, e estimar blast radius.

---

## Storage Account

| Recomendação | Downtime | Blast Radius | Risco | Rollback | Falsos Positivos |
|-------------|----------|-------------|-------|----------|-----------------|
| **Habilitar soft delete** | Zero | Nenhum (aditivo) | 🟢 Safe | Desabilitar | Nenhum |
| **Habilitar versioning** | Zero | Billing (custo de versões) | 🟢 Safe | Desabilitar | Nenhum |
| **Habilitar blob change feed** | Zero | Nenhum (aditivo) | 🟢 Safe | Desabilitar | Nenhum |
| **Lifecycle management** | Zero | Apps que acessam blobs movidos de tier | 🟡 Medium | Remover policy | Blobs acessados por apps legadas com path hardcoded |
| **Migrar GPv1 → GPv2** | Zero (online) | Apps com SDK antigo (<v12) | 🟡 Medium | Não reversível | Nenhum |
| **Mudar LRS → GRS** | Zero | Billing (+~95% custo) | 🟢 Safe | Mudar back para LRS | Nenhum |
| **Mudar GRS → LRS** | Zero | DR: perde cópia cross-region | 🔴 High | Mudar back para GRS | Se cliente tem DR alternativo (backup externo) |
| **Mudar Hot → Cool** | Zero | Acesso: custo de leitura sobe | 🟡 Medium | Mudar back para Hot | Blobs acessados frequentemente mas classificados como "cool candidates" |
| **Mudar Hot → Archive** | Zero | Blobs inacessíveis sem rehydrate (horas) | 🔴 High | Rehydrate (1-15h) | Blobs que parecem cold mas são acessados por batch jobs |
| **Habilitar HTTPS-only** | Zero | Apps usando HTTP sem redirect | 🟡 Medium | Desabilitar | Apps legadas internas sem HTTPS |

### Dependency mapping (Storage)
```
Storage Account
├── Quem lê/escreve?
│   ├── Function Apps (bindings)
│   ├── Logic Apps (connectors)
│   ├── Web Apps (connection strings)
│   ├── VMs (mounted disks, scripts)
│   └── ADF/Synapse (pipelines)
├── Quem monitora?
│   ├── Diagnostic settings → Log Analytics
│   └── Azure Monitor alerts
└── Quem depende para boot?
    ├── Cloud Shell
    ├── Function Apps (host storage)
    └── AKS (etcd, persistent volumes)
```

---

## Virtual Machines

| Recomendação | Downtime | Blast Radius | Risco | Rollback | Falsos Positivos |
|-------------|----------|-------------|-------|----------|-----------------|
| **Right-size (downsize)** | Sim (~5 min restart) | Apps na VM + dependentes via rede | 🟡 Medium | Resize back (restart) | VM sized para pico/seasonal que parece idle |
| **Right-size (burstable B-series)** | Sim (~5 min restart) | Apps que precisam de CPU sustentado | 🟡 Medium | Resize back | Workloads com CPU variável mas sem créditos suficientes |
| **Shutdown idle VM** | Sim (permanente até restart) | Todos os serviços hosted | 🟡 Medium | Start VM | VMs de DR, batch, seasonal, ou standby |
| **Migrate to newer SKU (v3→v5)** | Sim (~5 min restart) | Nenhum negativo (melhor perf) | 🟡 Medium | Resize back | Nenhum (geralmente benéfico) |
| **Aplicar Savings Plan** | Zero (financeiro) | Billing (compromisso 1-3 anos) | 🟢 Safe | Não reversível (compromisso) | Workloads que podem migrar para PaaS em breve |
| **Aplicar Reserved Instance** | Zero (financeiro) | Billing (locked SKU/region) | 🟢 Safe | Trocar/cancelar com penalidade | Workloads que mudam de SKU frequentemente |
| **Habilitar Azure Hybrid Benefit** | Zero | Billing (requer licença Windows) | 🟢 Safe | Desabilitar | Se cliente não tem SA/licenças suficientes |

### Dependency mapping (VM)
```
Virtual Machine
├── Quem conecta?
│   ├── Application Gateway (backend pool)
│   ├── Load Balancer (backend pool)
│   ├── Traffic Manager (endpoint)
│   └── Front Door (origin)
├── Quem depende?
│   ├── Outras VMs (AD, DNS, file shares)
│   ├── SQL Server (se hosted na VM)
│   ├── Apps com IP/hostname hardcoded
│   └── VPN/ExpressRoute (se gateway)
├── O que roda?
│   ├── IIS / Apache / Nginx
│   ├── SQL Server / MySQL / PostgreSQL
│   ├── Custom services / daemons
│   └── Scheduled tasks / cron jobs
└── Monitoring
    ├── Azure Monitor Agent
    ├── Log Analytics workspace
    └── Diagnostic settings
```

### ⚠️ Falsos positivos comuns em VMs
- **VM de DR/standby**: CPU em 0% por design — **NÃO** desligar
- **VM de batch/ETL**: ativa apenas em horários específicos — verificar schedule
- **VM seasonal**: Black Friday, fechamento fiscal — verificar sazonalidade
- **VM de build/CI**: idle entre builds — verificar se spot/scale set seria melhor

---

## Cosmos DB

| Recomendação | Downtime | Blast Radius | Risco | Rollback | Falsos Positivos |
|-------------|----------|-------------|-------|----------|-----------------|
| **Habilitar autoscale** | Zero | Billing (custo em picos sobe) | 🟡 Medium | Voltar para provisioned | Nenhum |
| **Reduzir RUs provisioned** | Zero | Throttling (HTTP 429) se P95 > novo valor | 🔴 High | Aumentar RUs | Advisor usa média; P95/P99 conta história diferente |
| **Habilitar multi-region** | Zero | Billing (+~100% por região), consistency model | 🟡 Medium | Remover região | Nenhum |
| **Habilitar continuous backup** | Zero | Billing (custo +~25%) | 🟢 Safe | Não reversível | Nenhum |
| **Container idle: reduzir/deletar** | Zero/Permanente | Apps que usam o container | 🔴 High | Restaurar backup | Containers usados por batch/seasonal |

### ⚠️ Falsos positivos comuns em Cosmos DB
- **RU médio vs pico**: Advisor recomenda 4K mas P95 é 7K → throttling em picos
- **Container "idle"**: usado por batch job mensal → verificar schedule
- **Consistency model**: mudança de Strong para Session pode quebrar lógica de app

### Alternativa inteligente: Quando Advisor diz "reduzir RUs"
```
Em vez de: Reduzir de 10.000 para 4.000 RU/s (fixo)
Fazer:     Habilitar Autoscale com max 10.000 RU/s
           → Min efetivo: 1.000 RU/s (10% do max)
           → Saving: 60-80% em horários de baixa
           → Zero risco: escala automaticamente em picos
```

---

## AKS (Azure Kubernetes Service)

| Recomendação | Downtime | Blast Radius | Risco | Rollback | Falsos Positivos |
|-------------|----------|-------------|-------|----------|-----------------|
| **Habilitar cluster autoscaler** | Zero | Billing (pode escalar mais) | 🟢 Safe | Desabilitar | Nenhum |
| **Adicionar PodDisruptionBudget** | Zero | Nenhum (melhora resiliência) | 🟢 Safe | Remover PDB | Nenhum |
| **Upgrade Kubernetes version** | Rolling update (~15min) | Pods com API deprecated, breaking changes | 🔴 High | Não reversível facilmente | Nenhum, mas validar compatibility matrix |
| **Upgrade node image** | Rolling update | Minimal se PDB configurado | 🟡 Medium | Criar novo node pool com image anterior | Nenhum |
| **Remover node pool idle** | Depende | Pods que dependem de node affinity/toleration | 🟡 Medium | Recriar node pool | Node pool de DR ou burst |

### ⚠️ Falsos positivos comuns em AKS
- **Node pool "idle"**: pode ser para burst capacity (Black Friday)
- **Upgrade K8s**: deve seguir N-2 policy, mas validar APIs deprecated

---

## SQL Database / Managed Instance

| Recomendação | Downtime | Blast Radius | Risco | Rollback | Falsos Positivos |
|-------------|----------|-------------|-------|----------|-----------------|
| **Right-size (reduzir DTU/vCore)** | Zero (online) | Performance se P95 > novo tier | 🟡 Medium | Scale up (online, ~minutos) | Workloads com picos noturnos/batch |
| **Mudar para elastic pool** | Zero (online) | Billing (modelo compartilhado) | 🟡 Medium | Remover do pool | Se databases têm picos simultâneos |
| **Habilitar geo-replication** | Zero | Billing + latência cross-region | 🟢 Safe | Remover secondary | Nenhum |
| **Habilitar failover groups** | Zero | Billing + DNS changes | 🟢 Safe | Remover failover group | Nenhum |
| **Aplicar TDE (encryption)** | Zero | Performance (~3-5% overhead) | 🟢 Safe | Não reversível facilmente | Nenhum |

---

## Networking

| Recomendação | Downtime | Blast Radius | Risco | Rollback | Falsos Positivos |
|-------------|----------|-------------|-------|----------|-----------------|
| **Habilitar DDoS Protection** | Zero | Billing (R$ ~10K/mês fixo) | 🟢 Safe | Desabilitar | Custo pode ser alto para ambientes pequenos |
| **NSG flow logs** | Zero | Billing (storage + Log Analytics) | 🟢 Safe | Desabilitar | Nenhum |
| **ExpressRoute redundância** | Zero | Nenhum (melhora resiliência) | 🟢 Safe | Remover peering | Nenhum |
| **App Gateway: WAF Prevention mode** | Zero | Pode bloquear tráfego legítimo | 🔴 High | Voltar para Detection | Regras WAF muito restritivas para apps legadas |
| **Migrar Basic Load Balancer → Standard** | Sim (~5-10 min) | VMs no backend pool | 🟡 Medium | Não reversível facilmente | Nenhum (Basic será retired) |

---

## Key Vault

| Recomendação | Downtime | Blast Radius | Risco | Rollback | Falsos Positivos |
|-------------|----------|-------------|-------|----------|-----------------|
| **Habilitar soft delete** | Zero | Nenhum (aditivo, obrigatório desde 2/2025) | 🟢 Safe | Não reversível | Nenhum |
| **Habilitar purge protection** | Zero | Secrets não podem ser purgados por 90 dias | 🟢 Safe | Não reversível | Nenhum |
| **Rotacionar secrets/certificates** | Zero se apps usam Key Vault ref | Apps com secrets hardcoded | 🟡 Medium | Restaurar versão anterior | Apps legadas sem Key Vault integration |

---

## App Service

| Recomendação | Downtime | Blast Radius | Risco | Rollback | Falsos Positivos |
|-------------|----------|-------------|-------|----------|-----------------|
| **Right-size plan (downsize)** | Swap-based (zero se staging slot) | Performance se under-sized | 🟡 Medium | Scale up | Plans sized para pico seasonal |
| **Deletar plan vazio/unused** | N/A | Nenhum se realmente vazio | 🟢 Safe | Recriar | Plan com apps em staging/hidden |
| **Habilitar Always On** | Zero | Nenhum (melhora cold start) | 🟢 Safe | Desabilitar | Não disponível em Free/Shared tier |
| **Habilitar Health Check** | Zero | Instâncias unhealthy são removidas | 🟢 Safe | Desabilitar | Apps sem endpoint de health |

---

## Regra Universal de Validação

Antes de classificar qualquer recomendação, verifique:

1. **Tags de criticality**: Se `criticality=high` ou `env=production`, aumente o nível de cautela
2. **Horário de análise**: Métricas coletadas em feriado/férias podem ser outliers
3. **Sazonalidade**: Verifique se o recurso tem padrão sazonal (fin de mês, Black Friday)
4. **Contrato**: Savings Plans e RIs devem ser validados contra preço MCA-E
5. **Compensating controls**: Advisor pode não ver backup externo, DR alternativo, ou proxy reverso
