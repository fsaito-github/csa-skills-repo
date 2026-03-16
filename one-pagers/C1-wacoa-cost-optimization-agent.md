# 💰 WACOA Cost Optimization Agent

> **One-Pager | Agente para Clientes | Prioridade: Wave 1**

---

## Problema do Cliente

Empresas brasileiras enfrentam "bill shock" quando custos Azure crescem sem visibilidade.
Clientes pedem "reduzir custo", mas o valor real está em **realocar orçamento para inovação**.
CSAs executam WACOA manualmente com scripts, workbooks e planilhas — processo que leva
1-2 semanas por assessment. Internamente, os achados se repetem: right-sizing ignorado,
confusão Savings Plans vs Reservations, governance de tagging inexistente, e custos
ocultos em Cosmos DB, Log Analytics e AKS.

---

## Solução

O **WACOA Cost Optimization Agent** automatiza o ciclo completo de assessment de custos
Azure usando a metodologia WACOA (Well-Architected Cost Optimization Assessment).
Ele executa discovery, identifica quick wins, analisa commitments, revisa arquitetura,
estabelece governance de FinOps e gera relatório executivo — tudo adaptado ao mercado
brasileiro com validação de contratos e descontos negociados.

---

## Como Funciona

```
┌───────────┐  ┌───────────┐  ┌────────────┐  ┌────────────┐  ┌──────────┐  ┌──────────┐
│ 1.DISCOVER│─▶│2.QUICK WIN│─▶│3.COMMITMENT│─▶│4.ARCHITECT │─▶│5.FINOPS  │─▶│6.REPORT  │
│ Inventário│  │ Savings   │  │ SP vs RI   │  │ Redesign   │  │ Governanc│  │ Executivo│
│ + Consumo │  │ Imediatos │  │ Analysis   │  │ Patterns   │  │ e Cultura│  │ + Actions│
└───────────┘  └───────────┘  └────────────┘  └────────────┘  └──────────┘  └──────────┘
```

| Fase | O que faz | Ferramentas |
|------|-----------|-------------|
| **1. Discovery** | Inventário via Azure Resource Graph, consumo últimos 90 dias, tag audit | ARG, Cost Management API |
| **2. Quick Wins** | Right-sizing, idle resources, orphaned disks, dev/test pricing | Azure Advisor, Custom KQL |
| **3. Commitments** | Análise Savings Plans vs RI vs On-Demand com break-even | Advisor Workbook, FinOps Toolkit |
| **4. Architecture** | Patterns de custo: autoscale, spot VMs, tiering, reserved capacity | WAF Cost Pillar |
| **5. FinOps Governance** | Tagging, budgets, alerts, cost ownership model | Azure Policy, Cost Management |
| **6. Executive Report** | Relatório com savings, roadmap, e executive summary | Markdown + PPTX |

---

## Diferenciadores Brasil 🇧🇷

| Cenário Brasil | Como o agente lida |
|---------------|-------------------|
| **Contratos com descontos SKU-level** | Valida Advisor vs preço contratado antes de recomendar SP/RI |
| **Break-even com markup** | Calcula payback considerando descontos negociados (MCA-E) |
| **"Reduzir custo" ≠ savings** | Framing como "realocação de budget para AI/inovação" |
| **Log Analytics/Sentinel ocultos** | Análise específica de ingestão de logs e retenção |
| **Cosmos DB over-provisioning** | Detecção de throughput ocioso e recomendação autoscale |
| **AKS node pools ociosos** | Identificação de pools não utilizados e spot node opportunities |

---

## Achados Mais Comuns (Validados em Campo)

| # | Achado | Frequência | Saving típico |
|---|--------|-----------|---------------|
| 1 | **Right-sizing de VMs** | 95% dos assessments | 15-30% |
| 2 | **Recursos idle/órfãos** | 90% | 5-10% |
| 3 | **Savings Plans não aplicados** | 80% | 20-35% |
| 4 | **Cosmos DB over-provisioned** | 60% | 10-40% |
| 5 | **Log Analytics ingestão excessiva** | 70% | 5-15% |
| 6 | **AKS node pools ociosos** | 50% | 10-20% |
| 7 | **Storage tier incorreto** | 75% | 5-10% |
| 8 | **Tagging inconsistente** | 90% | Governance |

---

## Benefícios

| Benefício | Impacto estimado |
|-----------|------------------|
| **Tempo de assessment** | De 1-2 semanas para 2-4 horas |
| **Savings identificados** | 20-40% do spend Azure |
| **Consistência** | Mesma qualidade de análise para todos os clientes |
| **Framing executivo** | Relatório pronto para CFO/CTO |
| **Realocar para AI** | Budget liberado para investir em inovação |

---

## Métricas de Sucesso (KPIs)

