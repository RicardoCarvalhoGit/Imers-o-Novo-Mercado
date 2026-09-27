// ===========================
// Imersão Novo Mercado — scripts
// ===========================

// Dispara evento de conversão (Google Analytics + Meta Pixel) sempre que
// um botão de WhatsApp é clicado. "origem" identifica qual botão da página
// foi usado, útil para saber qual seção converte mais.
function trackWhatsAppClick(origem) {
  if (typeof gtag === 'function') {
    gtag('event', 'contato_whatsapp', { origem_botao: origem });
  }
  if (typeof fbq === 'function') {
    fbq('track', 'Contact', { content_name: origem });
  }
}

// Guarda de qual botão veio o clique que abriu o formulário Tally,
// para sabermos a origem quando o evento de envio chegar via postMessage.
let origemUltimoFormulario = null;

document.addEventListener('DOMContentLoaded', () => {

  // Formulário Tally (pop-up antes do redirecionamento ao WhatsApp)
  document.querySelectorAll('[data-tally-open]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      origemUltimoFormulario = trigger.dataset.tallyHiddenOrigem || 'desconhecida';
    });
  });

  // O Tally avisa a página pai via postMessage quando o formulário é enviado.
  // O redirecionamento para o WhatsApp é configurado dentro do próprio Tally
  // (Settings > On submit > Redirect to URL) — aqui só disparamos o evento
  // de conversão (GA4 + Meta Pixel) no momento certo: envio concluído, não clique.
  window.addEventListener('message', (event) => {
    if (typeof event.data !== 'string') return;
    let payload;
    try {
      payload = JSON.parse(event.data);
    } catch (e) {
      return;
    }
    if (payload && payload.event === 'Tally.FormSubmitted') {
      trackWhatsAppClick(origemUltimoFormulario || 'formulario');
    }
  });

  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mainNav.classList.remove('open'));
    });
  }

  // FAQ accordion
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(other => {
        other.classList.remove('active');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

});
