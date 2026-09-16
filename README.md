# Sistema de Denúncias Anônimas

Sistema Web de Denúncias Anônimas desenvolvido como **protótipo acadêmico** utilizando HTML5, CSS3 e JavaScript puro.

O projeto possui dois contextos principais de acesso:

- **Usuário / Denunciante:** registra uma denúncia e acompanha seu andamento.
- **Administrador da Delegacia:** gerencia denúncias e agentes de acordo com o perfil de acesso.

---

## 🌐 Acesso online

GitHub Pages:

**https://marcellegg.github.io/sistema-denuncias-anonimas/**

---

## 🎯 Objetivo

Disponibilizar uma interface web simples, responsiva e organizada para:

1. Registrar denúncias.
2. Gerar protocolo e código de acesso.
3. Permitir o acompanhamento da denúncia.
4. Gerenciar denúncias em uma área administrativa.
5. Organizar diferentes níveis de permissão.
6. Manter histórico das alterações realizadas.

---

## 🛠️ Tecnologias utilizadas

- **HTML5** — estrutura das páginas.
- **CSS3** — estilos, layout e responsividade.
- **JavaScript** — validações, regras de negócio e interação.
- **LocalStorage** — armazenamento das denúncias e agentes no protótipo.
- **SessionStorage** — controle da sessão administrativa.
- **GitHub Pages** — publicação do sistema.

Não foram utilizados frameworks ou bibliotecas JavaScript para a implementação principal.

---

## 📁 Estrutura do projeto

```text
sistema-denuncias-anonimas/
│
├── inicio.html
├── index.html
├── consulta.html
├── admin.html
├── dashboard.html
├── agentes.html
├── README.md
│
├── css/
│   └── style.css
│
└── js/
    └── app.js
```

### Descrição dos arquivos

| Arquivo | Função |
|---|---|
| `inicio.html` | Página inicial institucional |
| `index.html` | Formulário de registro da denúncia |
| `consulta.html` | Consulta e acompanhamento da denúncia |
| `admin.html` | Login da área administrativa |
| `dashboard.html` | Dashboard e gerenciamento das denúncias |
| `agentes.html` | Cadastro e gerenciamento de agentes |
| `css/style.css` | Estilos e responsividade |
| `js/app.js` | Lógica, validações e funcionalidades |
| `README.md` | Documentação do projeto |

---

# 👤 Perfil Usuário / Denunciante

O denunciante pode:

- Acessar a página inicial.
- Registrar uma denúncia.
- Selecionar categoria e subcategoria.
- Informar a data da ocorrência.
- Definir o nível de urgência.
- Informar o local do fato.
- Descrever a ocorrência.
- Receber um **protocolo**.
- Receber um **código de acesso**.
- Consultar o andamento da denúncia.
- Visualizar o status atual.
- Visualizar o histórico das atualizações.

### Categorias disponíveis

- Furto ou roubo
- Tráfico de drogas
- Violência doméstica
- Perturbação do sossego
- Vandalismo
- Corrupção
- Outra ocorrência

---

# 🔐 Perfil Administrador da Delegacia

O sistema possui três perfis administrativos com permissões diferentes.

## Administrador Geral

**Usuário:** `admin`  
**Senha:** `delegacia123`

Permissões:

- Visualizar denúncias.
- Consultar detalhes.
- Atualizar status.
- Registrar observações.
- Arquivar denúncias.
- Cadastrar agentes.
- Excluir agentes.
- Exportar os registros para JSON.

## Agente Analista

**Usuário:** `analista`  
**Senha:** `analista123`

Permissões:

- Visualizar denúncias.
- Consultar detalhes.
- Atualizar status.
- Registrar observações.
- Exportar os registros para JSON.

Não possui permissão para gerenciar agentes ou arquivar denúncias.

## Consulta

**Usuário:** `consulta`  
**Senha:** `consulta123`

Permissões:

- Visualizar denúncias.
- Consultar os detalhes.

Não possui permissão para:

- Atualizar denúncias.
- Arquivar denúncias.
- Gerenciar agentes.
- Exportar dados.

