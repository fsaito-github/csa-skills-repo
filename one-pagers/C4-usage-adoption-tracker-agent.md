# 📈 Usage & Adoption Tracker Agent

> **One-Pager | Agente para Clientes | Prioridade: Wave 2**

---

## Problema do Cliente

Clientes compram licenças Azure e Copilot, mas a adoção real fica abaixo do esperado.
O tracking é manual, inconsistente e reativo — problemas de adoção são descobertos
tarde demais, quando o cliente já questiona o ROI. Internamente, ACR tracking é o
principal KPI pós-migração, mas não existe um dashboard unificado que combine consumo
técnico com métricas de adoção de negócio. CSAs revisam consumo em reuniões pontuais
sem visão contínua do lifecycle.

---

## Solução

O **Usage & Adoption Tracker Agent** monitora continuamente o consumo Azure, adoção de
serviços e utilização de licenças. Identifica recursos idle/subutilizados, detecta
adoption blockers, e gera relatórios executivos de consumption review alinhados ao
ACR (Azure Consumed Revenue) do cliente. Funciona como um "health check contínuo"
de adoção.

---

## Como Funciona

```
┌───────────┐  ┌───────────┐  ┌────────────┐  ┌────────────┐  ┌──────────┐
│ 1.MONITOR │─▶│ 2.ANALYZE │─▶│ 3.IDENTIFY │─▶│ 4.PLAN     │─▶│ 5.REPORT │
│ Consumo   │  │ Tendências│  │ Blockers   │  │ Ações de   │  │ Executive│
│ Contínuo  │  │ & Anomalias│  │ & Gaps     │  │ Adoção     │  │ Review   │
└───────────┘  └───────────┘  └────────────┘  └────────────┘  └──────────┘
```

| Fase | O que faz | Output |
|------|-----------|--------|
| **1. Monitoramento** | Coleta consumo por serviço, subscription, resource group | Dashboard de consumo |
| **2. Análise** | Identifica tendências, anomalias, MoM growth, seasonality | Trend analysis |
| **3. Identificação** | Detecta recursos idle, licenças não utilizadas, adoption gaps | Gap report |
| **4. Planejamento** | Plano de ação para acelerar adoção e resolver blockers | Action plan |
| **5. Relatório** | Consumption Review executivo para CSAM e liderança do cliente | PPTX + Dashboard |

---

## Dimensões de Tracking

### Consumo Azure (ACR)
| Métrica | O que mede | Alerta |
|---------|------------|--------|
| ACR MoM Growth | Crescimento mensal do consumo | < 0% = 🔴 declining |
| ACR vs Commit | Consumo vs compromisso contratual | < 80% = 🟡 underconsuming |
| Top 10 Services | Serviços com maior consumo | Mudanças bruscas = ⚠️ |
| New Services | Novos serviços adotados no mês | 0 novos = 🟡 stagnation |

### Utilização de Recursos
| Métrica | O que mede | Alerta |
|---------|------------|--------|
| VM Utilization | CPU/Memory médio das VMs | < 15% = idle |
| AKS Node Utilization | Pods vs capacity | < 30% = oversized |
| Storage Growth | Crescimento de storage | > 20% MoM sem justificativa |
| Database Utilization | DTU/vCore utilization | < 20% = oversized |

### Adoção de Serviços Modernos
| Métrica | O que mede | Alerta |
|---------|------------|--------|
| PaaS vs IaaS ratio | Modernização do estate | < 30% PaaS = opportunity |
| Copilot Usage | Licenças ativas vs compradas | < 50% = adoption gap |
| AI Services | Uso de Azure OpenAI, AI Foundry | 0 = AI opportunity |
| DevOps/GitHub | CI/CD adoption, Copilot dev | Baixo = HVE opportunity |

---

## Adoption Blockers Comuns no Brasil 🇧🇷

| Blocker | Sinal detectado | Ação recomendada |
|---------|-----------------|------------------|
| **Falta de conhecimento** | Serviço comprado mas não usado | Workshop/enablement |
| **Complexidade de setup** | Muitos recursos provisionados, poucos configurados | Engagement de setup assistido |
| **Resistência cultural** | Licenças Copilot não ativadas | Change management program |
| **Compliance concerns** | Dados não movidos para cloud | LGPD workshop + data classification |
| **Budget ownership** | Consumo concentrado em 1 subscription | FinOps governance (tags, budgets) |
| **Skill gap** | Workloads em VMs quando PaaS seria melhor | Modernization assessment |

---

## Benefícios

