// Enhanced rule-based chatbot widget with knowledge base responses and quick suggestions
(function () {
  const defaultSuggestions = [
    'Quero agendar uma consulta',
    'Quais serviços vocês oferecem?',
    'Documentos necessários',
  ];

  const knowledgeBase = [
    {
      id: 'agendar',
      labels: ['Quero agendar uma consulta'],
      triggers: ['agendar', 'agenda', 'consulta', 'marcar', 'horario', 'horário', 'atendimento'],
      response: {
        text: 'Para agendar, basta compartilhar alguns dados e retornamos com opções de horário.',
        details: [
          'Nome completo e telefone ou e-mail para contato.',
          'Breve resumo do caso ou dúvida principal.',
          'Preferência de atendimento: presencial na CIC ou on-line.'
        ],
        suggestions: ['Documentos necessários', 'Valores e honorários', 'Falar pelo WhatsApp']
      }
    },
    {
      id: 'servicos',
      labels: ['Quais serviços vocês oferecem?'],
      triggers: ['servico', 'serviço', 'servicos', 'serviços', 'atua', 'área', 'areas', 'empresa', 'empresas', 'trabalhador', 'compliance', 'contencioso', 'consultoria'],
      response: {
        text: 'Atuamos em consultoria preventiva, contencioso trabalhista e programas de compliance.',
        details: [
          'Consultoria: pareceres rápidos, revisão de contratos e treinamentos para equipes.',
          'Contencioso: defesas técnicas, audiências, sustentação oral e negociação de acordos.',
          'Compliance: programas customizados, auditorias internas e políticas voltadas ao trabalho decente.'
        ],
        suggestions: ['Quero agendar uma consulta', 'Documentos necessários', 'Sobre o Dr. Igor']
      }
    },
    {
      id: 'documentos',
      labels: ['Documentos necessários'],
      triggers: ['documento', 'documentos', 'docs', 'levar', 'papel'],
      response: {
        text: 'Os documentos abaixo ajudam a avançar rapidamente na análise da situação:',
        details: [
          'Carteira de trabalho, contrato ou aditivos relevantes.',
          'Contracheques, recibos e comprovantes de pagamento.',
          'Termo de rescisão, comunicações internas ou registros importantes.',
          'Documentos pessoais e comprovante de residência.'
        ],
        suggestions: ['Quero agendar uma consulta', 'Valores e honorários']
      }
    },
    {
      id: 'honorarios',
      labels: ['Valores e honorários'],
      triggers: ['honor', 'valor', 'valores', 'preco', 'preço', 'custo', 'quanto'],
      response: {
        text: 'Os honorários variam conforme o tipo de atuação e a complexidade do caso.',
        details: [
          'Após entender a demanda, enviamos proposta com etapas, escopo e formas de pagamento.',
          'Em ações judiciais, combinamos condições antes de protocolar.',
          'Você pode iniciar um orçamento enviando mensagem pelo formulário ou WhatsApp.'
        ],
        suggestions: ['Quero agendar uma consulta', 'Falar pelo WhatsApp']
      }
    },
    {
      id: 'sobre',
      labels: ['Sobre o Dr. Igor'],
      triggers: ['igor', 'advogado', 'curriculo', 'currículo', 'experiencia', 'experiência', 'quem e', 'quem é'],
      response: {
        text: 'O escritório é conduzido pelo advogado Igor Santana, especializado em Direito do Trabalho.',
        details: [
          'Relator da Comissão do Pacto Global e Sustentabilidade da OAB/PR, com foco em trabalho decente.',
          'Autor de pesquisa sobre trabalhador eventual e contrato intermitente publicada pelo TRT/PR.',
          'Participou do PVIC/2024 com estudo sobre o trabalho de motoristas de aplicativo e o PL 12/2024.'
        ],
        suggestions: ['Quais serviços vocês oferecem?', 'Quero agendar uma consulta']
      }
    },
    {
      id: 'localizacao',
      labels: ['Onde ficam?'],
      triggers: ['onde', 'endereco', 'endereço', 'local', 'localizacao', 'localização', 'ficam', 'mapa'],
      response: {
        text: 'O escritório fica na Rua Pedro Gusso, 4127, CIC - Curitiba - PR.',
        details: [
          'Atendemos presencialmente e também por videoconferência.',
          'Horário: segunda a sexta, das 9h às 18h.',
          'Clique em “Continuar no WhatsApp” para receber a localização completa.'
        ],
        suggestions: ['Quero agendar uma consulta', 'Falar pelo WhatsApp']
      }
    },
    {
      id: 'contato',
      labels: ['Falar pelo WhatsApp'],
      triggers: ['whatsapp', 'telefone', 'contato', 'ligar', 'falar'],
      response: {
        text: 'Podemos continuar a conversa pelo WhatsApp quando preferir.',
        details: [
          'O botão abaixo abre o WhatsApp com uma mensagem inicial.',
          'Estamos disponíveis em horário comercial.',
          'Se preferir, deixe seu número que retornamos.'
        ],
        suggestions: ['Quero agendar uma consulta', 'Valores e honorários']
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

    function createMessageElement(from, text, details) {
      const wrapper = document.createElement('div');
      wrapper.className = `chat-message chat-message--${from}`;

      const bubble = document.createElement('div');
      bubble.className = 'chat-message__bubble';

      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      bubble.appendChild(paragraph);

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

    function addMessage(from, payload) {
      if (!messages) return;
      const { text, details, suggestions: customSuggestions } = payload;
      messages.appendChild(createMessageElement(from, text, details));
      messages.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' });
      updateSuggestions(customSuggestions || null);
      if (from === 'bot' && root.dataset.open !== 'true') {
        root.dataset.unread = 'true';
      }
    }

    function updateSuggestions(items) {
      if (!suggestions) return;
      suggestions.innerHTML = '';
      const entries = items && items.length ? items : defaultSuggestions;
      entries.forEach(label => {
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
        text: 'Olá! Sou o assistente virtual do Igor Santana Advocacia. Posso ajudar com serviços, agenda, documentos ou contato imediato.',
        suggestions: defaultSuggestions
      });
    }

    function acknowledgeContact(info) {
      addMessage('bot', {
        text: 'Obrigado pelas informações. Nossa equipe vai retornar em breve com os próximos passos.',
        details: [info],
        suggestions: ['Quero agendar uma consulta', 'Falar pelo WhatsApp']
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
        const info = mailMatch ? `Email recebido: ${mailMatch[0]}` : `Telefone recebido: ${phoneDigits}`;
        acknowledgeContact(info);
        return;
      }

      if (gratitudeWords.some(word => normalized.includes(word))) {
        addMessage('bot', {
          text: 'Fico feliz em ajudar! Se precisar de algo a mais, é só me chamar.',
          suggestions: ['Quero agendar uma consulta', 'Falar pelo WhatsApp']
        });
        return;
      }

      if (farewellWords.some(word => normalized.includes(word))) {
        addMessage('bot', {
          text: 'Até breve! Quando quiser retomar o atendimento, estarei por aqui.',
          suggestions: ['Quero agendar uma consulta', 'Falar pelo WhatsApp']
        });
        return;
      }

      const topic = findTopic(normalized);

      if (topic) {
        state.lastTopic = topic.id;
        addMessage('bot', topic.response);
      } else if (!fromSuggestion && state.lastTopic) {
        addMessage('bot', {
          text: 'Posso detalhar mais algum ponto? Tenho informações sobre agenda, honorários, documentos e canais de contato.',
          suggestions: defaultSuggestions
        });
      } else {
        addMessage('bot', {
          text: 'Ainda não tenho essa informação, mas posso ajudar com serviços, agenda, documentos ou encaminhar para atendimento humano.',
          suggestions: defaultSuggestions
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

    updateSuggestions(defaultSuggestions);

    if (whatsappBtn) {
      whatsappBtn.setAttribute('data-chat-whatsapp', '');
      whatsappBtn.addEventListener('click', () => {
        addMessage('bot', {
          text: 'Abrindo o WhatsApp. Se preferir, deixe seu contato por aqui que retornamos também!',
          suggestions: ['Quero agendar uma consulta', 'Valores e honorários']
        });
      });
    }

    // Open chat automatically on desktop after delay to highlight availability
    if (window.matchMedia('(min-width: 768px)').matches) {
      setTimeout(() => { if (!state.openedOnce) setOpen(true); }, 2500);
    }
  }
})();
