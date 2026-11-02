(function() {
    /* 1. Menu Burger Mobile */
    var menuBtn = document.getElementById('menu-btn');
    var navLinks = document.getElementById('nav-links');
    var navItems = document.querySelectorAll('.nav-link');

    if (menuBtn && navLinks) {
        var icon = menuBtn.querySelector('i');

        // Met à jour l'état du menu et son apparence
        function toggleMenu(forceClose) {
            var isOpen = navLinks.classList.contains('active');

            if (forceClose || isOpen) {
                navLinks.classList.remove('active');
                menuBtn.setAttribute('aria-expanded', 'false');
                menuBtn.setAttribute('aria-label', 'Ouvrir le menu');

                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            } else {
                navLinks.classList.add('active');
                menuBtn.setAttribute('aria-expanded', 'true');
                menuBtn.setAttribute('aria-label', 'Fermer le menu');

                if (icon) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                }
            }
        }

        // Ouverture et fermeture avec le bouton
        menuBtn.addEventListener('click', function() {
            toggleMenu(false);
        });

        // Fermeture après sélection d'une rubrique
        navItems.forEach(function(item) {
            item.addEventListener('click', function() {
                toggleMenu(true);
            });
        });

        // Fermeture avec la touche Échap
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                toggleMenu(true);
            }
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 850) {
                toggleMenu(true);
            }
        });
    }


    /* 2. Animation Fade-in au défilement */
    var elementsToFade = document.querySelectorAll('.rv, .step, .card, .pt');
    elementsToFade.forEach(function(el) { el.classList.add('fade-up'); });

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        elementsToFade.forEach(function(el) { observer.observe(el); });
    } else {
        elementsToFade.forEach(function(el) { el.classList.add('visible'); });
    }

    /* 3. Animation Fréquence Audio Header */
    var cv = document.getElementById('wave');

    if (cv) {
        var ctx = cv.getContext('2d');
        if (!ctx) return;
        var W = 0, H = 0, dpr = 1, mx = -1;
        var animationId = null;
        var isVisible = false;

        var reduceMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        );

        function size() {
            dpr = Math.min(2, window.devicePixelRatio || 1);
            W = cv.clientWidth;
            H = cv.clientHeight;

            cv.width = W * dpr;
            cv.height = H * dpr;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            draw(0);
        }

        function draw(t) {
            ctx.clearRect(0, 0, W, H);

            var gap = W < 520 ? 7 : 9;
            var n = Math.floor(W / gap);
            var cy = H / 2;

            for (var i = 0; i < n; i++) {
                var x = i * gap + gap / 2;
                var u = i / n;

                var env = .35 + .65 * Math.abs(
                    Math.sin(u * 7.3 + 1.1) *
                    Math.cos(u * 3.1)
                );

                var wob = reduceMotion.matches
                    ? 1
                    : .55 + .45 *
                        Math.sin(t * .0017 + i * .45) *
                        Math.sin(t * .0009 + i * .13);

                var near = mx >= 0
                    ? Math.max(0, 1 - Math.abs(x - mx) / (W * .16))
                    : 0;

                var a = (env * wob * .8 + near * .55) * (H * .46);

                ctx.fillStyle = near > .08 || i % 5 === 0
                    ? '#1F3FE0'
                    : '#9FB0F2';

                var bw = 3;

                ctx.beginPath();

                if (ctx.roundRect) {
                    ctx.roundRect(x - bw / 2, cy - a, bw, a * 2, 2);
                } else {
                    ctx.rect(x - bw / 2, cy - a, bw, a * 2);
                }

                ctx.fill();
            }
        }

        function loop(t) {
            draw(t);
            animationId = requestAnimationFrame(loop);
        }

        function startAnimation() {
            if (
                animationId !== null ||
                !isVisible ||
                document.hidden ||
                reduceMotion.matches
            ) return;

            animationId = requestAnimationFrame(loop);
        }

        function stopAnimation() {
            if (animationId !== null) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        }

        // Détecte si le canvas est visible à l'écran
        if ('IntersectionObserver' in window) {
            var waveObserver = new IntersectionObserver(function(entries) {
                isVisible = entries[0].isIntersecting;

                if (isVisible) {
                    startAnimation();
                } else {
                    stopAnimation();
                }
            });

            waveObserver.observe(cv);
        } else {
            isVisible = true;
        }

        // Pause lorsque l'onglet n'est plus actif
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                stopAnimation();
            } else {
                startAnimation();
            }
        });

        // Réagit au changement de préférence d'animation
        reduceMotion.addEventListener('change', function() {
            stopAnimation();
            draw(0);
            startAnimation();
        });

        // Redimensionnement
        window.addEventListener('resize', size);

        // Interaction avec le pointeur
        cv.parentNode.addEventListener('pointermove', function(e) {
            var r = cv.getBoundingClientRect();
            mx = e.clientX - r.left;

            if (reduceMotion.matches) {
                draw(0);
            }
        });

        cv.parentNode.addEventListener('pointerleave', function() {
            mx = -1;

            if (reduceMotion.matches) {
                draw(0);
            }
        });

        size();
        startAnimation();
    }

    /* 4. Gestion des Projets et Modales */
    var P = {
        afp: {
            t: "Le Chat Renard - Montage vidéo",
            m: ['Vidéo', 'Montage', 'DaVinci Resolve'],
            video: true,
            imgHtml: '<div class="yt-wrap"><iframe src="https://www.youtube-nocookie.com/embed/tVxsfvPUwOw?rel=0&playsinline=1" title="Montage : Le Chat Renard (style AFP)" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>',
            d: [
                ['Contexte', "Exercice réalisé dans le cadre du BUT MMI à partir d'une vidéo MP4 regroupant l'ensemble des rushs fournis. Le sujet consistait à réaliser un montage d'actualité, et j'ai choisi de m'inspirer des formats de reportage de l'Agence France-Presse (AFP)."],
                ['Travail réalisé', "Montage individuel, de la sélection des passages utiles dans la vidéo source jusqu'au reportage final. J'ai réorganisé les séquences retenues, puis travaillé l'habillage : sous-titres, éléments graphiques, transitions et bande sonore."],
                ["Ce que j'en retiens", "Partir d'une seule vidéo de rushs oblige à trier avant de monter. J'ai appris à ne garder que l'essentiel, puis à donner du rythme au reportage grâce aux transitions, aux sous-titres et à la musique."],
                ['Contraintes techniques', "Export au format MP4 (H.264), en 1920 × 1080."],
                ['Logiciel utilisé', "DaVinci Resolve"]
            ]
        },

        aff: {
            t: "Affiche - Musée des Arts d'Afrique et d'Asie",
            m: ['Graphisme', 'Affiche', 'Canva'],
            imgHtml: '<img class="m-img" src="Projets/Affiche.png" alt="Affiche pour le Musée des Arts d\'Afrique et d\'Asie de Vichy">',
            d: [
                ['Contexte', "Projet réalisé dans le cadre d'un module de culture artistique du BUT MMI, autour d'une exposition fictive intitulée « Japon - Kimonos de saison », pour le Musée des Arts d'Afrique et d'Asie de Vichy."],
                ['Travail réalisé', "Conception de l'affiche avec une grande liberté sur la composition et les choix visuels. J'ai cherché à mettre en valeur le thème de l'exposition tout en organisant les informations pour que l'affiche reste lisible et attractive."],
                ["Ce que j'en retiens", "Une affiche doit se comprendre en quelques secondes. Ce projet m'a appris à construire une composition autour d'un thème culturel et à hiérarchiser les informations dans un format imposé."],
                ['Format', "Affiche A4 (21 × 29,7 cm)."],
                ['Logiciel utilisé', "Canva"]
            ]
        },

        cine: {
            t: "Digital Ciné-Pass - Carte VIP",
            m: ['Graphisme', 'Illustrator', 'Print'],
            imgHtml: '<div class="m-stack"><img class="m-img-card" src="Projets/Recto.png" alt="Recto de la carte VIP Digital Ciné-Pass"><img class="m-img-card" src="Projets/Verso.png" alt="Verso de la carte VIP Digital Ciné-Pass"></div>',
            d: [
                ['Contexte', "Projet réalisé dans le cadre du BUT MMI : une carte de membre VIP annuelle fictive pour un réseau de cinémas, le Digital Ciné-Pass, à créer à partir d'une maquette fournie."],
                ['Travail réalisé', "Réalisation sur Adobe Illustrator à partir de la maquette imposée. J'ai travaillé les couleurs et les dégradés pour donner du volume, créé un motif répétitif inspiré de la pellicule en arrière-plan avec une faible opacité, puis intégré les informations de la carte et un QR code."],
                ["Ce que j'en retiens", "C'est le projet où j'ai découvert les contraintes d'un support imprimé : CMJN, résolution et fond perdu. J'y ai aussi approfondi les dégradés et les motifs sur Illustrator."],
                ['Contraintes techniques', "Format carte de visite de 85 × 55 mm. Préparation du document pour l'impression en CMJN, à 300 dpi, avec 5 mm de fond perdu."],
                ['Logiciel utilisé', "Adobe Illustrator"]
            ]
        },

        data: {
            t: "Les jeunes et les réseaux sociaux - Data viz",
            m: ['Vidéo', 'Motion design', 'After Effects', 'DaVinci Resolve'],
            imgHtml: '<div class="m-note"><i class="fa-solid fa-chart-simple" aria-hidden="true"></i><strong>Vidéo non diffusée</strong><span>Elle montre d\'autres étudiants : droits à l\'image du groupe.</span></div>',
            d: [
                ['Contexte', "Projet universitaire du BUT MMI (octobre 2026), réalisé en équipe de quatre : une vidéo de communication enrichie de visualisations de données sur les usages des réseaux sociaux chez les jeunes, à partir d'études officielles (CRÉDOC, INJEP, Arcom)."],
                ['Travail réalisé', "J'ai animé sur After Effects les deux graphiques conçus par un membre de l'équipe sur Illustrator, puis réalisé le montage final sur DaVinci Resolve en les intégrant à la vidéo. J'ai aussi participé au tournage et aux recherches dans l'étude de l'Arcom pour préparer le script."],
                ["Ce que j'en retiens", "Ce projet m'a appris à animer des graphiques conçus par un autre membre de l'équipe, puis à les intégrer dans un montage final. J'y ai développé mes compétences en motion design, en montage audiovisuel et en travail d'équipe."],
                ['Contraintes', "Vidéo sous-titrée et accessible (contraste, taille des caractères, lisibilité), avec au moins deux tableaux de données présentés sous forme de graphiques animés."],
                ['Logiciels utilisés', "After Effects, DaVinci Resolve"]
            ]
        }

    };

    var dlg = document.getElementById('dlg'),
        dt = document.getElementById('dt'),
        dd = document.getElementById('dd'),
        dm = document.getElementById('dm'),
        dMedia = document.getElementById('d-media');

    function openModal(k) {
        var o = P[k];
        if (!o) return;
        dlg.classList.toggle('is-video', !!o.video);
        dMedia.innerHTML = o.imgHtml;
        dt.textContent = o.t;
        dm.innerHTML = o.m.map(function(x) { return '<span class="pill">' + x + '</span>'; }).join('');
        dd.innerHTML = o.d.map(function(r) { return '<dt>' + r[0] + '</dt><dd>' + r[1] + '</dd>'; }).join('');
        dlg.showModal();
    }

    document.querySelectorAll('.card-btn').forEach(function(c) {
        c.addEventListener('click', function() { openModal(c.getAttribute('data-p')); });
    });

    function closeModal() { dlg.close(); }
    /* Se déclenche aussi avec la touche Échap : vider la modale coupe la vidéo YouTube */
    dlg.addEventListener('close', function() {
        dMedia.innerHTML = '';
        dlg.classList.remove('is-video');
    });
    document.getElementById('dx').addEventListener('click', closeModal);
    dlg.addEventListener('click', function(e) { if (e.target === dlg) closeModal(); });
})();
