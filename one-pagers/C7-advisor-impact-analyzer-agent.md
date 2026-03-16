# 🔬 Advisor Impact Analyzer Agent

> **One-Pager | Agente para Clientes | Prioridade: Wave 1 (Customer Pain-Driven)**

---

## Problema do Cliente

> *"Quando recebemos uma recomendação do Advisor — por exemplo, mudar a replicação de
> um Storage Account — nosso time não sabe mensurar o impacto dessa mudança. Qual o
> blast radius? O que pode quebrar? Qual o downtime? Por isso a recomendação acaba
> nunca sendo executada."*

Esse é o ciclo vicioso da **"recommendation paralysis"**:

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Advisor gera │───▶│ Time recebe  │───▶│ Não consegue │───▶│ Recomendação │
│ recomendação │    │ recomendação │    │ avaliar      │    │ nunca é      │
│              │    │              │    │ impacto      │    │ executada    │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                                              │
                                              ▼
                                    ┌──────────────────┐
                                    │ Risco acumula,   │
                                    │ custo cresce,    │
                                    │ resiliência cai  │
                                    └──────────────────┘
```

**Por que isso acontece (dados internos):**
- Recomendações do Advisor são **genéricas** — não conhecem o contexto da arquitetura
- Times têm **medo de quebrar produção** ("blast radius" desconhecido)
- **Falsos positivos** em arquiteturas customizadas reduzem confiança
- Não há mapeamento entre recomendação e **workloads críticos** afetados
- Falta de **plano de rollback** aumenta percepção de risco
- Ninguém traduz recomendação técnica em **impacto de negócio**

---

## Solução

O **Advisor Impact Analyzer Agent** recebe uma recomendação do Azure Advisor e produz
uma **análise de impacto completa**: identifica dependências, calcula blast radius,
classifica risco, verifica falsos positivos, estima downtime, e gera um plano de
implementação com rollback. Transforma recomendações genéricas em **decisões informadas**.

**Antes do agente:**
> "Advisor diz para mudar X. O que fazemos?"  
> "Nada, melhor não mexer."

**Depois do agente:**
> "Advisor diz para mudar X. O agente analisou: impacto baixo, 3 serviços dependentes,  
> zero downtime com implementação gradual, rollback em 2 min. Vamos executar terça."

---

## Como Funciona

```
┌───────────┐  ┌───────────┐  ┌────────────┐  ┌────────────┐  ┌──────────┐  ┌──────────┐
│1.RECOMMEND│─▶│2.CONTEXT  │─▶│3.BLAST     │─▶│4.RISK      │─▶│5.PLAN    │─▶│6.REPORT  │
│ Input da  │  │ Mapeia    │  │ RADIUS     │  │ Score      │  │ Step-by  │  │ Impact   │
│ recomend. │  │ dependênc.│  │ Analysis   │  │ & Validate │  │ Step     │  │ Report   │
└───────────┘  └───────────┘  └────────────┘  └────────────┘  └──────────┘  └──────────┘
```

| Fase | O que faz | Como faz |
|------|-----------|----------|
| **1. Input** | Recebe recomendação do Advisor (ID, tipo, resource) | Advisor API ou input manual |
| **2. Context** | Identifica todas as dependências do recurso afetado | Azure Resource Graph (refs, network, IAM) |
| **3. Blast Radius** | Calcula raio de impacto: apps, serviços, usuários afetados | Dependency graph + traffic analysis |
| **4. Risk Score** | Classifica risco, valida contra falsos positivos | Regras por resource type + arquitetura |
| **5. Plan** | Gera plano de implementação com rollback e timing | Best practices por tipo de mudança |
| **6. Report** | Produz Impact Assessment Document para decisão | Markdown + formato para change management |

---

## Análise por Tipo de Recomendação

### Storage Account
| Recomendação Advisor | Impacto real | Blast radius típico | Risco |
|---------------------|-------------|---------------------|-------|
| Habilitar soft delete | Nenhum downtime, adição de feature | Nenhum | 🟢 Safe |
| Mudar replicação LRS → GRS | Custo aumenta ~2x, sem downtime | Billing | 🟢 Safe |
| Mudar replicação GRS → LRS | Perde DR cross-region | Todos os consumers do storage | 🔴 High |
| Habilitar versioning | Nenhum downtime, custo de storage sobe | Billing | 🟢 Safe |
| Migrar para v2 (GPv1 → GPv2) | Online, sem downtime | Apps com SDK antigo | 🟡 Medium |
| Lifecycle management | Sem downtime, move blobs automaticamente | Apps que acessam blobs movidos | 🟡 Medium |

### Virtual Machines
| Recomendação Advisor | Impacto real | Blast radius típico | Risco |
|---------------------|-------------|---------------------|-------|
| Right-size (downsizing) | Requer restart, possível impacto perf. | Apps na VM + dependentes | 🟡 Medium |
| Shutdown idle VM | Se realmente idle, nenhum impacto | Depende se há dependências ocultas | 🟡 Medium |
| Aplicar Savings Plan | Nenhum impacto técnico, compromisso financeiro | Billing | 🟢 Safe |
| Migrate to newer SKU | Requer restart, melhor performance | Apps na VM | 🟡 Medium |

### Cosmos DB
| Recomendação Advisor | Impacto real | Blast radius típico | Risco |
|---------------------|-------------|---------------------|-------|
| Habilitar autoscale | Sem downtime, muda throughput model | Billing (pode subir em picos) | 🟡 Medium |
| Reduzir RUs provisionados | Sem downtime, risco de throttling | Apps que consomem este container | 🔴 High |
| Habilitar multi-region | Sem downtime, aumenta custo | Billing + consistency model | 🟡 Medium |

### AKS
| Recomendação Advisor | Impacto real | Blast radius típico | Risco |
|---------------------|-------------|---------------------|-------|
| Habilitar cluster autoscaler | Sem downtime | Billing (pode escalar mais) | 🟢 Safe |
| Upgrade Kubernetes version | Requer rolling update, possível breaking changes | Todos os pods | 🔴 High |
| Adicionar PodDisruptionBudget | Sem downtime, melhora resiliência | Nenhum negativo | 🟢 Safe |

### Networking
| Recomendação Advisor | Impacto real | Blast radius típico | Risco |
|---------------------|-------------|---------------------|-------|
| Habilitar DDoS Protection | Sem downtime, custo fixo mensal | Billing | 🟢 Safe |
| Configurar NSG flow logs | Sem downtime, custo de storage/ingestão | Billing | 🟢 Safe |
| Redundância de ExpressRoute | Requer provisioning, sem downtime | Nenhum negativo | 🟢 Safe |

---

## Anatomia do Impact Assessment

```markdown
═══════════════════════════════════════════════════════════════
🔬 ADVISOR IMPACT ASSESSMENT
═══════════════════════════════════════════════════════════════

