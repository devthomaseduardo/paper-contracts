# 📄 Paper-Contracts Premium v3.0

O **Paper-Contracts** é uma suíte editorial de alta performance focada na geração de documentos corporativos, contratos e materiais de recrutamento (Currículos e Cartas de Apresentação) para profissionais da área de tecnologia e consultoria.

Afastando-se de interfaces engessadas ou designs genéricos ("estilo IA"), o projeto adota uma **Estética Minimalista Suíça**, utilizando linhas finas, contrastes precisos, fundos limpos e uma tipografia altamente refinada. O objetivo é garantir que cada PDF gerado transmita extrema autoridade, organização e sofisticação B2B.

---

## ✨ Principais Funcionalidades

### 1. Typography Engine (Motor de Tipografia Global)
Uma mecânica que permite alternar a "alma" visual de todo o documento com um único clique, modificando a forma como recrutadores e clientes percebem a sua marca pessoal:
- **MODERNO SANS** (Outfit): Limpo, tecnológico, ágil. Ideal para tech leads e UX designers.
- **EDITORIAL SERIF** (Lora): Sofisticado, elegante, tradicional. Perfeito para consultorias e documentos jurídicos.
- **TÉCNICO MONO** (JetBrains Mono): Cru, exato, programático. Focado em engenheiros de software e arquitetos de dados.

### 2. Recruiter Scanability (Otimização para ATS)
Os currículos não são apenas bonitos, mas projetados para conversão. Um algoritmo inteligente embutido no cabeçalho mede a "Escaneabilidade" (ATS Score) do documento em tempo real, avaliando a profundidade das seções de Experiência, Projetos e Habilidades para garantir que seu CV passe pelas triagens automatizadas.

### 3. Smart Document Workflow (Fluxo Dinâmico B2B)
Gestão do ciclo de vida de um documento através de uma *timeline* conectada:
- **Rascunho**: Recebe marcas d'água sutis e diagonais indicando que é um arquivo temporário.
- **Sob Revisão**: Sinalizado com selos amarelos (estilo carimbo técnico).
- **Documento Pronto**: O documento assume sua forma oficial e imaculada.
- **Liquidado / Pago**: Carimbos verdes de validação final para faturas e propostas aprovadas.

### 4. Quick Actions Formatting (Inserção Rápida de Símbolos)
Painel inteligente integrado aos campos de texto longos que permite aos usuários inserir símbolos tipográficos complexos (•, →, ✓, ★, —) com um clique, aplicando-os exatamente onde o cursor está posicionado, otimizando a formatação de listas de habilidades e arquiteturas de projetos.

---

## 🏛️ Biblioteca de Templates

A suíte possui um arsenal de templates B2B prontos para uso:

1. **Currículo Vitae (Elite Standard):** Focado na progressão de carreira com seções dedicadas para Resumo, Skills, Experiências e um bloco exclusivo para *Projetos em Destaque*.
2. **Carta de Apresentação Estratégica:** Design *clean* voltado para o Foco Estratégico e Chamada para Ação (CTA).
3. **Proposta Comercial:** Layout rigoroso B2B com grades de preços e tabela de escopo estruturada.
4. **Fatura de Serviços / Invoice:** Emissão de nota com cobrança unificada e Bloco de Pagamento PIX com geração automática de QR Code.
5. **Contrato de Prestação de Serviços & NDA:** Documentos densos formatados para máxima legibilidade jurídica (Single-column, 11.5pt).

---

## 💻 Arquitetura Técnica

O projeto é construído como uma SPA (Single Page Application) focada no cliente, garantindo privacidade e processamento local.

- **Framework:** React + Vite
- **Styling:** Tailwind CSS (configurado com paletas exclusivas B2B, como `midnight`, `azure` e `slate` refinados).
- **Export Engine:** Gerador de PDF nativo via HTML-to-PDF (`html2pdf.js`), garantindo fidelidade de pixel (Pixel-perfect) em folhas A4 (`210mm x 297mm`).
- **State Management:** Controle de estados dinâmicos unificado e persistência de dados em cache (`localStorage`) para que você não perca seu rascunho ao fechar o navegador.

---

## 🚀 Como Rodar o Projeto

1. **Clone o Repositório:**
   ```bash
   git clone https://github.com/seu-usuario/paper-contracts.git
   cd paper-contracts/frontend
   ```

2. **Instale as Dependências:**
   ```bash
   npm install
   ```

3. **Inicie o Servidor de Desenvolvimento:**
   ```bash
   npm run dev
   ```

O projeto rodará localmente na porta definida pelo Vite. Todo o processamento é local (não há banco de dados externo acoplado neste estágio).

---

## 🎯 Filosofia do Produto (UX/UI)
O *Paper-Contracts* defende a ideia de que o "menos é melhor resolvido". Nós descartamos ícones coloridos genéricos, pop-ups irritantes e layouts em formato "mosaico". Ao emular a experiência de estar lidando com um papel timbrado em cima de uma mesa de escritório preta à meia-noite, a aplicação eleva o estado de espírito do usuário para focar unicamente no que importa: **O peso e o impacto do seu conteúdo**.

---
*Developed by Thomas Eduardo @devthomas*
