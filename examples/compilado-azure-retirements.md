# Compilado: Azure Service Retirements
### Guia de Referência para CSAs — Atualizado em Março 2026

> **Fontes:** Microsoft Learn (público), Azure Updates, Azure Advisor, dados internos Microsoft (WorkIQ)

---

## 📋 Resumo Executivo

Este documento consolida as informações sobre retirements de serviços Azure organizadas por:
1. **Retirements já ocorridos** (ação urgente se ainda não migrou)
2. **Retirements em 2025** (deadlines próximos)
3. **Retirements em 2026** (planejamento necessário agora)
4. **Retirements em 2027+** (radar)
5. **Informações internas** (comunicações específicas do time CSA Brasil)
6. **Ferramentas de monitoramento**
7. **Ações recomendadas para o CSA**

---

## 🔴 1. Retirements Já Ocorridos (Ação Urgente)

Serviços já retirados — se algum cliente ainda usa, migração é **imediata**.

| Serviço | Data de Retirement | Migração |
|---------|-------------------|----------|
| **Classic VMs (ASM)** | 31 Ago 2024 | → Azure Resource Manager (ARM) |
| **Classic Cloud Services** | 31 Ago 2024 | → Cloud Services (extended support) ou App Service |
| **ASE v1 / v2** (App Service Environment) | 31 Ago 2024 | → App Service Environment v3 |
| **Azure Batch Cloud Service Configuration** | 2024 | → VM Configuration pools |
| **Microsoft Genomics** | 6 Jan 2025 | Descontinuado |
| **Visual Studio App Center** | 31 Mar 2025 | → GitHub Actions, App Center alternatives |

---

## 🟠 2. Retirements em 2025 (Deadlines Próximos)

| Serviço | Data | Migração Recomendada | Impacto |
|---------|------|---------------------|---------|
| **SAP HANA Large Instances (HLIs)** | 30 Jun 2025 | → Azure VMs para SAP | Alto (clientes SAP) |
| **Azure Database for MariaDB** | 19 Set 2025 | → Azure Database for MySQL Flexible Server | Alto |
| **Azure Basic Load Balancer** | 30 Set 2025 | → Standard Load Balancer | **Crítico** — afeta AKS, VMs, public IPs |
| **Azure HPC Cache** | 30 Set 2025 | → Azure Managed Lustre | Médio |
| **Azure Remote Rendering** | 30 Set 2025 | Descontinuado | Baixo |
| **Azure Service Map** | 30 Set 2025 | → Azure Monitor VM Insights | Médio |
| **Azure SQL Edge** | 30 Set 2025 | → SQL Server on edge / IoT | Médio |
| **Azure Unmanaged Disks** | 30 Set 2025 | → Managed Disks | **Crítico** |
| **Azure vFXT** | 30 Set 2025 | → Azure Managed Lustre / HPC | Baixo |

### ⚠️ End of Support — Out 2025
| Produto | Data | Impacto |
|---------|------|---------|
| **Windows 10** (todas edições) | 14 Out 2025 | **Massivo** — VMs, VDI, desktops |
| **Windows 11** (algumas versões) | 14 Out 2025 | Alto |
| **Office 2016 e 2019** | 14 Out 2025 | Alto |
| **Exchange Server 2016 & 2019** | 14 Out 2025 | Alto |
| **Skype for Business 2015 & 2019** | 14 Out 2025 | Alto |

---

## 🟡 3. Retirements em 2026 (Planejamento Necessário)

### Q1–Q2 2026

| Serviço | Data | Migração | Notas |
|---------|------|----------|-------|
| **Application Gateway v1** | **28 Abr 2026** | → Application Gateway v2 | Após essa data, v1 pode ser deletado sem aviso |
| **Databricks Standard Tier** | **1 Out 2026** (sem criação a partir de 1 Abr 2026) | → Databricks Premium Tier | Upgrade automático para quem não migrar |
| **AVS nodes AV36P / AV52** (último dia RI 3 anos) | **31 Mar 2026** | → AV64 / AV48 | Retirement final em Mar 2029 |
| **Azure Functions** (runtime legado, proxies) | 2026 | → Runtime v4+ | Versões antigas perdem suporte |
| **TLS 1.0/1.1** | Phaseout contínuo | → TLS 1.2+ | Múltiplos serviços afetados |

