---
name: impact-profiles
description: >
  Perfis de impacto por resource type e recomendação do Azure Advisor.
  Contém downtime esperado, blast radius típico, risco padrão, e falsos positivos conhecidos.
  Usado pelo Advisor Impact Analyzer agent para classificar risco rapidamente.
metadata:
  author: fsaito
  version: "1.0"
  category: azure-advisor
---

# Impact Profiles — Quick Reference

## Lookup Table (Carregue Primeiro)

| Resource Type | Recomendação | Downtime | Risco | Rollback |
|--------------|-------------|----------|-------|----------|
| **Storage** | Soft delete | Zero | 🟢 | Desabilitar |
| **Storage** | LRS→GRS | Zero | 🟢 | LRS back |
| **Storage** | GRS→LRS | Zero | 🔴 | GRS back |
| **Storage** | Hot→Archive | Zero | 🔴 | Rehydrate (horas) |
| **Storage** | Lifecycle mgmt | Zero | 🟡 | Remover policy |
| **VM** | Right-size | ~5min restart | 🟡 | Resize back |
| **VM** | Shutdown idle | Permanente | 🟡 | Start VM |
| **VM** | Savings Plan | Zero (financeiro) | 🟢 | Não reversível |
| **Cosmos DB** | Autoscale | Zero | 🟡 | Provisioned back |
| **Cosmos DB** | Reduzir RUs | Zero | 🔴 | Aumentar RUs |
| **AKS** | Autoscaler | Zero | 🟢 | Desabilitar |
| **AKS** | K8s upgrade | Rolling (~15m) | 🔴 | Não reversível |
| **AKS** | Add PDB | Zero | 🟢 | Remover PDB |
| **SQL** | Right-size DTU | Zero (online) | 🟡 | Scale up |
| **SQL** | Geo-replication | Zero | 🟢 | Remover secondary |
| **Network** | DDoS Protection | Zero | 🟢 | Desabilitar |
| **Network** | WAF Prevention | Zero | 🔴 | Detection back |
| **Key Vault** | Purge protection | Zero | 🟢 | Não reversível |
| **App Service** | Right-size plan | Swap-based | 🟡 | Scale up |

## Falsos Positivos Mais Comuns

| Sinal do Advisor | Realidade possível | Verificação |
|-----------------|-------------------|-------------|
| "VM idle (CPU <3%)" | VM de DR/standby | Verificar tags + WorkIQ |
| "Reduzir RUs para X" | Advisor usa média, P95 é 3x maior | Verificar P95/P99 |
| "Saving: $X/mês" | Preço retail, não contratado (MCA-E) | Verificar contrato |
| "Storage idle" | Batch job mensal ou seasonal | Verificar schedule |
| "Resize para B-series" | CPU burst insuficiente | Verificar créditos |

## Regra Universal

Antes de classificar, verifique:
1. **Tags**: `criticality=high` ou `env=production` → mais cautela
2. **Sazonalidade**: Black Friday, fechamento fiscal, campanhas
3. **Contrato**: Savings Plans/RIs validados contra MCA-E
4. **ITSM**: CI criticality pode diferir da tag Azure