📋 RECOMENDAÇÃO
├── Tipo: Cost Optimization
├── Descrição: "Right-size VM 'app-server-prod-01' from D4s_v3 to D2s_v3"
├── Recurso: /subscriptions/.../resourceGroups/rg-prod/providers/.../app-server-prod-01
├── Saving estimado: R$ 2.800/mês
└── Advisor Score Impact: +3 pontos

🔍 CONTEXTO DO RECURSO
├── Resource Group: rg-prod (32 recursos)
├── Função: Application server (IIS + .NET)
├── Tags: env=production, team=payments, criticality=high
├── Uptime: 99.98% (últimos 90 dias)
└── Owner: time-infra@cliente.com

📡 BLAST RADIUS
├── Dependências diretas:
│   ├── Azure SQL MI (app-sql-prod) — connection string hardcoded
│   ├── Storage Account (appstorageprod) — blob access
│   ├── Key Vault (kv-app-prod) — secrets
│   └── Application Gateway (appgw-prod) — backend pool member
├── Dependências indiretas:
│   ├── 3 outros VMs no mesmo backend pool do AppGW
│   └── Monitoring: Log Analytics workspace (logs-prod)
├── Usuários afetados: ~5.000 (portal de pagamentos)
└── Serviços afetados: 4 diretos, 2 indiretos