### Q3–Q4 2026

| Serviço | Data | Migração | Notas |
|---------|------|----------|-------|
| **VPN Gateway (non-AZ SKUs)** | **16 Set 2026** | → AZ-enabled SKUs | Migração automática pela MS |
| **HDInsight** (SKUs/versões legadas) | Q3 2026 | → HDInsight on AKS / Fabric | Verificar cluster por cluster |
| **Azure Machine Learning** (capabilities legadas) | 2026 | → ML v2 SDK/CLI | Capacidades específicas |
| **Synapse Analytics** (interfaces legadas) | 2026 | → Microsoft Fabric | Transição gradual |
| **AKS** (versões antigas) | Contínuo | → Versões suportadas | Ubuntu 18.04 → 22.04 |
| **Logic Apps** (conectores legados) | 2026 | → Conectores atualizados | Verificar workflows |
| **Azure Maps** (API versions antigas) | 2026 | → API versions atuais | Breaking changes possíveis |
| **Application Insights** (Java SDKs legados) | 2026 | → SDKs atualizados | Verificar instrumentação |
| **Default outbound VM access** | 2026 | → NAT Gateway / LB outbound rules | Impacto em VMs sem public IP |

---

## 🟢 4. Retirements em 2027+ (Radar)

| Serviço | Data Estimada | Migração |
|---------|--------------|----------|
| **Azure Lab Services** | Q2 2027 | → Soluções alternativas de lab/classroom |
| **AVS AV36P/AV52** (retirement final) | 31 Mar 2029 | → AV64 |
| **AVS AV36P/AV52** (último dia RI 1 ano) | 31 Mar 2028 | → AV64 |

---

## 🔒 5. Informações Internas (Microsoft Confidential)

### 5.1 Azure VMware Solution (AVS) — AV36P / AV52
**Fonte:** Teams — All CSU_Brasil | **Data:** 23 Fev 2026

Detalhes compartilhados internamente:
- **Retirement final:** 31 Mar 2029
- **Último dia para RI 3 anos (VCF BYOL):** 31 Mar 2026
- **Último dia para RI 1 ano:** 31 Mar 2028
- **PayGo:** Deve migrar até 31 Mar 2029
- **Path:** → AV64 (ou AV48 onde disponível)
- **Brasil:** Apenas AV36P e AV64 disponíveis
- **Suporte:** AVS_Retirement_Help@microsoft.com
- **Ação para CSA:** Notificar clientes com AVS sobre planejamento de migração de nodes, especialmente os que têm RIs vigentes

### 5.2 Azure OpenAI "On Your Data" (OYD) — Retirement FY26
**Fonte:** Customer Success Events (interno) | **Data:** 5 Mar 2026

- Sessão formal de **retirement + migration enablement** para o cenário OYD
- Foco em preparar o campo para comunicação com clientes
- **Ação para CSA:** Verificar clientes que usam Azure OpenAI "On Your Data" e preparar plano de migração
- ⚠️ Detalhes específicos de datas/SKUs não disponíveis nos artefatos internos

### 5.3 Azure Technical Update Briefing — Jan 2026
**Fonte:** SharePoint — FY23 Azure Core Solution Play | **Data:** 11 Fev 2026

- Documento `2026_01 - Azure-Technical Update Briefing.pptx`
- Acesso restrito — tipicamente contém retirements, SKU transitions e deprecations
- **Ação para CSA:** Solicitar acesso e revisar para detalhes adicionais

---

## 🛠️ 6. Ferramentas de Monitoramento

### Ferramentas Oficiais Microsoft