| KPI | Baseline atual | Meta com agente |
|-----|---------------|-----------------|
| Tempo de WACOA completo | 5-10 dias | <1 dia |
| % savings implementados | ~40% | >70% |
| Satisfação do cliente (NPS) | ~50 | >80 |
| WACOAs executados/quarter | 3-5 por CSA | 10-15 por CSA |
| Tempo para primeiro quick win | 2-3 semanas | <3 dias |

---

## Alinhamento FY26

| Prioridade da Liderança | Como o agente contribui |
|--------------------------|------------------------|
| 📊 Customer Impact > Activity | Savings tangíveis e mensuráveis |
| 📈 Usage & Adoption | Libera budget para novos workloads |
| 🤖 AI & Agents | Demonstra valor de agents para o cliente |
| 🎯 HVE | Entrega de alto impacto em tempo recorde |

---

## Fluxo Operacional Detalhado

### Fase 1: Discovery
```
Input:  Subscription IDs, Resource Group scope
Tools:  Azure Resource Graph, Cost Management API
Output: Inventário completo + heatmap de consumo
        ├── Total resources por tipo
        ├── Top 20 resources por custo
        ├── Trend de consumo 90 dias
        └── Tag coverage report
```

### Fase 2: Quick Wins
```
Input:  Inventário da Fase 1
Tools:  Azure Advisor, Custom KQL queries
Output: Lista priorizada de savings imediatos
        ├── VMs para right-size (com novo SKU sugerido)
        ├── Recursos idle para shutdown/delete
        ├── Discos órfãos, IPs não associados
        └── Dev/test pricing opportunities
```

### Fase 3: Commitment Analysis
```
Input:  Consumo histórico + preço contratado
Tools:  Advisor Workbook, FinOps Toolkit scripts
Output: Recomendação de commitments
        ├── Savings Plans: valor ideal, termo, cobertura
        ├── Reservations: por SKU, com break-even
        ├── ⚠️ Validação contra contrato MCA-E
        └── Comparativo: SP vs RI vs On-Demand
```

---

## Tecnologias e Integrações

- **GitHub Copilot Agent** (orquestração)
- **Azure Resource Graph** (inventário e queries KQL)
- **Azure Cost Management API** (consumo e tendências)
- **Azure Advisor API** (recomendações de custo)
- **FinOps Toolkit** (scripts WACOA, workbooks)
- **Azure Advisor Cost Optimization Workbook** (análise visual)
- **Markdown + pptxgenjs** (geração de relatórios)

---

## Exemplo de Uso

```
CSA: @wacoa-agent Executar assessment de custo para subscriptions:
     sub-prod-001, sub-prod-002, sub-dev-001
     Cliente: Banco Y
     Contrato: MCA-E com 15% discount em VMs D-series

Agent: 💰 Iniciando WACOA Assessment...

       FASE 1 - DISCOVERY ✅
       ├── 847 resources encontrados
       ├── Spend mensal: R$ 2.3M
       ├── Top custos: VMs (45%), Cosmos DB (18%), Storage (12%)
       └── Tag coverage: 34% (🔴 crítico)

       FASE 2 - QUICK WINS ✅
       ├── 23 VMs para right-size: saving R$ 187K/mês
       ├── 12 recursos idle: saving R$ 45K/mês
       ├── 8 discos órfãos: saving R$ 12K/mês
       └── Dev subscription sem dev/test pricing: saving R$ 89K/mês

       FASE 3 - COMMITMENTS ✅
       ├── Savings Plan recomendado: R$ 890K/mês (3 anos)
       │   ⚠️ Ajustado para contrato MCA-E (-15% D-series)
       │   Break-even: 4.2 meses
       ├── RI para Cosmos DB: saving adicional R$ 34K/mês
       └── Total commitment saving: R$ 312K/mês

       ═══════════════════════════════════
       💰 TOTAL SAVINGS IDENTIFICADOS: R$ 645K/mês (28%)
       📊 Relatório executivo: wacoa-bancoY-2026-03.md
       📑 Deck para CFO: wacoa-bancoY-executive.pptx
```

---

## Clientes Alvo (Brasil)

| Segmento | Exemplo | Cenário típico |
|----------|---------|----------------|
| Financial Services | Bradesco, Itaú, B3 | Bill shock pós-migração, commitment optimization |
| Energy & Resources | Petrobras, Vale | Custos de HPC e analytics |
| Retail | Americanas, Magazine Luiza | Sazonalidade, dev/test waste |
| Government | SERPRO, Prodesp | Compliance + otimização de budget público |

---

## Próximos Passos

1. Implementar Fases 1-2 com Azure Resource Graph queries
2. Integrar FinOps Toolkit scripts para Fase 3
3. Pilotar com 2 clientes do segmento financeiro
4. Validar framing "realocação de budget" com CxO

---

*Baseado em WACOA enablement sessions, FinOps Toolkit Brasil, e padrões reais de Bradesco, Itaú, B3, Petrobras.*
