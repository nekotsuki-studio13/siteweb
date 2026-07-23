// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if(navToggle && navLinks){
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
  }

  // Formulaires envoyés via Formspree (contact.html et boutique.html)
  document.querySelectorAll('.ajax-form').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = form.querySelector('.form-status');
      const submitBtn = form.querySelector('button[type="submit"]');
      const endpointReady = !form.action.includes('TON_ID_FORMSPREE');
      const defaultLabel = submitBtn.textContent;

      if(!endpointReady){
        status.textContent = "Ce formulaire n'est pas encore branché à Formspree. En attendant, utilise le bouton email de la page Contact.";
        status.className = 'form-status error';
        return;
      }

      // Pour le formulaire de commande : vérifier qu'au moins un article est coché
      const productChecks = form.querySelectorAll('input[name="produits"]');
      if(productChecks.length && !Array.from(productChecks).some(c => c.checked)){
        status.textContent = "Sélectionne au moins un article avant d'envoyer ta commande.";
        status.className = 'form-status error';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours...';

      try{
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if(res.ok){
          form.reset();
          status.textContent = form.dataset.successMessage || 'Message envoyé ! Je te réponds au plus vite.';
          status.className = 'form-status success';
        } else {
          status.textContent = "Oups, une erreur est survenue. Réessaie ou écris-moi directement par email.";
          status.className = 'form-status error';
        }
      } catch(err){
        status.textContent = "Oups, une erreur est survenue. Réessaie ou écris-moi directement par email.";
        status.className = 'form-status error';
      }
      submitBtn.disabled = false;
      submitBtn.textContent = defaultLabel;
    });
  });

  // Gallery filter (uniquement présent sur creations.html)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.art-card');
  if(filterBtns.length){
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        cards.forEach(card => {
          card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
        });
      });
    });
  }
});

// Lightbox (uniquement présent sur creations.html)
function openLightbox(el){
  const title = document.getElementById('lightboxTitle');
  const lightbox = document.getElementById('lightbox');
  if(title) title.textContent = el.dataset.title || 'Illustration';
  if(lightbox) lightbox.classList.add('active');
}
function closeLightbox(){
  const lightbox = document.getElementById('lightbox');
  if(lightbox) lightbox.classList.remove('active');
}
document.addEventListener('click', (e) => {
  if(e.target.id === 'lightbox') closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape') closeLightbox();
});

// Modales de détail des commissions (uniquement présentes sur commissions.html)
function openCommModal(key){
  const modal = document.getElementById('modal-' + key);
  if(modal){
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}
function closeCommModal(key){
  const modal = document.getElementById('modal-' + key);
  if(modal){
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}
document.addEventListener('click', (e) => {
  if(e.target.classList && e.target.classList.contains('comm-modal')){
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape'){
    document.querySelectorAll('.comm-modal.active').forEach(m => m.classList.remove('active'));
    document.body.style.overflow = '';
  }
});
