# 📋 Exemplos: Advisor Impact Assessment

> Três cenários reais demonstrando o agente em ação com diferentes níveis de risco.
> Cada exemplo mostra a integração com Resource Graph + WorkIQ + ITSM.

---

## Exemplo 1: 🟢 Safe — Habilitar Soft Delete no Storage Account

```
Operador: @advisor-impact Analisar recomendação:
          "Enable soft delete for Storage Account 'stproddata01'"
          Subscription: sub-prod-001

Agent: 🔬 Analisando impacto da recomendação...

       📋 RECOMENDAÇÃO
       ├── Categoria: Reliability
       ├── Descrição: Enable soft delete for blob data
       ├── Recurso: stproddata01 (StorageV2, LRS, Hot tier)
       ├── Benefício: Proteção contra deleção acidental
       └── Advisor Impact: Medium

       🔍 CONTEXTO DO RECURSO
       ├── Resource Group: rg-data-prod (18 recursos)
       ├── Função: Armazenamento de documentos do portal de clientes
       ├── Tags: env=production, team=data-platform, criticality=medium
       └── Owner: data-platform@cliente.com

       🗂️ CONTEXTO ORGANIZACIONAL (WorkIQ)
       ├── Histórico: ⚠️ Há 3 meses um estagiário deletou blobs acidentalmente
       │   via Storage Explorer. Time levou 4h para restaurar do backup externo.
       │   Email de João (Tech Lead) pedindo "proteção contra deleção" foi encontrado.
       ├── Decisões: Nenhuma decisão contra soft delete documentada
       └── Pessoas-chave: João Silva (Tech Lead), Maria Santos (DBA)
       
       🔧 CONTEXTO ITSM (ServiceNow)
       ├── CI: stproddata01 (CI Class: Azure Storage Account)
       ├── Business Service: Portal de Clientes (criticidade: Medium)
       ├── Incidentes: INC0045231 (3 meses atrás) — "Blobs deletados acidentalmente"
       │   Severidade: P3, Tempo de resolução: 4h, RCA: erro humano
       ├── Change Requests: Nenhuma pendente
       └── Known Errors: Nenhum

       📡 BLAST RADIUS: 🟢 NENHUM
       ├── 0 serviços afetados negativamente
       ├── Mudança é aditiva (habilita feature, não altera behavior)
       └── Dados existentes não são modificados

       ⚠️ ANÁLISE DE RISCO
       ├── Risco técnico: 🟢 ZERO — sem downtime, sem breaking changes
       ├── Risco de negócio: 🟢 ZERO — nenhum impacto em operação
       ├── Falso positivo?: NÃO — recomendação 100% válida
       └── 💡 CONTEXTO EXTRA: INC0045231 confirma necessidade real.
           Soft delete teria evitado o incidente de 4h de indisponibilidade.

       ✅ VALIDAÇÃO
       ├── ✅ Sem downtime
       ├── ✅ Sem breaking changes
       ├── ✅ Custo adicional mínimo: ~R$ 12/mês (retenção 14 dias)
       └── ✅ Resolve causa raiz do INC0045231

       📋 PLANO DE IMPLEMENTAÇÃO
       ├── PRE
       │   └── 1. Nenhuma preparação necessária
       ├── EXEC
       │   └── 2. az storage account blob-service-properties update \
       │          --account-name stproddata01 \
       │          --enable-delete-retention true \
       │          --delete-retention-days 14
       └── POST
           └── 3. Validar: az storage account blob-service-properties show

       🔄 ROLLBACK
       ├── Ação: Desabilitar soft delete (--enable-delete-retention false)
       ├── Tempo: 1 minuto
       └── Nota: Dados em soft delete serão purgados após desabilitar

       📊 DECISÃO RECOMENDADA
       ├── Implementar: ✅ SIM — IMEDIATAMENTE
       ├── Janela: Não necessária (pode ser feito agora)
       ├── Confidence: 🟢 99%
       ├── Saving/Benefício: Evita incidentes como INC0045231 (4h downtime)
       └── ITSM: Criar CR como "Standard Change" (pre-approved)

       ═══════════════════════════════════════════════
```

---

## Exemplo 2: 🟡 Medium — Right-size VM de Produção

