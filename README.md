<p align="center">
  <img src="https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js 22"/>
  <img src="https://img.shields.io/badge/Fastify-4.x-000000?style=for-the-badge&logo=fastify&logoColor=white" alt="Fastify"/>
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis"/>
  <img src="https://img.shields.io/badge/JWT_ES256-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT ES256"/>
  <img src="https://img.shields.io/badge/Argon2-0052CC?style=for-the-badge&logo=lock&logoColor=white" alt="Argon2"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="MIT License"/>
</p>

<h1 align="center">🚀 Enterprise URL Shortener</h1>

<p align="center">
  <strong>Plataforma de Encurtamento de URLs de Alto Desempenho com Clean Architecture, Segurança Zero-Trust e Threat Intelligence</strong>
</p>

<p align="center">
  <em>Hash Base62 O(1) · Cache-Aside (Redis) · Algoritmo ES256 & Cookies HttpOnly · Safe Browsing</em>
</p>

---

## 📋 Sumário

- [Sobre o Projeto](#-sobre-o-projeto)
- [Features](#-features)
- [Segurança](#-segurança)
- [Arquitetura](#-arquitetura)
- [API Endpoints](#-api-endpoints)
- [Stack Tecnológica](#-stack-tecnológica)
- [Autor](#-autor)

---

## 💡 Sobre o Projeto

O **Enterprise URL Shortener** é um sistema backend construído em **Node.js (Fastify) e TypeScript**, desenhado para escala massiva e segurança de nível militar.

Foi projetado utilizando **Clean Architecture (Hexagonal)**, permitindo total desacoplamento entre regras de negócio, banco de dados (Sequelize) e interfaces web. Ele é capaz de processar milhares de redirecionamentos por segundo usando um padrão de **Cache-Aside com Redis** e algoritmos matemáticos nativos (`crypto.randomBytes`) com conversão para Base62.

---

## ✨ Features

- ⚡ **Alta Performance** — Encurtamento ultrarrápido com gerador nativo em C++ e Base62 O(1).
- 🛡️ **Threat Intelligence** — Provedor de Safe Browsing com Blacklists locais e detecção de XSS/Phishing.
- 🍪 **Cookies Seguros** — Transição do JWT ES256 via HttpOnly, Secure e SameSite=Strict (Zero-Trust).
- 🔐 **Argon2** — Hashing de senhas otimizado em memória/tempo (resistente a GPUs).
- 📦 **Redis Cache-Aside** — Mitigação de DDoS e lentidão de I/O em URLs virais.
- ✅ **Prevenção de Race Conditions** — Tratamento de colisões no banco de dados, dobrando o throughput de INSERT.
- 📖 **Swagger OpenAPI 3.0** — Documentação interativa nativa suportando `cookieAuth`.

---

## 🛡 Segurança

### Modelo de Autenticação (Zero-Trust)

A API adota a abordagem Zero-Trust e recusa Headers `Authorization`. O JWT é assinado usando a curva elíptica ECDSA P-256 (`ES256`), e transacionado exclusivamente por Cookies `HttpOnly`.

### Flags de Segurança do Cookie

| Flag | Valor | Proteção |
|------|-------|----------|
| `HttpOnly` | `true` | Impede acesso via JavaScript (proteção contra **XSS**) |
| `Secure` | `true` | Cookie enviado apenas sobre **HTTPS** (Em produção) |
| `SameSite` | `Strict` | Impede envio em requisições cross-site (proteção contra **CSRF**) |
| `Path` | `/` | Disponível em todos os endpoints |

---

## 🏗 Arquitetura

O projeto segue Clean Architecture com separação rigorosa de limites:

| Camada | Pacote | Responsabilidade |
|--------|--------|------------------|
| **Apresentação** | `presentation` | Controladores, Adapters para Fastify e Validações Zod |
| **Infraestrutura** | `infra` | PostgreSQL (Sequelize), Redis, Argon2, ES256 |
| **Casos de Uso** | `domain/usecases` | Orquestração da lógica de negócio |
| **Entidades** | `domain/entities` | Regras puras e Factory Models |
| **Protocolos** | `domain/protocols` | Interfaces invertidas de Repositórios e Providers (Inversão de Dependência) |

---

## 🌐 API Endpoints

A documentação interativa oficial roda na rota local via Swagger: `http://localhost:8080/docs`

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|:------------:|-----------|
| `POST` | `/urls` | ✅ Cookie ES256 | Encurta uma nova URL (Passa pela proteção Safe Browsing) |
| `GET` | `/urls/me` | ✅ Cookie ES256 | Lista todas as URLs do usuário logado (Paginado) |
| `GET` | `/:short_url` | ❌ Pública | Redireciona e computa a visualização via Cache (Redis -> Postgre) |
| `POST` | `/login` | ❌ Pública | Autentica o usuário e retorna Cookie de Sessão |

---

## 🛠 Stack Tecnológica

| Tecnologia | Propósito |
|------------|-----------|
| **Node.js + Fastify** | Servidor de altíssima velocidade e processamento I/O assíncrono |
| **TypeScript** | Segurança de tipos em tempo de compilação |
| **PostgreSQL** | Persistência relacional transacional |
| **Redis** | Cache de memória ultra-rápida (Cache-Aside pattern) |
| **Argon2** | Derivação de chaves para senhas robustas |
| **Zod** | Validação de Schema |
| **Swagger-UI (OpenAPI 3)**| Documentação de API RESTful acoplada com injeção de Cookies |

---

## 👤 Autor

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/devrafaelsoares">
        <img src="https://github.com/devrafaelsoares.png" width="100px;" alt="Rafael Soares"/><br />
        <sub><b>Rafael Soares</b></sub>
      </a>
    </td>
  </tr>
</table>