⚠️ ANÁLISE DE RISCO
├── Risco técnico: 🟡 MÉDIO
│   ├── Resize requer restart da VM (~5 min downtime)
│   ├── CPU atual P95: 38% em D4s_v3 → ~76% em D2s_v3
│   ├── Memory atual P95: 45% (6.4GB de 16GB) → 90% em D2s_v3 (8GB)
│   └── ⚠️ ALERTA: Memory P95 ficaria em 90% — risco de OOM em picos
├── Risco de negócio: 🟡 MÉDIO
│   ├── Portal de pagamentos ficaria indisponível durante restart
│   ├── Horário de menor impacto: domingo 02:00-05:00
│   └── SLA impactado: sim (5 min de downtime planejado)
└── Falso positivo?: PARCIAL
    └── Advisor recomenda D2s_v3, mas D2s_v5 seria melhor
        (mesmo preço, mais performance por core)

✅ VALIDAÇÃO
├── ✅ Saving é real: R$ 2.800/mês confirmado
├── ⚠️ CPU: OK para operação normal, risco em picos
├── 🔴 Memory: P95 a 90% — recomendação modificada para D2s_v5 (mais memória)
└── ✅ Rede: throughput suficiente para tráfego atual

📋 PLANO DE IMPLEMENTAÇÃO
├── 1. [PRE] Snapshot da VM (restore point)
├── 2. [PRE] Comunicar janela de manutenção (domingo 02:00)
├── 3. [PRE] Preparar monitoring alertas para pós-resize
├── 4. [EXEC] Deallocate VM
├── 5. [EXEC] Resize para D2s_v5 (recomendação ajustada)
├── 6. [EXEC] Start VM
├── 7. [POST] Validar health checks (IIS, .NET, SQL connection)
├── 8. [POST] Monitorar CPU/Memory por 72h
└── 9. [POST] Confirmar saving no Cost Management (próximo billing cycle)

🔄 ROLLBACK
├── Trigger: CPU P95 > 85% ou Memory P95 > 95% por 1h
├── Ação: Resize back para D4s_v3 (mesmo procedimento)
├── Tempo estimado: 5 minutos
├── Snapshot disponível por: 7 dias
└── Decisão: Automático (via alert) ou manual

📊 DECISÃO RECOMENDADA
├── Implementar: ✅ SIM (com ajuste de SKU)
├── SKU recomendado: D2s_v5 (ao invés de D2s_v3)
├── Janela: Domingo 02:00-03:00
├── Confidence: 🟢 85%
└── Saving ajustado: R$ 2.650/mês