```
Operador: @advisor-impact Analisar recomendação:
          "Right-size VM 'app-server-prod-01' from Standard_D4s_v3 to Standard_D2s_v3"
          Saving estimado: R$ 2.800/mês
          Subscription: sub-prod-001

Agent: 🔬 Analisando impacto da recomendação...

       📋 RECOMENDAÇÃO
       ├── Categoria: Cost
       ├── Descrição: Right-size VM de D4s_v3 (4 vCPU, 16GB) para D2s_v3 (2 vCPU, 8GB)
       ├── Recurso: app-server-prod-01 (Windows Server 2022, IIS + .NET 8)
       ├── Saving estimado: R$ 2.800/mês
       └── Advisor Impact: Medium

       🔍 CONTEXTO DO RECURSO
       ├── Resource Group: rg-app-prod (32 recursos)
       ├── Função: Application server — Portal de Pagamentos
       ├── Tags: env=production, team=payments, criticality=high
       ├── CPU P50: 18% | P95: 38% | P99: 52%
       ├── Memory P50: 35% | P95: 45% (7.2GB de 16GB) | P99: 58%
       └── Owner: payments-infra@cliente.com

       🗂️ CONTEXTO ORGANIZACIONAL (WorkIQ)
       ├── Histórico:
       │   ├── ⚠️ Em janeiro, equipe discutiu right-sizing mas adiou por
       │   │   "receio de impacto em fechamento fiscal" (email de Carlos, Ops Lead)
       │   └── ✅ VM similar (app-server-hml-01) foi right-sized para D2s_v5
       │       com sucesso em dezembro — relatado por Ana em Teams
       ├── Decisões: VM foi provisionada como D4s_v3 em 2023 "para aguentar
       │   picos de Black Friday" (ADR encontrada no email de setup original)
       ├── Projeto: Portal de Pagamentos v2 em DevSquad (sprint 5/8)
       │   └── ⚠️ Time não quer mudanças em infra durante DevSquad
       └── Pessoas-chave: Carlos (Ops Lead), Ana (SRE), Pedro (DevSquad Lead)

       🔧 CONTEXTO ITSM (ServiceNow)
       ├── CI: app-server-prod-01 (CI Class: Windows Server)
       ├── Business Service: Portal de Pagamentos (criticidade: HIGH)
       ├── SLA: 99.95% disponibilidade mensal
       ├── Incidentes (90 dias):
       │   ├── INC0052100 (45 dias atrás) — "Lentidão no portal" — P3
       │   │   RCA: Query SQL lenta, não relacionada à VM
       │   └── Nenhum incidente de CPU/Memory
       ├── Change Requests:
       │   ├── CHG0012345 (em aprovação) — "Deploy v2.3 do portal" — esta semana
       │   └── ⚠️ CONFLITO: Não fazer right-size na mesma semana do deploy
       ├── Known Errors: Nenhum para esta VM
       └── Janela de manutenção: Domingos 02:00-06:00 (aprovada pelo CAB)

       📡 BLAST RADIUS
       ├── Dependências diretas (Resource Graph):
       │   ├── Azure SQL MI (app-sql-prod) — connection string
       │   ├── Storage Account (appstorageprod) — blob access
       │   ├── Key Vault (kv-app-prod) — secrets
       │   └── Application Gateway (appgw-prod) — backend pool member
       ├── Dependências indiretas:
       │   ├── 3 outras VMs no mesmo backend pool do AppGW
       │   └── Log Analytics workspace (logs-prod)
       ├── Dependências ITSM (CMDB):
       │   ├── Business Service: Portal de Pagamentos → 5K usuários
       │   └── Upstream: API Gateway → Mobile App → 12K end users
       └── Total: 4 diretos, 5 indiretos, ~12K usuários

       ⚠️ ANÁLISE DE RISCO
       ├── Risco técnico: 🟡 MÉDIO
       │   ├── Resize requer restart da VM (~5 min downtime)
       │   ├── CPU P95 38% em D4s_v3 → ~76% em D2s_v3 (OK)
       │   ├── Memory P95 7.2GB em 16GB → 7.2GB em 8GB = 90% ⚠️
       │   └── D2s_v5 seria melhor: mesma faixa de preço, mais eficiente
       ├── Risco de negócio: 🟡 MÉDIO
       │   ├── Portal de Pagamentos (HIGH criticality) — 5 min downtime
       │   ├── ⚠️ DevSquad em andamento — time sensível a mudanças
       │   └── ⚠️ CHG0012345 (deploy v2.3) esta semana — CONFLITO
       ├── Falso positivo?: PARCIAL
       │   ├── Advisor recomenda D2s_v3, mas D2s_v5 é melhor opção
       │   ├── VM foi sized para Black Friday (ADR de 2023)
       │   │   → P99 de nov/2025 mostra CPU 52% — D2s_v5 suportaria
       │   └── ✅ Precedente: app-server-hml-01 migrada com sucesso (WorkIQ)
       └── Contexto WorkIQ: Time adiou em janeiro por fechamento fiscal.
           Agora é março — momento mais seguro.

       ✅ VALIDAÇÃO
       ├── ✅ Saving é real: R$ 2.800/mês → R$ 2.650/mês com D2s_v5
       ├── ✅ CPU: OK mesmo em P99 (52% → ~70% em D2s_v5)
       ├── ⚠️ Memory: P95 a 90% em D2s_v3 — D2s_v5 tem melhor profile
       ├── ✅ Precedente validado: HML migrada com sucesso
       └── ⚠️ Timing: Esperar CHG0012345 (deploy v2.3) finalizar

       📋 PLANO DE IMPLEMENTAÇÃO
       ├── PRE
       │   ├── 1. Esperar CHG0012345 ser completado (deploy v2.3)
       │   ├── 2. Criar Change Request no ServiceNow (Normal Change)
       │   │      Referência: "Right-size app-server-prod-01 D4s_v3 → D2s_v5"
       │   ├── 3. Snapshot da VM (Azure restore point)
       │   ├── 4. Comunicar janela: Domingo 02:00 após deploy estabilizar
       │   └── 5. Configurar alertas pós-resize (CPU >80%, Memory >85%)
       ├── EXEC
       │   ├── 6. Remover VM do backend pool do AppGW (graceful drain)
       │   ├── 7. Deallocate VM
       │   ├── 8. Resize para Standard_D2s_v5
       │   ├── 9. Start VM
       │   └── 10. Adicionar VM de volta ao backend pool do AppGW
       └── POST
           ├── 11. Validar health checks (IIS, .NET, SQL connection)
           ├── 12. Monitorar CPU/Memory por 72h
           ├── 13. Fechar Change Request no ServiceNow
           └── 14. Confirmar saving no Cost Management (próximo ciclo)

       🔄 ROLLBACK
       ├── Trigger: CPU P95 >85% ou Memory P95 >95% por 1h
       ├── Ação: Resize back para D4s_v3 (mesmo procedimento)
       ├── Tempo estimado: 5 minutos
       ├── Snapshot disponível por: 7 dias
       └── ITSM: Registrar rollback na Change Request

       📊 DECISÃO RECOMENDADA
       ├── Implementar: ⚠️ SIM COM AJUSTES
       │   ├── SKU: D2s_v5 (não D2s_v3)
       │   ├── Timing: Após CHG0012345 + 1 semana de estabilização
       │   └── ITSM: Normal Change com aprovação do CAB
       ├── Janela: Domingo 02:00-03:00 (aprovada pelo CAB)
       ├── Confidence: 🟢 85%
       ├── Saving ajustado: R$ 2.650/mês
       └── Stakeholders a comunicar: Carlos (Ops), Pedro (DevSquad Lead)

       ═══════════════════════════════════════════════
```

