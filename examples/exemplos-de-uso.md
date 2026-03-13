# 📖 Exemplos de Uso — CSA Agents Repo

Exemplos práticos de como usar os agentes no dia a dia com o GitHub Copilot CLI.

---

## 1. Research Técnico

### Cenário: Preparar-se para falar sobre AI Foundry com um cliente de varejo

```bash
# Abra o Copilot CLI dentro do repo (carrega copilot-instructions.md automaticamente)
cd csa-skills-repo

copilot "Seguindo o agente de research técnico em agents/research-tecnico/research-tecnico.md,
faça um briefing sobre Azure AI Foundry Agents para cenário de atendimento ao
cliente no varejo. Foque em: integração com Teams, custos, e limitações atuais."
```

**Resultado esperado:** Briefing estruturado com visão geral, cenários, arquitetura,
comparativo, quick start e talking points.

---

## 2. Well-Architected Review

### Cenário: Cliente financeiro pediu uma revisão de arquitetura

```bash
copilot "Seguindo o agente WAF em agents/well-architected/waf-review.md,
analise esta arquitetura:

- App web Java Spring Boot em AKS (single region, Brazil South)
- Azure SQL Database (General Purpose, sem geo-replication)  
- Autenticação com JWT próprio (não usa Entra ID)
- Sem WAF, acesso público ao AKS
- Logs apenas no stdout dos pods
- Deploy manual via kubectl
- Cliente: banco digital, regulado pelo BACEN"
```

**Resultado esperado:** Relatório WAF com gaps críticos em segurança (autenticação,
rede) e confiabilidade (single region para banco), com recomendações priorizadas.

---

## 3. Solution Design

### Cenário: Proposta para modernização de sistema legado

```bash
copilot "Seguindo o agente de solution design em agents/arquitetura-solucao/solution-design.md,
desenhe uma arquitetura para:

Cenário: Empresa de logística com sistema de rastreamento on-premises (C# .NET Framework 4.8,
SQL Server 2016, Windows Server 2012). 200 motoristas usam app mobile. Precisam de:
- Rastreamento em tempo real
- Dashboard para operação
- Integração com WhatsApp para notificações
- Budget: ~R$15k/mês em cloud
- Timeline: 6 meses para MVP"
```

**Resultado esperado:** Arquitetura com App Service ou AKS, Azure SQL, SignalR para
real-time, Communication Services ou Twilio para WhatsApp, com roadmap faseado.

---

## 4. Meeting Prep

### Cenário: Reunião de acompanhamento com cliente de saúde

```bash
copilot "Seguindo o agente de meeting prep em agents/prep-reuniao/meeting-prep.md,
prepare-me para:

Reunião amanhã 10h com Hospital Albert Einstein.
Participantes: CISO (Dr. Marcos), Head de TI (Patricia), Arquiteto (João).
É a terceira reunião. Na última, apresentamos proposta de Zero Trust com
Defender for Cloud e eles pediram mais detalhes sobre custos e impacto na
operação da equipe de TI. Eles usam VMware on-premises e estão avaliando
Azure VMware Solution vs migração nativa."
```

**Resultado esperado:** Briefing com contexto do engajamento, agenda focada em
custos e operação, talking points diferenciados para CISO vs time técnico.

---

## 💡 Dicas de uso avançado

### Combinando agentes
```bash
copilot "Primeiro faça um research técnico sobre Azure VMware Solution
(seguindo agents/research-tecnico/research-tecnico.md), e depois use esse
contexto para preparar a reunião de amanhã com o Einstein
(seguindo agents/prep-reuniao/meeting-prep.md)."
```

### Criando variações para seu contexto
```bash
# Copie um agente e adapte para sua área
cp agents/research-tecnico/research-tecnico.md agents/research-tecnico/research-security.md
# Edite para focar em security (Defender, Sentinel, Zero Trust)
```

### Usando com WorkIQ (M365 Copilot)
```bash
# Combine o agente com dados do seu M365 para contexto completo
copilot "Use o agente de meeting prep para preparar minha reunião de amanhã
com Votorantim. Busque no meu calendário e emails recentes para contexto."
```
