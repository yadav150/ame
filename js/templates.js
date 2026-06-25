// templates.js
document.addEventListener('DOMContentLoaded', () => {
    // Add any hover effects or tracking if needed
    const cards = document.querySelectorAll('.template-card');
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            // The link already works, but we could store the choice
            const href = card.getAttribute('href');
            console.log('Template selected:', href);
        });
    });
});
