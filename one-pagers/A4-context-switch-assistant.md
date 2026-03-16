# 🔄 Context Switch Assistant

> **One-Pager | Agente para CSAs | Prioridade: Wave 3**

---

## Problema do Cliente

CSAs atendem múltiplos clientes por dia, frequentemente alternando entre 3-5 contextos
completamente diferentes. Cada troca de contexto exige relembrar: qual a arquitetura do
cliente, quais decisões foram tomadas, quais são as pendências, o que foi discutido na
última reunião. Esse "carregamento de contexto" consome até 30% do tempo produtivo e
aumenta o risco de erros por falta de informação atualizada.

---

## Solução

O **Context Switch Assistant** é um agente de IA que mantém o estado atualizado de cada
engagement ativo do CSA. Antes de qualquer reunião ou interação, ele gera um brief
contextual com tudo que o CSA precisa saber. Após a reunião, extrai action items e
atualiza o estado. Funciona como uma "memória persistente" do CSA.

---

## Como Funciona

```
┌──────────────┐    ┌───────────────┐    ┌───────────────┐
│  PRE-MEETING │    │   MEETING     │    │ POST-MEETING  │
│  Brief       │    │   (CSA atua)  │    │   Debrief     │
│  contextual  │    │               │    │   + Actions   │
└──────────────┘    └───────────────┘    └───────────────┘
       │                                         │
       ▼                                         ▼
  ┌────────────┐                          ┌────────────┐
  │ ENGAGEMENT │◀─────────────────────────│  ATUALIZA  │
  │   STATE    │     Estado persistente   │  ESTADO    │
  └────────────┘                          └────────────┘
```

| Modo | O que faz | Trigger |
|------|-----------|---------|
| **Pre-Meeting Brief** | Gera resumo contextual: arquitetura, decisões recentes, pendências, riscos | Antes de reunião no calendário |
| **Post-Meeting Debrief** | Extrai action items, decisões tomadas, próximos passos | Após reunião |
| **Status Dashboard** | Visão consolidada de todos os engagements ativos | Sob demanda |
| **Context Handoff** | Gera briefing completo para outro CSA assumir | Transferência de conta |

---

## Anatomia de um Context Brief

```markdown
═══════════════════════════════════════════════
📋 CONTEXT BRIEF: Cliente X - Portal Pagamentos
═══════════════════════════════════════════════

🏢 Cliente: Banco X | CSAM: João Silva
📅 Engagement: DevSquad | Sprint 5/8
🎯 Objetivo: Modernizar API de pagamentos (monolito → microserviços)

📐 ARQUITETURA ATUAL
├── AKS cluster (3 node pools, 12 pods)
├── Cosmos DB (autoscale, 5 containers)
├── API Management (external gateway)
└── Service Bus (event-driven async)

📌 ÚLTIMAS DECISÕES (14 dias)
├── ADR-007: Migrar de SQL Server para Cosmos DB ✅
├── ADR-008: Circuit breaker com Polly (em discussão) 🟡
└── PR #34: Novo endpoint /payments/v2 merged ✅

⚠️ PENDÊNCIAS
├── 🔴 Cliente precisa aprovar schema Cosmos DB até sexta
├── 🟡 Pipeline de staging com falha intermitente
└── 🟢 Load test agendado para sprint 6

📊 HEALTH: 🟢 On Track | Velocity: 32pts/sprint | Burn: 78%

💡 TALKING POINTS SUGERIDOS
├── Revisão do schema Cosmos DB (decisão pendente)
├── Status do circuit breaker (ADR-008)
└── Planejamento do load test
═══════════════════════════════════════════════
```

---

## Benefícios

| Benefício | Impacto estimado |
|-----------|------------------|
| **Redução de context switching** | -30% do tempo perdido com "recarregar contexto" |
| **Zero dropped balls** | Action items rastreados automaticamente |
| **Handoff sem fricção** | Outro CSA assume com contexto completo |
| **Preparação instantânea** | Brief gerado em segundos, não em 15min |
| **Decisões informadas** | Histórico de decisões sempre acessível |

---

## Métricas de Sucesso (KPIs)

| KPI | Baseline atual | Meta com agente |
|-----|---------------|-----------------|
| Tempo de preparação pré-reunião | 15-30 min | <2 min |
| Action items esquecidos | ~20% | <5% |
| Tempo de handoff entre CSAs | 1-2 dias | <1 hora |
| Confiança do CSA ao trocar contexto | Baixa | Alta |
| Engagements com estado rastreado | ~30% (manual) | 100% (automático) |

---

## Alinhamento FY26

| Prioridade da Liderança | Como o agente contribui |
|--------------------------|------------------------|
| 🔇 Foco & Redução de Fricção | Elimina overhead de context switching |
| 📊 Customer Impact > Activity | CSA chega preparado, mais tempo para entregar |
| 🎯 HVE + DevSquad | Estado do engagement sempre atualizado |
| 📈 Usage & Lifecycle | Tracking contínuo, não point-in-time |

---

## Fontes de Dados

| Fonte | Dados extraídos |
|-------|-----------------|
| **Calendário (M365)** | Próximas reuniões, participantes, histórico |
| **Email/Teams (M365)** | Comunicações recentes, decisões, updates |
| **GitHub** | PRs, issues, ADRs, commits recentes |
| **Azure DevOps** | Work items, sprint status, burn charts |
| **WorkIQ** | Contexto organizacional, prioridades do CSAM |

---

## Tecnologias e Integrações

- **GitHub Copilot Agent** (motor de execução)
- **WorkIQ/M365 Copilot** (emails, meetings, calendário)
- **GitHub API** (repos, PRs, issues, ADRs)
- **Azure DevOps API** (boards, sprints, work items)
- **Persistent state store** (engagement state em YAML/JSON)

---

## Exemplo de Uso

```
CSA: @context-switch Vou entrar em reunião com Cliente X em 10 min.
     Me dê o contexto.

Agent: 🔄 Carregando contexto do Cliente X...

       [Gera Context Brief completo - ver anatomia acima]

       ⏱️ Tempo: 8 segundos
       📋 Brief salvo em: engagements/clienteX/brief-2026-03-16.md

--- Após a reunião ---

CSA: @context-switch Reunião com Cliente X finalizada. Notes:
     - Aprovaram schema Cosmos DB
     - Circuit breaker: vão com Polly + retry policy
     - Pediram para incluir rate limiting no API Management
     - Próxima reunião: quinta 14h

Agent: ✅ Estado do engagement atualizado:

       📌 Decisões registradas:
       ├── Schema Cosmos DB: APROVADO ✅
       └── Circuit breaker: Polly + retry policy ✅

       📝 Action Items criados:
       ├── [CSA] Implementar rate limiting no APIM (Sprint 6)
       ├── [CSA] ADR-008 finalizado (circuit breaker)
       └── [Cliente] Validar rate limits aceitáveis

       📅 Próxima reunião: Quinta 14h (adicionada ao calendário)
       📊 Health atualizado: 🟢 On Track
```

---

## Próximos Passos

1. Definir formato padrão do engagement state (YAML schema)
2. Integrar com WorkIQ para extração automática de meeting context
3. Pilotar com 2 CSAs que atendem 4+ clientes simultâneos
4. Avaliar integração com Azure DevOps boards

---

*Baseado em dados internos sobre context switching como principal dor de CSAs e padrões de multi-account management.*
