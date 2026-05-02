# 📄 Paper-Contracts: Forensic Document Engine
> **A fusão definitiva entre Design Editorial de Luxo, Inteligência Artificial Semântica e Segurança Forense.**

[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://paper-contracts.vercel.app/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)](https://cloud.google.com/)

---

## 🏛️ O Conceito
O **Paper-Contracts** não é apenas um gerador de documentos. É um **Motor Editorial** desenvolvido para profissionais de elite que entendem que a autoridade de um contrato ou currículo começa na sua estética. Abandonamos o design "clichê de IA" em favor de uma experiência **Artesanal Digital**, inspirada na tipografia suíça e no minimalismo de luxo.

## ✨ Novidades da v4.0 (Editorial Edition)

### 1. 🧠 ATS Analyzer (Google Vertex AI)
Integração nativa com o SDK oficial da **Google Cloud Vertex AI**. O sistema realiza uma análise semântica profunda do seu currículo, simulando o comportamento de recrutadores e algoritmos de triagem (ATS), gerando um dossiê tático de melhorias.

### 2. 🔐 Autenticação Multi-Camada (Firebase)
Sistema de login robusto e seguro via **Firebase Auth**, suportando:
- **Google OAuth**: Acesso instantâneo e seguro.
- **GitHub Auth**: Integração direta para o público tech.
- **E-mail/Senha**: Gerenciamento de credenciais clássico com criptografia de ponta.

### 3. 🎨 Design Editorial "Dark Mode"
Uma interface imersiva que utiliza:
- **Texturas Reais**: Imagens macro de papel e tinta digital que trazem alma ao sistema.
- **Tipografia Forense**: Combinação de fontes serifadas clássicas e sans-serif tecnológicas.
- **Responsividade Total**: O Modo de Visualização (Preview) foi otimizado para escalas dinâmicas em qualquer dispositivo.

### 4. 🛡️ Segurança & Privacidade
- **Zero-Knowledge Architecture**: Seus dados são processados localmente ou via tokens efêmeros.
- **Authorized Domains**: Proteção contra acessos não autorizados via domínios configurados no console.

---

## 🛠️ Stack Tecnológica

- **Frontend:** React 19 + Vite (SPA de alta performance).
- **Backend:** Node.js (Express) preparado para escalabilidade.
- **IA:** Google Vertex AI (Gemini 1.5 Pro).
- **Auth/Hosting:** Firebase & Vercel.
- **Design:** Vanilla CSS + Lucide Icons + Editorial Assets.

---

## 🚀 Como Rodar o Projeto

Este projeto utiliza **npm workspaces** para gerenciar o Frontend e o Backend simultaneamente.

### 1. Pré-requisitos
- Node.js v18+
- Google Cloud SDK (para autenticação Vertex AI via ADC)

### 2. Configuração
```bash
# Clone o projeto
git clone https://github.com/seu-usuario/paper-contracts.git
cd paper-contracts

# Instale todas as dependências (Raiz, Frontend e Backend)
npm install
```

### 3. Execução
```bash
# Inicie ambos os serviços (Vite + Node) simultaneamente
npm run dev
```

O sistema estará disponível em `http://localhost:3000`.

---

## 📂 Estrutura de Arquivos
```text
.
├── backend/          # Motor de análise (Node.js + Vertex AI)
├── frontend/         # Interface Editorial (React + Firebase)
│   ├── public/       # Assets e Imagens Premium
│   └── src/
│       ├── components/  # Tecnologia, Segurança, Empresas, etc.
│       └── firebase.js  # Configuração de Auth & Cloud
└── package.json      # Configuração de Workspaces
```

---

## 🎯 Filosofia "Less, but Better"
No *Paper-Contracts*, cada pixel tem um propósito. Removemos barras de progresso invasivas e grids genéricos para focar na **legibilidade e no impacto**. É a ferramenta definitiva para quem não aceita o mediano.

---
*Developed with excellence by Thomas Eduardo & Antigravity AI*