═══════════════════════════════════════════════════════════════
```

---

## O Diferencial: De Genérico para Contextual

| Advisor (hoje) | Impact Analyzer (com agente) |
|----------------|------------------------------|
| "Right-size VM para D2s_v3" | "Right-size, mas use D2s_v5 por causa do memory profile" |
| "Saving: $500/mês" | "Saving: R$ 2.650/mês, validado contra contrato MCA-E" |
| Sem contexto de dependências | "4 serviços dependentes, 5K usuários afetados" |
| Sem análise de risco | "Risco médio: downtime de 5 min, memory a 90%" |
| Sem plano de implementação | "9 steps com pre/exec/post, rollback automatizado" |
| Sem validação de falso positivo | "Parcialmente falso positivo: SKU melhor disponível" |
| Time ignora recomendação | Time executa com confiança |

---

## Benefícios

| Benefício | Impacto estimado |
|-----------|------------------|
| **Recommendation adoption rate** | De ~20-30% para >70% |
| **Tempo de análise** | De horas/dias (manual) para minutos (automático) |
| **Incidentes por mudança** | -80% (blast radius conhecido) |
| **Confiança do time** | De "medo de mudar" para "decisão informada" |
| **Savings realizados** | 2-3x mais savings implementados |
| **Change management** | Impact Assessment pronto para CAB/GMUD |

---

## Métricas de Sucesso (KPIs)

| KPI | Baseline atual | Meta com agente |
|-----|---------------|-----------------|
| % recomendações implementadas | ~20-30% | >70% |
| Tempo para decidir sobre recomendação | 1-4 semanas | <1 dia |
| Incidentes causados por mudanças Advisor | Variável | -80% |
| Advisor Score do cliente | Estagnado | Crescendo MoM |
| Savings realizados vs identificados | ~30% | >70% |

---

## Alinhamento FY26

| Prioridade da Liderança | Como o agente contribui |
|--------------------------|------------------------|
| 📊 Customer Impact > Activity | De "entregar achados" para "implementar mudanças" |
| 🤖 AI & Agents | Agente que resolve gap real do Advisor |
| 📈 Usage & Adoption | Ambiente otimizado = mais budget para novos workloads |
| 🔇 Redução de Fricção | CSA não precisa fazer análise manual de impacto |

---

## Integração com Outros Agentes

```
┌──────────────────┐
│ WACOA Assessment │──── Gera lista de recomendações ───┐
│ (Agent C1)       │                                     │
└──────────────────┘                                     │
                                                         ▼
┌──────────────────┐     ┌───────────────────────┐     ┌─────────────────────┐
│ WARA/Reliability │────▶│ ADVISOR IMPACT        │────▶│ Impact Assessment   │
│ (Agent C2)       │     │ ANALYZER              │     │ por recomendação    │
└──────────────────┘     │ (Este agente)         │     │ → Time executa      │
                         └───────────────────────┘     └─────────────────────┘
┌──────────────────┐                                     ▲
│ Azure Advisor    │──── Feed direto de recomendações ───┘
│ (nativo)         │
└──────────────────┘
```

---

## Tecnologias e Integrações

- **GitHub Copilot Agent** (orquestração e análise)
- **Azure Advisor API** (recomendações, metadata, impacted resources)
- **Azure Resource Graph** (dependency mapping, resource relationships)
- **Azure Monitor** (métricas de utilization para validação)
- **Azure Activity Log** (histórico de mudanças no recurso)
- **Azure Cost Management** (validação de savings)
- **Markdown** (Impact Assessment Document)

---

## Cenários de Alto Valor

| Cenário | Frequência | Valor do agente |
|---------|-----------|-----------------|
| **Right-sizing de VMs em produção** | Muito alta | Blast radius + downtime analysis |
| **Mudança de replicação Storage** | Alta | Impacto em DR e data durability |
| **Redução de RUs Cosmos DB** | Alta | Risco de throttling em picos |
| **Upgrade Kubernetes** | Média | Breaking changes + rollback plan |
| **Remoção de recursos idle** | Muito alta | Validação de "realmente idle" |
| **Aplicação de Savings Plans** | Alta | Análise financeira vs técnica |

---

## Exemplo de Uso Completo

```
Operador: @advisor-impact Analisar recomendação:
          "Enable soft delete for Storage Account 'stproddata01'"
          Subscription: sub-prod-001

