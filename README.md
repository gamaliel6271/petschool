# 🐾 PetSchool — Tutores e Pets

Projeto em **Vue 3 + Vite + Vue Router + Bootstrap 5**, com API mockada via **json-server**.

## Como rodar

Abra **dois terminais** na pasta `petschool`:

```bash
# Terminal 1 — API (json-server na porta 3000)
npm run api

# Terminal 2 — aplicação (Vite na porta 5173)
npm run dev
```

Depois acesse: **http://localhost:5173**

> Se aparecer a pasta `node_modules` faltando, rode antes: `npm install`

## Rotas

| Tela | Rota |
|---|---|
| Listagem de tutores | `/tutores` |
| Cadastro de tutor | `/tutores/novo` |
| Detalhes do tutor | `/tutores/:id` |
| Listagem de pets | `/pets` |
| Detalhes do pet | `/pets/:id` |

## Endpoints utilizados (json-server, porta 3000)

| Funcionalidade | Método | Endpoint |
|---|---|---|
| Listar tutores | GET | `/tutores` |
| Buscar tutor por ID | GET | `/tutores/{id}` |
| Cadastrar tutor | POST | `/tutores` |
| Remover tutor | DELETE | `/tutores/{id}` |
| Buscar pets do tutor | GET | `/pets?tutorId={id}` |
| Cadastrar pet | POST | `/pets` |

> ⚠️ Usei o **json-server 0.17.4** de propósito: na versão 1.x (beta) o filtro
> `?tutorId={id}` não funciona, pois campos terminados em `Id` são tratados
> como relações.

## O que foi implementado

### 1. Listagem de tutores (`/tutores`) — `TutoresView.vue`
- Requisições `GET /tutores` e `GET /pets`
- Tabela com: ID, Nome completo, Telefone (com máscara), Quantidade de pets
  (badge) e nomes dos pets vinculados
- Ações: **Visualizar** (vai para `/tutores/{id}`) e **Excluir**
- Botão **Novo tutor** → `/tutores/novo`
- Ao excluir: se o tutor tiver pets, a exclusão é bloqueada com aviso;
  senão, pede confirmação (`Deseja realmente remover este tutor?`) e faz
  `DELETE /tutores/{id}`

### 2. Cadastro de tutor (`/tutores/novo`) — `AddTutorView.vue`
- Campos do wireframe: ID (gerado automaticamente), Nome, CPF/CNPJ,
  Telefone, E-mail, Data de Nascimento e Endereço completo
- **Máscaras**: telefone `(47) 99999-0001`, CPF/CNPJ (muda sozinha entre
  11 e 14 dígitos), data `dd/mm/aaaa` e CEP `00000-000`
- **Validação**: Nome e Telefone são obrigatórios. Enquanto estiverem
  inválidos, o botão **Cadastrar Tutor** fica desabilitado e aparece
  `"Ops, campo obrigatório, por favor preencha-o!"` embaixo de cada input,
  mais o aviso `"Preencha corretamente Nome e Telefone para habilitar o cadastro."`
- E-mail inválido mostra `"Informe um e-mail válido."`
- Envia `POST /tutores` e redireciona para `/tutores`

### 3. Detalhes do tutor (`/tutores/:id`) — `TutorDetailsView.vue`
- Usa `route.params.id` → `GET /tutores/{id}`
- Seção "Informações do Tutor" com ID, Nome, Telefone (e os campos extras,
  quando preenchidos)
- Botão **Voltar para Tutores**

### 4. Pets vinculados
- `GET /pets?tutorId={id}`, listados com `v-for` em tabela (ID, Nome,
  Espécie, Ações)
- Botão **Visualizar** leva para `/pets/{id}`
- Sem pets: `"Nenhum pet vinculado a este tutor."`

### 5. Cadastro de pet para o tutor
- Formulário "Cadastrar novo pet" na tela de detalhes: nome + espécie
- Envia `POST /pets` com o `tutorId` do tutor da URL e atualiza a lista na
  hora

### 6. Detalhes do pet (`/pets/:id`) — `PetDetailsView.vue`
- Mostra os dados do pet e do tutor vinculado

## Estrutura

```
petschool/
├── db.json                  # dados de exemplo (tutores e pets)
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.js
    ├── App.vue              # topbar verde + sidebar + rotas
    ├── style.css            # visual dos wireframes
    ├── router/index.js
    ├── services/api.js      # fetch para o json-server
    ├── utils/masks.js       # máscaras e validações
    └── views/
        ├── TutoresView.vue
        ├── AddTutorView.vue
        ├── TutorDetailsView.vue
        ├── PetsView.vue
        └── PetDetailsView.vue
```
