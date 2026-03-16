# 🔍 Migration Discovery Agent

> **One-Pager | Agente para Clientes | Prioridade: Wave 3**

---

## Problema do Cliente

Migrações Azure no Brasil começam frequentemente como lift-and-shift sem discovery
estruturado. Clientes não mapeiam dependências entre workloads, subestimam complexidade,
e acabam com migrações travadas ou incompletas. Internamente, Azure Migrate é a
ferramenta principal, mas CSAs precisam complementar com análise manual de AWS bills,
dependency mapping e wave planning em planilhas. O processo de discovery a wave plan
leva 3-6 semanas e é altamente manual.

---

## Solução

O **Migration Discovery Agent** automatiza as fases de discovery, assessment e wave
planning de migrações Azure. Utiliza Azure Migrate como backbone, complementa com
análise de dependências, validação de Landing Zone, e gera um plano de migração
estruturado com waves, RACI, risk matrix e timeline.

---

## Como Funciona

```
┌───────────┐  ┌───────────┐  ┌────────────┐  ┌────────────┐  ┌──────────┐  ┌──────────┐
│ 1.DISCOVER│─▶│ 2.ASSESS  │─▶│ 3.DEPEND   │─▶│ 4.LANDING  │─▶│ 5.WAVE   │─▶│ 6.REPORT │
│ Inventário│  │ Readiness │  │ Mapping    │  │ Zone Check │  │ Planning │  │ Migration│
│ Estate    │  │ & Sizing  │  │            │  │            │  │          │  │ Plan     │
└───────────┘  └───────────┘  └────────────┘  └────────────┘  └──────────┘  └──────────┘
```

| Fase | O que faz | Ferramentas |
|------|-----------|-------------|
| **1. Discovery** | Inventário completo do estate (on-prem, AWS, VMware) | Azure Migrate Appliance, manual import |
| **2. Assessment** | Readiness por workload, sizing, estimativa de custo Azure | Azure Migrate Assessment |
| **3. Dependencies** | Mapeamento de dependências entre workloads | Dependency visualization, agent-based/agentless |
| **4. Landing Zone** | Validação da LZ de destino (networking, identity, governance) | CAF Landing Zone checklist |
| **5. Wave Planning** | Agrupamento em waves por dependência, risco e complexidade | Wave planning engine |
| **6. Report** | Migration Plan completo com timeline, RACI e risk matrix | Markdown + PPTX |

---

## Cenários de Migração no Brasil 🇧🇷

| Cenário | Frequência | Complexidade | Trigger |
|---------|-----------|--------------|---------|
| **On-prem → Azure VMs** | Muito alta | Média | Custo, modernização de DC |
| **AWS EC2 → Azure VMs** | Alta | Média | Estratégia multi-cloud, custos AWS |
| **VMware → AVS** | Alta | Alta | Broadcom/licensing, performance |
| **VMC on AWS → AVS** | Média | Alta | Broadcom uncertainty, incentivos AVS |
| **On-prem → PaaS** | Média | Alta | Modernização, redução operacional |
| **Data migration (TB/PB)** | Alta | Alta | Data gravity, compliance |

---

## Migration Strategy Decision Tree

```
                    ┌─── Workload assessment ───┐
                    │                            │
            ┌───────┴───────┐            ┌───────┴───────┐
            │ Manter?       │            │ Migrar?       │
            │               │            │               │
          ┌─┴─┐          ┌──┴──┐     ┌───┴───┐     ┌────┴────┐
          │Ret │          │Reta │     │Rehost │     │Moderni  │
          │ire │          │in   │     │(L&S)  │     │ze       │
          └────┘          └─────┘     └───────┘     └────┬────┘
                                                         │
                                                  ┌──────┴──────┐
                                                  │             │
                                              Refactor    Rearchitect
                                              (PaaS)      (Cloud-native)
```

---

## Wave Planning Framework

| Wave | Critério | Exemplo |
|------|----------|---------|
| **Wave 0 (Foundation)** | Landing Zone, networking, identity, governance | VNet, ExpressRoute, Azure AD, policies |
| **Wave 1 (Quick Wins)** | Workloads simples, sem dependências críticas | File servers, web servers estáticos |
| **Wave 2 (Core Infra)** | AD, DNS, shared services | Domain controllers, SCCM |
| **Wave 3 (Applications)** | Aplicações de negócio com dependências | ERP, CRM, portais internos |
| **Wave 4 (Complex)** | Workloads com alta dependência ou regulação | Core banking, SAP, SCADA |
| **Wave 5 (Modernize)** | Candidatos a PaaS/containerização | APIs, microserviços, analytics |

---

## Benefícios

| Benefício | Impacto estimado |
|-----------|------------------|
| **Tempo de discovery** | De 3-6 semanas para 1-2 semanas |
| **Qualidade do plano** | Dependencies mapeadas = menos surpresas |
| **Risk reduction** | Risk matrix antecipa problemas |
| **Governance** | RACI claro desde o início |
| **ACR acceleration** | Migração mais rápida = consumo mais cedo |

