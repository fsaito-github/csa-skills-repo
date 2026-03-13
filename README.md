# 🧠 CSA Agents Repo

Repositório de **agentes reutilizáveis** para o time de Cloud Solution Architects (CSA), otimizados para uso com **GitHub Copilot CLI**.

> **Filosofia:** Agents = Código versionado. Git > SharePoint.

## Conceitos

| Conceito | O que é | Neste repo |
|----------|---------|------------|
| **Agent** | Persona autônoma com instruções, regras e output estruturado | Cada `.md` em `agents/` define um agente |
| **Skill** | Capacidade/ferramenta individual que um agente *usa* | Web search, file read, API calls, etc. |

Cada agente é um arquivo `.md` que define **quem ele é**, **como se comporta**, e **que output produz**. As skills são as ferramentas que o Copilot CLI já possui nativamente.

## 🚀 Como usar

### Pré-requisitos
- [GitHub Copilot CLI](https://docs.github.com/en/copilot/github-copilot-in-the-cli) instalado e autenticado

### Uso rápido

1. Clone este repo:
   ```bash
   git clone <repo-url>
   cd csa-skills-repo
   ```

2. Use um agente diretamente no Copilot CLI:
   ```bash
   # O Copilot CLI carrega automaticamente .github/copilot-instructions.md
   # e os prompt files disponíveis no repo

   # Exemplo: agente de pesquisa técnica
   copilot "pesquise sobre Azure AI Foundry para cenário de contact center"

   # Exemplo: agente de análise Well-Architected
   copilot "faça uma análise WAF do cenário: app .NET com SQL no Azure sem DR"
   ```

3. Ou copie o conteúdo de um agente e use como contexto em qualquer conversa Copilot.

## 📁 Estrutura

```
csa-skills-repo/
├── .github/
│   └── copilot-instructions.md       # Contexto base CSA (carregado automaticamente)
├── agents/
│   ├── research-tecnico/
│   │   └── research-tecnico.md       # Agente de pesquisa técnica profunda
│   ├── well-architected/
│   │   └── waf-review.md             # Agente de análise Well-Architected Framework
│   ├── arquitetura-solucao/
│   │   └── solution-design.md        # Agente de design de arquitetura
│   └── prep-reuniao/
│       └── meeting-prep.md           # Agente de preparação para reuniões
└── examples/
    ├── exemplos-de-uso.md            # Como usar cada agente
    └── output-*.md                   # Outputs reais gerados pelos agentes
```

## 🎯 Agentes disponíveis

| Agente | Descrição | Quando usar |
|--------|-----------|-------------|
| **Research Técnico** | Pesquisa aprofundada sobre tecnologias, serviços e padrões Azure | Antes de engajamentos técnicos, POCs, ou quando precisa dominar um tema rápido |
| **WAF Review** | Análise baseada no Well-Architected Framework | Revisão de arquiteturas de clientes, assessments, workshops |
| **Solution Design** | Design de arquitetura de solução end-to-end | Propostas técnicas, respostas a RFPs, desenho de soluções |
| **Meeting Prep** | Preparação estruturada para reuniões técnicas | Antes de reuniões com clientes, parceiros ou time interno |

## 🤝 Como contribuir

1. Crie uma branch: `git checkout -b agent/nome-do-agente`
2. Adicione seu agente em `agents/<categoria>/`
3. Siga o template existente (seções: Contexto, Instruções, Output esperado)
4. Abra um PR com exemplo de output gerado
5. O time revisa e dá merge

## 💡 Dicas

- **Seja específico** nas instruções do agente — quanto mais contexto, melhor o output
- **Inclua exemplos** de output esperado — isso calibra a qualidade
- **Versione melhorias** — agentes evoluem com o uso do time
- **Compartilhe casos de sucesso** — quando um agente ajudar em um engajamento real, documente

---

> Mantido pelo time CSA Brazil | Inspirado no [Copilot Skills Cookbook](https://github.com/skills)
