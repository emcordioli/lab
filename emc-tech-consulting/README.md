# EMC Tech Consulting

Site de Emanuel Cordioli para consultoria estratégica em produto e tecnologia.

## Site

- [GPT Sites](https://emanuel-cordioli-emc.emcordioli.chatgpt.site/)
- [Domínio na EC2](https://emcordioli.com.br/) — HTTPS válido; `www` redireciona ao domínio principal.
- DNS na Cloudflare. Atualização automática do IP ainda pendente; revisar o registro A após parar/iniciar a EC2.

## Código e publicação

`index.html` reúne conteúdo, CSS e imagens incorporadas, incluindo foto de perfil e logos. Montserrat via Google Fonts. Sem build ou dependências.

Edite o arquivo e faça commit/push para `main`. O workflow [emc-deploy.yml](../.github/workflows/emc-deploy.yml) valida o HTML e as imagens e publica na EC2 via OIDC e SSM, sem chaves AWS no GitHub. Se desligada, a EC2 sincroniza a versão mais recente ao iniciar. GPT Sites exige publicação separada.

## Infraestrutura

- EC2 `t3.micro`, região `us-east-1`, Free Plan.
- Nginx e certificado Let's Encrypt para o domínio, com renovação automática.
- Desliga às 20h e liga às 8h diariamente, horário de Brasília.

## Preview local

```sh
python -m http.server 8000
```

Abra `http://localhost:8000/` nesta pasta.

## Testes E2E

[GitHub Actions](https://github.com/emcordioli/lab/actions/workflows/emc-e2e.yml): diariamente às 8h15 (Brasília), manualmente ou quando os testes mudam. Playwright verifica EC2 e GPT Sites em desktop/celular: HTTP 200, título, logo, foto, layout e abertura dos quatro CTAs sem enviar mensagens. Valida a navegação inicial; não testa login nem disponibilidade dos serviços externos.

O IP da EC2 é consultado na AWS em cada execução. EC2 e GPT Sites são testados por HTTPS; o domínio também valida o apontamento DNS. Relatórios e evidências ficam nos artifacts por 14 dias. Agendamentos do GitHub podem atrasar.
