# 🔬 Advisor Impact Analyzer

> **One-Pager | Customer Pain-Driven | Wave 1**

## Customer Problem

Times de operação recebem recomendações do Azure Advisor — *"right-size esta VM",
"mude a replicação deste Storage"* — mas **não conseguem mensurar o impacto da
mudança**. Sem saber o blast radius, o risco de downtime, ou como fazer rollback,
**a recomendação nunca é executada**. O Advisor diz *o que* fazer, mas não explica
*o que pode quebrar*. Resultado: custos crescem, resiliência cai, Advisor Score estagna.

## Solution

Agente de IA que recebe uma recomendação do Advisor e produz um **Impact Assessment**:
mapeia dependências (Azure Resource Graph), calcula blast radius, classifica risco
(🟢 Safe → 🟡 Medium → 🔴 High), detecta falsos positivos, e gera plano de
implementação com rollback. Transforma recomendações genéricas em **decisões informadas**.

## How It Works

```
                    ┌─────────────────────────────────────────────────┐
                    │           FONTES DE DADOS (paralelo)            │
                    │                                                 │
                    │  ┌───────────┐ ┌──────────┐ ┌───────────────┐  │
                    │  │  Azure    │ │  WorkIQ  │ │     ITSM      │  │
                    │  │  Resource │ │  M365    │ │  ServiceNow   │  │
                    │  │  Graph   │ │  emails, │ │  Jira SM, etc │  │
                    │  │  (KQL)   │ │  Teams,  │ │  CMDB, INC,   │  │
                    │  │          │ │  docs    │ │  CHG, SLA     │  │
                    │  └────┬─────┘ └────┬─────┘ └──────┬────────┘  │
                    │       │            │              │            │
                    └───────┼────────────┼──────────────┼────────────┘
                            │            │              │
                            ▼            ▼              ▼
Advisor          ┌──────────────────────────────────────────────┐
Recommendation──▶│          ADVISOR IMPACT ANALYZER             │──▶ Impact Assessment
                 │                                              │    (blast radius, risk,
                 │  Contexto + Dependências + Histórico + SLA   │     plano, rollback)
                 └──────────────────────────────────────────────┘
```

**3 camadas de inteligência:**
1. **Técnica** (Resource Graph) — dependências, métricas, configuração
2. **Organizacional** (WorkIQ) — decisões, incidentes passados, owners, projetos
3. **Operacional** (ITSM) — CMDB, SLAs, change records, known errors

## Key Benefits

| # | Benefício | Métrica |
|---|-----------|---------|
| 1 | **Recommendation adoption** de ~25% para >70% | 3x mais recomendações implementadas |
| 2 | **Tempo de análise** de dias para minutos | -95% tempo de decisão |
| 3 | **Incidentes por mudança** reduzidos | -80% com blast radius conhecido |
| 4 | **Detecção de falsos positivos** | Evita mudanças desnecessárias/danosas |
| 5 | **Change management ready** | Impact Assessment pronto para CAB/GMUD |

## Example

**Advisor:** *"Reduzir Cosmos DB de 10.000 para 4.000 RU/s — saving R$ 5.800/mês"*

**Agent:** 🔴 **ALTO RISCO** — Advisor usou média (2.800 RU/s), mas P95 = 7.200 RU/s.
4.000 RU/s causaria throttling em 35% do horário de pico.
**Alternativa:** Autoscale max 10K → saving R$ 4.200/mês com **zero risco**.

## FAQ

**P: Funciona com todas as recomendações do Advisor?**
R: Cobre 8 resource types: Storage, VMs, Cosmos DB, AKS, SQL, Networking, Key Vault, App Service.

**P: Precisa de acesso ao ambiente Azure?**
R: O agente sugere queries KQL. O operador executa no Resource Graph e alimenta os resultados.

**P: Substitui o Azure Advisor?**
R: Não. Complementa — transforma a saída genérica do Advisor em decisão contextualizada.

---
*Nascido de dor real de cliente. Advisor + Resource Graph + Knowledge Base de Impact Profiles.*

