document.addEventListener('DOMContentLoaded', function () {
    
    const headlineScroll = document.getElementById('headline-scroll');
    const clone = headlineScroll.cloneNode(true);
    headlineScroll.parentNode.appendChild(clone);

    
    const scrollWidth = headlineScroll.scrollWidth;
    headlineScroll.style.width = `${scrollWidth}px`;
    clone.style.width = `${scrollWidth}px`;

    
    const sobreSection = document.getElementById('sobre');
    const skillsSection = document.getElementById('skills');
    const sobreCards = document.querySelectorAll('.conteudo-sobre'); 

    
    skillsSection.style.opacity = '0';
    skillsSection.style.pointerEvents = 'none';
    skillsSection.style.position = 'absolute'; 

    window.addEventListener('scroll', function () {
        
        const allCardsVisible = Array.from(sobreCards).every(card => {
            const cardBottom = card.getBoundingClientRect().bottom;
            return cardBottom <= (window.innerHeight || document.documentElement.clientHeight);
        });

        
        if (allCardsVisible) {
            skillsSection.style.opacity = '1'; 
            skillsSection.style.pointerEvents = 'auto'; 
            skillsSection.style.position = 'relative'; 
        } else {
            skillsSection.style.opacity = '0'; 
            skillsSection.style.pointerEvents = 'none'; 
        }
    });
});

const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
@keyframes scroll {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-50%);
    }
}`;
document.head.appendChild(styleSheet);
