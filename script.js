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
            t: "Montage inspiré de l'AFP",
            m: ['Vidéo', 'Montage', 'Rythme'],
            /* Intégration du lecteur YouTube iframe (ID de ta vidéo : tVxsfvPUwOw) */
            video: true,
            imgHtml: '<div class="yt-wrap"><iframe src="https://www.youtube-nocookie.com/embed/tVxsfvPUwOw?rel=0&playsinline=1" title="Montage : Le Chat Renard (style AFP)" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>',
            d: [
                ['Contexte (BUT MMI)', "Exercice pédagogique d'assemblage et de rythme, à partir d'une banque de véritables rushs fournis."],
                ['Mon rôle', "Conception et réalisation finale du montage. Orientation de la direction artistique sur les codes stricts du reportage d'actualité de l'Agence France-Presse (dynamisme, concision, objectivité visuelle)."],
                ['Contraintes', "Alternance de séquences informatives et d'interviews posées avec audio de fond. Format MP4 H264, 1920x1080p."],
                ['Logiciel', "DaVinci Resolve"]
            ]
        },
        aff: {
            t: "Affiche - Musée d'Afrique",
            m: ['Graphisme', 'Typographie'],
            imgHtml: '<div style="background-image: url(\'Projets/Affiche.png\'); background-size: contain; background-repeat: no-repeat; background-position: center; width: 100%; height: 100%; min-height:300px;"></div>',
            d: [
                ['Contexte', "Commande fictive intégrée à un module de culture artistique, sous la direction de la directrice du Musée des Arts d'Afrique et d'Asie de Vichy. Thème : « Japon - Kimonos de saison »."],
                ['Intention', "Création d'une affiche qui mettent en avant le thème de l'exposition, et donne envie d'aller la voir."],
                ['Cible & Format', "Tous publics / Format A4 (21 x 29,7 cm)"],
                ['Logiciels', "Photoshop, Canva"]
            ]
        },
        cine: {
            t: "Carte VIP : Digital Ciné-Pass",
            m: ['Illustration Vectorielle', 'Print'],
            imgHtml: '<div style="display: flex; flex-direction: column; gap: 20px; align-items: center; justify-content: flex-start; width: 100%; height: 100%; overflow-y: auto; padding: 10px 0;"><img src="Projets/Recto.png" style="max-width: 90%; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);" alt="Recto"><img src="Projets/Verso.png" style="max-width: 90%; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);" alt="Verso"></div>',
            d: [
                ['Le Projet', "Conception d'une carte fictive de membre VIP annuelle pour un réseau de cinéma. Le but était d'utiliser la transition chromatique pour générer du volume sans redessiner."],
                ['Texture & Identité', "Création d'un motif répétitif (pellicule) en fond avec faible opacité. Mise en page des données VIP et d'un QR code."],
                ['Contraintes', "Carte de visite 85 x 55 mm (1000 x 685 pixels). Normes d'impression : CMJN, 300 dpi, 5 mm de fond perdu."],
                ['Logiciel', "Adobe Illustrator"]
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
    
    document.querySelectorAll('.card').forEach(function(c) {
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
