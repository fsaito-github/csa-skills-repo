# 🧠 AI Readiness Assessment Agent

> **One-Pager | Agente para Clientes | Prioridade: Wave 1**

---

## Problema do Cliente

Clientes querem adotar AI mas não sabem por onde começar. As conversas variam de
"queremos um chatbot" a "precisamos de uma estratégia de AI para a empresa toda".
Internamente, conversas de AI acontecem em paralelo com trilhas de reliability e
modernização, mas não existe um assessment estruturado padronizado. CSAs precisam
criar avaliações ad-hoc para cada cliente, e a confusão entre Azure OpenAI, AI Foundry,
Copilot Studio e modelos open-source dificulta o posicionamento correto.

---

## Solução

O **AI Readiness Assessment Agent** executa uma avaliação estruturada de maturidade AI
em 6 dimensões: Strategy, Data, Technology, People, Governance e Use Cases. Posiciona
o cliente em um maturity model (Exploring → Experimenting → Scaling → Transforming),
identifica quick wins e gera um roadmap de adoção AI com recomendações de tecnologia
Microsoft mapeadas.

---

## Como Funciona

```
┌───────────┐  ┌───────────┐  ┌────────────┐  ┌────────────┐  ┌──────────┐
│ 1.ASSESS  │─▶│ 2.SCORE   │─▶│ 3.MAP TECH │─▶│ 4.ROADMAP  │─▶│ 5.REPORT │
│ 6 Dimensõe│  │ Maturity  │  │ AI Foundry │  │ Quick Wins │  │ Executive│
│ s de AI   │  │ Model     │  │ vs OpenAI  │  │ + Horizon  │  │ + CxO    │
└───────────┘  └───────────┘  └────────────┘  └────────────┘  └──────────┘
```

| Fase | O que faz | Output |
|------|-----------|--------|
| **1. Assessment** | Questionnaire guiado nas 6 dimensões de AI readiness | Score por dimensão |
| **2. Maturity Score** | Posiciona cliente no maturity model (4 níveis) | Maturity card |
| **3. Technology Mapping** | Mapeia necessidades para stack Microsoft AI | Decision tree aplicado |
| **4. Roadmap** | Quick wins (30 dias), Horizon 1 (90 dias), Horizon 2 (6 meses) | Roadmap visual |
| **5. Report** | Relatório executivo com business case e ROI estimado | PPTX + Markdown |

---

## 6 Dimensões de AI Readiness

### 1. Strategy & Vision 🎯
| Critério | Exploring | Experimenting | Scaling | Transforming |
|----------|-----------|---------------|---------|--------------|
| AI Vision | Sem visão formal | Iniciativas isoladas | Estratégia documentada | AI-first culture |
| Executive Sponsor | Ausente | IT-led | C-level sponsor | Board-level governance |
| Budget | Sem budget dedicado | Experimental | Programa anual | % da receita |
| Success Metrics | Não definidos | Técnicos (accuracy) | Business KPIs | Revenue impact |

### 2. Data Foundation 📊
| Critério | Exploring | Experimenting | Scaling | Transforming |
|----------|-----------|---------------|---------|--------------|
| Data Quality | Silos, inconsistente | Cleaning ad-hoc | Data quality pipeline | Automated governance |
| Data Platform | On-prem legacy | Cloud partial | Lakehouse/Fabric | Real-time + AI-ready |
| Data Governance | Inexistente | Básica | LGPD compliant | Automated + audited |
| Data Literacy | Baixa | Pockets of expertise | Training programs | Data-driven culture |

### 3. Technology & Infrastructure 🔧
| Critério | Exploring | Experimenting | Scaling | Transforming |
|----------|-----------|---------------|---------|--------------|
| Cloud Maturity | Beginning | Migrating | Cloud-native | Multi-cloud + edge |
| AI Platform | Nenhuma | Azure OpenAI trial | AI Foundry | Enterprise AI ops |
| MLOps | Ausente | Notebooks manuais | CI/CD para modelos | Full MLOps pipeline |
| Security | Básica | Network isolation | Private endpoints | Zero-trust AI |

