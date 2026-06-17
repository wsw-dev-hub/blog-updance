
[ PROTOCOLOS DE SEGURANÇA ]

#[ RISCO CRÍTICO ] API token Cloudflare salvo em texto puro

O wrangler login salva o token em %APPDATA%\Roaming\.wrangler\config.toml. Um malware com acesso ao perfil do Windows pode lê-lo e fazer deploy de conteúdo malicioso no domínio do blog ou destruir dados de KV/R2.

Configurar CLOUDFLARE_API_TOKEN como variável de ambiente do sistema Windows em vez do login interativo. Criar um token com permissão mínima (só Workers Scripts, sem KV/R2 se não for usar). Rotacionar a cada 90 dias.
-------------------------------------------------------------------------------------------------------------------------------------

#[ RISCO ALTO ] Supply chain: dependências comprometidas

O build log registrou 16 vulnerabilidades (2 high, 14 moderate). Pacotes npm são alvo frequente de ataques — um mantenedor comprometido pode injetar código que lê variáveis de ambiente ou arquivos locais no momento do build ou deploy.

Fixar a versão do Wrangler no package.json em vez de usar npx wrangler. Executar npm audit e npm audit fix antes de cada deploy. Revisar qualquer dependência nova antes de instalar.

npm audit antes de cada deploy 
— npm audit && npm run deploy como sequência obrigatória
-------------------------------------------------------------------------------------------------------------------------------------

#[ RISCO ALTO ] Dev server exposto na rede local

O vite.config.js tem host: true com HTTPS ativo. Em redes domésticas isso é seguro; em redes públicas (hotéis, aeroportos, co-workings), qualquer dispositivo na mesma rede pode acessar o site em desenvolvimento, incluindo rotas e dados de teste com o TON Connect.

Condicionar host: true a uma variável de ambiente: host: !!process.env.EXPOSE_HOST. Nunca executar npm run dev com expose ativo em redes públicas.
-------------------------------------------------------------------------------------------------------------------------------------

#[ RISCO MÉDIO ] Deploy direto para produção sem staging

Não há ambiente de homologação. Qualquer commit no main vai ao ar para todos os visitantes. Com o TON Connect ativo, um bug em produção afeta transações reais.

Criar branch staging e configurar um segundo projeto no Cloudflare (blog-updance-staging). Testar sempre na branch antes de fazer merge no main.





==================================[ ALTERAÇÕES NO packge.json ]==========================================

versão antiga

 "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && wrangler pages deploy dist --project-name=blog-updance",
    "deploy:preview": "npm run build && wrangler pages deploy dist --project-name=blog-updance --branch=preview",
    "post:new": "node scripts/new-post.js",
    "contracts:test": "cd contracts && npx blueprint test",
    "contracts:testnet": "cd contracts && npx blueprint run --testnet",
    "contracts:mainnet": "cd contracts && npx blueprint run --mainnet"
  },