---

## Exemplo 3: 🔴 High — Reduzir RUs do Cosmos DB

```
Operador: @advisor-impact Analisar recomendação:
          "Reduce provisioned throughput on Cosmos DB container 'orders'
           from 10000 RU/s to 4000 RU/s"
          Database: db-ecommerce, Container: orders
          Saving estimado: R$ 5.800/mês

Agent: 🔬 Analisando impacto da recomendação...

       📋 RECOMENDAÇÃO
       ├── Categoria: Cost
       ├── Descrição: Reduzir throughput provisioned de 10.000 para 4.000 RU/s
       ├── Recurso: db-ecommerce/orders (Cosmos DB, Brazil South)
       ├── Saving estimado: R$ 5.800/mês
       └── Advisor Impact: Medium

       🔍 CONTEXTO DO RECURSO
       ├── Resource Group: rg-ecommerce-prod (45 recursos)
       ├── Função: Container de pedidos do e-commerce
       ├── Tags: env=production, team=commerce, criticality=critical
       ├── RU consumption: avg=2.800 | P50=3.100 | P95=7.200 | P99=9.400
       └── Owner: commerce-platform@cliente.com

       🗂️ CONTEXTO ORGANIZACIONAL (WorkIQ)
       ├── Histórico:
       │   ├── 🔴 Em novembro (Black Friday), o time escalou RUs de 8K para
       │   │   15K porque throttling causou pedidos perdidos (email de CTO)
       │   ├── ⚠️ CTO mencionou em all-hands: "nunca mais quero ouvir que
       │   │   perdemos pedidos por falta de capacidade"
       │   └── ✅ Em janeiro, equipe discutiu autoscale como alternativa mas
       │       "ficou para Q2" (meeting notes do planning)
       ├── Decisões: RUs atuais (10K) foram definidos pós-Black Friday como
       │   "buffer de segurança" — decisão documentada em email do CTO
       ├── Projetos: Campanha de Páscoa planejada para abril — promoções
       └── Pessoas-chave: Roberto (CTO), Mariana (Eng Lead), Fábio (SRE)

       🔧 CONTEXTO ITSM (ServiceNow)
       ├── CI: db-ecommerce-orders (CI Class: Azure Cosmos DB)
       ├── Business Service: E-Commerce Platform (criticidade: CRITICAL)
       ├── SLA: 99.99% disponibilidade
       ├── Incidentes (90 dias):
       │   ├── INC0048900 (Black Friday) — "Throttling Cosmos DB" — P1
       │   │   Duração: 2h, Impacto: R$ 450K em pedidos perdidos
       │   │   RCA: RUs insuficientes para pico de tráfego
       │   │   Ação: Aumentar RUs de 8K para 15K (reduzido para 10K depois)
       │   └── INC0051200 (jan) — "Latência elevada" — P3
       │       RCA: Query cross-partition não otimizada
       ├── Change Requests: Nenhuma pendente
       ├── Known Errors: PRB0003400 — "Cosmos DB partition skew em container orders"
       │   Status: Investigação em andamento
       └── Janela de manutenção: Domingos 01:00-05:00

       📡 BLAST RADIUS
       ├── Dependências diretas:
       │   ├── api-orders (AKS, 150 req/s avg, 800 req/s peak)
       │   ├── api-reports (App Service, 20 req/s, batch queries)
       │   └── Azure Function order-processor (event-driven, 50 req/s)
       ├── Dependências ITSM (CMDB):
       │   ├── Business Service: E-Commerce Platform → CRITICAL
       │   ├── Upstream: Mobile App, Web App, Partner API
       │   └── Downstream: Payment Gateway, Inventory, Shipping
       ├── Usuários afetados: ~45.000 (clientes + parceiros)
       └── Revenue at risk: ~R$ 2M/dia (baseado em INC0048900)

       ⚠️ ANÁLISE DE RISCO
       ├── Risco técnico: 🔴 ALTO
       │   ├── RU P95 = 7.200 → 4.000 causaria throttling em 35% do tempo
       │   ├── RU P99 = 9.400 → picos regulares acima de 4.000
       │   ├── Known Error PRB0003400 (partition skew) agrava o problema
       │   └── Campanha de Páscoa em abril → picos maiores que novembro
       ├── Risco de negócio: 🔴 CRÍTICO
       │   ├── INC0048900 (P1): throttling causou R$ 450K em perdas
       │   ├── CTO: "nunca mais perder pedidos por capacidade"
       │   ├── SLA 99.99% seria violado com throttling frequente
       │   └── Campanha de Páscoa é um risco adicional
       ├── Falso positivo?: SIM — PARCIAL
       │   ├── Advisor usou média (2.800 RU/s) — ignora P95 de 7.200
       │   ├── Advisor não conhece o histórico de Black Friday
       │   ├── Advisor não vê a campanha de Páscoa chegando
       │   └── Known Error (partition skew) amplifica consumo de RU
       └── Contexto decisivo (WorkIQ + ITSM combinados):
           ├── INC P1 com R$ 450K de perda por throttling
           ├── Decisão do CTO de manter buffer
           └── Campanha sazonal em 3 semanas

       ✅ VALIDAÇÃO
       ├── 🔴 Reduzir para 4K fixo: INACEITÁVEL (throttling em picos)
       ├── ✅ Autoscale é viável: reduz custo mantendo proteção
       ├── ⚠️ Timing: Não implementar antes da Páscoa
       └── ⚠️ Known Error: Resolver partition skew primeiro reduziria RU

       ✅ RECOMENDAÇÃO AJUSTADA
       ├── ❌ NÃO reduzir para 4.000 RU/s fixo
       ├── ✅ ALTERNATIVA em 2 fases:
       │
       │   FASE 1 (agora): Habilitar Autoscale com max 10.000 RU/s
       │   ├── Min efetivo: 1.000 RU/s (10% do max)
       │   ├── Saving estimado: R$ 4.200/mês em períodos normais
       │   ├── Risco: 🟢 ZERO (escala automaticamente)
       │   └── Protege contra picos (Black Friday, Páscoa)
       │
       │   FASE 2 (pós-Páscoa): Resolver partition skew (PRB0003400)
       │   ├── Reduzirá consumo base de RUs
       │   ├── Permitirá reduzir max autoscale para 8.000
       │   └── Saving adicional estimado: R$ 1.200/mês
       │
       └── Total saving: R$ 4.200 + R$ 1.200 = R$ 5.400/mês (93% do Advisor)
           com ZERO risco de throttling

       📋 PLANO DE IMPLEMENTAÇÃO
       ├── PRE (Fase 1)
       │   ├── 1. Criar Change Request: "Migrar orders para Autoscale"
       │   ├── 2. Habilitar alertas de throttling (429) e latência
       │   ├── 3. Comunicar ao time (Mariana + Fábio)
       │   └── 4. NÃO fazer antes da campanha de Páscoa
       ├── EXEC (Fase 1 — pós-Páscoa, domingo 02:00)
       │   ├── 5. Converter container de Provisioned para Autoscale
       │   │      max: 10.000 RU/s
       │   └── 6. Validar que autoscale está ativo
       └── POST (Fase 1)
           ├── 7. Monitorar RU consumption por 14 dias
           ├── 8. Verificar que não houve throttling
           ├── 9. Confirmar saving no Cost Management
           └── 10. Iniciar Fase 2 (resolver PRB0003400)

       🔄 ROLLBACK
       ├── Trigger: Throttling (429) > 1% das requests por 15 min
       ├── Ação: Aumentar max autoscale para 15.000 RU/s
       ├── Tempo: Imediato (autoscale ajusta em segundos)
       └── ITSM: Registrar na Change Request

       📊 DECISÃO RECOMENDADA
       ├── Implementar como Advisor recomenda: ❌ NÃO
       ├── Implementar alternativa (autoscale): ✅ SIM — Fase 1 pós-Páscoa
       ├── Saving: R$ 4.200/mês (Fase 1) + R$ 1.200/mês (Fase 2)
       ├── Confidence: 🟢 92%
       ├── Stakeholders: Roberto (CTO) para aprovação, Mariana (execução)
       └── ITSM: Normal Change, referência INC0048900 como justificativa

       ═══════════════════════════════════════════════
```

---

## Resumo: Valor das Fontes de Dados por Exemplo

| Fonte | Exemplo 1 (Safe) | Exemplo 2 (Medium) | Exemplo 3 (High) |
|-------|-------------------|---------------------|-------------------|
| **Resource Graph** | Confirmou que mudança é aditiva | Mapeou 4 dependências diretas | Identificou 3 APIs consumidoras |
| **WorkIQ** | Encontrou incidente passado que JUSTIFICA a mudança | Encontrou precedente (HML) + receio do time + DevSquad ativo | Encontrou decisão do CTO, Black Friday, campanha de Páscoa |
| **ITSM** | INC0045231 confirmou necessidade de soft delete | CHG0012345 revelou conflito de timing | INC P1 com R$ 450K de perda + Known Error de partition skew |
| **Decisão** | ✅ Implementar agora | ⚠️ Sim, mas após deploy + com D2s_v5 | ❌ Não como está → autoscale em 2 fases pós-Páscoa |