---

# 📊 Dashboard administrativo

O dashboard apresenta:

- Total de denúncias.
- Denúncias recebidas.
- Denúncias em investigação.
- Denúncias concluídas.
- Denúncias arquivadas.
- Busca por protocolo, categoria, local e descrição.
- Filtro por status.
- Filtro por urgência.
- Filtro por categoria.
- Resumo das denúncias por categoria.
- Visualização detalhada das ocorrências.

---

# 📝 Status das denúncias

As denúncias podem possuir os seguintes status:

1. **Recebida**
2. **Em análise**
3. **Em investigação**
4. **Concluída**
5. **Arquivada**

As alterações de status ficam registradas no histórico.

Cada atualização pode armazenar:

- Status.
- Data e horário.
- Observação.
- Perfil responsável pela alteração.

---

# 🔎 Validações implementadas

O sistema possui validações para:

- Campos obrigatórios.
- Categoria e subcategoria.
- Data da ocorrência.
- Bloqueio de datas futuras.
- Nível de urgência.
- Tamanho mínimo do local.
- Tamanho mínimo da descrição.
- Matrícula duplicada de agentes.
- Geração de protocolos únicos.
- Código de acesso para acompanhamento.
- Proteção das páginas administrativas por sessão.

---

# 💾 Armazenamento

Como se trata de um protótipo front-end, os dados são armazenados no navegador.

### LocalStorage

```text
sda.denuncias
sda.agentes
```

### SessionStorage

```text
sda.sessaoAdmin
sda.perfilAdmin
```

Isso significa que os dados do protótipo não estão armazenados em um banco de dados remoto.

---

# 📱 Responsividade

A interface foi desenvolvida para se adaptar a:

- Computadores.
- Notebooks.
- Tablets.
- Smartphones.

O layout utiliza CSS responsivo para reorganizar formulários, cartões, tabelas e navegação em telas menores.

---

# ▶️ Como executar localmente

Clone ou baixe o projeto e abra o arquivo:

```text
inicio.html
```

Também é possível utilizar um servidor local.

### Com Python

```bash
python -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000/inicio.html
```

---

# 🚀 Publicação no GitHub Pages

O projeto pode ser publicado diretamente como site estático.

No GitHub:

```text
Settings
→ Pages
→ Deploy from a branch
→ Branch: main
→ Folder: /(root)
```

A estrutura do repositório deve manter `index.html`, `inicio.html`, `consulta.html`, `admin.html`, `dashboard.html` e `agentes.html` na raiz, além das pastas:

```text
css/
js/
```

---

# ✅ Validação do projeto

Durante o desenvolvimento foram realizadas verificações de:

- Estrutura dos arquivos.
- Separação entre HTML, CSS e JavaScript.
- Sintaxe do JavaScript.
- Carregamento das páginas.
- Carregamento do CSS.
- Carregamento do JavaScript.
- Fluxo de autenticação administrativa.
- Aplicação das permissões por perfil.
- Formulários e validações.
- Responsividade.

---

# ⚠️ Limitações do protótipo

Este projeto é destinado a **demonstração acadêmica**.

Ele não deve ser utilizado para receber denúncias reais ou informações sensíveis em ambiente de produção, pois:

- A autenticação está implementada no front-end.
- As credenciais estão presentes no código do protótipo.
- Os dados ficam armazenados no navegador.
- Não existe banco de dados remoto.
- Não existe autenticação individual baseada em servidor.
- Não existe controle de acesso no backend.

Para transformar o projeto em um sistema real, seria necessário implementar, entre outros recursos:

- Backend.
- Banco de dados.
- Autenticação segura.
- Autorização no servidor.
- Criptografia.
- Auditoria.
- Controle de sessão no servidor.
- Proteção de dados sensíveis.
- Backup e recuperação de dados.

---

# 👩‍💻 Projeto

**Sistema Web de Denúncias Anônimas**

Tecnologias:

```text
HTML5
CSS3
JavaScript
GitHub Pages
```

Projeto desenvolvido para fins acadêmicos.

