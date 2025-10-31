# Igor Santana Advocacia — Site Pessoal

Site estático construído com HTML, Tailwind (CDN), AOS, EmailJS e JavaScript puro.

Features incluídas:
- Mobile-first design com Tailwind CDN
- AOS para animações suaves
- Formulário de contato funcional com EmailJS (necessita configurar IDs)
- WhatsApp click-to-chat (configure número)
- Sistema simples de posts via `posts/posts.json`
- FAQ em accordions (details/summary)
- Integração com Google Maps (embed iframe)
- Chatbot simples rule-based


Localização
----------

Rua Pedro Gusso, 4127, CIC - Curitiba - PR, 81315-000

Contato
-------

WhatsApp / Telefone: +55 41 8512-2438

Como configurar localmente
1. Abra a pasta do projeto:

```cmd
cd "c:\Users\Alisson\OneDrive\Área de Trabalho\IgorSantanaAdvocacia"
```

2. Servir localmente (recomendado) — use Python ou http-server:

```cmd
# com Python 3
python -m http.server 3000

# ou, se preferir (requer Node):
# npx http-server -p 3000
```

Abra http://localhost:3000 no navegador.

Configurações necessárias
- EmailJS: crie uma conta em https://www.emailjs.com, gere Service ID, Template ID e User ID. Substitua os placeholders em `assets/js/main.js`:
  - `emailjs.init('YOUR_EMAILJS_USER_ID')`
  - `serviceID = 'YOUR_SERVICE_ID'`
  - `templateID = 'YOUR_TEMPLATE_ID'`

- WhatsApp: edite a variável `phone` em `assets/js/main.js` com seu número no formato internacional (ex.: 5511999999999).

- Google Maps: substitua o `src` do iframe em `index.html` por um embed do Google Maps com sua localização.

Personalização
- Cor de identidade: #4f0000 (definida como `brand`). Use classes Tailwind customizadas, ou inline styles se necessário.

Próximos passos sugeridos
- Adicionar formulários de validação mais robusta e tratamento de erros
- Criar templates de posts em Markdown com um pequeno conversor ou usar um gerador estático
- Integrar um atendimento real via API (ex.: Zendesk, Intercom) caso deseje substituição do chatbot simples

Licença: este repositório é um ponto de partida. Ajuste conforme necessidade.

## Estrutura recomendada

Sugiro organizar os ativos em uma pasta dedicada para ficar mais profissional e previsível:

```text
IgorSantanaAdvocacia/
├─ assets/
│  ├─ css/
│  ├─ js/
│  └─ images/    <- coloque aqui `logo.jpg`, `s_logo.png` etc.
├─ posts/
├─ index.html
├─ README.md
```

Mover os arquivos (ex.: Windows cmd):

```powershell
move "logo.jpg" "assets\images\logo.jpg"
move "s_logo.png" "assets\images\s_logo.png"
```

Depois atualize o git (se aplicável):

```powershell
git add assets/images/logo.jpg assets/images/s_logo.png
git commit -m "Move logos to assets/images"
```

Observação: o site já procura primeiro em `assets/images/` e tem fallback para os arquivos na raiz, então é seguro mover os arquivos conforme acima.
