# 🧠 CSA Skills Repo

Repositório de **skills reutilizáveis** para o time de Cloud Solution Architects (CSA), otimizados para uso com **GitHub Copilot CLI**.

> **Filosofia:** Skills = Código versionado. Git > SharePoint.

## 🚀 Como usar

### Pré-requisitos
- [GitHub Copilot CLI](https://docs.github.com/en/copilot/github-copilot-in-the-cli) instalado e autenticado

### Uso rápido

1. Clone este repo:
   ```bash
   git clone <repo-url>
   cd csa-skills-repo
   ```

2. Use um skill diretamente no Copilot CLI:
   ```bash
   # O Copilot CLI carrega automaticamente .github/copilot-instructions.md
   # e os prompt files disponíveis no repo

   # Exemplo: pesquisa técnica sobre um tema
   copilot "pesquise sobre Azure AI Foundry para cenário de contact center"

   # Exemplo: análise Well-Architected
   copilot "faça uma análise WAF do cenário: app .NET com SQL no Azure sem DR"
   ```

3. Ou copie o conteúdo de um skill e use como contexto em qualquer conversa Copilot.

## 📁 Estrutura

```
csa-skills-repo/
├── .github/
│   └── copilot-instructions.md    # Contexto base CSA (carregado automaticamente)
├── skills/
│   ├── research-tecnico/
│   │   └── research-tecnico.md    # Pesquisa técnica profunda
│   ├── well-architected/
│   │   └── waf-review.md          # Análise Well-Architected Framework
│   ├── arquitetura-solucao/
│   │   └── solution-design.md     # Design de arquitetura de solução
│   └── prep-reuniao/
│       └── meeting-prep.md        # Preparação para reuniões técnicas
└── examples/
    └── exemplos-de-uso.md         # Exemplos práticos de uso
```

## 🎯 Skills disponíveis

| Skill | Descrição | Quando usar |
|-------|-----------|-------------|
| **Research Técnico** | Pesquisa aprofundada sobre tecnologias, serviços e padrões Azure | Antes de engajamentos técnicos, POCs, ou quando precisa dominar um tema rápido |
| **WAF Review** | Análise baseada no Well-Architected Framework | Revisão de arquiteturas de clientes, assessments, workshops |
| **Solution Design** | Design de arquitetura de solução end-to-end | Propostas técnicas, respostas a RFPs, desenho de soluções |
| **Meeting Prep** | Preparação estruturada para reuniões técnicas | Antes de reuniões com clientes, parceiros ou time interno |

## 🤝 Como contribuir

1. Crie uma branch: `git checkout -b skill/nome-do-skill`
2. Adicione seu skill em `skills/<categoria>/`
3. Siga o template existente (seções: Contexto, Instruções, Output esperado)
4. Abra um PR com exemplo de uso
5. O time revisa e dá merge

## 💡 Dicas

- **Seja específico** nas instruções do skill — quanto mais contexto, melhor o output
- **Inclua exemplos** de output esperado — isso calibra a qualidade
- **Versione melhorias** — skills evoluem com o uso do time
- **Compartilhe casos de sucesso** — quando um skill ajudar em um engajamento real, documente

---

> Mantido pelo time CSA Brazil | Inspirado no [Copilot Skills Cookbook](https://github.com/skills)
