# 🛡️ WARA/Reliability Agent

> **One-Pager | Agente para Clientes | Prioridade: Wave 2**

---

## Problema do Cliente

Clientes brasileiros de grande porte — especialmente bancos e empresas de energia — operam
workloads mission-critical no Azure sem uma avaliação estruturada de resiliência. Os
problemas são recorrentes: dependência de região única (Brazil South), ExpressRoute sem
multi-peering, monitoramento incompleto, e confusão entre SLA da plataforma e SLO do
workload. Internamente, WARA é uma das entregas mais solicitadas (Bradesco PIX, Open
Finance, Seguros, Itaú), mas o processo manual com scripts PowerShell e análise de
planilhas consome 2-3 semanas.

---

## Solução

O **WARA/Reliability Agent** automatiza o ciclo completo de avaliação de resiliência
usando a metodologia WARA (Well-Architected Reliability Assessment) combinada com
APRL (Azure Proactive Resiliency Library). Ele executa coleta automatizada, análise
de gaps, classificação de severidade, e gera relatório executivo com plano de ação
priorizado.

---

## Como Funciona

```
┌───────────┐  ┌───────────┐  ┌────────────┐  ┌────────────┐  ┌──────────┐
│ 1.COLLECT │─▶│ 2.ANALYZE │─▶│ 3.ASSESS   │─▶│ 4.PRIORIT  │─▶│ 5.REPORT │
│ ARG + APRL│  │ Gaps &    │  │ WAF Reliab │  │ Action Plan│  │ Executive│
│ Data      │  │ Findings  │  │ Checklist  │  │ by Risk    │  │ + CxO    │
└───────────┘  └───────────┘  └────────────┘  └────────────┘  └──────────┘
```

| Fase | O que faz | Ferramentas |
|------|-----------|-------------|
| **1. Coleta** | Azure Resource Graph + APRL v2 collectors (PowerShell) | WARA v3 Collector, ARG, KQL |
| **2. Análise** | Identifica gaps de resiliência por resource type | APRL KQL workbooks |
| **3. Assessment** | Avalia contra WAF Reliability Pillar checklist | WAF Reliability checklist |
| **4. Priorização** | Classifica findings por severidade (Critical/High/Medium/Low) | Risk matrix |
| **5. Relatório** | Executive Summary + Action Plan detalhado | Markdown + PPTX |

---

## Findings Mais Comuns no Brasil 🇧🇷

### Disponibilidade e DR
| # | Finding | Frequência | Severidade |
|---|---------|-----------|------------|
| 1 | **Workloads single-region (Brazil South only)** | 80% | 🔴 Critical |
| 2 | **DR não testado ou sem runbook** | 75% | 🔴 Critical |
| 3 | **AZ habilitado mas não totalmente protegido** | 60% | 🟡 High |
| 4 | **RPO/RTO não documentados formalmente** | 70% | 🟡 High |

### Rede e Conectividade
| # | Finding | Frequência | Severidade |
|---|---------|-----------|------------|
| 5 | **ExpressRoute sem multi-peering location** | 65% | 🔴 Critical |
| 6 | **Validação MTU/WAN incompleta** | 50% | 🟡 High |
| 7 | **Network Security sem segmentação adequada** | 55% | 🟡 High |

### Monitoramento e Observabilidade
| # | Finding | Frequência | Severidade |
|---|---------|-----------|------------|
| 8 | **Service Health Alerts não configurados** | 70% | 🟡 High |
| 9 | **Dependência exclusiva de APM externo (Dynatrace)** | 45% | 🟠 Medium |
| 10 | **Sem alertas automatizados para ações corretivas** | 60% | 🟡 High |

---

## Análise APRL por Resource Type

| Resource Type | Checks APRL | Findings Comuns |
|--------------|-------------|-----------------|
| **Application Gateway** | WAF mode, health probes, autoscale, AZ | WAF em detection-only, sem autoscale |
| **ExpressRoute** | Redundância, peering locations, monitoring | Single peering, sem BFD |
| **AKS/ARO** | Node pools, PDB, cluster autoscaler, AZ | PDB ausente, single node pool |
| **Storage** | Replicação, soft delete, lifecycle | GRS não habilitado, sem lifecycle |
| **Cosmos DB** | Multi-region, consistency, backup | Single-region, backup padrão |
| **SQL DB/MI** | Geo-replication, failover groups, backup | Sem failover group configurado |
| **Key Vault** | Soft delete, purge protection, backup | Purge protection desabilitado |

---

## Benefícios

| Benefício | Impacto estimado |
|-----------|------------------|
| **Tempo de assessment** | De 2-3 semanas para 1-2 dias |
| **Cobertura** | 100% dos resource types com checks APRL |
| **Consistência** | Mesma qualidade para todos os clientes |
| **Priorização** | Action plan baseado em risco, não intuição |
| **Executive-ready** | Relatório pronto para CTO/CIO |

---

## Métricas de Sucesso (KPIs)

