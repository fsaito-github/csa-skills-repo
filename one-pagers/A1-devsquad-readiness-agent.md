# 📋 DevSquad Readiness Agent

> **One-Pager | Agente para CSAs | Prioridade: Wave 1**

---

## Problema do Cliente

Engagements de DevSquad frequentemente iniciam sem que o cliente esteja verdadeiramente pronto.
CSAs são forçados a começar entregas sem subscriptions de dev, sem engenheiros nomeados,
sem escopo definido e sem metas de sprint. Isso gera retrabalho, escopo instável e
frustração de ambos os lados. Internamente, retros do DevSquad mostram que **"não podemos
pular o triage"** e **"as pessoas ouvem DevSquad e acham que estamos prontos para começar"**
são os problemas mais recorrentes.

---

## Solução

O **DevSquad Readiness Agent** é um agente de IA que automatiza a avaliação de prontidão
de um engagement DevSquad antes do início da entrega. Ele valida checklists obrigatórios,
gera documentação de escopo estruturada e produz um score de readiness (Go / Refine / No-Go)
com recomendações acionáveis.

---

## Como Funciona

```
┌─────────────┐    ┌──────────────┐    ┌───────────────┐    ┌──────────────┐
│  1. INPUT   │───▶│  2. VALIDATE │───▶│  3. GENERATE  │───▶│  4. OUTPUT   │
│ Informações │    │  Checklist   │    │  Scope Doc    │    │  Readiness   │
│ do engage   │    │  de Readiness│    │  + RACI       │    │  Report      │
└─────────────┘    └──────────────┘    └───────────────┘    └──────────────┘
```

| Fase | O que faz | Fonte de dados |
|------|-----------|----------------|
| **1. Coleta** | Recebe informações do engagement (cliente, workload, objetivo, timeline) | Input do CSA |
| **2. Validação** | Verifica 4 pilares: Customer Readiness, Environment, Delivery Framing, HVE Bar | Checklist interno |
| **3. Geração** | Produz Scope Document, RACI matrix, sprint themes, e out-of-scope explícito | Templates padronizados |
| **4. Scoring** | Calcula readiness score e emite recomendação Go / Refine / No-Go | Regras de negócio |

---

## Checklist de Readiness Validado

### Customer Readiness
- [ ] Engenheiros nomeados (mínimo 1-2) com dedicação acordada
- [ ] Buy-in da liderança de engenharia do cliente
- [ ] Compromisso com rituais Agile (sprint reviews, retros, grooming)
- [ ] Cliente entende que DevSquad = code-with, não code-for

### Environment
- [ ] Subscription Azure não-produtiva disponível
- [ ] Repositório criado e acessível ao time
- [ ] Ownership de CI/CD definido
- [ ] Acesso a ambientes de dev/staging configurado

### Delivery Framing
- [ ] ADS (Architecture Design Session) concluída
- [ ] Projeto/workload único identificado (1 repo, 1 jornada, 1 objetivo)
- [ ] Sprint theme definido
- [ ] "Out of scope" documentado explicitamente

### HVE Bar
- [ ] GitHub Copilot habilitado (trial ou investido)
- [ ] Métricas baseline definidas (velocity, PR cycle time)
- [ ] Cliente aberto a workflows com AI/agents

---

## Benefícios

| Benefício | Impacto estimado |
|-----------|------------------|
| **Eliminação de engagements "raw"** | -80% de engagements que iniciam sem readiness |
| **Redução de scope creep** | -60% de mudanças de escopo mid-sprint |
| **Aceleração do kickoff** | -3 a 5 dias no tempo de setup |
| **Padronização** | 100% dos DevSquads com scope doc estruturado |
| **Visibilidade para liderança** | Score objetivo para decisão Go/No-Go |

---

## Métricas de Sucesso (KPIs)

| KPI | Baseline atual | Meta com agente |
|-----|---------------|-----------------|
| % engagements que iniciam "ready" | ~40% | >90% |
| Tempo médio de kickoff | 2-3 semanas | <1 semana |
| Scope changes por sprint | 3-5 | <1 |
| Satisfação CSA com readiness | NPS ~30 | NPS >70 |
| Engagements cancelados por falta de readiness | ~15% | <5% |

---

## Alinhamento FY26

| Prioridade da Liderança | Como o agente contribui |
|--------------------------|------------------------|
| 🎯 HVE + DevSquad disciplinado | Gate obrigatório de readiness antes do início |
| 🤖 Spec-Driven Engineering | Scope doc gerado como spec do engagement |
| 📊 Customer Impact > Activity | Foco em engagements prontos = maior entrega de valor |
| 🔇 Redução de Fricção | CSA não precisa fazer triage manual repetitivo |

---

## Anti-patterns que o Agente Previne

| Anti-pattern | Sinal detectado | Ação do agente |
|-------------|-----------------|----------------|
| DevSquad vendido sem escopo | Nenhum workload/repo específico | 🔴 No-Go + recomendação de ADS |
| Cliente não engajado | Sem engenheiros nomeados | 🟡 Refine + template de comunicação |
| Scope muito amplo | "Modernizar tudo" como objetivo | 🟡 Refine + sugestão de foco |
| HVE ausente | Sem Copilot, sem métricas baseline | 🟡 Refine + plano de enablement |

---

## Tecnologias e Integrações

- **GitHub Copilot Agent** (motor de execução)
- **Templates YAML/Markdown** (scope doc, RACI, checklist)
- **WorkIQ/M365** (contexto do engagement, emails, meetings)
- **Azure DevOps** (criação de boards, sprints)

---

## Exemplo de Uso

```
CSA: @devsquad-readiness Preciso avaliar readiness do DevSquad para
     modernização do portal de pagamentos do Cliente X.

Agent: 📋 Iniciando avaliação de readiness...

       CUSTOMER READINESS: 🟡 Parcial
       ✅ Liderança com buy-in
       ❌ Engenheiros não nomeados
       ❌ Sem compromisso com rituais Agile

       ENVIRONMENT: 🔴 Não pronto
       ❌ Subscription não-prod não disponível
       ❌ Repositório não criado

       DELIVERY FRAMING: 🟡 Parcial
       ✅ ADS concluída
       ✅ Workload identificado (portal pagamentos)
       ❌ Out-of-scope não documentado

       HVE BAR: 🟢 Pronto
       ✅ GitHub Copilot Enterprise habilitado
       ✅ Métricas baseline do time disponíveis

       ═══════════════════════════════════
       SCORE: 🟡 REFINE (58/100)
       Recomendação: Resolver 4 gaps antes de iniciar.
       Tempo estimado para readiness: 5-7 dias úteis.

       📄 Scope Document gerado → scope-doc-clienteX.md
       📊 RACI Matrix gerada → raci-clienteX.md
       📧 Email template para cliente → email-readiness.md
```

---

## Próximos Passos

1. Validar checklist com liderança DevSquad
2. Implementar como Copilot Agent no repositório csa-skills-repo
3. Testar com 3 engagements reais como piloto
4. Iterar com feedback dos CSAs

---

*Baseado em dados reais de retros DevSquad, HVE Squad syncs, e padrões observados no CSU Brasil.*
