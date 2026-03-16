# 🚀 Engagement Kickstart Agent

> **One-Pager | Agente para CSAs | Prioridade: Wave 2**

---

## Problema do Cliente

CSAs gastam dias configurando manualmente a infraestrutura de delivery para cada novo
engagement: repositórios, ADRs (Architecture Decision Records), pipelines CI/CD, templates
de documentação, branch policies e estruturas de projeto. Esse setup repetitivo consome
tempo que deveria ser usado em entrega técnica. Internamente, a falta de padronização
entre engagements dificulta a reutilização de conhecimento e gera inconsistência na
qualidade das entregas.

---

## Solução

O **Engagement Kickstart Agent** automatiza o scaffolding completo de um engagement técnico.
A partir do tipo de engagement (DevSquad, ADS, Envisioning, Modernization, Migration),
ele gera um repositório pré-configurado com todas as estruturas, templates e ferramentas
necessárias para o CSA começar a entregar valor no dia 1.

---

## Como Funciona

```
┌──────────────┐    ┌───────────────┐    ┌───────────────┐    ┌──────────────┐
│  1. CLASSIFY │───▶│ 2. SCAFFOLD   │───▶│ 3. CONFIGURE  │───▶│ 4. DELIVER   │
│ Tipo do      │    │ Estrutura do  │    │ Pipelines,    │    │ Repo pronto  │
│ Engagement   │    │ Repositório   │    │ Policies      │    │ para uso     │
└──────────────┘    └───────────────┘    └───────────────┘    └──────────────┘
```

| Fase | O que faz | Output |
|------|-----------|--------|
| **1. Classificação** | Identifica tipo: DevSquad, ADS, Envisioning, Migration, Modernization | Perfil de engagement |
| **2. Scaffolding** | Gera estrutura de repo com ADRs, README, CONTRIBUTING, docs/, src/, infra/ | Repositório base |
| **3. Configuração** | Branch policies, CI/CD templates (GitHub Actions/Azure Pipelines), .editorconfig | Automação configurada |
| **4. Entrega** | Repo inicializado, primeiro commit, PR template, issue templates | Pronto para delivery |

---

## Templates por Tipo de Engagement

### DevSquad
```
repo/
├── .github/
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug.md
│   │   ├── feature.md
│   │   └── spike.md
│   └── workflows/
│       ├── ci.yml
│       └── cd.yml
├── docs/
│   ├── adr/
│   │   └── 001-initial-architecture.md
│   ├── specs/
│   │   └── spec-template.md
│   └── runbooks/
├── src/
├── infra/
│   ├── bicep/ ou terraform/
│   └── parameters/
├── tests/
├── README.md
├── CONTRIBUTING.md
├── .editorconfig
└── .copilot/
    └── copilot-instructions.md
```

### ADS (Architecture Design Session)
```
repo/
├── docs/
│   ├── architecture/
│   │   ├── current-state.md
│   │   ├── proposed-architecture.md
│   │   └── diagrams/
│   ├── adr/
│   ├── requirements/
│   └── deliverables/
│       ├── executive-summary.md
│       └── technical-recommendations.md
├── README.md
└── .copilot/
    └── copilot-instructions.md
```

### Migration
```
repo/
├── discovery/
│   ├── inventory.md
│   ├── dependencies.md
│   └── assessment-results/
├── planning/
│   ├── wave-plan.md
│   ├── raci.md
│   └── risk-matrix.md
├── execution/
│   ├── runbooks/
│   └── validation/
├── infra/
│   ├── landing-zone/
│   └── networking/
└── README.md
```

---

## Benefícios

| Benefício | Impacto estimado |
|-----------|------------------|
| **Tempo de setup eliminado** | -2 a 3 dias por engagement |
| **Padronização** | 100% dos repos seguem mesma estrutura |
| **Reutilização de conhecimento** | ADR templates pré-populados com best practices |
| **Onboarding acelerado** | Novo CSA produtivo em horas, não dias |
| **Qualidade consistente** | Pipelines e policies desde o dia 1 |

---

## Métricas de Sucesso (KPIs)

| KPI | Baseline atual | Meta com agente |
|-----|---------------|-----------------|
| Tempo de setup de repo | 2-3 dias | <30 minutos |
| % repos com CI/CD desde o início | ~30% | 100% |
| % engagements com ADRs | ~20% | 100% |
| Consistência entre repos (score) | Variável | >95% |
| Reuso de templates entre engagements | Ad-hoc | Sistemático |

---

## Alinhamento FY26

| Prioridade da Liderança | Como o agente contribui |
|--------------------------|------------------------|
| 🤖 Spec-Driven Engineering | Estrutura de specs pronta desde o dia 1 |
| 🔇 Redução de Fricção | Elimina setup repetitivo, CSA foca em delivery |
| 🎯 HVE + DevSquad | Repo alinhado com best practices de HVE |
| 📊 Customer Impact > Activity | Mais tempo para entregar valor, menos para configurar |

---

## Integrações com Frameworks Internos

| Framework | Como o agente integra |
|-----------|----------------------|
| **Spec-Driven Development (SDD)** | Template de spec incluído (GitHub spec-kit) |
| **HVE-Customer-Facing** | README com narrativa HVE para o cliente |
| **DevSquad Roles & Levels** | RACI template alinhado ao governance DevSquad |
| **CSU Invested Guidance** | Tags de classificação (invested/trial) no README |

---

## Tecnologias e Integrações

- **GitHub Copilot Agent** (motor de execução)
- **GitHub API** (criação de repos, branch policies, templates)
- **Azure DevOps API** (boards, pipelines — quando aplicável)
- **Copilot Workspace** (scaffolding inteligente)
- **Bicep/Terraform templates** (infraestrutura base)

---

## Exemplo de Uso

```
CSA: @engagement-kickstart Novo DevSquad com Cliente Y.
     Workload: modernização de API de pagamentos.
     Stack: .NET 8, AKS, Cosmos DB.
     IaC: Bicep.
     Timeline: 8 sprints.

Agent: 🚀 Criando estrutura de engagement...

       ✅ Repositório criado: clienteY-payments-modernization
       ✅ Estrutura DevSquad gerada (src/, infra/, docs/, tests/)
       ✅ ADR-001: Escolha de AKS como plataforma (template preenchido)
       ✅ Pipeline CI/CD configurado (GitHub Actions + Bicep)
       ✅ Branch policy: require PR review, status checks
       ✅ Spec template (.NET 8 + Cosmos DB patterns)
       ✅ README com contexto do engagement e narrativa HVE
       ✅ CONTRIBUTING.md com guidelines do time
       ✅ .copilot/copilot-instructions.md configurado

       📂 Repo: github.com/org/clienteY-payments-modernization
       📋 Primeiro PR criado: "Initial scaffolding"
       ⏱️ Tempo total: 2 minutos
```

---

## Próximos Passos

1. Definir templates padrão para cada tipo de engagement com input da liderança
2. Integrar com GitHub org do CSU Brasil
3. Testar com 5 novos engagements como piloto
4. Coletar feedback e iterar templates

---

*Baseado em práticas de DevSquad weekly syncs, SDD frameworks, e padrões de repos do CSU Brasil.*
