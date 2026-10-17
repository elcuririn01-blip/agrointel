/**
 * AGROINTEL PRO — FRONTEND SCRIPTS
 * Responsividade, Interatividade e Configuração de Checkout
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. CONFIGURAÇÃO DOS LINKS DE CHECKOUT
  // Altere os links abaixo conforme sua plataforma de pagamento (Hotmart, Kiwify, Payt, etc.)
  // ==========================================
  const CHECKOUT_CONFIG = {
    // Plano PRO Completo (R$ 97,00)
    CHECKOUT_PRO_URL: 'https://checkout.payt.com.br/09e26c8d4ed0ed3a6514410cfb87c038',
    // Plano Start (R$ 47,00)
    CHECKOUT_START_URL: 'https://checkout.payt.com.br/edaf0b3ca4eca8b1f5fe2fae82647f89'
  };

  // Aplica os links aos botões correspondentes
  document.querySelectorAll('[data-checkout="pro"]').forEach(btn => {
    btn.setAttribute('href', CHECKOUT_CONFIG.CHECKOUT_PRO_URL);
  });

  document.querySelectorAll('[data-checkout="start"]').forEach(btn => {
    btn.setAttribute('href', CHECKOUT_CONFIG.CHECKOUT_START_URL);
  });

  // ==========================================
  // 2. ACCORDION DO FAQ
  // ==========================================
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');

      // Fecha todos os itens
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        const q = i.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });

      // Se não estava ativo, abre
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ==========================================
  // 3. BARRA FIXA MOBILE (STICKY BOTTOM CTA)
  // Surge suavemente após rolar 500px da página
  // ==========================================
  const mobileBar = document.querySelector('.mobile-sticky-bar');
  if (mobileBar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        mobileBar.classList.add('visible');
      } else {
        mobileBar.classList.remove('visible');
      }
    });
  }

  // ==========================================
  // 4. INTERATIVIDADE NA DEMO DO APLICATIVO
  // Troca de módulos na demonstração
  // ==========================================
  const menuItems = document.querySelectorAll('.sidebar-menu-item');
  const demoTitle = document.querySelector('.app-pane-title');
  const mockRec = document.querySelector('.mock-rec-box');

  const demoPresets = {
    'Visitas Técnicas': {
      title: 'Relatório Técnico de Visita — Fazenda Primavera',
      rec: '<strong>Diagnóstico & Recomendação de Manejo:</strong><br>Constatada presença de <em>Spodoptera frugiperda</em> acima do nível de controle no talhão 04 (estádio V4). Recomenda-se rotação de ativos com inseticida fisiológico regulador de crescimento + bioinsumo associado. Repetir monitoramento em 5 dias.'
    },
    'Manejo & Nutrição': {
      title: 'Prescrição Nutricional Foliar — Café Conilon',
      rec: '<strong>Balanço Nutricional Foliar:</strong><br>Análise visual e histórico de solo indicam carência de Zinco e Boro na fase de pré-florada. Recomendação de aplicação de micronutrientes quelatados associados a adjuvante organossiliconado para maior penetração cuticular.'
    },
    'Crédito Rural': {
      title: 'Estruturação de Custeio Agrícola — Safra 26/27',
      rec: '<strong>Memorial Descritivo e Cronograma:</strong><br>Organização das certidões negativas (CND, CAR, CCIR), demonstrativo de capacidade de pagamento e cronograma físico-financeiro de desembolso para protocolo no agente financeiro credenciado.'
    },
    'Calagem & Adubação': {
      title: 'Cálculo de Necessidade de Calagem (NC) — Cerrado',
      rec: '<strong>Correção de Perfil de Solo:</strong><br>Elevação da saturação por bases (V%) de 38% para 65% na camada 0-20cm. Necessidade de 2,4 t/ha de calcário dolomítico com PRNT 85%, incorporado a 90 dias do plantio.'
    }
  };

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      menuItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const textSpan = item.querySelector('span:not(.sidebar-item-icon):not(.sidebar-count)');
      const menuText = textSpan ? textSpan.textContent.trim() : '';
      if (demoPresets[menuText] && demoTitle && mockRec) {
        demoTitle.textContent = demoPresets[menuText].title;
        mockRec.innerHTML = demoPresets[menuText].rec;
      }
    });
  });

  // ==========================================
  // 5. SMOOTH SCROLL PARA ANCHORS INTERNOS
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