### 4. People & Skills 👥
| Critério | Exploring | Experimenting | Scaling | Transforming |
|----------|-----------|---------------|---------|--------------|
| AI Skills | Curiosidade | 1-2 champions | AI team dedicado | AI CoE |
| Training | Self-service | Workshops | Programa estruturado | Continuous learning |
| Change Mgmt | Ausente | Comunicação básica | Adoption program | Culture transformation |

### 5. Governance & Ethics 📜
| Critério | Exploring | Experimenting | Scaling | Transforming |
|----------|-----------|---------------|---------|--------------|
| AI Policy | Inexistente | Draft | Publicada | Audited + enforced |
| Responsible AI | Awareness | Guidelines | Implementation | Automated checks |
| LGPD/Privacy | Compliance básica | DPO nomeado | Privacy by design | Automated compliance |
| Risk Mgmt | Informal | Assessment manual | Framework formal | Continuous monitoring |

### 6. Use Cases & Value 💡
| Critério | Exploring | Experimenting | Scaling | Transforming |
|----------|-----------|---------------|---------|--------------|
| # Use Cases | 0 | 1-3 POCs | 5-10 em produção | >20, AI-native products |
| Business Impact | Desconhecido | Pilot results | Measured ROI | Revenue generation |
| Innovation | Reativo | Experimental | Systematic | AI-first design |

---

## Microsoft AI Decision Tree (Simplificado)

```
                    ┌─── Precisa customizar modelo? ───┐
                    │                                   │
                  NÃO                                 SIM
                    │                                   │
            ┌───────┴───────┐                   ┌───────┴───────┐
            │ Copilot SaaS  │                   │ Dados próprios?│
            │ M365/Security │                   │               │
            │ /Sales/Service│                 SIM              NÃO
            └───────────────┘                   │               │
                                        ┌───────┴──────┐  ┌────┴────┐
                                        │ AI Foundry   │  │ Azure   │
                                        │ + RAG/Fine   │  │ OpenAI  │
                                        │ tuning       │  │ API     │
                                        └──────────────┘  └─────────┘
                                                │
                                        ┌───────┴──────┐
                                        │ Agentes?     │
                                      SIM              NÃO
                                        │               │
                                ┌───────┴──────┐  ┌────┴────────┐
                                │ AI Foundry   │  │ AI Foundry  │
                                │ Agent Service│  │ Promptflow  │
                                │ + MCP        │  │ + Eval      │
                                └──────────────┘  └─────────────┘
```

---

## Benefícios

| Benefício | Impacto estimado |
|-----------|------------------|
| **Clareza para o cliente** | De "não sei por onde começar" para roadmap estruturado |
| **Posicionamento correto** | Tecnologia certa para cada cenário |
| **Time-to-first-pilot** | De meses para semanas |
| **Budget justification** | Business case com ROI estimado |
| **Competitive positioning** | Azure AI vs AWS/GCP com argumentos técnicos |

---

## Métricas de Sucesso (KPIs)

| KPI | Baseline atual | Meta com agente |
|-----|---------------|-----------------|
| Assessments de AI/quarter | 1-2 por CSA | 5-8 por CSA |
| % clientes com pilot AI em 90 dias | ~20% | >60% |
| Clareza de roadmap (cliente NPS) | Variável | >80 |
| ACR gerado por pilots de AI | Variável | +15% ACR |
| % clientes usando AI Foundry | ~10% | >40% |

---

## Alinhamento FY26

| Prioridade da Liderança | Como o agente contribui |
|--------------------------|------------------------|
| 🤖 AI & Agents (spec-driven) | Assessment → Spec → Pilot → Scale |
| 📊 Customer Impact > Activity | De "workshop genérico" para roadmap acionável |
| 📈 Usage & Adoption | AI adoption = mais workloads = mais ACR |
| 🎯 HVE | AI Readiness como gate para DevSquad de AI |