Agent: 🔬 Analisando impacto da recomendação...

       📋 RECOMENDAÇÃO: Enable soft delete
       📦 RECURSO: stproddata01 (StorageV2, LRS, Hot)

       📡 BLAST RADIUS: 🟢 NENHUM
       ├── 0 serviços afetados negativamente
       ├── Mudança é aditiva (habilita feature, não altera behavior)
       └── Dados existentes não são modificados

       ⚠️ RISCO: 🟢 ZERO
       ├── Sem downtime
       ├── Sem breaking changes
       ├── Sem impacto em performance
       └── Custo adicional: ~R$ 12/mês (retenção de blobs deletados)

       ✅ FALSO POSITIVO?: NÃO — recomendação 100% válida

       📋 IMPLEMENTAÇÃO:
       ├── 1. az storage account blob-service-properties update \
       │      --account-name stproddata01 \
       │      --enable-delete-retention true \
       │      --delete-retention-days 14
       └── 2. Validar: az storage account blob-service-properties show

       🔄 ROLLBACK: Desabilitar soft delete (mesmo comando, false)

       ═══════════════════════════════════
       📊 DECISÃO: ✅ IMPLEMENTAR IMEDIATAMENTE
       Confidence: 🟢 99%
       Risco: Zero
       Benefício: Proteção contra deleção acidental
       Pode ser feito agora, sem janela de manutenção.
```

```
Operador: @advisor-impact Analisar recomendação:
          "Reduce provisioned throughput on Cosmos DB container 'orders'
           from 10000 RU/s to 4000 RU/s"
          Database: db-ecommerce, Container: orders

Agent: 🔬 Analisando impacto da recomendação...

       📋 RECOMENDAÇÃO: Reduzir throughput de 10000 para 4000 RU/s
       📦 RECURSO: db-ecommerce/orders (Cosmos DB, Brazil South)

       📡 BLAST RADIUS: 🟡 MÉDIO
       ├── 2 APIs consomem este container:
       │   ├── api-orders (AKS, 150 req/s avg, 800 req/s peak)
       │   └── api-reports (App Service, 20 req/s, batch queries)
       ├── Usuários afetados: ~12.000 (clientes do e-commerce)
       └── Horário de pico: 11:00-14:00 e 19:00-22:00

       ⚠️ RISCO: 🔴 ALTO
       ├── Consumo atual P95: 7.200 RU/s
       ├── Consumo peak (Black Friday projetado): 15.000 RU/s
       ├── 4.000 RU/s causaria throttling (HTTP 429) em:
       │   ├── 35% do tempo durante horário de pico
       │   └── 80% durante eventos promocionais
       ├── Impacto: erros visíveis ao usuário, pedidos perdidos
       └── ⚠️ ESTE É UM FALSO POSITIVO PARCIAL
           Advisor baseou-se no consumo médio (2.800 RU/s)
           mas não considerou picos de tráfego.

       ✅ RECOMENDAÇÃO AJUSTADA:
       ├── Ao invés de reduzir para 4.000 fixo:
       │   → Habilitar AUTOSCALE com max 10.000 RU/s
       │   → Min efetivo: 1.000 RU/s (10% do max)
       │   → Saving estimado: R$ 4.200/mês (vs R$ 5.800 do Advisor)
       │   → Risco: 🟢 ZERO (autoscale ajusta automaticamente)
       └── Melhor dos dois mundos: saving + proteção contra picos

       📋 IMPLEMENTAÇÃO:
       ├── 1. [PRE] Habilitar alertas de throttling (429s)
       ├── 2. [EXEC] Mudar de provisioned (10K) para autoscale (max 10K)
       ├── 3. [POST] Monitorar por 7 dias em período normal
       ├── 4. [POST] Validar comportamento em próximo pico
       └── 5. [POST] Ajustar max se necessário

       ═══════════════════════════════════
       📊 DECISÃO: ⚠️ NÃO IMPLEMENTAR COMO ESTÁ
       → Implementar ALTERNATIVA (autoscale) em vez de redução fixa
       Confidence: 🟢 92%
       Saving: R$ 4.200/mês (72% do saving original, 0% do risco)
```

---

## Próximos Passos

1. Criar biblioteca de impact profiles por resource type + recommendation type
2. Integrar com Azure Resource Graph para dependency mapping automático
3. Integrar com Azure Monitor para validação de métricas em tempo real
4. Pilotar com o cliente que reportou o problema
5. Criar versão self-service para times de operação do cliente

---

*Nascido de dor real de cliente. Baseado em padrões de recommendation paralysis
documentados internamente no CSU Brasil e Azure Advisor best practices.*
