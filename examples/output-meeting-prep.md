# Prep: TIM — Estratégia de AI Agents (Definição de POC)
**Data:** Quinta-feira, 14h | **Duração:** 60 min (estimado) | **Formato:** Teams

---

## 👥 Participantes

| Nome | Cargo | Empresa | Nota |
|------|-------|---------|------|
| Carlos | VP de Tecnologia | TIM Brasil | 🔑 Decision maker — preocupado com custo e lock-in |
| Marina | Head de Inovação | TIM Brasil | Sponsor do projeto — foco em diferenciação competitiva |
| Ricardo | Arquiteto Líder | TIM Brasil | Influenciador técnico — validou proposta de arquitetura |
| [Você/CSA] | Cloud Solution Architect | Microsoft | Responsável técnico pelo engajamento |

> **⚠️ Validar antes da reunião:**
> - Carlos terá poder de aprovação do escopo da POC nesta reunião?
> - Marina está trazendo alguém de procurement/finance?
> - Ricardo fez alguma prova técnica interna desde a última reunião?

---

## 🎯 Objetivo da Reunião

- **Objetivo principal:** Definir o escopo da POC de AI Agents com Azure AI Foundry, endereçando concerns de custo de tokens e lock-in.
- **Sucesso =** Sair com: (1) caso de uso definido, (2) critérios de sucesso acordados, (3) timeline e responsabilidades claras, (4) concerns de custo e lock-in endereçados.

---

## 📌 Contexto

| # | Reunião | Status | Output |
|---|---------|--------|--------|
| 1 | Discovery | ✅ | Mapeamento de casos de uso e dores |
| 2 | Proposta de Arquitetura | ✅ | Arquitetura com Azure AI Foundry — bem recebida |
| 3 | **Esta reunião** | 🔄 | Fechar escopo da POC |

**Pontos em aberto:**
- Modelo de pricing e estimativa de custo para o cenário TIM
- Estratégia de mitigação de lock-in (modelos open-source como alternativa)
- Definição de qual caso de uso será pilotado na POC

---

## 📋 Agenda Sugerida

| Tempo | Tópico | Responsável | Material |
|-------|--------|-------------|----------|
| 5 min | Abertura e recap | CSA | Slide timeline |
| 10 min | Endereçar concern de custo de tokens | CSA | Planilha de estimativa / Token calculator |
| 10 min | Endereçar concern de lock-in — estratégia multi-model | CSA | Diagrama atualizado |
| 15 min | Definição do caso de uso da POC | CSA + Ricardo | Template POC scope |
| 10 min | Critérios de sucesso e timeline | CSA + Marina | Proposta timeline |
| 5 min | Modelo de engagement (recursos, acesso, governance) | CSA + Carlos | — |
| 5 min | Próximos passos | CSA | — |

---

## 🗣️ Talking Points

### Para o Decision Maker (Carlos — VP)

- **Custo controlado:** "Carlos, com Azure AI Foundry, vocês têm **Provisioned Throughput Units (PTU)** que dão previsibilidade. Para a POC, recomendamos pay-as-you-go com budget alerts para total visibilidade."
- **Lock-in mitigation:** "O **Model Catalog** suporta modelos OpenAI, Meta (Llama), Mistral e outros. O agent framework permite trocar o modelo sem reescrever a lógica. Usamos **padrões abertos como OpenAPI** para tool definitions."
- **ROI:** "Uma POC de 4-6 semanas nos dá dados reais de custo e performance — muito mais valioso que estimativas teóricas."
- **Competitividade:** "Telefónica e Claro já investem em AI Agents. A janela de diferenciação é agora."

### Para o Time Técnico (Ricardo — Arquiteto)

- **Arquitetura modular:** "Cada tool do agent é uma API. Se quiserem mover um componente, o impacto é isolado."
- **Modelos open-source:** "Podem rodar Llama 3.1 ou Phi-3 via **Models as a Service** para tasks menos críticos, reduzindo custo de tokens."
- **Observabilidade:** "Tracing nativo — cada chamada, tokens consumidos, latência por step."
- **SDK portável:** "SDKs open-source (Python/JS), protocolo REST/OpenAPI. Não é SDK proprietário."

### Perguntas de Descoberta

- "Qual caso de uso mais impactante para validar primeiro — atendimento, operações de rede, ou suporte interno?"
- "Vocês já têm knowledge base estruturada (docs, FAQs, runbooks) para grounding?"
- "Volume estimado de interações/dia em produção?"
- "Restrições LGPD que impactem onde dados podem ser processados?"
- "Quem seria o dono técnico da POC do lado da TIM?"
- "Têm ambiente de dev na Azure hoje?"

---

## ⚠️ Pontos de Atenção

| Tema | Risco | Mitigação |
|------|-------|-----------|
| **Custo de tokens** | Carlos pode querer cap fixo. Pay-as-you-go gera incerteza. | Estimativa low/mid/high. Mencionar PTU. Budget alerts na POC. |
| **Lock-in** | Concorrentes (AWS Bedrock, Google Vertex) alimentam o argumento. | Model Catalog multi-provider. Padrões abertos. Teste com modelo OSS na POC. |
| **Escopo da POC** | "Quero testar tudo" ou "isso não prova nada". | Template pré-preenchido. 1 caso de uso, max 2. Critérios mensuráveis. |
| **Concorrência** | AWS e Google falando com a TIM. | Maturidade Azure OpenAI, compliance LGPD, integração com stack Microsoft. |
| **Timeline** | Se não fechar nesta reunião, momentum se perde. | Timeline concreta: 1 sem setup, 3-4 sem dev, 1 sem avaliação. |
| **LGPD** | Telco = dados sensíveis de clientes. | Azure OpenAI em Brazil South. Política de data processing da Azure. |

---

## ✅ Ações Pré-Reunião

- [ ] Preparar **estimativa de custo de tokens** (3 cenários: conservador, moderado, agressivo)
- [ ] Atualizar **diagrama de arquitetura** destacando portabilidade e modelos alternativos
- [ ] Preparar **template de POC Scope** pré-preenchido
- [ ] Preparar **slide de timeline** da POC
- [ ] Revisar **Azure AI Foundry pricing page** (números atualizados)
- [ ] Verificar **Azure OpenAI em Brazil South** — quais modelos GA
- [ ] Buscar **case studies de telco** (Telefónica, AT&T) para referenciar
- [ ] Testar link do Teams e compartilhamento de tela
- [ ] Alinhar com Account Executive da TIM sobre status comercial

---

## 📎 Materiais de Apoio

| Material | Link |
|----------|------|
| Azure AI Foundry — Visão Geral | https://learn.microsoft.com/azure/ai-studio/what-is-ai-studio |
| Azure AI Agent Service | https://learn.microsoft.com/azure/ai-services/agents/overview |
| Model Catalog | https://learn.microsoft.com/azure/ai-studio/how-to/model-catalog-overview |
| Azure OpenAI Pricing | https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/ |
| PTU (Provisioned Throughput) | https://learn.microsoft.com/azure/ai-services/openai/concepts/provisioned-throughput |
| Data Privacy | https://learn.microsoft.com/legal/cognitive-services/openai/data-privacy |

---

> **💡 Dica:** O objetivo #1 é **sair com escopo da POC fechado e "sim" do Carlos**. Se custo e lock-in não forem endereçados nos primeiros 20 min, o restante trava. Lidere com esses temas.
