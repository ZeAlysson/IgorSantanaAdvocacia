// Simple rule-based chatbot widget
(function () {
  const openBtn = document.getElementById('chat-open');
  const chatbox = document.getElementById('chatbox');
  const sendBtn = document.getElementById('chat-send');
  const input = document.getElementById('chat-input');
  const messages = document.getElementById('chat-messages');

  openBtn && openBtn.addEventListener('click', () => {
    if (chatbox.classList.contains('hidden')) chatbox.classList.remove('hidden');
    else chatbox.classList.add('hidden');
  });

  function appendMessage(text, from = 'bot') {
    const el = document.createElement('div');
    el.className = from === 'bot' ? 'text-sm text-gray-700 mb-2' : 'text-sm text-right text-brand mb-2';
    el.textContent = text;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
  }

  function botReply(userText) {
    const t = userText.toLowerCase();
    if (t.includes('horário') || t.includes('agenda')) return 'Atendemos por agendamento. Você pode enviar seus dados pelo formulário ou me passar seu número que retornamos contato.';
    if (t.includes('valor') || t.includes('custo') || t.includes('honor')) return 'O valor depende do serviço. Envie detalhes do caso pelo formulário para que possamos estimar.';
    if (t.includes('documentos') || t.includes('docs')) return 'Documentos comuns: carteira de trabalho, contracheques, termo de rescisão e comunicações relevantes.';
    return 'Obrigado pela mensagem. Para atendimento humano, use o WhatsApp ou o formulário de contato.';
  }

  sendBtn && sendBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) return;
    appendMessage(text, 'user');
    input.value = '';
    setTimeout(() => appendMessage(botReply(text), 'bot'), 500);
  });

  input && input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendBtn.click(); });
})();
