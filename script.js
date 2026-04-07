const tabButtons = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.day-panel');

for (const button of tabButtons) {
  button.addEventListener('click', () => {
    const day = button.dataset.day;

    for (const btn of tabButtons) {
      btn.classList.remove('active');
    }

    for (const panel of panels) {
      panel.classList.remove('active');
    }

    button.classList.add('active');
    const target = document.getElementById(day);
    if (target) {
      target.classList.add('active');
    }
  });
}

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    }
  },
  {
    threshold: 0.2,
  }
);

for (const item of revealItems) {
  observer.observe(item);
}

const heroVisual = document.querySelector('.hero-visual');
const heroImage = document.querySelector('.college-image');

if (heroVisual && heroImage) {
  heroVisual.addEventListener('mousemove', (event) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    heroImage.style.transform = `translateY(-4px) rotateY(${x * 7}deg) rotateX(${y * -7}deg)`;
  });

  heroVisual.addEventListener('mouseleave', () => {
    heroImage.style.transform = '';
  });
}
