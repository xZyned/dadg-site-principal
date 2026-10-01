# Site DADG — entrega da auditoria

Branch `codex/auditoria-integracao`, base `14ed0c9`. Requer a branch homônima do `dadg-certificates`, base `ce4fcfe`.

## Mudanças

- Criação de conta via Universal Login; onboarding antigo encaminha ao perfil completo.
- Inscrições gratuitas/pagas com resposta do backend; perfil mostra pagamento, presença, ingresso e cancelamento permitido.
- `/perfil/certificados`: biblioteca pessoal, solicitação manual e botão de correspondências quando autorizado no backend.
- Busca pública paginada sem armazenar resultados pessoais em localStorage; aliases de consulta, PDF, scan, eventos e ligas centralizados no backend. Rotas administrativas locais antigas respondem 410.
- Estatísticas reais; ouvidoria com categorias compartilhadas e falha de envio explícita; mural com tratamento de indisponibilidade, data e sem redirecionar todos os avisos a certificados.
- Atalhos de serviços, navegação por teclado, foco do menu, link para pular conteúdo, agenda sem abertura automática, ajustes de movimento, metadados, sitemap, robots e páginas de erro.
- Dependências atualizadas e CI de lint, tipos, testes, auditoria e build.

## Configuração

`BACKEND_URL` deve apontar ao backend compatível. Preservar configuração Auth0 e suas rotas `/api/auth/*`. `/criar-conta` usa `screen_hint=signup`; abertura de signup no tenant é uma etapa operacional. O backend exige claims de e-mail verificado para novas inscrições e pedidos de vínculo; consultar o runbook do backend.

`CONTENTFUL_SPACE_ID` e `CONTENTFUL_ACCESS_TOKEN` habilitam o mural; ausência/falha mostra estado indisponível. Preservar integração da ouvidoria e confirmar recebimento real em homologação, sem criar manifestações fictícias em produção.

A CI/build de verificação usa `DB_ACCESS_DISABLED=1`, URLs locais inacessíveis e credenciais fictícias. Não levar esse flag para produção. As verificações não acessam banco.

## Publicação

Publicar backend, preparar índices com aprovação e homologar primeiro; publicar site em seguida. Nenhum PR/merge/deploy de produção é feito por estes arquivos. Eventos históricos continuam certificados, sem criar inscrições retroativas. Nomes iguais não comprovam titularidade.

Os testes locais não validam o tenant Auth0, os pagamentos reais, a entrega da ouvidoria ou o acervo de certificados. O teste Mongo inicial do backend passou após autorização. A aplicação de estruturas em produção continua dependendo da aprovação específica descrita em `docs/auditoria-integracao.md` no backend.

## Limite da consulta pública através do site

Definir o mesmo `PUBLIC_PROXY_RATE_LIMIT_SECRET` aleatório nos dois projetos. O site envia uma chave de visitante sem IP em texto, assinada e com validade de 60 segundos; o backend verifica antes de aplicar o limite por visitante (60/minuto/instância). Sem assinatura, usa limite por rede (600/minuto/instância), para não concentrar todos os visitantes do site em um limite individual. O proxy da hospedagem deve sobrescrever `x-forwarded-for`. Complementar com proteção distribuída no CDN/WAF.

O site mantém o limitador de mutações existente em `proxy.rateLimit`/`proxy.trafficLogs` (banco `proxy`), com TTL já gerido pelo projeto. Definir `RATE_LIMIT` como inteiro positivo, por exemplo `60` requisições/minuto por rota/IP; inscrições continuam limitadas a 3/minuto. Configuração ausente ou inválida responde 503 nas mutações e preserva leituras públicas. O guard de verificação offline também impede conexão desse cliente Mongo. Nenhum acesso a essas coleções foi realizado nesta entrega.