---

## Quick Wins por Maturity Level

| Nível | Quick Win (30 dias) | Tecnologia |
|-------|--------------------:|------------|
| **Exploring** | Deploy M365 Copilot + medir produtividade | M365 Copilot |
| **Experimenting** | POC de RAG com dados do cliente | AI Foundry + Search |
| **Scaling** | Agent de atendimento com knowledge base | Copilot Studio + AI Foundry |
| **Transforming** | Multi-agent workflow para core business | AI Foundry Agent Service |

---

## Tecnologias e Integrações

- **GitHub Copilot Agent** (orquestração do assessment)
- **Azure AI Foundry** (platform reference)
- **Azure OpenAI Service** (modelo reference)
- **Copilot Studio** (low-code agents)
- **Microsoft Purview** (AI governance)
- **CAF AI Strategy** (framework reference)
- **Markdown + PPTX** (relatórios)

---

## Exemplo de Uso

```
CSA: @ai-readiness Executar AI Readiness Assessment para Empresa Z.
     Setor: Financeiro (seguros)
     Cloud maturity: Azure, 2 anos, ~300 VMs, AKS, SQL MI
     AI atual: POC de chatbot com Azure OpenAI (não em produção)
     Objetivo: "Automatizar análise de sinistros"

Agent: 🧠 Iniciando AI Readiness Assessment...

       DIMENSÃO 1 - STRATEGY: 🟡 Experimenting (45/100)
       ├── ✅ Caso de uso identificado (sinistros)
       ├── ❌ Sem sponsor C-level dedicado
       └── ❌ Sem métricas de sucesso definidas

       DIMENSÃO 2 - DATA: 🟡 Experimenting (50/100)
       ├── ✅ SQL MI com dados históricos de sinistros
       ├── ❌ Dados não catalogados (sem Purview)
       └── ❌ Sem pipeline de data quality

       DIMENSÃO 3 - TECHNOLOGY: 🟡 Experimenting (55/100)
       ├── ✅ Azure OpenAI habilitado
       ├── ✅ AKS disponível para hosting
       └── ❌ Sem AI Foundry configurado

       DIMENSÃO 4 - PEOPLE: 🔴 Exploring (30/100)
       ├── ❌ Sem time dedicado a AI
       ├── ❌ Sem programa de treinamento
       └── 🟡 1 champion técnico identificado

       DIMENSÃO 5 - GOVERNANCE: 🔴 Exploring (25/100)
       ├── ❌ Sem política de AI
       ├── ❌ Sem framework de Responsible AI
       └── 🟡 LGPD compliance básica

       DIMENSÃO 6 - USE CASES: 🟡 Experimenting (40/100)
       ├── ✅ 1 POC (chatbot sinistros)
       ├── ❌ Sem métricas de business impact
       └── ❌ Sem pipeline de produção

       ═══════════════════════════════════
       🧠 MATURITY SCORE: EXPERIMENTING (41/100)

       🚀 QUICK WINS (30 dias):
       ├── Deploy M365 Copilot para equipe de sinistros
       ├── Configurar AI Foundry com RAG sobre dados de sinistros
       └── Definir 3 KPIs de sucesso com sponsor

       📋 ROADMAP:
       ├── Horizon 1 (90 dias): POC → Pilot com 100 sinistros
       ├── Horizon 2 (6 meses): Produção + 2 novos use cases
       └── Horizon 3 (12 meses): AI CoE + multi-agent workflows

       📑 Report: ai-readiness-empresaZ-2026-03.pptx
```

---

## Próximos Passos

1. Validar questionnaire com CSAs que fazem AI workshops
2. Alinhar decision tree com AI Foundry GA features
3. Pilotar com 2 clientes (1 financial, 1 retail)
4. Criar versão "self-service" para clientes executarem sozinhos

---

*Baseado em CAF AI Strategy, AI Decision Tree Microsoft, e padrões de conversas AI com clientes do CSU Brasil.*
