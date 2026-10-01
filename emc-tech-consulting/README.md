# EMC Tech Consulting

Site de Emanuel Cordioli para consultoria estratégica em produto e tecnologia.

## Site

- [Domínio na EC2](https://emcordioli.com.br/) — HTTPS válido; `www` redireciona ao domínio principal.
- DNS na Cloudflare. IP atualizado automaticamente ao iniciar e a cada 5 minutos. Token criptografado no AWS Parameter Store, restrito a este domínio.

## Código e publicação

`index.html` reúne conteúdo, CSS e imagens incorporadas, incluindo foto de perfil e logos. Montserrat via Google Fonts. Sem build ou dependências.

Edite o arquivo e faça commit/push para `main`. O workflow [emc-deploy.yml](../.github/workflows/emc-deploy.yml) valida o HTML e as imagens e publica na EC2 via OIDC e SSM, sem chaves AWS no GitHub. Se desligada, a EC2 sincroniza a versão mais recente ao iniciar.

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

[GitHub Actions](https://github.com/emcordioli/lab/actions/workflows/emc-e2e.yml): diariamente às 8h15 (Brasília), manualmente ou quando os testes mudam. Playwright verifica o domínio emcordioli.com.br em desktop/celular: HTTP 200, título, logo, foto, layout e abertura dos quatro CTAs sem enviar mensagens. Valida a navegação inicial; não testa login nem disponibilidade dos serviços externos.

Os testes acessam diretamente `https://emcordioli.com.br/`, sem consultar IP nem usar credenciais AWS. O domínio é testado por HTTPS, incluindo o apontamento DNS. Relatórios e evidências ficam nos artifacts por 14 dias. Agendamentos do GitHub podem atrasar.
