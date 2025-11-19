# 🌐 BIGMIND MCP Server

<div align="center">

**Transformez Claude AI en Administrateur Réseau Cisco Intelligent**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-Compatible-green.svg)](https://modelcontextprotocol.io)
[![Cisco](https://img.shields.io/badge/Cisco-IOS-1BA0D7.svg)](https://www.cisco.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933.svg)](https://nodejs.org/)

[Installation](#-installation-rapide) •
[Documentation](#-documentation) •
[Exemples](#-exemples-concrets) •
[Roadmap](#-roadmap)

</div>

---

## 🎯 Qu'est-ce que BIGMIND ?

**BIGMIND** est un serveur MCP qui connecte **Claude AI** directement à votre infrastructure réseau Cisco. Plus besoin de SSH manuel, de commandes répétitives ou d'analyses fastidieuses - **discutez simplement avec Claude en langage naturel**.

### 💬 Avant BIGMIND
```bash
$ ssh admin@192.168.1.1
Password: ********
Router# show version
Router# show ip route
Router# show interfaces
Router# exit
# Copier/coller dans Excel
# Analyser manuellement
# Répéter pour 50 devices...
```

### ✨ Avec BIGMIND
```
Vous: "Claude, analyse la sécurité de tous mes routeurs"

Claude: [Scanne 50 devices automatiquement]
        [Analyse configurations]
        [Génère rapport complet]
        "Trouvé: 3 services Telnet actifs, 5 ACLs manquantes,
         2 mots de passe en clair. Rapport détaillé ci-dessous..."
```

---

## 🚀 Fonctionnalités Principales

<table>
<tr>
<td width="50%">

### 🤖 Intelligence Artificielle
- Commandes en **langage naturel**
- **Analyse contextuelle** des résultats
- **Recommandations** automatiques
- **Troubleshooting** guidé

</td>
<td width="50%">

### 🔌 Connectivité Native
- **SSH** direct vers équipements Cisco
- Support **devices legacy**
- Gestion **multi-devices**
- **Timeout** et reconnexion auto

</td>
</tr>
<tr>
<td width="50%">

### 🛠️ Administration Simplifiée
- **7 MCP tools** prêts à l'emploi
- **Commandes IOS** standard
- **Configuration** en JSON
- **Profils** personnalisables

</td>
<td width="50%">

### 🔒 Sécurité & Contrôle
- Credentials **locaux uniquement**
- Support **SSH keys**
- **Aucune télémétrie**
- **Audit logs** complets

</td>
</tr>
</table>

---

## 📦 Installation Rapide

### Prérequis
```bash
Node.js >= 18.0.0
Claude Desktop (dernière version)
Accès SSH à vos équipements Cisco
```

### 3 Commandes pour Démarrer
```bash
# 1. Cloner le projet
git clone https://github.com/VOTRE_USERNAME/bigmind-mcp-server.git
cd bigmind-mcp-server

# 2. Installer et compiler
npm install && npm run build

# 3. Configurer vos devices
# Éditer: config/devices-cisco.json
```

### Configuration Claude Desktop

**Fichier:** `%APPDATA%\Claude\claude_desktop_config.json`
```json
{
  "mcpServers": {
    "bigmind": {
      "command": "node",
      "args": ["C:\\chemin\\vers\\bigmind-mcp-server\\build\\index.js"]
    }
  }
}
```

**Redémarrer Claude Desktop → C'est prêt !** ✅

📚 [Guide d'installation détaillé](INSTALL.md)

---

## 💡 Exemples Concrets

### Exemple 1: Audit de Sécurité Automatique
```
👤 Vous: "Effectue un audit de sécurité complet de mon infrastructure"

🤖 Claude exécute automatiquement:
  ✓ Scan de 3 routeurs + 1 switch
  ✓ Vérification versions IOS (CVEs connues)
  ✓ Analyse configurations (services non sécurisés)
  ✓ Check ACLs et filtrage
  ✓ Détection mots de passe faibles

📊 Résultat:
  ⚠️ 2 routeurs avec Telnet activé
  ⚠️ 1 switch sans ACL sur management
  ⚠️ 3 passwords en "enable secret" niveau 5 (crackable)
  ✅ SSH configuré correctement partout
  ✅ SNMP v3 en place

📋 Recommandations:
  1. Désactiver Telnet immédiatement
  2. Implémenter ACL management (template fourni)
  3. Upgrade passwords vers level 8 minimum
```

### Exemple 2: Troubleshooting Réseau
```
👤 Vous: "Je ne peux pas joindre 10.20.0.0/16 depuis mon PC"

🤖 Claude:
  1. Identifie votre routeur de sortie
  2. Vérifie la table de routage
  3. Check statut interfaces concernées
  4. Analyse ACLs applicables
  5. Teste connectivité (si possible)

💬 "Le problème vient de l'interface Gi0/2 qui est 'administratively down'.
    La route existe vers 10.20.0.0/16 via cette interface.
    
    Solution: no shutdown sur GigabitEthernet0/2
    
    Voulez-vous que je génère la commande exacte ?"
```

### Exemple 3: Documentation Automatique
```
👤 Vous: "Génère une documentation complète de mon réseau"

🤖 Claude produit:

# 📡 Infrastructure Réseau - Documentation Technique
Généré le: 2025-11-19 14:30

## Vue d'Ensemble
- **Total devices:** 4 (3 routeurs, 1 switch)
- **Vendor:** Cisco (100%)
- **OS:** IOS 15.x (75%), NX-OS 6.x (25%)
- **Total interfaces:** 48 (32 actives)

## Topology
```
                 Internet
                    |
              [BG-RT] (Nexus 7K)
                 /     \
        [BG-FUSION]   [BG-FE01]
          Router        Switch
            |              |
        VLAN 20        VLAN 10,30
```

## Devices Détaillés

### 🔷 BG-RT (Core Router)
- **Model:** Nexus 7000
- **IOS:** NX-OS 6.2(10)
- **IP:** 172.22.21.254
- **Role:** Core routing + BGP peering
- **Interfaces:** 12 actives / 16 total
- **Protocols:** OSPF (area 0), BGP (AS 65001)
...

[Documentation complète 15 pages générée en 30 secondes]
```

📚 [Plus d'exemples](EXAMPLES.md)

---


## 🛠️ MCP Tools Disponibles

| Tool | Description | Exemple |
|------|-------------|---------|
| `list_devices` | Liste tous les devices configurés | "Montre-moi mes équipements" |
| `get_device_info` | Détails d'un device spécifique | "Info sur BG-RT" |
| `get_statistics` | Stats infrastructure globale | "Combien de routeurs j'ai ?" |
| `execute_command` | Commande CLI personnalisée | "Exécute 'show ip route' sur BG-RT" |
| `show_version` | Version IOS d'un device | "Quelle version tourne BG-FUSION ?" |
| `show_running_config` | Configuration running | "Config running de BG-FE01" |
| `show_interfaces` | Statut interfaces | "Interfaces up sur BG-RT" |

---

## 📊 Cas d'Usage

### 🏢 Entreprise
- Audit de sécurité automatisé
- Documentation infrastructure
- Troubleshooting rapide
- Change management

### 🎓 Formation
- Apprentissage Cisco IOS
- Labs pratiques guidés
- Simulation de pannes
- Analyse de configurations

### 🔬 Lab / Homelab
- Gestion infrastructure perso
- Tests et expérimentations
- Automatisation tâches
- Monitoring simplifié

---

## 🗺️ Roadmap

### ✅ v1.0.0 (Actuel - Nov 2025)
- [x] Support Cisco IOS via SSH
- [x] 7 MCP tools fonctionnels
- [x] Profile system
- [x] Legacy devices support

### 🚧 v1.1.0 (Step 2 - Déc 2025)
- [ ] LibreNMS integration (monitoring)
- [ ] Graylog integration (logs)
- [ ] Connection pooling (5x faster)
- [ ] 16 MCP tools total

### 📅 v1.2.0 (Q1 2026)
- [ ] Cisco ASA firewall support
- [ ] Automated health checks
- [ ] Alert system
- [ ] Web dashboard

### 🔮 v2.0.0 (Q2 2026)
- [ ] Multi-vendor (Juniper, Aruba, HP)
- [ ] Ansible integration
- [ ] Network topology viz
- [ ] AI troubleshooting

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Voir [CONTRIBUTING.md](CONTRIBUTING.md)

**Quick start:**
```bash
git checkout -b feature/ma-feature
npm run build
# Coder votre feature
git commit -m "feat: ajout support Juniper"
```

---

## 📄 License

Ce projet est sous licence **MIT** - voir [LICENSE](LICENSE)
```
Copyright (c) 2025 Bigmind
```

---

## 👨‍💻 Auteur

**Bigmind** - Network Administrator & AI Integration Specialist

- 🌐 GitHub: [@VOTRE_USERNAME](https://github.com/VOTRE_USERNAME)
- 📧 Email: votre.email@example.com
- 💼 Spécialité: Cisco Infrastructure + AI Automation

---

## 🙏 Remerciements

- [Anthropic](https://www.anthropic.com/) - Claude AI & MCP Protocol
- [Cisco](https://www.cisco.com/) - IOS Ecosystem
- La communauté open-source

---

## ⭐ Support

Si BIGMIND vous aide, donnez une ⭐ sur GitHub !

**Besoin d'aide ?**
- 🐛 [Ouvrir une Issue](https://github.com/VOTRE_USERNAME/bigmind-mcp-server/issues)
- 💬 [Discussions](https://github.com/VOTRE_USERNAME/bigmind-mcp-server/discussions)
- 📖 [Documentation complète](https://github.com/VOTRE_USERNAME/bigmind-mcp-server/wiki)

---

<div align="center">

**Made with ❤️ by Bigmind**

*"Bringing AI Intelligence to Network Administration"*

</div>
