# Well-Architected Review: Banco Digital — App Web .NET 8

## Contexto
- **Cliente:** Banco digital brasileiro, regulado pelo BACEN e sujeito à LGPD, Resolução CMN 4.893/2021 e Resolução BCB 85/2021.
- **Arquitetura atual:**
  - **Compute:** Azure App Service, SKU B2 (Basic)
  - **Dados:** Azure SQL Database — single database, General Purpose
  - **Identidade:** Autenticação própria com JWT (sem Entra ID)
  - **Rede:** Sem WAF, sem Firewall, sem Private Endpoints
  - **DR/HA:** Sem Disaster Recovery
  - **Observabilidade:** Application Insights apenas
  - **Deploy:** Manual via FTP

---

## Análise por Pilar

### 🔒 Segurança (Security)

| Aspecto | Status | Risco | Recomendação |
|---------|--------|-------|--------------|
| Identidade e acesso | ❌ | **Crítico** | Migrar para **Microsoft Entra ID** com MFA obrigatório. JWT customizado não atende BACEN. |
| Proteção de dados em trânsito | ⚠️ | Alto | Garantir TLS 1.2+ end-to-end. Configurar minimum TLS version no App Service. Implementar HSTS. |
| Proteção de dados em repouso | ⚠️ | Alto | Implementar **Customer-Managed Keys (CMK)**. Avaliar **Always Encrypted** para CPF/dados bancários. |
| Segurança de rede | ❌ | **Crítico** | Implementar **Azure WAF**, **Private Endpoints** para SQL, **VNet Integration** no App Service. Obrigatório pela Res. CMN 4.893. |
| Gestão de secrets | ⚠️ | Alto | Migrar secrets para **Azure Key Vault** com Managed Identity. |
| Governança e compliance | ❌ | **Crítico** | Implementar **Microsoft Defender for Cloud** + **Azure Policy**. Necessário para LGPD Art. 46 e BACEN. |
| Teste de segurança | ❌ | **Crítico** | Implementar SAST/DAST. **GitHub Advanced Security** ou **Defender for DevOps**. |

### 🔄 Confiabilidade (Reliability)

| Aspecto | Status | Risco | Recomendação |
|---------|--------|-------|--------------|
| Redundância | ❌ | **Crítico** | SKU B2 não suporta slots, auto-scale, nem SLA robusto. Migrar para **Premium P1v3** (zone redundancy, 99.95%). |
| DR | ❌ | **Crítico** | Implementar **Active Geo-Replication** ou **Failover Groups** no SQL; App Service multi-região com **Front Door**. |
| Backup | ⚠️ | Alto | Validar **Long-Term Retention (LTR)** no SQL. Testar restauração regularmente. |
| Resiliência | ⚠️ | Alto | Implementar retry policies, circuit breaker (Polly), health checks, auto-healing. |
| SLA composto | ❌ | **Crítico** | App Service Basic não tem SLA de produção. Target banco digital: ≥ 99.95%. |

### ⚡ Eficiência de Performance

| Aspecto | Status | Risco | Recomendação |
|---------|--------|-------|--------------|
| Escalabilidade | ❌ | Alto | B2 não suporta auto-scale. Essencial para picos de Pix/pagamentos. |
| BD Performance | ⚠️ | Médio | Avaliar tier **Business Critical** (local SSD). Habilitar **Automatic Tuning**. |
| Caching | ❌ | Alto | Implementar **Azure Cache for Redis** para sessões e dados de referência. |
| CDN/Edge | ⚠️ | Médio | Implementar **Azure Front Door** com caching e aceleração de rotas. |

### 💰 Otimização de Custos

| Aspecto | Status | Risco | Recomendação |
|---------|--------|-------|--------------|
| Right-sizing | ⚠️ | Médio | Analisar métricas via **Azure Advisor** antes de migrar SKU. |
| Reservas | ❌ | Médio | **1-year RI** no SQL (~30% economia). **Savings Plan** para App Service. |
| Monitoramento | ⚠️ | Baixo | Implementar **Cost Management** com budgets e alertas de anomalia. |

### 🏭 Excelência Operacional

| Aspecto | Status | Risco | Recomendação |
|---------|--------|-------|--------------|
| IaC | ❌ | **Crítico** | Implementar **Bicep** ou **Terraform**. Exigência BACEN para auditoria. |
| CI/CD | ❌ | **Crítico** | **FTP é inaceitável** para banco. Implementar **GitHub Actions** com build, testes, SAST, deployment slots, approval gates. |
| Observabilidade | ⚠️ | Alto | Falta: alertas proativos, dashboards, Log Analytics centralizado, runbooks. |
| Gestão de incidentes | ❌ | Alto | Implementar runbooks, playbooks, on-call com **Action Groups**. |
| Gestão de mudanças | ❌ | **Crítico** | FTP não permite rollback nem audit trail. Violação direta de controles BACEN. |

---

## Resumo Executivo

### Score geral por pilar

| Pilar | Score (1-5) | Prioridade |
|-------|:-----------:|:----------:|
| 🔒 Segurança | **1** | 🔴 Crítica |
| 🔄 Confiabilidade | **1** | 🔴 Crítica |
| ⚡ Performance | **2** | 🔴 Crítica |
| 💰 Custo | **3** | 🟡 Moderada |
| 🏭 Operações | **1** | 🔴 Crítica |

> **Score médio: 1.6 / 5** — Gaps críticos com risco regulatório significativo para instituição financeira.

### Top 5 Recomendações

| # | Ação | Pilar | Esforço |
|---|------|-------|---------|
| 1 | **Implementar CI/CD e eliminar FTP** | Operações + Segurança | Médio |
| 2 | **VNet Integration + Private Endpoints + WAF** | Segurança | Médio |
| 3 | **Migrar autenticação para Entra ID + MFA** | Segurança | Alto |
| 4 | **Upgrade App Service Premium P1v3 + DR multi-região** | Confiabilidade | Alto |
| 5 | **IaC com Bicep + Defender for Cloud** | Operações + Segurança | Médio |

### Quick Wins (< 1 semana)
- ✅ Habilitar **Defender for Cloud** (CSPM + planos App Service e SQL)
- ✅ Habilitar **SQL Auditing** e **Advanced Threat Protection**
- ✅ Configurar **TLS 1.2 minimum** no App Service
- ✅ Mover connection strings para **Key Vault** com Managed Identity
- ✅ Configurar **Azure Monitor Alerts** (CPU, HTTP 5xx, SQL DTU)
- ✅ Habilitar **Long-Term Backup Retention** no SQL
- ✅ Configurar **Service Health Alerts**

### Próximos Passos
1. **Semana 1-2:** Quick Wins + pipeline CI/CD básico
2. **Semana 3-4:** VNet, Private Endpoints, Front Door + WAF
3. **Mês 2:** Upgrade App Service Premium + IaC com Bicep
4. **Mês 2-3:** Migrar para Entra ID + Redis
5. **Mês 3-4:** DR multi-região (SQL Failover Groups + Front Door)

> ⚠️ **Nota regulatória:** Esta arquitetura apresenta gaps que podem configurar não-conformidade com a Resolução CMN 4.893/2021, Resolução BCB 85/2021, e LGPD.

---
*Refs: [WAF Framework](https://learn.microsoft.com/azure/well-architected/) · [Res. CMN 4.893](https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?tipo=Resolu%C3%A7%C3%A3o%20CMN&numero=4893)*