| KPI | Baseline atual | Meta com agente |
|-----|---------------|-----------------|
| Tempo de WARA completo | 10-15 dias | <2 dias |
| % findings com remediation plan | ~60% | 100% |
| % clientes que implementam remediações | ~40% | >70% |
| WARAs executados/quarter | 2-3 por CSA | 8-10 por CSA |
| Incidentes de resiliência pós-WARA | Variável | -50% |

---

## Alinhamento FY26

| Prioridade da Liderança | Como o agente contribui |
|--------------------------|------------------------|
| 📊 Customer Impact > Activity | Proteção tangível de workloads críticos |
| 🎯 HVE + DevSquad | WARA como gate de qualidade em DevSquads |
| 📈 Usage & Adoption | Confiança na plataforma = mais workloads |
| 🤖 AI & Agents | Demonstra automação de assessment para clientes |

---

## Padrões de DR Observados no Brasil

| Padrão | Adoção | Recomendação |
|--------|--------|--------------|
| **Active-Active (AZ-based, single region)** | 60% | ✅ Bom para maioria dos workloads |
| **Active-Passive Warm (cross-region)** | 20% | ✅ Recomendado para mission-critical |
| **Active-Passive Cold (cross-region)** | 10% | 🟡 Aceitável para workloads não-críticos |
| **ASR para IaaS** | 30% | ✅ Padrão para VMs legadas |
| **Sem DR definido** | 25% | 🔴 Risco inaceitável |

---

## Tecnologias e Integrações

- **GitHub Copilot Agent** (orquestração e análise)
- **WARA v3 Collector Scripts** (PowerShell, coleta ARG)
- **APRL v2 KQL Workbooks** (análise por resource type)
- **Azure Resource Graph** (inventário e queries)
- **WAF Reliability Pillar** (checklist de referência)
- **Azure Monitor / Service Health** (validação de alertas)
- **Markdown + PPTX** (relatórios)

---

## Exemplo de Uso

```
CSA: @wara-agent Executar WARA para workload PIX do Banco Z.
     Subscriptions: sub-pix-prod, sub-pix-dr
     Workload: PIX (pagamentos instantâneos, regulado pelo BACEN)
     SLA exigido: 99.99%

Agent: 🛡️ Iniciando WARA Assessment...

       FASE 1 - COLETA ✅
       ├── 234 resources analisados (2 subscriptions)
       ├── Resource types: AKS, Cosmos DB, AppGW, ExpressRoute, KeyVault
       └── APRL collectors executados: 47 checks

       FASE 2 - ANÁLISE ✅
       🔴 CRITICAL (3 findings)
       ├── ExpressRoute: single peering location (São Paulo only)
       ├── Cosmos DB: single-region (Brazil South), sem multi-region write
       └── DR: sem runbook documentado, último teste >6 meses

       🟡 HIGH (5 findings)
       ├── AKS: PodDisruptionBudget ausente em 4/6 deployments
       ├── AppGW: WAF em detection mode (deveria estar em prevention)
       ├── Service Health Alerts: não configurados
       ├── Key Vault: purge protection desabilitado
       └── Storage: GRS não habilitado para blobs críticos

       🟠 MEDIUM (4 findings)
       ├── Monitoring: dependência exclusiva de Dynatrace
       ├── Backup: Cosmos DB com backup padrão (não contínuo)
       ├── AKS: cluster autoscaler com limits conservadores
       └── Network: NSG rules excessivamente permissivas

       FASE 3 - SLA ANALYSIS ✅
       ├── SLA composta estimada: 99.93% (abaixo do target 99.99%)
       ├── Bottleneck: Cosmos DB single-region (99.99% → 99.999% com multi-region)
       └── Gap: 0.06% = ~26 minutos/mês de indisponibilidade adicional

       ═══════════════════════════════════
       📊 WARA Score: 62/100 (🟡 Needs Improvement)
       📄 Action Plan: 12 remediações priorizadas
       📑 Executive Summary: wara-bancoz-pix-2026-03.pptx
       ⏱️ Tempo total: 4 horas (incluindo coleta)
```

---

## Clientes Alvo (Brasil)

| Segmento | Exemplo | Cenário típico |
|----------|---------|----------------|
| Financial Services | Bradesco, Itaú | PIX, Open Finance, Mobile Banking |
| Insurance | Bradesco Seguros | Open Insurance, Claims Processing |
| Energy | Petrobras | SCADA, Analytics, SAP |
| Government | SERPRO, Caixa | Serviços ao cidadão, pagamentos |
| Telecom | TIM, Claro | BSS/OSS, Customer Experience |

---

## Próximos Passos

1. Integrar WARA v3 Collector como tool do agente
2. Mapear APRL checks para automação via KQL
3. Pilotar com workload PIX de banco parceiro
4. Validar relatório executivo com liderança de cliente

---

*Baseado em WARAs reais executados para Bradesco (PIX, Open Finance, Seguros), Itaú, e padrões APRL do CSU Brasil.*
