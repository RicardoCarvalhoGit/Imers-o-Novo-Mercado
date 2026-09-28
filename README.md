# Imersão Novo Mercado

Landing page da Imersão Novo Mercado — Gestão, Liderança e Vendas, com Moysés Carvalho.

Site estático (HTML, CSS e JavaScript puro, sem build ou dependências). Basta abrir `index.html` no navegador ou publicar a pasta em qualquer host de sites estáticos.

## Estrutura

```
imersao-novo-mercado/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── assets/
    ├── gestao-indicadores.jpg
    ├── imersao-turma.jpg
    ├── moyses-blazer.jpg
    ├── moyses-hero.webp
    ├── prova-evento-aplausos.jpg
    ├── prova-evento-energia.jpg
    └── prova-treinamento-equipe.jpg
```

## Rodando localmente

Abra `index.html` diretamente no navegador, ou use a extensão **Live Server** do VSCode (botão direito no arquivo > "Open with Live Server") para ter recarregamento automático ao editar.

## Rastreamento (Analytics)

O site já vem com os blocos de código do **Google Analytics (GA4)** e do **Meta Pixel** prontos no `<head>` do `index.html` — só falta trocar os IDs de exemplo pelos IDs reais da sua conta:

- `G-XXXXXXXXXX` → seu Measurement ID do GA4
- `SEU_PIXEL_ID` → o ID do seu Pixel do Meta (aparece em 2 lugares no arquivo)

O evento de conversão (`contato_whatsapp` no GA4, `Contact` no Meta Pixel) é disparado quando o formulário Tally é **enviado** — não no clique do botão — identificando qual botão da página abriu o formulário.

## Formulário (Tally) antes do WhatsApp

Os botões "Quero Participar" / "Quero concorrer a uma cortesia" abrem um formulário em pop-up (via [Tally](https://tally.so)) antes de mandar a pessoa para o WhatsApp. Isso garante que você capture nome/telefone de todo mundo que demonstrou interesse, mesmo que a conversa no WhatsApp não avance. Se o script do Tally não carregar por algum motivo, os botões caem no fallback: abrem o WhatsApp direto (o `href` original continua no link).

**Passo a passo:**

1. Crie uma conta grátis em [tally.so](https://tally.so).
2. Crie um formulário curto com os campos:
   - **Nome** (texto curto, obrigatório)
   - **WhatsApp** (telefone, obrigatório)
   - Campo **oculto** chamado `origem` (Tally > Add block > Hidden Field) — é preenchido automaticamente pela página com qual botão foi clicado (`menu`, `hero`, `cortesias`, `faq_final`), útil para saber o que mais converte.
3. Em **Settings > On submit**, ative **"Redirect to URL"** e configure:
   `https://wa.me/5511982273141?text=Ol%C3%A1%2C%20me%20chamo%20{{Nome}}%2C%20quero%20participar%20da%20imers%C3%A3o%20novo%20mercado`
   (digite `@` no campo de URL dentro do Tally para inserir a referência da pergunta "Nome" automaticamente — não copie `{{Nome}}` literalmente, o Tally gera o marcador certo).
4. Em **Share > Embed > Popup**, copie o **Form ID**.
5. No `index.html`, substitua as 4 ocorrências de `SEU_TALLY_FORM_ID` pelo ID copiado (busque por `data-tally-open`).
6. Publique e teste: abra a página, clique em um botão, preencha o formulário de teste e confirme que é redirecionado ao WhatsApp com seu nome na mensagem.

**Detalhes técnicos importantes (conforme documentação oficial do Tally):**
- O script de embed é `https://tally.so/widgets/embed.js` (plural, "widgets") — já está correto no `<head>` do `index.html`.
- Os botões precisam do atributo `data-tally-form-events-forwarding="1"` para o Tally avisar a página (via `postMessage`) quando o formulário for enviado — sem isso, o clique até abre o pop-up, mas o evento de conversão (GA4/Pixel) nunca dispara. Já está configurado nos 4 botões.

> O disparo do evento de analytics depende do formato de mensagem (`Tally.FormSubmitted`) que o Tally envia via `postMessage` quando `data-tally-form-events-forwarding="1"` está presente. Depois de configurar, abra o Console do navegador (F12), envie um teste e confirme que o evento `contato_whatsapp` aparece disparado; se não aparecer, verifique no Console qual mensagem o Tally está realmente enviando.

## Deploy em moysescarvalho.com.br/imersao-novo-mercado

O site foi publicado dentro de um **subcaminho** do domínio (`/imersao-novo-mercado`), não na raiz — porque a raiz (`moysescarvalho.com.br`) está reservada para o site principal do Moysés no futuro. Isso é feito com o arquivo `vercel.json` na raiz do projeto, que:

- redireciona `moysescarvalho.com.br/` → `/imersao-novo-mercado/` **temporariamente** (enquanto não existe site principal — remova esse redirect quando o site principal for publicado);
- serve todos os arquivos do projeto sob `/imersao-novo-mercado/...`.

Como os links do site (`css/style.css`, `assets/...`) são todos **relativos** (sem `/` na frente), eles funcionam automaticamente dentro do subcaminho — não precisa mexer no HTML.

### Passo a passo

1. **Criar o repositório e subir o código**
   ```
   git init
   git add .
   git commit -m "primeiro commit"
   ```
   Crie um repositório no [GitHub](https://github.com/new) e depois:
   ```
   git remote add origin <URL do repositório>
   git branch -M main
   git push -u origin main
   ```

2. **Importar na Vercel**
   - Acesse [vercel.com](https://vercel.com), faça login (pode ser com a conta do GitHub).
   - "Add New" → "Project" → selecione o repositório `imersao-novo-mercado`.
   - Framework: **Other** (site estático, sem build). Não precisa mudar nenhuma configuração — o `vercel.json` já cuida do roteamento.
   - Deploy.

3. **Conectar o domínio**
   - No projeto da Vercel: **Settings → Domains** → adicione `moysescarvalho.com.br`.
   - A Vercel indica os registros de DNS a configurar — **use os valores exatos que aparecem na sua tela da Vercel**, pois o CNAME é único por conta. Registros atuais deste projeto (conferidos em 2026-09-28):
     - **Domínio raiz (`@` / `moysescarvalho.com.br`)**: registro **A** → `216.198.79.1`
     - **`www.moysescarvalho.com.br`**: registro **CNAME** → `b3e90d2f86a313cb.vercel-dns-017.com.`
   - Entre no painel onde o domínio está registrado (registro.br ou outro) e adicione (ou edite, se já existir um registro `@` ou `www` apontando pra outro lugar) esses registros na zona de DNS.
   - A propagação pode levar de alguns minutos até 24h. A tela da Vercel muda de "Invalid Configuration" para validado (ícone verde) automaticamente quando detectar os registros certos — não precisa fazer nada além de esperar depois de salvar no DNS.

4. **Testar**
   - Acesse `https://moysescarvalho.com.br/imersao-novo-mercado/` e confirme que a página carrega com CSS, imagens e o formulário Tally funcionando.
   - Acesse `https://moysescarvalho.com.br/` e confirme que redireciona para `/imersao-novo-mercado/`.

### Quando o site principal do Moysés existir

Nesse momento, alguém vai publicar o site principal também apontando para este domínio. Nesse ponto:
- remova a linha de redirect `"/"` do `vercel.json` deste projeto (ou substitua o projeto principal por outro que já cuide da raiz e faça um rewrite/proxy só para `/imersao-novo-mercado` apontando pra este deploy).
