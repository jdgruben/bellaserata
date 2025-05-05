// Initialize GSAP ScrollTrigger
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Initialisation d'EmailJS avec plus de logs
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing EmailJS...');
    emailjs.init("yRb-j4b6K4CJSyp5A");
    console.log('EmailJS initialized successfully');

    // Variables globales
    const nav = document.querySelector('.main-nav');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const rsvpForm = document.getElementById('rsvpForm');
    const sections = document.querySelectorAll('section');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const headings = document.querySelectorAll('h2');
    const formGroups = document.querySelectorAll('.form-group');
    const dressCodeQuote = document.querySelector('.dress-code-quote');
    let lastScroll = 0;

    // Audio elements
    const audioToggle = document.getElementById('toggleAudio');
    const ambientSound = document.getElementById('ambientSound');
    let isAudioPlaying = false;

    // Get the existing confirmation message element
    const confirmationMsg = document.getElementById('confirmation');

    // Create and append UI elements
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    // Loading Animation
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loading);

    // Essayer de jouer l'audio automatiquement de plusieurs façons
    // Fonction plus agressive pour lancer l'audio automatiquement
    async function forcePlayAudio() {
        if (!ambientSound) return;
        
        try {
            // Régler le volume bas au départ pour éviter de surprendre l'utilisateur
            ambientSound.volume = 0.3;
            
            // Essayer de jouer l'audio avec la méthode standard
            await ambientSound.play();
            console.log('Autoplay successful!');
            isAudioPlaying = true;
            
            // Mettre à jour l'icône si la lecture réussit
            if (audioToggle) {
                audioToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            }
            
            // Augmenter progressivement le volume
            let currentVolume = 0.3;
            const fadeIn = setInterval(() => {
                if (currentVolume < 0.8) {
                    currentVolume += 0.1;
                    ambientSound.volume = currentVolume;
                } else {
                    clearInterval(fadeIn);
                }
            }, 700);
            
        } catch (error) {
            console.log('Autoplay prevented by browser:', error);
            // Les navigateurs modernes exigent une interaction utilisateur
            // Nous essaierons de nouveau lors de la première interaction
            setupAutoplayOnInteraction();
        }
    }
    
    // Tente de jouer l'audio dès la première interaction avec la page
    function setupAutoplayOnInteraction() {
        const playAudioOnce = () => {
            if (!isAudioPlaying && ambientSound) {
                ambientSound.play()
                    .then(() => {
                        isAudioPlaying = true;
                        if (audioToggle) {
                            audioToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
                        }
                        console.log('Audio started on user interaction');
                    })
                    .catch(err => console.log('Still cannot play audio:', err));
            }
            
            // Retirer les écouteurs d'événements après la première tentative
            document.removeEventListener('click', playAudioOnce);
            document.removeEventListener('touchstart', playAudioOnce);
            document.removeEventListener('keydown', playAudioOnce);
            document.removeEventListener('scroll', playAudioOnce);
        };
        
        // Ajouter des écouteurs pour différents types d'interactions
        document.addEventListener('click', playAudioOnce);
        document.addEventListener('touchstart', playAudioOnce);
        document.addEventListener('keydown', playAudioOnce);
        document.addEventListener('scroll', playAudioOnce);
    }

    window.addEventListener('load', () => {
        loading.classList.add('hidden');
        setTimeout(() => loading.remove(), 500);
        
        // Essayer de jouer l'audio immédiatement
        forcePlayAudio();
    });

    // Essayer également quand la page devient visible
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && !isAudioPlaying) {
            forcePlayAudio();
        }
    });

    // Audio toggle button
    if (audioToggle && ambientSound) {
        audioToggle.addEventListener('click', async () => {
            try {
                if (!isAudioPlaying) {
                    await ambientSound.play();
                    ambientSound.volume = 0.8;
                    audioToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
                    isAudioPlaying = true;
                } else {
                    ambientSound.pause();
                    audioToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
                    isAudioPlaying = false;
                }
            } catch (error) {
                console.error('Error toggling audio:', error);
            }
        });
    }

    // Initial animations for the hero section
    if (typeof gsap !== 'undefined') {
        gsap.from('.hero-content', {
            opacity: 0,
            y: 30,
            duration: 0.8
        });
        
        gsap.from('h1', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            delay: 0.3
        });
        
        gsap.from('.tagline', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            delay: 0.6
        });
        
        gsap.from('.cta-button', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            delay: 0.9
        });
    }

    // Navigation Scroll Effect
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        if (currentScroll <= 0) {
            nav.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !nav.classList.contains('scroll-down')) {
            nav.classList.remove('scroll-up');
            nav.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && nav.classList.contains('scroll-down')) {
            nav.classList.remove('scroll-down');
            nav.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;

        // Update scroll progress bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = `${scrolled}%`;
    });

    // Mobile Menu
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });

    // Form Submission
    if (rsvpForm && confirmationMsg) {
        console.log('RSVP form found in the document');
        
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Form submitted, preparing to send emails...');
            
            const formData = new FormData(rsvpForm);
            const data = {
                nom: formData.get('nom'),
                prenom: formData.get('prenom'),
                email: formData.get('email'),
                presence: formData.get('presence'),
                message: formData.get('message')
            };
            
            console.log('Form data collected:', data);

            try {
                console.log('Sending email to organizer...');
                
                // Envoyer l'email à l'organisateur avec le service et template corrects
                const organizerResponse = await emailjs.send(
                    "service_8dunhrv", 
                    "template_l167fad", 
                    {
                        // Fixé: Organizer's email is hardcoded, no using submitted email
                        from_name: `${data.prenom} ${data.nom}`,
                        from_email: data.email,
                        nom: data.nom,
                        prenom: data.prenom,
                        email: data.email,
                        presence: data.presence,
                        message: data.message || "Aucun message"
                    }
                );
                
                console.log('Organizer email sent successfully:', organizerResponse);
                
                console.log('Sending confirmation email...');
                
                // Envoyer l'email de confirmation avec le service et template corrects
                const confirmationResponse = await emailjs.send(
                    "service_8dunhrv", 
                    "template_xfdtcqn", 
                    {
                        to_name: `${data.prenom} ${data.nom}`,
                        to_email: data.email,
                        from_name: "La Bella Serrata",
                        nom: data.nom,
                        prenom: data.prenom,
                        presence: data.presence,
                        message: data.message || "Aucun message"
                    }
                );
                
                console.log('Confirmation email sent successfully:', confirmationResponse);

                // Afficher le message de succès
                confirmationMsg.style.display = 'block';
                
                // Cacher le formulaire
                rsvpForm.style.display = 'none';
                
                // Réinitialiser le formulaire pour une utilisation future
                rsvpForm.reset();
                
                console.log('Form submission complete!');

            } catch (error) {
                console.error('Erreur détaillée lors de l\'envoi des emails:', error);
                alert('Une erreur est survenue lors de l\'envoi de votre réponse. Veuillez réessayer.');
            }
        });
    } else {
        console.warn('RSVP form or confirmation element not found in the document!');
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== ANIMATIONS AMÉLIORÉES =====
    
    // Animation des sections au défilement
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    // Observateur pour les sections
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                sectionObserver.unobserve(entry.target);
                
                // Si la section Dress Code est visible, animer la citation
                if (entry.target.id === 'dress-code' && dressCodeQuote) {
                    setTimeout(() => {
                        dressCodeQuote.classList.add('visible');
                    }, 1500); // Délai pour que la galerie apparaisse d'abord
                }
            }
        });
    }, observerOptions);

    // Observateur pour les titres
    const headingsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                headingsObserver.unobserve(entry.target);
                
                // Animer les éléments de formulaire si c'est la section RSVP
                if (entry.target.parentNode.id === 'rsvp') {
                    animateFormGroups();
                }
            }
        });
    }, observerOptions);

    // Animer les éléments du formulaire avec délai
    function animateFormGroups() {
        // Option 1: Animation progressive (désactivée par défaut)
        const useFormAnimation = false; // Mettre à true pour réactiver l'animation
        
        if (useFormAnimation) {
            // Ajouter d'abord la classe animate pour préparer l'animation
            formGroups.forEach(group => {
                group.classList.add('animate');
            });
            
            // Puis ajouter la classe visible avec délai
            formGroups.forEach((group, index) => {
                setTimeout(() => {
                    group.classList.add('visible');
                }, 100 * index);
            });
        }
    }

    // Observer les sections et titres
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    headings.forEach(heading => {
        headingsObserver.observe(heading);
    });

    // Animation pour l'effet de parallaxe lors du défilement
    if (typeof gsap !== 'undefined') {
        const parallaxElements = document.querySelectorAll('.hero-content, .names, .date, .tagline');
        
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.classList.contains('hero-content') ? 0.5 : 0.7;
                const yPos = -(scrollPosition * speed / 10);
                gsap.to(element, {
                    y: yPos,
                    ease: 'power1.out',
                    duration: 0.3
                });
            });
        });
        
        // Animer les éléments de la galerie avec un effet de cascade
        const gallerySection = document.getElementById('dress-code');
        if (gallerySection) {
            const galleryItems = gallerySection.querySelectorAll('.gallery-item');
            
            // Créer une timeline pour l'animation en grille
            const galleryTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: gallerySection,
                    start: 'top 70%',
                    toggleActions: 'play none none none'
                }
            });
            
            // Réorganiser les éléments pour une animation plus intéressante
            const chunks = Math.ceil(galleryItems.length / 4); // 4 éléments par groupe
            
            for (let i = 0; i < chunks; i++) {
                const chunk = Array.from(galleryItems).slice(i * 4, (i + 1) * 4);
                
                galleryTimeline.from(chunk, {
                    opacity: 0,
                    y: 50,
                    stagger: 0.1,
                    duration: 0.6,
                    ease: 'power2.out'
                }, i * 0.2); // Décalage entre les groupes
            }
        }
    }

    // Gallery Lightbox avec animation améliorée
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            
            const lightboxContent = document.createElement('div');
            lightboxContent.className = 'lightbox-content';
            
            const lightboxImg = document.createElement('img');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            
            const closeButton = document.createElement('button');
            closeButton.className = 'close-lightbox';
            closeButton.innerHTML = '&times;';
            
            // Créer un loader pour l'image
            const loader = document.createElement('div');
            loader.className = 'lightbox-loader';
            loader.innerHTML = '<div class="spinner"></div>';
            
            lightboxContent.appendChild(loader);
            lightboxContent.appendChild(lightboxImg);
            lightboxContent.appendChild(closeButton);
            lightbox.appendChild(lightboxContent);
            document.body.appendChild(lightbox);
            
            // Attendre que l'image soit chargée
            lightboxImg.onload = () => {
                loader.style.display = 'none';
            };
            
            if (typeof gsap !== 'undefined') {
                // Animation d'ouverture
                gsap.from(lightbox, {
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    duration: 0.4,
                    ease: 'power2.out'
                });
                
                gsap.from(lightboxContent, {
                    scale: 0.9,
                    opacity: 0,
                    duration: 0.5,
                    delay: 0.1,
                    ease: 'back.out(1.7)'
                });
                
                // Fermeture avec animation
                const closeLightbox = () => {
                    gsap.to(lightboxContent, {
                        scale: 0.9,
                        opacity: 0,
                        duration: 0.3,
                        ease: 'power2.in'
                    });
                    
                    gsap.to(lightbox, {
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        duration: 0.4,
                        delay: 0.1,
                        onComplete: () => lightbox.remove()
                    });
                };
                
                closeButton.addEventListener('click', closeLightbox);
                
                lightbox.addEventListener('click', (e) => {
                    if (e.target === lightbox) {
                        closeLightbox();
                    }
                });
            } else {
                // Fallback sans GSAP
                closeButton.addEventListener('click', () => {
                    lightbox.remove();
                });
                
                lightbox.addEventListener('click', (e) => {
                    if (e.target === lightbox) {
                        lightbox.remove();
                    }
                });
            }
        });
    });
});