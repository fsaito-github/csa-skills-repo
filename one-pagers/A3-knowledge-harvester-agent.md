# 🌾 Knowledge Harvester Agent

> **One-Pager | Agente para CSAs | Prioridade: Wave 3**

---

## Problema do Cliente

O conhecimento gerado em engagements fica preso com indivíduos. CSAs resolvem os mesmos
problemas repetidamente porque learnings, decisões arquiteturais e padrões validados não
são compartilhados de forma estruturada. Nas retros do DevSquad, **"falta de compartilhamento"
foi o item mais votado**. O conhecimento hoje flui informalmente via Teams e emails —
funciona para quem está presente, mas é invisível para quem entra depois.

---

## Solução

O **Knowledge Harvester Agent** extrai automaticamente decisões, padrões e lessons learned
de engagements finalizados e os transforma em artefatos reutilizáveis: case studies,
architecture patterns, reusable templates e ADRs. Publica no repositório compartilhado
da equipe para que qualquer CSA possa buscar e reutilizar.

---

## Como Funciona

```
┌──────────────┐    ┌───────────────┐    ┌───────────────┐    ┌──────────────┐
│  1. EXTRACT  │───▶│  2. CLASSIFY  │───▶│  3. FORMAT    │───▶│  4. PUBLISH  │
│ Decisões e   │    │ Categoriza    │    │ Gera artifact │    │ Publica no   │
│ Learnings    │    │ por domínio   │    │ reutilizável  │    │ repo shared  │
└──────────────┘    └───────────────┘    └───────────────┘    └──────────────┘
```

| Fase | O que faz | Fonte de dados |
|------|-----------|----------------|
| **1. Extração** | Analisa ADRs, PRs, issues, meeting notes do engagement | GitHub, Azure DevOps, WorkIQ |
| **2. Classificação** | Categoriza: Architecture Pattern, Migration Playbook, FinOps Insight, Security Pattern | Taxonomia padronizada |
| **3. Formatação** | Gera artifact estruturado (case study, template, pattern card) | Templates padronizados |
| **4. Publicação** | Publica no repo compartilhado com tags, busca e índice | GitHub repo compartilhado |

---

## Tipos de Artefatos Gerados

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| **Case Study** | Resumo do engagement: problema, solução, resultados, learnings | "Modernização API Pagamentos - AKS + Cosmos DB" |
| **Architecture Pattern** | Padrão arquitetural validado e documentado com diagrama | "Event-Driven com Service Bus + Functions" |
| **Migration Playbook** | Playbook de migração com steps, riscos e mitigações | "VMware → AVS: Lições de Bradesco" |
| **ADR Reutilizável** | Decision record que pode ser adaptado para outros engagements | "ADR: Por que AKS sobre App Service para APIs" |
| **FinOps Insight** | Achado de otimização de custo replicável | "Cosmos DB: Autoscale vs Provisioned em cargas variáveis" |
| **Checklist Operacional** | Checklist validado em campo para operações | "Pre-Go-Live Checklist para AKS em produção" |

---

## Benefícios

| Benefício | Impacto estimado |
|-----------|------------------|
| **Eliminação de retrabalho** | -40% de tempo resolvendo problemas já resolvidos |
| **Onboarding acelerado** | Novos CSAs encontram padrões validados em minutos |
| **Qualidade crescente** | Base de conhecimento cresce com cada engagement |
| **Visibilidade** | Liderança visualiza o que o time aprende e produz |
| **Cultura de sharing** | Sharing automático, não dependente de boa vontade |

---

## Métricas de Sucesso (KPIs)

| KPI | Baseline atual | Meta com agente |
|-----|---------------|-----------------|
| Artifacts compartilhados/mês | ~2 (ad-hoc) | >10 (automatizado) |
| % engagements com learnings documentados | ~15% | >80% |
| Tempo para encontrar pattern existente | Horas (perguntar no Teams) | Segundos (busca no repo) |
| Reuso de patterns em novos engagements | Raro | >50% |
| Contribuição ao repo compartilhado por CSA | Desigual | Uniforme |

---

## Alinhamento FY26

| Prioridade da Liderança | Como o agente contribui |
|--------------------------|------------------------|
| 📊 Customer Impact > Activity | Transforma experiência em asset reutilizável |
| 🔇 Redução de Fricção | CSA não precisa "caçar" conhecimento no Teams |
| 🎯 HVE + DevSquad | Cada DevSquad alimenta a base de conhecimento |
| 📈 Usage & Adoption | Padrões validados aceleram adoption em clientes |

---

## Estrutura do Repositório Compartilhado

```
csu-knowledge-base/
├── patterns/
│   ├── architecture/
│   │   ├── event-driven-servicebus-functions.md
│   │   └── aks-cosmos-api-pattern.md
│   ├── migration/
│   │   ├── vmware-to-avs-playbook.md
│   │   └── aws-ec2-to-azure-vm.md
│   └── finops/
│       ├── cosmosdb-autoscale-insight.md
│       └── aks-nodepool-optimization.md
├── case-studies/
│   ├── cliente-x-payments-modernization.md
│   └── cliente-y-data-platform.md
├── checklists/
│   ├── aks-production-readiness.md
│   └── landing-zone-validation.md
├── adrs/
│   ├── aks-vs-appservice.md
│   └── bicep-vs-terraform.md
└── INDEX.md (índice searchable)
```

---

## Tecnologias e Integrações

- **GitHub Copilot Agent** (extração e formatação)
- **GitHub API** (leitura de repos de engagements, criação de PRs)
- **WorkIQ/M365** (context de meetings, emails, decisões)
- **Markdown + YAML frontmatter** (metadata para busca)
- **GitHub Search** (busca full-text no repo compartilhado)

---

## Exemplo de Uso

```
CSA: @knowledge-harvester Extraia learnings do engagement
     repo: org/clienteX-payments-modernization
     Engagement concluído em 8 sprints.

Agent: 🌾 Analisando engagement...

       Fontes analisadas:
       ├── 12 ADRs
       ├── 47 PRs merged
       ├── 8 sprint retros
       └── 23 issues resolvidas

       Artefatos gerados:
       ✅ Case Study: "Modernização Portal Pagamentos - AKS + Cosmos DB"
          → Problema, solução, resultados, métricas
       ✅ Architecture Pattern: "API Gateway → AKS → Cosmos DB"
          → Diagrama, trade-offs, quando usar
       ✅ ADR Reutilizável: "Cosmos DB Autoscale vs Provisioned"
          → Contexto, decisão, consequências
       ✅ Checklist: "AKS Production Readiness (validado em campo)"
          → 23 items verificados neste engagement
       ✅ FinOps Insight: "Cosmos DB RU optimization: -35% custo"
          → Técnica aplicada, resultado medido

       📂 PR criado: csu-knowledge-base#42
       🏷️ Tags: aks, cosmos-db, payments, modernization, finops
```

---

## Próximos Passos

1. Definir taxonomia padrão com o time (categories + tags)
2. Criar repositório compartilhado `csu-knowledge-base`
3. Pilotar com 3 engagements recém-finalizados
4. Integrar com DevSquad weekly sync para review de artifacts

---

*Baseado em retros DevSquad (sharing como top issue), CSA Community Calls, e padrões observados no CSU Brasil.*
