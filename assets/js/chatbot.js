// Enhanced rule-based chatbot widget with knowledge base responses and quick suggestions
(function () {
  const mainOptions = [
    'Atendimento',
    'Áreas Atuantes',
    'Direitos do Trabalhador',
    'Documentos Necessários',
    'Contato'
  ];

  const knowledgeBase = [
    {
      id: 'atendimento',
      area: 'Atendimento',
      labels: ['Atendimento', 'Agendar consulta', 'Formato do atendimento', 'Valores e honorários'],
      triggers: [
        'atendimento', 'agendar', 'agenda', 'consulta', 'marcar', 'horario', 'horário',
        'online', 'on-line', 'presencial', 'videoconferencia', 'videoconferência',
        'honorario', 'honorários', 'valor', 'valores', 'orcamento', 'orçamento',
        'custo', 'investimento'
      ],
      response: {
        title: 'Atendimento • Agendar consulta',
        paragraphs: [
          'Para agendar uma consulta, informe seu nome completo, telefone ou e-mail e descreva brevemente o assunto para que possamos direcionar o atendimento.',
          'Os atendimentos podem ser presenciais na Rua Pedro Gusso, 4127, CIC, Curitiba/PR, ou on-line por videoconferência, conforme sua preferência e disponibilidade.',
          'Antes da confirmação, apresentamos os horários disponíveis, esclarecemos os documentos prévios necessários e encaminhamos a proposta de honorários correspondente.'
        ],
        suggestions: mainOptions
      }
    },
    {
      id: 'areas-atuantes',
      area: 'Áreas Atuantes',
      labels: ['Áreas Atuantes', 'Serviços', 'Serviços oferecidos', 'Consultoria trabalhista', 'Compliance trabalhista', 'Contencioso trabalhista'],
      triggers: [
        'areas', 'áreas', 'servico', 'servicos', 'serviço', 'serviços', 'atuacao', 'atua', 'atuamos',
        'consultoria', 'consultivo', 'contencioso', 'compliance', 'programas', 'empresas',
        'empresarial', 'trabalhista'
      ],
      response: {
        title: 'Áreas Atuantes • Consultoria, contencioso e compliance',
        paragraphs: [
          'No consultivo trabalhista, elaboramos pareceres, revisamos contratos e conduzimos treinamentos para prevenir passivos e fortalecer políticas internas.',
          'No contencioso, representamos empresas em audiências, defesas técnicas e negociações perante a Justiça do Trabalho, com acompanhamento estratégico de todo o processo.',
          'Em compliance trabalhista, estruturamos programas personalizados, auditorias e códigos de conduta alinhados ao Pacto Global e às metas de trabalho decente.'
        ],
        suggestions: mainOptions
      }
    },
    {
      id: 'direitos',
      area: 'Direitos do Trabalhador',
      labels: ['Direitos do Trabalhador', 'Direitos trabalhistas', 'Demissões', 'Rescisões', 'Ações judiciais'],
      triggers: [
        'direito', 'direitos', 'trabalhador', 'trabalhadores', 'rescisao', 'rescisões', 'demissao', 'demissões',
        'dispensa', 'justa causa', 'fgts', 'verbas', 'acao', 'ação', 'processo', 'judicial',
        'reclamacao', 'reclamação', 'indenizacao', 'indenização'
      ],
      response: {
        title: 'Direitos do Trabalhador • Rescisões, demissões e ações',
        paragraphs: [
          'Analisamos rescisões para verificar verbas rescisórias, aviso-prévio, multas do FGTS e demais direitos decorrentes da ruptura contratual.',
          'Em demissões controversas ou dispensas por justa causa, avaliamos provas, orientamos sobre regularização de registros e buscamos soluções consensuais quando possível.',
          'Para ações judiciais, definimos a estratégia processual, reunimos documentos, estimamos riscos e acompanhamos a execução até o recebimento das verbas devidas.'
        ],
        suggestions: mainOptions
      }
    },
    {
      id: 'documentos',
      area: 'Documentos Necessários',
      labels: ['Documentos Necessários', 'Lista de documentos', 'Documentos para consulta'],
      triggers: ['documento', 'documentos', 'docs', 'papelada', 'comprovantes', 'checklist', 'lista', 'arquivos', 'anexos', 'comprovante'],
      response: {
        title: 'Documentos Necessários • Checklist por tipo de atendimento',
        paragraphs: [
          'Para consultas iniciais, reúna dados pessoais, contratos de trabalho, aditivos e políticas internas relevantes para contextualizar o atendimento.',
          'Em análises de rescisão ou demissão, solicitamos holerites, Termo de Rescisão do Contrato de Trabalho, extratos do FGTS, comunicações internas e comprovantes de pagamento.',
          'Para ações ou defesas judiciais, precisamos dos registros de jornada, comunicações eletrônicas, testemunhas disponíveis e qualquer documentação complementar relacionada ao caso.'
        ],
        suggestions: mainOptions
      }
    },
    {
      id: 'contato',
      area: 'Contato',
      labels: ['Contato', 'WhatsApp', 'Telefone', 'Formulário'],
      triggers: ['contato', 'whatsapp', 'telefone', 'ligar', 'mensagem', 'falar', 'retorno', 'formulario', 'formulário', 'email', 'e-mail'],
      response: {
        title: 'Contato • Canais de continuidade',
        paragraphs: [
          'Você pode continuar o atendimento imediatamente pelo WhatsApp oficial do escritório; acione o botão e enviaremos uma mensagem inicial para facilitar.',
          'Caso prefira ligação telefônica, informe o melhor número e período para retorno que nossa equipe realizará o contato.',
          'O formulário do site permanece disponível para envio de dados, anexos e atualização do andamento, garantindo o registro seguro da sua demanda.'
        ],
        suggestions: mainOptions
      }
    }
  ];

  const gratitudeWords = ['obrigado', 'obrigada', 'valeuuu', 'agradeço', 'thanks'];
  const farewellWords = ['tchau', 'até', 'ate mais', 'encerrar', 'finalizar'];

  const normalize = (str = '') => str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  function waitForIncludes(fn) {
    if (document.querySelector('[data-include]') && !window.__includesLoaded) {
      document.addEventListener('includes:loaded', fn, { once: true });
    } else {
      fn();
    }
  }

  ready(() => waitForIncludes(initChatbot));

  function initChatbot() {
    const root = document.getElementById('chatbot');
    if (!root) return;
    if (!root.dataset.unread) root.dataset.unread = 'false';

    const toggle = root.querySelector('[data-chat-toggle]');
    const panel = root.querySelector('[data-chat-panel]');
    const closeBtn = root.querySelector('[data-chat-close]');
    const messages = root.querySelector('[data-chat-messages]');
    const suggestions = root.querySelector('[data-chat-suggestions]');
    const form = root.querySelector('[data-chat-form]');
    const input = root.querySelector('[data-chat-input]');
    const whatsappBtn = root.querySelector('[data-chat-whatsapp]') || root.querySelector('[data-wa-link]');
    const launcherLabel = toggle?.querySelector('.chat-launcher__label');

    if (!toggle || !panel || !messages || !form || !input) return;

    panel.setAttribute('tabindex', '-1');

    const state = {
      openedOnce: false,
      lastTopic: null
    };

    function formatPhoneNumber(digits = '') {
      if (!digits) return '';
      if (digits.length === 11) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
      }
      if (digits.length === 10) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
      }
      return digits;
    }

    function setOpen(open) {
      root.dataset.open = open ? 'true' : 'false';
      if (!open) root.dataset.unread = 'false';
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (launcherLabel) launcherLabel.textContent = open ? 'Minimizar chat' : 'Precisa de ajuda?';
      if (open) {
        panel.focus({ preventScroll: false });
        setTimeout(() => input.focus(), 120);
        if (!state.openedOnce) {
          state.openedOnce = true;
          setTimeout(() => botGreet(), 250);
        }
      }
    }

    toggle.addEventListener('click', () => {
      const willOpen = root.dataset.open !== 'true';
      setOpen(willOpen);
    });

    closeBtn?.addEventListener('click', () => setOpen(false));

    panel.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggle.focus();
      }
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      handleUserInput(text);
      input.value = '';
    });

    function createMessageElement(from, payload = {}) {
      const wrapper = document.createElement('div');
      wrapper.className = `chat-message chat-message--${from}`;

      const bubble = document.createElement('div');
      bubble.className = 'chat-message__bubble';

      const { title, text, paragraphs, details } = payload;

      if (title) {
        const heading = document.createElement('div');
        heading.className = 'chat-message__title';
        heading.textContent = title;
        heading.style.fontWeight = '700';
        heading.style.marginBottom = '0.4rem';
        bubble.appendChild(heading);
      }

      const segments = [];
      if (text) segments.push(text);
      if (Array.isArray(paragraphs) && paragraphs.length) {
        paragraphs.forEach(segment => {
          if (segment) segments.push(segment);
        });
      }

      segments.forEach(content => {
        const paragraphEl = document.createElement('p');
        paragraphEl.textContent = content;
        bubble.appendChild(paragraphEl);
      });

      if (Array.isArray(details) && details.length) {
        const list = document.createElement('ul');
        list.className = 'chat-message__list';
        details.forEach(item => {
          const li = document.createElement('li');
          li.textContent = item;
          list.appendChild(li);
        });
        bubble.appendChild(list);
      }

      const time = document.createElement('span');
      time.className = 'chat-message__time';
      time.textContent = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      bubble.appendChild(time);

      wrapper.appendChild(bubble);
      return wrapper;
    }

    function addMessage(from, payload = {}) {
      if (!messages) return;
      const { suggestions: customSuggestions } = payload;
      messages.appendChild(createMessageElement(from, payload));
      messages.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' });
      updateSuggestions(customSuggestions || null);
      if (from === 'bot' && root.dataset.open !== 'true') {
        root.dataset.unread = 'true';
      }
    }

    function updateSuggestions(items) {
      if (!suggestions) return;
      suggestions.innerHTML = '';
      const pool = items && items.length ? items : mainOptions;
      const entries = Array.from(new Set(pool.filter(label => mainOptions.includes(label))));
      const finalEntries = entries.length ? entries : mainOptions;
      finalEntries.forEach(label => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'chat-suggestion';
        button.textContent = label;
        button.addEventListener('click', () => handleUserInput(label, true));
        suggestions.appendChild(button);
      });
    }

    function botGreet() {
      addMessage('bot', {
        title: 'Bem-vindo • Assistente virtual',
        paragraphs: [
          'Sou o assistente virtual do Igor Santana Advocacia e posso orientar sobre atendimento, áreas de atuação, direitos trabalhistas, documentos necessários e canais de contato.',
          'Escolha um dos temas abaixo ou descreva sua necessidade para avançarmos com a orientação adequada.'
        ],
        suggestions: mainOptions
      });
    }

    function acknowledgeContact(contact) {
      if (!contact) return;
      const descriptor = contact.type === 'email'
        ? `E-mail informado: ${contact.value}`
        : `Telefone informado: ${contact.value}`;
      addMessage('bot', {
        title: 'Contato • Dados recebidos',
        paragraphs: [
          'Agradeço o envio das informações. Nossa equipe analisará os dados e retornará com os próximos passos do atendimento.',
          descriptor
        ],
        suggestions: mainOptions
      });
    }

    function handleUserInput(text, fromSuggestion = false) {
      const trimmed = text.trim();
      if (!trimmed) return;

      addMessage('user', { text: trimmed });
      const normalized = normalize(trimmed);

      const mailMatch = trimmed.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
      const phoneDigits = trimmed.replace(/\D/g, '');
      const hasPhone = phoneDigits.length >= 10;

      if (mailMatch || hasPhone) {
        const info = mailMatch
          ? { type: 'email', value: mailMatch[0] }
          : { type: 'phone', value: formatPhoneNumber(phoneDigits) };
        acknowledgeContact(info);
        return;
      }

      if (gratitudeWords.some(word => normalized.includes(word))) {
        addMessage('bot', {
          title: 'Assistente • À disposição',
          paragraphs: [
            'Permaneço à disposição para esclarecer outras dúvidas ou direcionar novas etapas do atendimento.',
            'Selecione um dos temas principais abaixo sempre que desejar continuar a conversa.'
          ],
          suggestions: mainOptions
        });
        return;
      }

      if (farewellWords.some(word => normalized.includes(word))) {
        addMessage('bot', {
          title: 'Assistente • Atendimento encerrado',
          paragraphs: [
            'Agradeço o contato. Quando quiser retomar a conversa, basta acionar o ícone do assistente no canto inferior da tela.'
          ],
          suggestions: mainOptions
        });
        return;
      }

      const topic = findTopic(normalized);

      if (topic) {
        state.lastTopic = topic.id;
        addMessage('bot', topic.response);
      } else if (!fromSuggestion && state.lastTopic) {
        addMessage('bot', {
          title: 'Assistente • Temas disponíveis',
          paragraphs: [
            'Ainda tenho informações organizadas sobre atendimento, áreas atuantes, direitos do trabalhador, documentos necessários e formas de contato.',
            'Escolha um dos tópicos abaixo ou descreva novamente com mais detalhes para que eu possa ajudar.'
          ],
          suggestions: mainOptions
        });
      } else {
        addMessage('bot', {
          title: 'Assistente • Não localizei essa informação',
          paragraphs: [
            'No momento não identifiquei a resposta para essa solicitação na base de conhecimento.',
            'Selecione um dos temas principais abaixo ou reformule a pergunta com detalhes específicos.'
          ],
          suggestions: mainOptions
        });
      }
    }

    function findTopic(text) {
      return knowledgeBase.find(topic => {
        const searchSpace = [
          ...(topic.triggers || []),
          ...(topic.labels || [])
        ].map(normalize);
        return searchSpace.some(trigger => trigger && text.includes(trigger));
      }) || null;
    }

    updateSuggestions(mainOptions);

    if (whatsappBtn) {
      whatsappBtn.setAttribute('data-chat-whatsapp', '');
      whatsappBtn.addEventListener('click', () => {
        addMessage('bot', {
          title: 'Contato • Abrindo WhatsApp',
          paragraphs: [
            'Abrirei o WhatsApp do escritório para que possamos prosseguir com um atendimento em tempo real.',
            'Se preferir, informe aqui o número ou o melhor horário para retorno e manteremos o acompanhamento diretamente pela equipe.'
          ],
          suggestions: mainOptions
        });
      });
    }

    // Remove auto-open: chat should only expand when the user clicks the launcher.
  }
})();
