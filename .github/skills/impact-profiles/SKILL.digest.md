---
name: impact-profiles
tier: digest
---

# Impact Profiles (Digest)

| Resource | Rec | Risk | Downtime |
|----------|-----|------|----------|
| Storage soft-del | 🟢 | 0 | Storage GRS→LRS | 🔴 | 0 |
| VM right-size | 🟡 | ~5m | VM idle shutdown | 🟡 | perm |
| Cosmos reduce RU | 🔴 | 0 | Cosmos autoscale | 🟡 | 0 |
| AKS K8s upgrade | 🔴 | ~15m | AKS autoscaler | 🟢 | 0 |
| SQL right-size | 🟡 | 0 | WAF prevention | 🔴 | 0 |

**False positives:** Advisor uses avg (check P95), retail price (check MCA-E), no seasonal awareness.
