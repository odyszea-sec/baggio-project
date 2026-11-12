document.addEventListener('DOMContentLoaded', () => {
    const $ = (id) => document.getElementById(id);

    // ───────────────────────── 🎵 REPRODUCTOR ─────────────────────────
    const audio = $('audio-principal');
    const btnPlay = $('btn-play');
    const btnPrev = $('btn-prev');
    const btnNext = $('btn-next');
    const albumArt = $('album-art');
    const trackTitle = $('track-title');
    const trackArtist = $('track-artist');
    const progress = $('progress');
    const progressBar = $('progress-bar');

    const playlist = [
        { src: "cancion.mp3", portada: "portada.jpg", titulo: "DtMF", artista: "Bad Bunny" },
        { src: "cancion2.mp3", portada: "portada2.jpg", titulo: "Obsesionario en La Mayor", artista: "Tan Biónica" },
        { src: "cancion3.mp3", portada: "portada3.jpg", titulo: "Naistumichiu", artista: "Chano!" },
        { src: "cancion4.mp3", portada: "portada4.jpg", titulo: "Noches de insomnio", artista: "Airbag" },
        { src: "cancion5.mp3", portada: "portada5.jpg", titulo: "Cicatrices", artista: "Airbag" },
        { src: "cancion6.mp3", portada: "portada6.jpg", titulo: "Arruinarse", artista: "Tan Biónica" }
    ];

    let indiceActual = 0;
    let pausadoPorUsuario = false;

    function reproducir() {
        const p = audio.play();
        if (p && p.catch) p.catch(() => { /* el navegador bloqueó el autoplay */ });
    }

    function cargarCancion(indice) {
        const c = playlist[indice];
        audio.src = c.src;
        albumArt.src = c.portada;
        trackTitle.textContent = c.titulo;
        trackArtist.textContent = c.artista;
        progressBar.style.width = '0%';
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: c.titulo,
                artist: c.artista,
                artwork: [{ src: c.portada }]
            });
        }
    }

    function cambiar(delta) {
        indiceActual = (indiceActual + delta + playlist.length) % playlist.length;
        cargarCancion(indiceActual);
        pausadoPorUsuario = false;
        reproducir();
    }

    function alternar() {
        if (audio.paused) {
            pausadoPorUsuario = false;
            reproducir();
        } else {
            pausadoPorUsuario = true;
            audio.pause();
        }
    }

    // El ícono siempre refleja el estado real del audio
    audio.addEventListener('play', () => { btnPlay.textContent = '⏸'; });
    audio.addEventListener('pause', () => { btnPlay.textContent = '▶'; });
    audio.addEventListener('ended', () => cambiar(1));
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) progressBar.style.width = (audio.currentTime / audio.duration * 100) + '%';
    });

    btnPlay.addEventListener('click', (e) => { e.stopPropagation(); alternar(); });
    btnNext.addEventListener('click', (e) => { e.stopPropagation(); cambiar(1); });
    btnPrev.addEventListener('click', (e) => { e.stopPropagation(); cambiar(-1); });

    // Tocar la barra para adelantar o atrasar
    progress.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!audio.duration) return;
        const r = progress.getBoundingClientRect();
        audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
    });

    // Controles de la pantalla de bloqueo / auriculares
    if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', () => { pausadoPorUsuario = false; reproducir(); });
        navigator.mediaSession.setActionHandler('pause', () => { pausadoPorUsuario = true; audio.pause(); });
        navigator.mediaSession.setActionHandler('previoustrack', () => cambiar(-1));
        navigator.mediaSession.setActionHandler('nexttrack', () => cambiar(1));
    }

    cargarCancion(indiceActual);
    reproducir();

    // Si el autoplay estaba bloqueado, arranca con el primer toque en cualquier lado
    document.addEventListener('pointerdown', () => {
        if (audio.paused && !pausadoPorUsuario) reproducir();
    }, { once: true });

    // ───────────────────────── 🧭 NAVEGACIÓN ─────────────────────────
    const inicio = $('inicio-screen');
    const subScreens = document.querySelectorAll('.sub-screen');

    function mostrar(id) {
        const destino = id && $(id) && $(id).classList.contains('sub-screen') ? id : '';
        inicio.classList.toggle('hidden', destino !== '');
        subScreens.forEach((s) => s.classList.toggle('hidden', s.id !== destino));
        window.scrollTo(0, 0);
    }

    function abrirSeccion(id) {
        history.pushState({ interna: true }, '', '#' + id);
        mostrar(id);
    }

    function volverAlInicio() {
        // Si llegamos desde el menú, usamos el historial para que el botón "atrás" del celu se comporte bien
        if (history.state && history.state.interna) {
            history.back();
        } else {
            history.replaceState(null, '', location.pathname + location.search);
            mostrar('');
        }
    }

    document.querySelectorAll('[data-abrir]').forEach((b) =>
        b.addEventListener('click', () => abrirSeccion(b.dataset.abrir)));
    document.querySelectorAll('[data-volver]').forEach((b) =>
        b.addEventListener('click', volverAlInicio));

    window.addEventListener('popstate', () => {
        cerrarRecuerdo();
        mostrar(location.hash.slice(1));
    });
    mostrar(location.hash.slice(1));

    // ───────────────────────── 📸 RECUERDOS ─────────────────────────
    const recuerdosData = {
    1: {
        titulo: "pic #1 📌",
        texto: "tengo demasiados sentimientos con respecto a esta foto y a ese dia en especifico, ese dia me estabas abrazando (cosa que no haces nunca) y si no fuera por esa foto aveces sentiria que no me queres. en esos momentos de mi vida no estaba en el mejor momento y un gesto tan simple como un abrazo me curan el alma, gracias por ese abrazo y gracias por existir ese dia para mi.",
        foto: "foto1.jpg"
    },
    2: {
        titulo: "pic #2 📌",
        texto: "esta foto es hermosa, 25 de diciembre de 2025 a las 3:48 de la noche, ni yo ni vos ni nadie sabia que iba a pasar esa noche no sabiamos bien a donde ibamos y las calles estaban mojadas, ustedes esperando que llegue con la mochila y listos para caminar a un lugar incierto, matchiamos remera ese dia, una vez mas gracias por existir ese dia para mi.",
        foto: "foto2.jpg"
    },
    3: {
        titulo: "pic #3 📌",
        texto: "esta foto es de mis favoritas en toda mi galeria. es de esos momentos que dps de meses ves las imagenes y decis, no puedo creer que fui tan feliz, es de esas fotos que ves y decis quiero volver, es un momento unico y me lo llevo conmigo por siempre, si algun dia pierdo la memoria, quiero que de las primeras fotos que me muestren para rrecordar todo sea esa, gracias por caminar conmigo ese dia y por seguirme aunque odias caminar, gracias por existir ese dia para mi ",
        foto: "foto3.jpg"
    },
    4: {
        titulo: "pic #4 📌",
        texto: "LKASJHDLKAJSH me lo estoy gozando viendo esa foto, literalmente el resultado de hacerme caso una noche. mas alcohol que sangre y las piernas destruidas de caminar si mal no recuerdo estabamos comiendo pan dulce y jugando al impostor, la verdad ame amanecer con ustedes a mi lado, en general ame pasar esa noche, gracias por pasar esa mañana conmigo y gracias por existir ese dia para mi",
        foto: "foto4.jpg"
    },
    5: {
        titulo: "pic #5 📌",
        texto: "esta foto es a mi parecer magnifica, se que odias ese dia, yo en parte tambien, hay cosas en el contexto de como terminamos ahi que no tuvieron que suceder asi, pero a mi parecer es de esos incidentes que traen cosas lindas, es de las primeras veces que te veia y la verdad sin ese dia no se si estarias leyendo esto ahora, parte del por que te tengo tanto cariño es por eso, el dia del amigo lo pase con vos, y no con quien pensaba y no la pase mal. agradezco que ese dia decidi ir al multi aunque no las conocia, agradezco que hayas estado y una vez mas gracias por existir para mi ese dia.",
        foto: "foto5.jpg"
    }
    };

    const modal = $('modalRecuerdo');
    let ultimoFoco = null;

    function abrirRecuerdo(numero) {
        const r = recuerdosData[numero];
        if (!r) return;
        ultimoFoco = document.activeElement;
        $('modal-img').src = r.foto;
        $('modal-titulo').textContent = r.titulo;
        $('modal-desc').textContent = r.texto;
        modal.classList.remove('hidden');
        modal.querySelector('.modal-content').scrollTop = 0;
        document.body.style.overflow = 'hidden';
        $('modal-cerrar').focus();
    }

    function cerrarRecuerdo() {
        if (modal.classList.contains('hidden')) return;
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
    }

    document.querySelectorAll('[data-recuerdo]').forEach((el) => {
        el.addEventListener('click', () => abrirRecuerdo(el.dataset.recuerdo));
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrirRecuerdo(el.dataset.recuerdo); }
        });
    });
    $('modal-cerrar').addEventListener('click', cerrarRecuerdo);
    modal.addEventListener('click', (e) => { if (e.target === modal) cerrarRecuerdo(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarRecuerdo(); });

    // ───────────────────────── 🌟 FRASES ─────────────────────────
    const frases = [
    "sos divina ✨",
    "Sos una nena re valiosa, nunca te olvides de eso.",
    "Acordate de tomar agua hoy. Sí, es una orden. 💧",
    "Si leíste esto, cuando nos veamos me debés un juguito Baggio. 🧃",
    "No te olvides que no sos invisible para mí. Te extraño un montón.",
    "Aunque esté re lejos, siempre estoy a un mensaje de distancia si te sentís mal.",
    "Tomate las cosas con calma hoy. 'No es para tanto', ¿te acordás?",
    "Espero que hoy nadie te amargue el corazón. Te merecés estar feliz.",
    "Para mí siempre vas a ser la nena más dulce del mundo. ✨",
    "Hagas lo que hagas hoy, sabelo que te banco a muerte.",
    "Que nadie te haga dudar de lo buena persona que sos.",
    "Ojalá la gente viera el mundo con la misma falta de maldad que vos.",
    "Acá tenés un recordatorio amistoso de que sos una piba increíble. 🤜🤛",
    "Si hoy el día viene gris, ponete DtMF a todo volumen y que te importe un carajo.",
    "Cada vez que te bajonees, acordate de que hay gente que te quiere ver bien (yo incluido).",
    "No dejes que las malas vibras de los demás arruinen tu tranquilidad.",
    "Espero que estés teniendo un día lindo, y si no, que mejore prontito.",
    "¡Arriba ese ánimo! Que no se te caiga la corona por gente soberbia. 👑",
    "Hablame cuando quieras, posta. Nunca vas a ser una molestia.",
    "Cuidate mucho hoy, ¿dale? Te quiero ver bien siempre.",
    "Sos de esas personas que hacen que el mundo sea un toque menos injusto.",
    "Paso por acá para recordarte que sos una amiga de fierro.",
    "No te guardes las cosas si te sentís mal, sabés que te escucho.",
    "Gracias por ser siempre tan auténtica y dulce. No cambies nunca.",
    "Un recordatorio random: me pone re contento haberte conocido.",
    // Frases nuevas integradas:
    "Si hoy te sentís pesada con todo, acordate que podés mandar a cagar a cualquiera que te rompa las pelotas.",
    "Pasaba a recordarte que sos una genia total, por más que el día esté medio pelo.",
    "Si necesitas putear un rato por la vida, sabé que mi chat está abierto 24/7.",
    "No te dejes cagar el día por boludos que no valen ni medio centavo.",
    "Acordate de comer bien hoy, no me saltees comidas porque te armo bondi desde acá.",
    "Qué paja estar tan lejos y no poder invitarte a tomar unos mates para reírnos un rato.",
    "Valés oro, posta. No te olvides de eso ni por casualidad.",
    "Si la semana viene pesada, pensá que ya falta menos para que nos juntemos a viciar o a charlar de nada.",
    "Un aplauso para vos que aguantás cada personaje infumable con una paciencia de oro.",
    "Te mando un abrazo virtual gigante, de esos que te desarman un poco la mala onda.",
    "Si hoy querés mandar todo a la mierda y tirarte a dormir todo el día, tenés mi total apoyo moral.",
    "Sos re importante para mí, aunque a veces sea un colgado para decirlo.",
    "Que nadie te haga dudar de lo brillante que sos, eh.",
    "Si te dan ganas de llorar, llorá tranquila y después a seguir, que sos más fuerte de lo que creés.",
    "Me da un orgullo tremendo la piba que sos y cómo le ponés el pecho a todo.",
    "Acordate de ponerte buena música y que se detenga el mundo un ratito.",
    "Si alguien te trata mal, es problema de su cabeza pedorra, no tuyo.",
    "Acá tenés a tu cable a tierra oficial para cuando te sature la realidad.",
    "Sos de lo mejor que me dio este último tiempo, posta te lo digo.",
    "Un día menos para volver a vernos las caras y bardear un rato en persona.",
    "Tenete un poco de paciencia, nadie nace sabiendo cómo lidiar con tanta locura junta.",
    "Si el mundo te parece injusto, sumate al club, pero no dejes que te apague la sonrisa.",
    "Te quiero un montón, pendeja. Cuidate un poco más.",
    "Acordate de respirar hondo y mandar todo lo que te hace mal bien a la concha de su madre.",
    "Acá estoy siempre, pase lo que pase y estemos a los kilómetros que estemos."
    ];

    const btnFrase = $('btn-nueva-frase');
    const cajaFrase = $('caja-frase');
    let bolsa = [];
    let ultima = -1;

    // "Bolsa" mezclada: no se repite ninguna frase hasta haberlas visto todas
    function siguienteFrase() {
        if (bolsa.length === 0) {
            bolsa = frases.map((_, i) => i).sort(() => Math.random() - 0.5);
            if (bolsa[bolsa.length - 1] === ultima) bolsa.unshift(bolsa.pop());
        }
        ultima = bolsa.pop();
        return frases[ultima];
    }

    if (btnFrase && cajaFrase) {
        btnFrase.addEventListener('click', () => {
            cajaFrase.style.opacity = '0';
            setTimeout(() => {
                cajaFrase.textContent = `"${siguienteFrase()}"`;
                cajaFrase.style.opacity = '1';
            }, 200);
        });
    }

    // ───────────────────────── ⏳ TIEMPO SIN VERNOS ─────────────────────────
    // Cuenta desde el 4 de octubre de 2026 (mes 9 = octubre porque enero es 0)
    const fechaInicio = new Date(2026, 9, 4, 0, 0, 0);
    const contador = $('contador-tiempo');

    function actualizarContador() {
        if (!contador) return;
        const ahora = new Date();

        if (ahora < fechaInicio) {
            contador.textContent = "Aún falta para esa fecha.";
            return;
        }

        // meses completos de calendario + el resto en días / horas / minutos / segundos
        let meses = (ahora.getFullYear() - fechaInicio.getFullYear()) * 12 + (ahora.getMonth() - fechaInicio.getMonth());
        let ancla = new Date(fechaInicio);
        ancla.setMonth(fechaInicio.getMonth() + meses);
        if (ancla > ahora) {
            meses--;
            ancla = new Date(fechaInicio);
            ancla.setMonth(fechaInicio.getMonth() + meses);
        }

        const resto = Math.floor((ahora - ancla) / 1000);
        const dias = Math.floor(resto / 86400);
        const horas = Math.floor(resto / 3600) % 24;
        const minutos = Math.floor(resto / 60) % 60;
        const segundos = resto % 60;
        const diasTotales = Math.floor((ahora - fechaInicio) / 86400000);

        const unidad = (n, uno, varios) => `<div><b>${n}</b><small>${n === 1 ? uno : varios}</small></div>`;

        contador.innerHTML = `
            <div class="contador-grid">
                ${unidad(meses, 'mes', 'meses')}
                ${unidad(dias, 'día', 'días')}
                ${unidad(horas, 'hora', 'horas')}
                ${unidad(minutos, 'min', 'min')}
                ${unidad(segundos, 'seg', 'seg')}
            </div>
            <p class="contador-total">${diasTotales} ${diasTotales === 1 ? 'día' : 'días'} desde el 4 de octubre</p>
        `;
    }

    setInterval(actualizarContador, 1000);
    actualizarContador();

    // ───────────────────────── ✨ EXTRAS ─────────────────────────
    // Saludo según la hora
    const hora = new Date().getHours();
    const saludo = $('saludo');
    if (saludo) saludo.textContent = (hora < 6 ? 'buenas madrugadas' : hora < 13 ? 'buen día' : hora < 20 ? 'buenas tardes' : 'buenas noches') + ', lalen ✨';

    // Ecualizador y brillo del reproductor cuando suena
    const reproductor = document.querySelector('.player-iphone-global');
    audio.addEventListener('play', () => reproductor.classList.add('sonando'));
    audio.addEventListener('pause', () => reproductor.classList.remove('sonando'));

    // Chispas / confeti
    function chispas(x, y, lista, n, alcance) {
        for (let i = 0; i < n; i++) {
            const s = document.createElement('span');
            const ang = Math.random() * Math.PI * 2;
            const d = 30 + Math.random() * alcance;
            s.className = 'chispa';
            s.textContent = lista[Math.floor(Math.random() * lista.length)];
            s.style.left = x + 'px';
            s.style.top = y + 'px';
            s.style.fontSize = (0.8 + Math.random() * 0.8) + 'rem';
            s.style.setProperty('--dx', Math.cos(ang) * d + 'px');
            s.style.setProperty('--dy', (Math.sin(ang) * d - 30) + 'px');
            document.body.appendChild(s);
            setTimeout(() => s.remove(), 1000);
        }
    }
    document.addEventListener('pointerdown', (e) => chispas(e.clientX, e.clientY, ['✨'], 3, 40));
    if (btnFrase) btnFrase.addEventListener('click', () => {
        const r = btnFrase.getBoundingClientRect();
        chispas(r.left + r.width / 2, r.top + r.height / 2, ['💗', '✨', '⭐', '🌸', '💖'], 16, 120);
    });

    // Estrellas de fondo (con alguna fugaz de vez en cuando)
    const cv = $('estrellas');
    const ctx = cv.getContext('2d');
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W, H, estrellas = [], fugaz = null;

    function medir() {
        const d = Math.min(window.devicePixelRatio || 1, 2);
        W = window.innerWidth; H = window.innerHeight;
        cv.width = W * d; cv.height = H * d;
        ctx.setTransform(d, 0, 0, d, 0, 0);
        estrellas = Array.from({ length: Math.round(W * H / 14000) }, () => ({
            x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.4 + 0.3,
            t: Math.random() * 6.28, v: Math.random() * 0.02 + 0.005, s: Math.random() * 0.08 + 0.02,
            rosa: Math.random() < 0.25
        }));
    }

    function dibujar() {
        ctx.clearRect(0, 0, W, H);
        for (const e of estrellas) {
            if (!quieto) { e.t += e.v; e.y -= e.s; if (e.y < -2) { e.y = H + 2; e.x = Math.random() * W; } }
            const a = 0.35 + 0.45 * Math.sin(e.t);
            ctx.fillStyle = e.rosa ? `rgba(255,121,198,${a})` : `rgba(255,255,255,${a})`;
            ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, 6.283); ctx.fill();
        }
        if (quieto) return;
        if (!fugaz && Math.random() < 0.002) fugaz = { x: W * 0.2 + Math.random() * W * 0.8, y: Math.random() * H * 0.4, l: 0 };
        if (fugaz) {
            fugaz.x -= 9; fugaz.y += 4.5; fugaz.l++;
            ctx.strokeStyle = `rgba(255,200,235,${Math.max(1 - fugaz.l / 45, 0)})`;
            ctx.lineWidth = 1.6;
            ctx.beginPath(); ctx.moveTo(fugaz.x, fugaz.y); ctx.lineTo(fugaz.x + 60, fugaz.y - 30); ctx.stroke();
            if (fugaz.l > 45) fugaz = null;
        }
        requestAnimationFrame(dibujar);
    }
    medir();
    dibujar();
    window.addEventListener('resize', () => { medir(); if (quieto) dibujar(); });

    // ───────────────────────── 🎧 PLAYLIST ─────────────────────────
    const temas = [
    [
        "9 de Julio",
        "Callejeros",
        "nostalgico, tipico tema que escuchas tomando un mate, top temas q siento q escucharias o escuchas y me hace acordar vos"
    ],
    [
        "Arruinarse",
        "Tan Bionica",
        "Triste, doloroso y nocivo para una noche promedio, mucha historia en una sola cancion. nada que explicar habla por si solo"
    ],
    [
        "BAILE INoLVIDABLE",
        "Bad Bunny",
        "habla por si solo tambien."
    ],
    [
        "Cicatrices",
        "Airbag",
        "nuestro tema amiga."
    ],
    [
        "Claramente",
        "Chano",
        "CLARAMMEEEENTE CLARA NO ME QUERIA."
    ],
    [
        "deja vu",
        "Olivia Rodrigo",
        "no se si lo conoces pero si lo conoces ya sabes pq y si no lo conoces conocelo amiga."
    ],
    [
        "Dominguicidio",
        "Tan Bionica",
        "\"Esta aturdida la consciencia que perdí\nEstoy perdiendo en esta guerra contra mi\nAtormentado sin paciencia ni fe\nMi alma hizo las valijas y se fue\""
    ],
    [
        "DtMF",
        "Bad Bunny",
        "no hace falta explicarlo."
    ],
    [
        "Ese Maldito Momento",
        "No Te Va Gustar",
        "\"si no estas en mis mañanas si no me riooo con voss, es sentirme acorralado\" tristeza total. tema que seguro escuchas o escucharias. al momento de escribir esto te extraño"
    ],
    [
        "Hola Noviembre",
        "Tan Bionica",
        "hola noviembre."
    ],
    [
        "La Melodía de Dios",
        "Tan Bionica",
        "en el nombree de mi desengaño, a la nochee te extraño te extraño, depresion pura este tema"
    ],
    [
        "La Perla",
        "ROSALÍA, Yahritza Y Su Esencia",
        "te odio."
    ],
    [
        "Llora Llora",
        "Milo j, AKRIILA",
        "tema dulce y letra mortal. me mata, siento que te gustaria o te gusta. quiero llorar"
    ],
    [
        "Loca",
        "Tan Bionica",
        "me gusta tan bionica y a vos creo q tambien, compartimos gustos"
    ],
    [
        "Los Graduados",
        "Chano Moreno Charpentier",
        "nostalgico. como nosotres."
    ],
    [
        "Mis Madrugaditas",
        "Tan Bionica",
        "me hace acordar a vos"
    ],
    [
        "Mis Noches de Enero",
        "Tan Bionica",
        "me hace acordar a cuando caminabamos por ahi el verano pasado"
    ],
    [
        "Naistumichiu",
        "Chano",
        "me hace acordar a vos"
    ],
    [
        "No llora",
        "El Cuarteto De Nos",
        "no llores"
    ],
    [
        "No Tengo Ganas",
        "Intoxicados",
        "tema depresivo, como vos"
    ],
    [
        "Noches de Insomnio",
        "Airbag",
        "noches de insomnioooo ohh duermo muy pocoooo wooohh"
    ],
    [
        "Nunca Lo Olvides",
        "Airbag",
        "#vivimosdelanostalgia"
    ],
    [
        "Nunca quise",
        "Intoxicados",
        "tu sangre es roja y la mia tambien"
    ],
    [
        "Obsesionario en La Mayor",
        "Tan Bionica",
        "Obsesionario en La Mayor."
    ],
    [
        "Pensamientos",
        "Airbag",
        "nose, airbag"
    ],
    [
        "Por Mil Noches",
        "Airbag",
        "tema triste y nostalgico, otra vez."
    ],
    [
        "Reflections",
        "The Neighbourhood",
        "tema que esucho mucho y siento que te gustaria."
    ],
    [
        "Tu Falta De Querer",
        "Mon Laferte",
        "gorreadita"
    ],
    [
        "TURiSTA",
        "Bad Bunny",
        "Simplemente DeBÍ TiRAR MáS FOToS"
    ],
    [
        "Verte De Cerca",
        "Airbag",
        "nose, airbag"
    ],
    [
        "WELTiTA",
        "Bad Bunny, Chuwi",
        "DeBÍ TiRAR MáS FOToS."
    ],
    [
        "Why'd You Only Call Me When You're High?",
        "Arctic Monkeys",
        "otro tema que escucho y siento que te gustaria."
    ],
    [
        "Zona de Promesas (with Gustavo Cerati)",
        "Mercedes Sosa, Gustavo Cerati",
        "tema dulce que siento tambeim que te gustaria"
    ]
];

    const lista = $('lista-temas');
    const buscador = $('buscar-tema');
    const cuenta = $('cuenta-temas');
    const sinRes = $('sin-resultados');

    temas.forEach(([titulo, artista, texto], i) => {
        const li = document.createElement('li');
        li.className = 'tema';
        li.dataset.busqueda = (titulo + ' ' + artista).toLowerCase();

        const cab = document.createElement('button');
        cab.className = 'tema-cabeza';
        cab.setAttribute('aria-expanded', 'false');
        cab.innerHTML = '<span class="tema-num"></span><span class="tema-info"><div class="tema-titulo"></div><div class="tema-artista"></div></span><span class="tema-flecha">▼</span>';
        cab.querySelector('.tema-num').textContent = String(i + 1).padStart(2, '0');
        cab.querySelector('.tema-titulo').textContent = titulo;
        cab.querySelector('.tema-artista').textContent = artista;

        const cuerpo = document.createElement('div');
        cuerpo.className = 'tema-cuerpo';
        const inner = document.createElement('div');
        const p = document.createElement('p');
        p.className = 'tema-texto';
        p.textContent = texto || '🤍';
        const a = document.createElement('a');
        a.className = 'tema-link';
        a.target = '_blank';
        a.rel = 'noopener';
        a.href = 'https://open.spotify.com/search/' + encodeURIComponent(titulo + ' ' + artista);
        a.textContent = 'buscar este tema en Spotify ↗';
        inner.append(p, a);
        cuerpo.appendChild(inner);

        cab.addEventListener('click', (e) => {
            const abrir = !li.classList.contains('abierto');
            lista.querySelectorAll('.tema.abierto').forEach((t) => {
                t.classList.remove('abierto');
                t.querySelector('.tema-cabeza').setAttribute('aria-expanded', 'false');
            });
            if (abrir) {
                li.classList.add('abierto');
                cab.setAttribute('aria-expanded', 'true');
                chispas(e.clientX || cab.getBoundingClientRect().left + 40, e.clientY || cab.getBoundingClientRect().top + 20, ['💗', '✨'], 6, 60);
                setTimeout(() => li.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 360);
            }
        });

        li.append(cab, cuerpo);
        lista.appendChild(li);
    });

    function filtrar() {
        const q = buscador.value.trim().toLowerCase();
        let visibles = 0;
        lista.querySelectorAll('.tema').forEach((li) => {
            const ok = !q || li.dataset.busqueda.includes(q);
            li.classList.toggle('hidden', !ok);
            if (ok) visibles++;
        });
        cuenta.textContent = q ? visibles + ' de ' + temas.length + ' temas' : temas.length + ' temas';
        sinRes.classList.toggle('hidden', visibles > 0);
    }
    buscador.addEventListener('input', filtrar);
    filtrar();
});