---

## Métricas de Sucesso (KPIs)

| KPI | Baseline atual | Meta com agente |
|-----|---------------|-----------------|
| Tempo de discovery a wave plan | 3-6 semanas | 1-2 semanas |
| % workloads com dependencies mapeadas | ~40% | >90% |
| % migrações com rollback plan | ~30% | 100% |
| Migration velocity (VMs/semana) | 10-20 | 30-50 |
| Issues não previstos durante migração | 5-10 por wave | <2 por wave |

---

## Alinhamento FY26

| Prioridade da Liderança | Como o agente contribui |
|--------------------------|------------------------|
| 🎯 HVE + DevSquad | Execução focada com plano estruturado |
| 📊 Customer Impact > Activity | Migração bem planejada = menos retrabalho |
| 📈 Usage & Adoption | Workloads migrados = ACR imediato |
| 🔇 Redução de Fricção | Automação de discovery e wave planning |

---

## Validação de Landing Zone

| Área | Checklist |
|------|-----------|
| **Networking** | VNet design, subnets, NSGs, ExpressRoute/VPN, DNS |
| **Identity** | Azure AD/Entra, RBAC, PIM, MFA |
| **Governance** | Management groups, policies, naming convention |
| **Security** | Defender for Cloud, Sentinel, Key Vault |
| **Management** | Azure Monitor, Log Analytics, Update Management |
| **Cost** | Budgets, tags, cost allocation |
| **Compliance** | LGPD, setor-specific (BACEN, ANEEL, ANATEL) |

---

## Tecnologias e Integrações

- **GitHub Copilot Agent** (orquestração)
- **Azure Migrate** (discovery, assessment, migration)
- **Azure Resource Graph** (inventário de destino)
- **Dependency Visualization** (agent-based/agentless)
- **CAF Landing Zone** (validação de destino)
- **Azure Data Box** (migração de dados offline)
- **Markdown + PPTX** (migration plan)

---

## Exemplo de Uso

```
CSA: @migration-discovery Cliente W quer migrar 500 VMs de on-prem para Azure.
     Estate: VMware vSphere 7, 3 clusters, ~200TB de dados.
     Conectividade: ExpressRoute já provisionado.
     Landing Zone: CAF básica já deployada.
     Timeline desejado: 6 meses.

Agent: 🔍 Iniciando Migration Discovery...

       FASE 1 - DISCOVERY ✅
       ├── 487 VMs identificadas (13 não suportadas)
       ├── 193 TB de dados totais
       ├── OS: Windows Server 2019 (60%), Linux (35%), Legacy (5%)
       └── 12 clusters de aplicação identificados

       FASE 2 - ASSESSMENT ✅
       ├── Azure Ready: 412 VMs (85%)
       ├── Conditionally Ready: 58 VMs (12%)
       ├── Not Ready: 17 VMs (3%) — OS não suportado
       └── Custo Azure estimado: R$ 890K/mês (vs R$ 1.2M on-prem)

       FASE 3 - DEPENDENCIES ✅
       ├── 12 clusters de dependência mapeados
       ├── 3 "blast radius" clusters (>20 VMs interdependentes)
       └── 2 workloads com dependência externa (SaaS, on-prem legacy)

       FASE 4 - LANDING ZONE ✅
       ├── 🟢 Networking: OK (ExpressRoute + VNet design)
       ├── 🟢 Identity: OK (Entra ID + RBAC)
       ├── 🟡 Governance: Tags incompletas (precisa política)
       └── 🟡 Security: Defender for Cloud não habilitado

       FASE 5 - WAVE PLAN ✅
       ├── Wave 0: LZ fixes (governance, security) — 2 semanas
       ├── Wave 1: 87 VMs simples (file/web) — 3 semanas
       ├── Wave 2: 145 VMs core infra (AD, DNS) — 4 semanas
       ├── Wave 3: 180 VMs aplicações — 6 semanas
       └── Wave 4: 75 VMs complexas (SAP, legacy) — 6 semanas

       ═══════════════════════════════════
       📋 Migration Plan: migration-plan-clienteW-2026.md
       📊 Risk Matrix: 23 riscos identificados, 5 críticos
       📑 Executive Summary: migration-exec-clienteW.pptx
       ⏱️ Timeline estimado: 21 semanas (dentro do target)
```

---

## Próximos Passos

1. Integrar com Azure Migrate API para discovery automatizado
2. Criar wave planning engine com dependency analysis
3. Pilotar com 1 migração de médio porte (200-500 VMs)
4. Validar com CSAs que executam migrações regularmente

---

*Baseado em padrões de migração do CSU Brasil, Azure Migrate practices, e CAF Migration Landing Zone.*