| Ferramenta | O que faz | Link |
|-----------|-----------|------|
| **Azure Advisor — Service Retirement Workbook** | Mostra recursos **do seu tenant** impactados por retirements | [learn.microsoft.com/azure/advisor/advisor-workbook-service-retirement](https://learn.microsoft.com/en-us/azure/advisor/advisor-workbook-service-retirement) |
| **Microsoft Lifecycle Policy** | Busca por qualquer produto Microsoft | [learn.microsoft.com/lifecycle](https://learn.microsoft.com/en-us/lifecycle/) |
| **Azure Updates — Retirements** | Feed oficial de anúncios | [azure.microsoft.com/updates/?filters=Retirements](https://azure.microsoft.com/en-us/updates/?filters=%5B%22Retirements%22%5D) |
| **Lifecycle Newsletters** | PDFs trimestrais com resumo | [Mar 2025](https://download.microsoft.com/download/17da6d02-fb47-4261-8809-cd743467abc9/Lifecycle0325.pdf) / [Dez 2025](https://download.microsoft.com/download/cb5ac7d8-4543-4e73-9b2c-76b354ccf7e0/LMNewsletter1225.pdf) |

### Ferramentas da Comunidade

| Ferramenta | O que faz | Link |
|-----------|-----------|------|
| **Azure Deprecations Timeboard** | Dashboard visual com timeline | [azurecharts.com/timeboards/deprecations](https://azurecharts.com/timeboards/deprecations) |
| **Azure Retirement Calendar** | Calendário simples | [retire.azu.fyi](https://retire.azu.fyi/) |
| **Azure Charts — Retirements** | Últimas atualizações | [azurecharts.com/updates?category=retirements](https://azurecharts.com/updates?category=retirements) |

### Query Interna (Kusto)
Para tracking de impacto por workload/TPID:
```kusto
ServiceRetirementsForWorkloads()
```

---

## 🎯 7. Ações Recomendadas para o CSA

### Ação Imediata (esta semana)
1. ✅ **Rodar o Service Retirement Workbook** no Azure Advisor para cada cliente
2. ✅ **Verificar Basic Load Balancer** — retirement em Set 2025, já não cria novos
3. ✅ **Identificar clientes AVS** no Brasil — deadline de RI 3 anos é 31 Mar 2026

### Ação de Curto Prazo (30 dias)
4. 📋 **Inventariar Application Gateway v1** — retirement Abr 2026
5. 📋 **Verificar Azure OpenAI OYD** — buscar detalhes do retirement
6. 📋 **Windows 10 VMs** — mapear VMs com Win10 para plano de upgrade

### Ação de Médio Prazo (90 dias)
7. 📅 **Criar calendário de retirements** por cliente (top accounts)
8. 📅 **Comunicar proativamente** — clientes apreciam heads-up antecipado
9. 📅 **Planejar VPN Gateway migration** — deadline Set 2026

### Template de Comunicação com Cliente
```
Assunto: [Proativo] Azure Service Retirement — Ação necessária para [Nome do Serviço]

Olá [Nome],

Gostaríamos de informar proativamente que o serviço [Nome do Serviço] do Azure
tem data de retirement programada para [Data]. 

Identificamos que sua subscription [ID] possui [N] recursos utilizando este serviço.

Recomendamos a migração para [Serviço Alternativo], que oferece [benefícios].

Nosso time pode apoiar no planejamento e execução da migração. 
Podemos agendar uma sessão para discutir o plano?

Atenciosamente,
[Seu nome] — Cloud Solution Architect, Microsoft
```

---

## 📊 Dashboard Rápido — Top Retirements por Urgência

```
🔴 URGENTE (< 6 meses)
├── Basic Load Balancer ──────── Set 2025
├── Azure DB for MariaDB ─────── Set 2025
├── Unmanaged Disks ──────────── Set 2025
├── Windows 10 EOS ───────────── Out 2025
└── AVS RI 3yr deadline ──────── Mar 2026

🟠 ATENÇÃO (6-12 meses)
├── Application Gateway v1 ──── Abr 2026
├── VPN Gateway non-AZ ──────── Set 2026
├── HDInsight (legado) ──────── Q3 2026
├── Databricks Standard ─────── Out 2026
└── Azure OpenAI OYD ────────── FY26 TBD

🟡 RADAR (12+ meses)
├── Lab Services ─────────────── Q2 2027
├── AVS AV36P/AV52 (RI 1yr) ── Mar 2028
└── AVS AV36P/AV52 (final) ──── Mar 2029
```

---

*Compilado por CSA Agents Repo | Fontes: Microsoft Learn, Azure Updates, WorkIQ (interno) | Março 2026*
*Para informações sempre atualizadas, consulte: [Azure Advisor Service Retirement Workbook](https://learn.microsoft.com/en-us/azure/advisor/advisor-workbook-service-retirement)*
