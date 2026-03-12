# Arquitetura de Solução: Plataforma de Rastreamento em Tempo Real — LogTrack

## 1. Entendimento do Cenário

### Problema de negócio
Empresa de logística opera com 200 motoristas e depende de um sistema de rastreamento on-premises legado (C# .NET Framework 4.8, SQL Server 2016, Windows Server 2012 R2). O sistema atual não oferece visibilidade em tempo real das entregas, não escala para picos operacionais e não possui canal de comunicação direta com o cliente final. A operação perde eficiência por falta de dashboards em tempo real e o atendimento ao cliente é reativo — o cliente liga para perguntar "onde está minha entrega?" em vez de receber notificações proativas.

### Requisitos funcionais (top 5)

1. **Rastreamento GPS em tempo real** — Receber posição dos 200 motoristas a cada 15 segundos e exibir no mapa
2. **Dashboard operacional** — Painel web para a central de operações com visão consolidada de frota, status de entregas e alertas
3. **Notificações via WhatsApp** — Envio automático de status ao cliente final (saiu para entrega, chegando, entregue)
4. **Histórico de rotas e entregas** — Consulta de trajetos realizados, tempos de entrega e SLA por motorista
5. **Integração com sistema legado** — Manter integração com o ERP/TMS existente durante o período de transição

### Requisitos não-funcionais

| Requisito | Meta |
|-----------|------|
| Latência de rastreamento | < 5 segundos entre envio GPS e exibição no mapa |
| Disponibilidade | 99.5% durante horário comercial (6h–22h) |
| Throughput de ingestão | ~13 eventos/segundo (200 motoristas × 1 evento a cada 15s) |
| Retenção de dados | 12 meses de histórico detalhado, 36 meses agregado |
| LGPD | Dados de localização são dados pessoais — consentimento e anonimização necessários |
| Escalabilidade | Suportar crescimento para 500 motoristas sem re-arquitetura |

### Restrições conhecidas

- **Budget:** ~R$ 15.000/mês (~USD 2.800/mês na cotação atual) para infraestrutura cloud
- **Timeline:** 6 meses para MVP funcional
- **Skills do time:** Desenvolvedores conhecem C# / .NET — não têm experiência com Kubernetes ou arquiteturas event-driven
- **Legado:** Windows Server 2012 R2 está fora de suporte (EOL). SQL Server 2016 em extended support até 2026
- **Dispositivos:** Motoristas usam smartphones Android com app próprio (já existente)

---

## 2. Solução Proposta

### Visão geral

A solução moderniza o sistema de rastreamento migrando o backend para Azure App Service (.NET 8) com ingestão de eventos GPS via Azure SignalR Service para comunicação em tempo real e Azure Event Hubs para streaming resiliente. Os dados são persistidos em Azure SQL Database (compatibilidade direta com o SQL Server existente) com uma camada analítica em Azure Maps para visualização geoespacial. A integração com WhatsApp é realizada via Azure Communication Services (canal WhatsApp) com orquestração por Azure Functions. O dashboard operacional é construído como SPA em Blazor, hospedado no mesmo App Service, conectando-se via SignalR para atualizações em tempo real.

### Componentes da Arquitetura

| Camada | Serviço Azure | Justificativa | Alternativa considerada |
|--------|---------------|---------------|-------------------------|
| **Frontend / Dashboard** | Azure App Service (B2 Linux) + Blazor Server | Blazor permite manter stack C# full-stack, reduzindo curva de aprendizado. B2 oferece 3.5 GB RAM suficiente para o workload. SignalR integrado nativamente | Azure Static Web Apps + React (descartado: time não domina JS/TS, aumentaria timeline) |
| **API Backend** | Azure App Service (B2 Linux) — mesmo plano | Hospeda a Web API .NET 8 que recebe telemetria GPS e serve o dashboard. Consolidar no mesmo App Service Plan reduz custo | AKS (descartado: overhead operacional alto para time sem experiência em K8s; escala desnecessária para 200 motoristas) |
| **Ingestão de eventos** | Azure Event Hubs (Basic, 1 TU) | Ingestão resiliente de eventos GPS com buffering. 1 TU suporta até 1 MB/s ou 1000 eventos/s — muito acima dos ~13 eventos/s necessários | IoT Hub (descartado: custo maior, features de device management desnecessárias — motoristas usam app, não dispositivos IoT dedicados) |
| **Real-time push** | Azure SignalR Service (Free → Standard) | Push de posições para o dashboard em tempo real via WebSocket. Free tier suporta 20 conexões simultâneas (suficiente para operadores); migrar para Standard se escalar | Polling HTTP a cada 5s (descartado: latência maior, mais carga no backend) |
| **Banco de dados** | Azure SQL Database (Standard S2, 50 DTUs) | Compatibilidade direta com SQL Server 2016. Migração com menor atrito (mesmo T-SQL, Entity Framework). S2 suporta o volume operacional com folga | Cosmos DB (descartado: curva de aprendizado com modelo NoSQL, time domina SQL Server); PostgreSQL Flexible (descartado: reescrita de stored procedures sem benefício claro) |
| **Integração WhatsApp** | Azure Communication Services (ACS) — Advanced Messaging (WhatsApp) | Serviço gerenciado da Microsoft com canal WhatsApp Business nativo. Pricing por mensagem (~USD 0.005/msg template). Integração direta via SDK .NET | Twilio (descartado: vendor externo, custo similar mas sem integração nativa com Azure); API WhatsApp Business direta (descartado: complexidade de aprovação Meta e manutenção) |
| **Orquestração / Notificações** | Azure Functions (Consumption Plan) | Processa eventos do Event Hubs e dispara notificações WhatsApp. Consumption plan = paga por execução, ideal para workload event-driven intermitente | Logic Apps (descartado: custo por conector mais alto para volume de 200+ entregas/dia) |
| **Mapas e geolocalização** | Azure Maps | Renderização de mapa no dashboard, geocoding, cálculo de rotas. Pricing por transação, 1.000 transações gratuitas/mês. Stack Microsoft nativo | Google Maps Platform (descartado: custo mais alto em volume, vendor externo) |
| **Identidade** | Microsoft Entra ID (Free tier) | Autenticação dos operadores do dashboard via SSO. Managed Identity para comunicação entre serviços (Zero Trust) | Auth0 (descartado: custo adicional, vendor externo) |
| **Rede** | VNet + Private Endpoints + NSG | Private Endpoint para Azure SQL e Event Hubs. VNet Integration no App Service. NSG restritivo | Service Endpoints (descartado: Private Endpoints oferecem isolamento superior, alinhado com Zero Trust) |
| **Segurança de segredos** | Azure Key Vault (Standard) | Armazena connection strings, chaves de API do ACS e certificados. Referenciado via Managed Identity, sem segredos em código | App Configuration (complementar, não substituto para secrets) |
| **Monitoramento** | Azure Monitor + Application Insights | Telemetria de aplicação (App Insights), métricas de infra (Monitor), alertas operacionais. SDK .NET nativo | Datadog (descartado: custo adicional significativo, vendor externo) |
| **DevOps / CI/CD** | Azure DevOps (Basic Plan gratuito até 5 users) | Pipeline CI/CD para deploy automatizado. Familiar para times .NET. Repos Git + Boards para gestão | GitHub Actions (viável, mas Azure DevOps oferece Boards integrado para gestão do projeto) |
| **Cache** | Azure Cache for Redis (Basic C0) | Cache de posições recentes dos motoristas para reduzir queries ao SQL. Latência < 1ms | Cache in-memory no App Service (descartado: não compartilhado entre instâncias se escalar) |

### Diagrama de Arquitetura

```
                                    ┌─────────────────────────────────┐
                                    │     Dashboard Operacional       │
                                    │   (Blazor Server + Azure Maps)  │
                                    └──────────────┬──────────────────┘
                                                   │ SignalR (WebSocket)
                                                   ▼
┌──────────────┐   HTTPS/REST    ┌─────────────────────────────────────┐
│  App Mobile  │ ──────────────► │     Azure App Service (B2 Linux)    │
│  Motorista   │  (GPS coords)  │  ┌─────────────┐  ┌──────────────┐  │
│  (Android)   │                │  │  Web API     │  │  Blazor      │  │
└──────────────┘                │  │  .NET 8      │  │  Dashboard   │  │
                                │  └──────┬──────┘  └──────────────┘  │
                                └─────────┼───────────────────────────┘
                                          │ (Managed Identity)
                          ┌───────────────┼───────────────┐
                          ▼               ▼               ▼
              ┌──────────────────┐ ┌────────────┐ ┌──────────────┐
              │  Azure Event     │ │ Azure SQL  │ │ Azure Cache  │
              │  Hubs (Basic)    │ │ DB (S2)    │ │ Redis (C0)   │
              │  Ingestão GPS    │ │ [Private   │ │ Posições     │
              │                  │ │  Endpoint] │ │ recentes     │
              └────────┬─────────┘ └────────────┘ └──────────────┘
                       │
                       ▼ (Event trigger)
              ┌──────────────────┐
              │  Azure Functions │
              │  (Consumption)   │
              │  Orquestração    │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐        ┌──────────────────┐
              │  Azure Comm.     │        │  Sistema Legado  │
              │  Services (ACS)  │        │  On-premises     │
              │  WhatsApp        │        │  (VPN Gateway)   │
              └──────────────────┘        └──────────────────┘

         ┌──────────────────────────────────────────────────┐
         │  Cross-cutting: Entra ID │ Key Vault │ Monitor  │
         │  VNet + Private Endpoints │ Application Insights │
         └──────────────────────────────────────────────────┘
```

### Fluxos Principais

#### 1. Fluxo de rastreamento GPS (tempo real)
1. App do motorista envia coordenadas GPS via HTTPS POST para a Web API a cada 15 segundos
2. Web API valida o token JWT (Entra ID) e publica o evento no **Event Hubs**
3. Web API atualiza a posição no **Redis Cache** (última posição conhecida)
4. Web API faz broadcast da posição via **SignalR** para os dashboards conectados
5. **Azure Function** (trigger Event Hubs) persiste o evento no **Azure SQL** para histórico
6. Dashboard atualiza o pin no **Azure Maps** em tempo real

#### 2. Fluxo de notificação WhatsApp
1. Motorista atualiza status da entrega no app (ex: "saiu para entrega", "entregue")
2. Web API registra a mudança de status no **Azure SQL**
3. Evento de mudança de status é publicado no **Event Hubs**
4. **Azure Function** (trigger Event Hubs) processa o evento:
   - Busca dados do cliente (telefone, nome) no Azure SQL
   - Monta a message template do WhatsApp
   - Envia via **Azure Communication Services** (Advanced Messaging API)
5. ACS entrega a mensagem no WhatsApp do cliente final
6. Confirmação de entrega (delivery receipt) é logada no Application Insights

#### 3. Fluxo de integração com sistema legado
1. **VPN Gateway** (Basic SKU) estabelece tunnel site-to-site com o datacenter on-premises
2. Azure Function executa sync periódico (a cada 15 min) via API REST exposta pelo sistema legado
3. Dados de ordens de entrega e cadastro de motoristas são sincronizados para o Azure SQL
4. Conflitos são resolvidos com lógica "last-write-wins" com timestamp de origem
5. Durante o período de transição (Fase 1-2), o sistema legado permanece como source of truth para cadastro

---

## 3. Segurança & Compliance

### Modelo de identidade
- **Operadores do dashboard:** Autenticação via Microsoft Entra ID com MFA habilitado
- **App do motorista:** Autenticação via Entra ID B2C (registro e login por celular), com tokens JWT de curta duração (1h)
- **Comunicação entre serviços:** Exclusivamente via **Managed Identity** — sem connection strings ou secrets em código
- **RBAC:** Roles definidos — `Operador`, `Supervisor`, `Admin`. Princípio do menor privilégio

### Proteção de dados
- **Encryption at rest:** Habilitado por padrão em Azure SQL (TDE), Event Hubs e Redis
- **Encryption in transit:** TLS 1.2+ em todas as comunicações
- **Key Vault:** Armazena chaves de API do ACS, certificados TLS custom e qualquer secret residual
- **Dados sensíveis:** Números de telefone dos clientes são classificados como PII — acesso restrito via column-level security no Azure SQL

### Segurança de rede
- **VNet Integration:** App Service integrado à VNet para acessar recursos privados
- **Private Endpoints:** Azure SQL Database e Event Hubs acessíveis apenas via Private Endpoint dentro da VNet
- **NSG (Network Security Groups):** Regras restritivas — deny all inbound, allow apenas de subnets específicas
- **WAF:** Não incluso no MVP (budget limitado). Recomendado para Fase 3 via Azure Front Door Standard

### Compliance — LGPD
- **Base legal:** Execução de contrato (rastreamento da entrega contratada pelo cliente)
- **Consentimento WhatsApp:** Opt-in explícito no momento da compra para receber notificações
- **Direito ao esquecimento:** Processo documentado para anonimização de dados de localização após 36 meses
- **DPO:** Recomenda-se nomear um encarregado de dados (Data Protection Officer)
- **Logs de acesso:** Application Insights registra quem acessou dados de qual motorista/cliente

---

## 4. Confiabilidade & DR

### SLA composto estimado

| Serviço | SLA individual |
|---------|---------------|
| App Service (B2) | 99.95% |
| Azure SQL (Standard) | 99.99% |
| Event Hubs (Basic) | 99.95% |
| SignalR Service | 99.9% |
| Azure Functions (Consumption) | 99.95% |
| Azure Cache for Redis (Basic) | 99.9% |

**SLA composto (caminho crítico: App → Event Hubs → SQL):**
0.9995 × 0.9995 × 0.9999 = **99.89%** (~8.7 horas de downtime/ano)

> ℹ️ Para o cenário de logística com operação 6h–22h, o SLA efetivo durante horário operacional é superior, pois manutenções programadas tipicamente ocorrem de madrugada.

### Estratégia de DR

| Parâmetro | Meta MVP | Meta futura |
|-----------|----------|-------------|
| **RTO** | 4 horas | 1 hora |
| **RPO** | 1 hora | 15 minutos |

- **MVP (single region — Brazil South):** Sem failover automático cross-region. Recovery baseado em restore de backup
- **Evolução futura:** Geo-replication do Azure SQL para Brazil Southeast (quando disponível) ou East US 2

### Backup
- **Azure SQL:** Backup automático com retenção de 35 dias (PITR). Backup geo-redundante habilitado (RA-GRS)
- **Event Hubs:** Dados são transientes — sem backup necessário (já persistidos no SQL via Functions)
- **Configuração (IaC):** Todo infra definido em Bicep/ARM templates versionados no Azure DevOps — recovery via re-deploy

### Zonas de disponibilidade
- **MVP:** Não utiliza Availability Zones (SKUs Basic/Standard selecionados por budget). O App Service B2 não oferece garantia de AZ
- **Evolução:** Migrar para Premium v3 (P1v3) com zone redundancy quando o workload justificar o investimento

---

## 5. Estimativa de Custos

> Preços baseados na região **Brazil South**, em USD, cotação de referência: USD 1 = BRL 5.30

| Componente | SKU recomendado | Custo mensal estimado (USD) |
|------------|-----------------|------------------------------|
| App Service Plan | B2 Linux (2 vCPU, 3.5 GB RAM) | $54 |
| Azure SQL Database | Standard S2 (50 DTUs, 250 GB) | $112 |
| Azure Event Hubs | Basic (1 Throughput Unit) | $15 |
| Azure SignalR Service | Free tier (20 connections) | $0 |
| Azure Functions | Consumption (est. 500k execuções/mês) | $0.20 |
| Azure Cache for Redis | Basic C0 (250 MB) | $22 |
| Azure Communication Services | WhatsApp msgs (~6.000 msgs/mês) | $30 |
| Azure Maps | ~50.000 transações/mês | $25 |
| Azure Key Vault | Standard (est. 10k operações/mês) | $3 |
| Application Insights | Basic (est. 5 GB ingestão/mês) | $12 |
| Azure Monitor | Alertas e métricas básicas | $5 |
| VPN Gateway | Basic SKU (site-to-site) | $36 |
| Microsoft Entra ID | Free tier (operadores) | $0 |
| Entra ID B2C | 50.000 auth gratuitas (motoristas) | $0 |
| Azure DevOps | Basic (até 5 users grátis) | $0 |
| **Bandwidth** | Est. 50 GB outbound/mês | $5 |
| **Total estimado** | | **~$319/mês (~R$ 1.690)** |

> ⚠️ **Nota:** A estimativa está significativamente abaixo do budget de R$ 15k/mês. Isso permite:
> 1. Margem para crescimento (escalar para 500 motoristas sem preocupação)
> 2. Investir em SKUs superiores na Fase 3 (App Service Premium, SQL Hyperscale)
> 3. Adicionar Azure Front Door com WAF para segurança de borda
> 4. Reservar budget para licenciamento de ferramentas do time e treinamento
>
> 💡 **Recomendação:** Considerar **Reserved Instances (1 ano)** para App Service e Azure SQL após validação do MVP — economia de ~30-40%.
>
> ⚠️ Estimativa baseada em premissas de volume. Validar com [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/).

---

## 6. Roadmap de Implementação

| Fase | Escopo | Duração estimada |
|------|--------|-----------------|
| **1 — Foundation** | Landing zone (VNet, NSGs, Private Endpoints), Entra ID config, Key Vault, Azure DevOps setup, pipeline CI/CD, VPN site-to-site com on-premises | 3 semanas |
| **2 — Core Backend** | Migração do backend para .NET 8 Web API, setup Azure SQL (schema migration), Event Hubs ingestão GPS, Azure Functions para persistência, Redis cache, integração com sistema legado via VPN | 6 semanas |
| **3 — Dashboard & Real-time** | Dashboard Blazor Server com Azure Maps, SignalR para real-time, telas de operação (mapa, lista de entregas, alertas), histórico de rotas | 5 semanas |
| **4 — WhatsApp & Notificações** | Registro WhatsApp Business via ACS, Azure Functions para orquestração de notificações, templates de mensagem (saiu, chegando, entregue), opt-in de clientes | 3 semanas |
| **5 — Hardening & QA** | Testes de carga (k6/JMeter), security review, LGPD compliance check, Application Insights tuning, alertas operacionais, documentação | 3 semanas |
| **6 — Go-Live MVP** | Rollout gradual (20 motoristas → 50 → 200), treinamento da equipe de operações, período de operação assistida, handoff | 4 semanas |
| | **Total** | **~24 semanas (6 meses)** |

> 📌 **Dependência crítica:** Aprovação da conta WhatsApp Business pela Meta pode levar 2-4 semanas. Iniciar o processo na Fase 1.

---

## 7. Riscos & Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **Atraso na aprovação WhatsApp Business pela Meta** | Alta | Médio | Iniciar processo de aprovação na semana 1. Plano B: usar SMS via ACS enquanto aguarda aprovação |
| **Dificuldade na migração .NET Framework 4.8 → .NET 8** | Média | Alto | Usar .NET Upgrade Assistant. Identificar dependências incompatíveis na Fase 1. Fallback: rodar em Windows App Service com .NET 4.8 (custo maior) |
| **Latência GPS acima do aceitável (> 5s)** | Baixa | Alto | Arquitetura já otimizada com SignalR + Redis. Se necessário, mover para Azure IoT Hub com routing nativo |
| **Conectividade VPN instável com on-premises** | Média | Médio | VPN Gateway com redundância active-standby. Monitorar com Connection Monitor. Plano B: ExpressRoute (se budget permitir) |
| **Resistência dos motoristas ao novo app** | Média | Médio | Manter UX similar ao app atual. Treinamento presencial. Rollout gradual com grupo piloto de motoristas engajados |
| **Budget insuficiente para evolução pós-MVP** | Baixa | Médio | Custo estimado muito abaixo do budget. Documentar savings para justificar investimento contínuo |
| **LGPD — tratamento inadequado de dados de localização** | Média | Alto | Engajar jurídico desde a Fase 1. Implementar privacy by design: consentimento, anonimização, acesso auditado |
| **Windows Server 2012 R2 sem suporte** | Alta | Alto | Priorizar migração do workload para cloud. Se necessário manter temporariamente, habilitar Extended Security Updates (ESU) via Azure Arc |

---

## 8. Próximos Passos

- [ ] **Validar requisitos** com o time de operações e TI do cliente (workshop de 2h)
- [ ] **POC de ingestão GPS** — Testar pipeline App Service → Event Hubs → SQL com 10 dispositivos simulados (1 semana)
- [ ] **Iniciar aprovação WhatsApp Business** na Meta (processo pode levar 2-4 semanas)
- [ ] **Avaliar migração .NET** — Rodar o .NET Upgrade Assistant no codebase atual e gerar relatório de compatibilidade
- [ ] **Provisionar landing zone** — Criar subscription, VNet, NSGs e Private Endpoints via Bicep template
- [ ] **Definir contrato de SLA interno** — Alinhar com o cliente os targets de RTO/RPO e horário de operação
- [ ] **Workshop de segurança** — Revisar modelo Zero Trust e compliance LGPD com o time jurídico do cliente
- [ ] **Estimar custo detalhado** no [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) com os volumes exatos do cliente

---

> 📚 **Referências:**
> - [Azure Well-Architected Framework](https://learn.microsoft.com/azure/well-architected/)
> - [Cloud Adoption Framework — Landing Zones](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/)
> - [Azure Communication Services — WhatsApp](https://learn.microsoft.com/azure/communication-services/concepts/advanced-messaging/whatsapp/whatsapp-overview)
> - [Azure SignalR Service](https://learn.microsoft.com/azure/azure-signalr/signalr-overview)
> - [Migração .NET Framework → .NET 8](https://learn.microsoft.com/dotnet/core/porting/)
> - [LGPD e Azure Compliance](https://learn.microsoft.com/azure/compliance/offerings/offering-lgpd)

---

*Documento gerado como exemplo de output da skill `solution-design` do repositório CSA Skills.*
