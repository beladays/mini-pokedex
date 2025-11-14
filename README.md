Mini Pokédex — React Native + Expo

Uma Pokédex simples criada em React Native (Expo) como mini-projeto da cadeira de desenvolvimento de aplicativos móveis.
O app consome a PokéAPI, permite listar Pokémon, buscar por nome e ver detalhes completos (imagem, tipos, habilidades e stats).

 Tecnologias utilizadas:

React Native (Expo)

TypeScript

React Navigation

Fetch API

PokéAPI: https://pokeapi.co/


Funcionalidades
Tela Inicial (Lista)

Lista de 20 Pokémon por página

Botões Próxima e Anterior

Campo de busca por nome

Ao clicar em um Pokémon → vai para a tela de detalhes

Exibe estado de:

Carregando…

Erro com “Tentar novamente”

🔍 Busca por nome

Busca direto por nome (ex.: pikachu)

Se não encontrar → mostra “Pokémon não encontrado”

Se encontrar → navega direto para os detalhes

🧾 Tela de Detalhes

Exibe:

Imagem oficial (official-artwork) ou sprite padrão

Tipos (ex.: fire, water…)

Habilidades

Stats principais: HP, attack, defense etc.

Botão Voltar

📦 Como rodar o projeto
1️⃣ Clone o repositório
git clone https://github.com/beladays/mini-pokedex.git
cd mini-pokedex

2️⃣ Instale as dependências
npm install

3️⃣ Rodar o app
npm start


Depois:

Abra o Expo Go no seu celular

Escaneie o QR Code do terminal

ou

Rode no emulador Android / iOS

📚 Estrutura do projeto
src/
 ├── components/
 │    └── PokemonItem.tsx
 ├── telas/
 │    ├── HomeTela.tsx
 │    └── DetalheTela.tsx
 └── AppNavigator.tsx
App.tsx

🧩 Endpoints utilizados
📄 Lista (com paginação)
GET https://pokeapi.co/api/v2/pokemon?limit=20&offset=0

🔍 Buscar por nome
GET https://pokeapi.co/api/v2/pokemon/{nome}

📘 Detalhes
GET https://pokeapi.co/api/v2/pokemon/{nome}

 erro e 404.
A interface é simples e responsiva, usando apenas componentes nativos.
Todo código está separado em telas e componentes para ficar mais organizado.”
