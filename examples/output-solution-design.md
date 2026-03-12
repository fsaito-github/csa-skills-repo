# Arquitetura de Solução: Sistema de Rastreamento — Logística

## 1. Entendimento do Cenário

- **Problema:** Empresa de logística com sistema de rastreamento on-premises legado (C# .NET Framework 4.8, SQL Server 2016, Windows Server 2012) precisa modernizar para atender demanda de rastreamento em tempo real, comunicação via WhatsApp, e dashboard operacional.
- **Requisitos funcionais:**
  1. Rastreamento GPS em tempo real de 200 motoristas
  2. Dashboard web para operação monitorar frota
  3. Notificações automáticas via WhatsApp para clientes
  4. Histórico de rotas e entregas
  5. Integração com sistema legado durante transição
- **Requisitos não-funcionais:**
  - Latência < 5s para atualização de posição
  - Disponibilidade 99.9%
  - Compliance LGPD (dados de localização são dados pessoais)
- **Restrições:**
  - Budget: ~R$ 15k/mês em cloud
  - Timeline: 6 meses para MVP
  - Time com experiência em .NET, pouca em cloud

---

## 2. Solução Proposta

### Visão geral
Modernização gradual do sistema de rastreamento migrando de .NET Framework 4.8 para .NET 8 em Azure App Service, com Event Hubs para ingestão de dados GPS em tempo real, SignalR para push de atualizações ao dashboard Blazor Server, Azure SQL como banco principal (compatibilidade direta), e Azure Communication Services para notificações WhatsApp. Custo estimado bem dentro do budget.

### Componentes da Arquitetura

| Camada | Serviço Azure | Justificativa | Alternativa considerada |
|--------|---------------|---------------|-------------------------|
| Frontend/Dashboard | **Blazor Server + Azure Maps** | Time .NET não precisa aprender React; Maps nativo Azure | React + Google Maps (skill gap) |
| Backend / API | **App Service B2** (.NET 8) | PaaS gerenciado, familiar para time .NET, slots para deploy | AKS (overengineering para 200 motoristas) |
| Ingestão real-time | **Event Hubs** (Basic) | Ingestão massiva de eventos GPS com baixa latência | IoT Hub (features desnecessárias), Service Bus (não otimizado para streaming) |
| Push real-time | **SignalR Service** (Free→Standard) | Push de atualizações para dashboard sem polling | WebSockets manual (mais complexo) |
| Cache | **Azure Cache for Redis** (Basic C0) | Cache de posições atuais, reduz queries ao SQL | In-memory (não escala, perde dados) |
| Dados | **Azure SQL S2** | Compatibilidade direta com SQL Server 2016, migração simples | Cosmos DB (overkill, curva de aprendizado) |
| Mensageria WhatsApp | **Azure Communication Services** (Advanced Messaging) | Nativo Azure, API REST simples, sem vendor externo | Twilio (custo adicional, vendor externo) |
| Identidade | **Microsoft Entra ID** | Zero Trust, Managed Identity para serviços | JWT custom (inseguro) |
| Monitoramento | **Application Insights + Azure Monitor** | APM completo, alertas, dashboards | Datadog (custo adicional) |
| DevOps | **GitHub Actions** | CI/CD integrado, gratuito para repos privados | Azure DevOps (mais features que o necessário) |

### Diagrama de Arquitetura

```
[App Mobile GPS]  ──HTTP POST──▶  [Event Hubs]
   (200 motoristas)                    │
                                       ▼
                              [Azure Function]
                              (processa eventos)
                                  │        │
                                  ▼        ▼
                              [Redis]   [Azure SQL]
                              (cache)   (histórico)
                                  │
                                  ▼
                          [SignalR Service]
                                  │
                                  ▼
                          [Blazor Dashboard]  ◀── [Azure Maps]
                          (operação monitora)

[Azure Function Timer] ──▶ [Communication Services] ──▶ [WhatsApp]
(notificações)              (Advanced Messaging)        (clientes)

[VPN Site-to-Site] ◀──▶ [Sistema Legado On-Premises]
(coexistência durante migração)
```

### Fluxos Principais
1. **Fluxo GPS:** App mobile → Event Hubs → Azure Function → Redis (posição atual) + SQL (histórico) → SignalR → Dashboard
2. **Fluxo WhatsApp:** Evento de entrega no SQL → Azure Function (timer) → Communication Services → WhatsApp do cliente
3. **Fluxo de autenticação:** Motorista/Operador → Entra ID → App Service (token JWT emitido pelo Entra)

---

## 3. Segurança & Compliance
- **Identidade:** Entra ID + Managed Identity para todos os serviços. RBAC granular.
- **Dados:** Encryption at rest (TDE no SQL, platform-managed keys). TLS 1.2+ em trânsito.
- **Rede:** VNet Integration no App Service, Private Endpoints para SQL e Redis.
- **LGPD:** Dados de GPS são dados pessoais — documentar finalidade, base legal, e período de retenção. Política de purge automático.

---

## 4. Confiabilidade & DR
- **SLA composto estimado:** ~99.9% (App Service Standard + Azure SQL + Event Hubs)
- **DR:** Azure SQL geo-backup automático (PITR 7 dias). App Service multi-instance (2 instâncias mín.).
- **Backup:** SQL automated backups + LTR mensal
- **Availability Zones:** Não necessário no MVP — avaliar pós-crescimento

---

## 5. Estimativa de Custos

| Componente | SKU | Custo mensal (USD) |
|------------|-----|-------------------:|
| App Service | B2 (2 cores, 3.5GB) | $55 |
| Azure SQL | S2 (50 DTU) | $75 |
| Event Hubs | Basic (1 TU) | $11 |
| SignalR | Free (20 conexões) → Standard se necessário | $0–$50 |
| Redis | Basic C0 (250MB) | $16 |
| Communication Services | WhatsApp msgs (~5k/mês) | $50 |
| Application Insights | Logs (~5GB/mês) | $12 |
| Azure Maps | ~50k transações | $25 |
| Azure Functions | Consumption (~100k exec/mês) | $0 |
| **Total estimado** | | **~$244–$294/mês** |

> **~R$ 1.300–1.560/mês** (câmbio ~R$ 5.30) — **muito abaixo do budget de R$ 15k**, deixando margem para escala e hardening.

---

## 6. Roadmap de Implementação

| Fase | Escopo | Duração |
|------|--------|---------|
| 1 - Foundation | Infra base: VNet, Entra ID, CI/CD pipeline, IaC (Bicep) | 3 semanas |
| 2 - Ingestão | Event Hubs + Azure Function + Redis + SQL schema | 4 semanas |
| 3 - Dashboard | Blazor Server + SignalR + Azure Maps | 4 semanas |
| 4 - WhatsApp | Communication Services + templates + notificações | 3 semanas |
| 5 - Migração | VPN S2S, migração de dados SQL Server → Azure SQL, cutover app mobile | 4 semanas |
| 6 - Hardening | Monitoring, alertas, load testing, LGPD review, docs | 3 semanas |
| | **Total** | **~21 semanas (5 meses)** |

> 1 mês de margem para o deadline de 6 meses.

---

## 7. Riscos & Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|:------------:|:-------:|-----------|
| Time sem experiência em cloud | Alta | Alto | Hands-on labs Azure + pair programming com CSA nas primeiras sprints |
| Migração .NET Framework → .NET 8 | Média | Alto | Usar .NET Upgrade Assistant. Começar por módulos isolados. |
| Conectividade GPS em áreas rurais | Alta | Médio | Buffer local no app mobile + sync quando online (offline-first) |
| Volume de WhatsApp crescer rápido | Média | Baixo | Communication Services escala automaticamente. Monitorar custos. |
| Latência entre componentes | Baixa | Médio | Tudo na mesma região (Brazil South). Load test no final. |

---

## 8. Próximos Passos
- [ ] Validar requisitos com stakeholders da logística
- [ ] POC: Event Hubs + Function + mapa com 5 motoristas (2 semanas)
- [ ] Workshop de .NET 8 migration para o time de dev
- [ ] Criar ambiente dev com IaC (Bicep) via GitHub Actions
