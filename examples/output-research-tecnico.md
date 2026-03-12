# Briefing Técnico: Azure AI Foundry Agents para Contact Center Inteligente

## 1. Visão Geral

**Azure AI Foundry Agent Service** é a plataforma da Microsoft para construir, orquestrar e executar agentes de IA em escala enterprise. Diferente de chatbots tradicionais, os agentes são sistemas proativos capazes de raciocinar, planejar, buscar conhecimento em vector stores, executar ações (chamadas a APIs, atualização de CRM, criação de tickets) e orquestrar workflows multi-agente com contexto compartilhado.

- **Posicionamento no portfólio:** Componente central do Azure AI Foundry (anteriormente Azure AI Studio), parte da stack Azure AI + OpenAI. Complementa o Copilot Studio (low-code) e utiliza Semantic Kernel como camada de orquestração.
- **Status:** ✅ **GA** — disponibilidade geral anunciada no Microsoft Build 2025, com SLA para produção. Hosted Agents (deploy de código custom em containers gerenciados) permanece em **Preview**.

> 📖 Ref: [What is Foundry Agent Service?](https://learn.microsoft.com/en-us/azure/foundry/agents/overview)

---

## 2. Cenários de Uso

### ✅ Top 3 cenários recomendados para Contact Center

| # | Cenário | Descrição |
|---|---------|-----------|
| 1 | **Atendimento automatizado inteligente (Tier 0/1)** | Agente resolve autonomamente dúvidas frequentes, consultas de status de pedido, reset de senha, emissão de 2ª via — com acesso a knowledge base via RAG e ações em sistemas backend |
| 2 | **Assistente do operador humano (Copilot do agente)** | Agente atua como copiloto do atendente, sugerindo respostas, resumindo histórico, buscando políticas internas e preenchendo formulários automaticamente durante a chamada |
| 3 | **Análise pós-atendimento e quality assurance** | Agente processa transcrições de chamadas para extrair sentiment analysis, compliance check, resumos automáticos e insights de melhoria operacional |

### 🏭 Verticals com maior aderência
- **Financial Services** — atendimento regulado com compliance LGPD/BACEN
- **Telecom** — alto volume, resolução de problemas técnicos repetitivos
- **Varejo/E-commerce** — tracking de pedidos, trocas, devoluções
- **Healthcare** — triagem inicial, agendamento, FAQs de planos de saúde

### ⛔ Anti-patterns (onde NÃO usar)
- **Cenários simples de FAQ estático** → Copilot Studio ou Azure AI Search + Bot Framework são mais custo-eficientes
- **Workloads que exigem latência sub-100ms garantida** → modelos LLM têm latência variável; avaliar cuidadosamente para IVR síncrono
- **Substituição completa de agentes humanos em temas sensíveis** → agentes devem escalar para humanos em situações de risco legal/emocional
- **Dados altamente confidenciais sem estratégia de data residency** → verificar suporte regional e opção BYO (bring your own resources)

---

## 3. Arquitetura & Componentes

### Componentes principais

| Componente | Função |
|------------|--------|
| **Foundry Project** | Recurso unificado que consolida Cognitive Services, modelos e ferramentas sob uma única API |
| **Agent Runtime** | Executa o agente com gerenciamento de threads, mensagens e runs |
| **Model Deployment** | GPT-4o, GPT-4o-mini, o-series, ou modelos third-party deployados via Foundry |
| **Tools** | File Search (RAG), Code Interpreter, Bing Custom Search, Azure Functions, OpenAPI actions |
| **Knowledge Store** | Azure AI Search como vector store para retrieval-augmented generation |
| **Orquestrador** | Semantic Kernel / LangGraph para multi-agent orchestration |
| **Azure Speech Service** | Speech-to-text e text-to-speech para canal de voz |
| **Azure Communication Services** | Telephony, chat, SMS — canais de comunicação omnichannel |

### Integrações nativas
- **Microsoft Entra ID** — identidade e RBAC para agentes e usuários
- **Azure Logic Apps** — 1.400+ conectores para integração com CRM, ERP, ticketing
- **Microsoft Fabric** — analytics sobre dados de atendimento
- **Microsoft Teams** — deploy one-click de agentes como app no Teams
- **Azure Monitor / Application Insights** — observabilidade e tracing de conversas
- **Microsoft Purview** — governance e compliance de dados

### Diagrama de arquitetura (texto)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CANAIS DE ENTRADA                            │
│  [Web Chat]  [Teams]  [Telefone/IVR]  [WhatsApp*]  [Mobile App]    │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│                 AZURE COMMUNICATION SERVICES                         │
│            (Roteamento, Telephony, Chat SDK)                         │
└──────────────────────────┬───────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│              AZURE AI FOUNDRY AGENT SERVICE                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐       │
│  │ Agent Router  │  │ Agent Tier 1 │  │ Agent Copilot do     │       │
│  │ (Triagem +   │──▶ (Resolve     │  │ Operador (assiste    │       │
│  │  Intent)     │  │  autônomo)   │  │  atendente humano)   │       │
│  └──────────────┘  └──────┬───────┘  └──────────────────────┘       │
│         │                 │                     │                     │
│         ▼                 ▼                     ▼                     │
│  ┌─────────────────────────────────────────────────────────┐         │
│  │                    TOOLS & KNOWLEDGE                     │         │
│  │  [File Search/RAG]  [Code Interpreter]  [API Actions]   │         │
│  │  [Azure AI Search]  [Bing Search]       [Logic Apps]    │         │
│  └─────────────────────────────────────────────────────────┘         │
└──────────────────────────┬───────────────────────────────────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
     ┌──────────────┐ ┌────────┐ ┌──────────────┐
     │  CRM/ERP     │ │Ticketing│ │ Knowledge    │
     │  (Dynamics,  │ │(Service │ │ Base (SharePt,│
     │   Salesforce) │ │ Now)   │ │  Confluence) │
     └──────────────┘ └────────┘ └──────────────┘
```

> *WhatsApp via Azure Communication Services Advanced Messaging (Preview)

---

## 4. Considerações Importantes

### ⚠️ Limitações conhecidas e workarounds

| Limitação | Detalhe | Workaround |
|-----------|---------|------------|
| **File Search não disponível em Brazil South** | Ferramenta de busca em arquivos não suportada em todas as regiões | Utilizar East US 2 ou Sweden Central para o Foundry Project |
| **Hosted Agents em Preview** | Deploy de código custom em containers gerenciados ainda não é GA | Usar Azure Functions ou Container Apps como alternativa |
| **Limite de 10.000 arquivos por agent/thread** | Pode ser restritivo para knowledge bases muito grandes | Particionar por domínio/tema; usar Azure AI Search externo |
| **Tamanho máximo de arquivo: 512 MB** | Arquivos individuais não podem exceder esse limite | Pré-processar e dividir documentos grandes |
| **Latência variável de LLM** | Tempo de resposta depende do modelo, tamanho do prompt e carga | Implementar streaming e UX de "digitando..." |

### 💰 Aspectos de custo

| Componente | Modelo de Pricing | Estimativa de referência |
|------------|-------------------|--------------------------|
| **Tokens (GPT-4o)** | Pay-as-you-go por 1M tokens | ~$2.50 input / ~$10.00 output por 1M tokens |
| **Tokens (GPT-4o-mini)** | Pay-as-you-go | ~$0.15 input / ~$0.60 output por 1M tokens |
| **File Search** | Por GB/dia de armazenamento vetorial | ~$0.10/GB/dia |
| **Code Interpreter** | Por sessão | ~$0.03/sessão |
| **Azure AI Search** | Tier-based | A partir de ~$75/mês (Basic) |
| **Azure Speech** | Por hora de áudio | ~$1.00/hora (STT Standard) |

> 💡 Para alto volume, avaliar **Provisioned Throughput Units (PTU)** para previsibilidade de custo.

---

## 5. Comparativo

| Critério | **Foundry Agent Service** | **Copilot Studio** | **Semantic Kernel (OSS)** |
|----------|--------------------------|--------------------|-----------------------|
| **Público** | Devs / Arquitetos | Business users | Devs avançados |
| **Complexidade** | Alta (multi-agent, custom tools) | Baixa-Média | Alta (orquestração custom) |
| **Customização** | Total (code-first) | Limitada (low-code) | Total (SDK) |
| **Multi-agent** | ✅ Nativo (GA) | ✅ Básico (Preview) | ✅ Nativo |
| **RAG** | AI Search + File Search | SharePoint (limitado) | Custom |
| **Voice** | Azure Speech + ACS | Omnichannel D365 | Custom |
| **Pricing** | Pay-per-token + tools | Per-user/month | Gratuito + infra |
| **Recomendação** | ⭐ **Contact center complexo** | Pilotos simples | Orquestração complementar |

---

## 6. Quick Start

### 🚀 POC mínima — Contact Center Agent

```python
import os
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

client = AIProjectClient(
    endpoint=os.getenv("PROJECT_ENDPOINT"),
    credential=DefaultAzureCredential()
)

agent = client.agents.create_agent(
    model=os.getenv("MODEL_DEPLOYMENT_NAME"),
    name="agente-contact-center",
    instructions="""Você é um agente de atendimento ao cliente.
    Seja cordial, objetivo e resolva o problema do cliente.
    Se não souber, escale para um atendente humano.
    Responda em português brasileiro."""
)

thread = client.agents.create_thread()
client.agents.create_message(
    thread_id=thread.id, role="user",
    content="Qual o status do meu pedido #12345?"
)
run = client.agents.create_and_process_run(
    thread_id=thread.id, agent_id=agent.id
)
```

### 📚 Recursos
- [Workshop: Build Your First Agent](https://microsoft.github.io/build-your-first-agent-with-azure-ai-agent-service-workshop/)
- [Foundry Samples](https://github.com/microsoft-foundry/foundry-samples)
- [Python SDK Reference](https://learn.microsoft.com/en-us/python/api/overview/azure/ai-agents-readme)

---

## 7. Talking Points para o Cliente

### 🎯 Para o Decision Maker
1. **Redução de custo:** Agentes resolvem 40-60% das interações Tier 0/1 autonomamente
2. **Time-to-value:** POC funcional em 2-3 semanas, produção em 2-3 meses
3. **Compliance enterprise-ready:** SLA 99.9%, Purview, content filtering, LGPD/GDPR

### 🔧 Para o Time de Engenharia
1. **Code-first:** SDK Python/.NET com Semantic Kernel — total controle
2. **Multi-agent nativo:** Orquestração de agentes especializados sem infra adicional
3. **Observabilidade built-in:** Tracing, dashboards de custo/safety, Application Insights

### ❓ Perguntas de descoberta
- Qual o volume mensal de atendimentos e % por canal?
- Quais os top 10 motivos de contato?
- Já utilizam Dynamics 365 ou outro CRM?
- Requisitos regulatórios (BACEN, ANS, LGPD)?
- Prioridade: voz ou chat/digital?