| Benefício | Impacto estimado |
|-----------|------------------|
| **Visibilidade contínua** | De reviews pontuais para tracking sempre-on |
| **Detecção precoce** | Problemas de adoção detectados em semanas, não meses |
| **ACR acceleration** | +10-20% ACR com ações de adoção direcionadas |
| **Executive communication** | Relatório pronto para CSAM e liderança |
| **Lifecycle management** | Tracking desde deploy até steady-state |

---

## Métricas de Sucesso (KPIs)

| KPI | Baseline atual | Meta com agente |
|-----|---------------|-----------------|
| Frequência de consumption reviews | Trimestral | Mensal (automático) |
| % recursos idle detectados | Revisão manual | 100% detectados |
| Tempo para detectar adoption issue | 2-3 meses | <2 semanas |
| ACR growth vs target | Variável | On-target ou acima |
| Churn de serviços | Não rastreado | <5% |

---

## Alinhamento FY26

| Prioridade da Liderança | Como o agente contribui |
|--------------------------|------------------------|
| 📈 Usage, Adoption & Lifecycle | Core da proposta — tracking contínuo |
| 📊 Customer Impact > Activity | Ações baseadas em dados, não intuição |
| 🎯 HVE + DevSquad | Mede impacto real de entregas no consumo |
| 🔇 Redução de Fricção | Automation substitui reviews manuais |

---

## Template de Consumption Review

```markdown
═══════════════════════════════════════════════
📊 AZURE CONSUMPTION REVIEW - Cliente X
📅 Período: Fevereiro 2026
═══════════════════════════════════════════════

💰 ACR SUMMARY
├── ACR atual: R$ 1.2M/mês
├── ACR target (commit): R$ 1.5M/mês
├── Coverage: 80% (🟡 abaixo do target)
├── MoM Growth: +5.2% (🟢 positivo)
└── YoY Growth: +23% (🟢 saudável)

📊 TOP SERVICES
├── 1. Virtual Machines: R$ 420K (35%) ↑ 2%
├── 2. AKS: R$ 180K (15%) ↑ 12%
├── 3. SQL Managed Instance: R$ 156K (13%) → 0%
├── 4. Storage: R$ 132K (11%) ↑ 8%
└── 5. Cosmos DB: R$ 96K (8%) ↑ 15%

🔴 CONCERNS
├── 47 VMs com utilização < 15% (saving R$ 89K)
├── Copilot: 200 licenças compradas, 43 ativas (21.5%)
├── AI Services: nenhum uso detectado
└── 3 subscriptions com < R$ 1K consumo (abandonadas?)

🟢 WINS
├── AKS adoption growing (+12% MoM)
├── Cosmos DB adoption healthy (+15% MoM)
└── Novo workload de analytics em Fabric

📋 RECOMMENDED ACTIONS
├── [P1] Right-size 47 VMs idle → saving R$ 89K/mês
├── [P1] Copilot activation campaign (target: 80%)
├── [P2] AI Readiness Assessment (0 AI services)
├── [P2] Review 3 subscriptions abandonadas
└── [P3] Modernization assessment para VMs → AKS
═══════════════════════════════════════════════
```

---

## Tecnologias e Integrações

- **GitHub Copilot Agent** (orquestração e análise)
- **Azure Cost Management API** (consumo e tendências)
- **Azure Resource Graph** (inventário e utilization)
- **Azure Monitor** (métricas de performance)
- **M365 Admin Center** (licenças Copilot)
- **Power BI** (dashboards visuais)
- **Markdown + PPTX** (relatórios)

---

## Exemplo de Uso

```
CSA: @usage-tracker Gerar consumption review mensal para Cliente X.
     Foco: ACR alignment e Copilot adoption.

Agent: 📈 Gerando Consumption Review...

       [Gera template completo - ver acima]

       ⚠️ ALERTAS PRIORITÁRIOS:
       ├── 🔴 Copilot adoption: 21.5% (target: 80%)
       │   → Sugestão: Workshop + champions program
       ├── 🟡 ACR coverage: 80% (gap de R$ 300K)
       │   → Sugestão: Acelerar workload de analytics
       └── 🟡 AI opportunity: zero AI services
           → Sugestão: AI Readiness Assessment

       📊 Report: consumption-review-clienteX-fev2026.pptx
       📧 Email summary: pronto para enviar ao CSAM
```

---

## Próximos Passos

1. Definir métricas padrão com alinhamento CSAM
2. Integrar com Azure Cost Management API
3. Criar dashboard Power BI template
4. Pilotar com 3 top accounts

---

*Baseado em ACR tracking practices, consumption review patterns, e Copilot adoption data do CSU Brasil.*
