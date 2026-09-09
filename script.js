document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio-principal');
    const btnPlay = document.getElementById('btn-play');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const albumArt = document.getElementById('album-art');
    const trackTitle = document.getElementById('track-title');
    const trackArtist = document.getElementById('track-artist');

    // 🎵 LISTA DE LAS 6 CANCIONES
    const playlist = [
        { src: "cancion.mp3", portada: "portada.jpg", titulo: "DtMF", artista: "Bad Bunny" },
        { src: "cancion2.mp3", portada: "portada2.jpg", titulo: "Obsesionario en La Mayor", artista: "Tan Biónica" },
        { src: "cancion3.mp3", portada: "portada3.jpg", titulo: "Naistumichiu", artista: "Chano!" },
        { src: "cancion4.mp3", portada: "portada4.jpg", titulo: "Noches de insomnio", artista: "Airbag" },
        { src: "cancion5.mp3", portada: "portada5.jpg", titulo: "Cicatrices", artista: "Airbag" },
        { src: "cancion6.mp3", portada: "portada6.jpg", titulo: "Arruinarse", artista: "Tan Biónica" }
    ];

    let indiceActual = 0;

    function cargarCancion(indice) {
        const cancion = playlist[indice];
        audio.src = cancion.src;
        albumArt.src = cancion.portada;
        trackTitle.textContent = cancion.titulo;
        trackArtist.textContent = cancion.artista;
        audio.load();
    }

    // Inicializar primera canción
    cargarCancion(indiceActual);

    // Intentar arrancar música de una
    audio.play().then(() => {
        btnPlay.textContent = '⏸';
    }).catch(() => {
        console.log("Autoplay retenido por el navegador. Esperando interacción...");
    });

    // Activar música al primer click en la pantalla si estaba bloqueada
    document.body.addEventListener('click', () => {
        if (audio.paused && btnPlay.textContent === '▶') {
            audio.play();
            btnPlay.textContent = '⏸';
        }
    }, { once: true });

    // Manejo de Play / Pausa manual
    btnPlay.addEventListener('click', (e) => {
        e.stopPropagation();
        if (audio.paused) {
            audio.play();
            btnPlay.textContent = '⏸';
        } else {
            audio.pause();
            btnPlay.textContent = '▶';
        }
    });

    // Botón Siguiente Canción
    if (btnNext) {
        btnNext.addEventListener('click', (e) => {
            e.stopPropagation();
            indiceActual = (indiceActual + 1) % playlist.length;
            cargarCancion(indiceActual);
            audio.play();
            btnPlay.textContent = '⏸';
        });
    }

    // Botón Canción Anterior
    if (btnPrev) {
        btnPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            indiceActual = (indiceActual - 1 + playlist.length) % playlist.length;
            cargarCancion(indiceActual);
            audio.play();
            btnPlay.textContent = '⏸';
        });
    }

    // Cuando termina una canción, pasa a la siguiente automáticamente
    audio.addEventListener('ended', () => {
        indiceActual = (indiceActual + 1) % playlist.length;
        cargarCancion(indiceActual);
        audio.play();
    });


    // 📸 DATOS DE LOS RECUERDOS (Modales limpios e independientes)
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

    // Funciones globales para abrir y cerrar el modal de recuerdos
    window.abrirRecuerdo = function(numero) {
        const modal = document.getElementById('modalRecuerdo');
        const modalImg = document.getElementById('modal-img');
        const modalTitulo = document.getElementById('modal-titulo');
        const modalDesc = document.getElementById('modal-desc');

        if (recuerdosData[numero] && modal) {
            modalImg.src = recuerdosData[numero].foto;
            modalTitulo.textContent = recuerdosData[numero].titulo;
            modalDesc.textContent = recuerdosData[numero].texto;
            modal.classList.remove('hidden');
        }
    };

    window.cerrarRecuerdo = function() {
        const modal = document.getElementById('modalRecuerdo');
        if (modal) {
            modal.classList.add('hidden');
        }
    };

    window.cerrarRecuerdoFuera = function(event) {
        const modal = document.getElementById('modalRecuerdo');
        if (event.target === modal) {
            modal.classList.add('hidden');
        }
    };


    // 🌟 LISTA DE FRASES (Las 50 frases unidas)
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

    const btnFrase = document.getElementById('btn-nueva-frase');
    const cajaFrase = document.getElementById('caja-frase');
    let ultimoIndice = -1;

    if (btnFrase && cajaFrase) {
        btnFrase.addEventListener('click', () => {
            cajaFrase.style.opacity = '0';
            setTimeout(() => {
                let nuevoIndice;
                do {
                    nuevoIndice = Math.floor(Math.random() * frases.length);
                } while (nuevoIndice === ultimoIndice);
                ultimoIndice = nuevoIndice;
                cajaFrase.textContent = `"${frases[nuevoIndice]}"`;
                cajaFrase.style.opacity = '1';
            }, 200);
        });
    }

    // ⏳ CONTADOR DE TIEMPO DESDE EL 25 DE ENERO DE 2026
    const fechaInicio = new Date('2026-01-25T00:00:00');

    function actualizarContador() {
        const contadorElemento = document.getElementById('contador-tiempo');
        if (!contadorElemento) return;

        const ahora = new Date();
        let diferencia = Math.floor((ahora - fechaInicio) / 1000); // en segundos

        if (diferencia < 0) {
            contadorElemento.textContent = "Aún falta para esa fecha.";
            return;
        }

        const segundosTotales = diferencia;
        const diasTotales = Math.floor(segundosTotales / 86400);
        const semanas = Math.floor(diasTotales / 7);
        const meses = (ahora.getFullYear() - fechaInicio.getFullYear()) * 12 + (ahora.getMonth() - fechaInicio.getMonth());

        const segundos = segundosTotales % 60;
        const minutos = Math.floor(segundosTotales / 60) % 60;
        const horas = Math.floor(segundosTotales / 3600) % 24;

        contadorElemento.innerHTML = `
        ${meses} meses, ${semanas} semanas, ${diasTotales} días<br>
        y ${horas}h ${minutos}m ${segundos}s
        `;
    }

    setInterval(actualizarContador, 1000);
    actualizarContador();
});

// Lógica fluida para abrir y cerrar subsecciones (fuera del DOMContentLoaded para que sean globales)
function abrirSeccion(idSeccion) {
    const inicio = document.getElementById('inicio-screen');
    const seccionTarget = document.getElementById(idSeccion);

    if (inicio && seccionTarget) {
        inicio.classList.add('hidden');
        seccionTarget.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function volverAlInicio() {
    const inicio = document.getElementById('inicio-screen');
    const subScreens = document.querySelectorAll('.sub-screen');

    if (inicio) {
        subScreens.forEach(screen => {
            screen.classList.add('hidden');
        });
        inicio.classList.remove('hidden');
    }
}

// ============================================= //
// 🎁 WIDGETS EXTRA — "Un recordatorio para hoy"  //
// ============================================= //
document.addEventListener('DOMContentLoaded', () => {

    const hoyStr = () => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    // ---------- 💭 SELECTOR DE ÁNIMO ----------
    const moodRespuestas = {
        genial: [
            "¡Me encanta leer eso! Que ese brillo te dure todo el día ✨",
            "Genial vos, genial el día. Disfrutalo a full 😄"
        ],
        bien: [
            "Qué bueno che, ojalá siga así de lindo el resto del día 🙂",
            "Bien está perfecto. No todo tiene que ser explosivo para ser bueno."
        ],
        meh: [
            "Días así también cuentan, no hace falta que sea todo genial siempre 😐",
            "Un día del montón no es un mal día. Mañana puede venir mejor."
        ],
        mal: [
            "Uh, lo siento. Si podés, probá el ejercicio de respiración de acá abajo, ayuda un toque 🫁",
            "Los días feos pasan, este también va a pasar. Estoy para lo que necesites."
        ],
        pesimo: [
            "Perdón que la estés pasando tan mal. Respirá hondo, tomate un segundo, no tenés que resolver todo hoy 💗",
            "Ey, tranquila. Un día pésimo no define nada. Mandame un mensaje si necesitás hablar, en serio."
        ]
    };
    const moodBtns = document.querySelectorAll('.mood-btn');
    const moodResp = document.getElementById('mood-response');
    moodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            moodBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            const opciones = moodRespuestas[btn.dataset.mood];
            moodResp.textContent = opciones[Math.floor(Math.random() * opciones.length)];
        });
    });

    // ---------- 🎡 RULETA DE MIMOS ----------
    const ruletaMensajes = [
        "Un pedacito de estrella para vos ✨",
        "Te debo (y me debés) un juguito Baggio 🧃",
        "Recordatorio de estirar las piernas y jugar un rato al vóley 🏐",
        "En algún momento te voy a escribir una carta larga, esta es la versión mini 💌",
        "Poné una canción que te guste y bailá 10 segundos, sí o sí 🎶",
        "Sos de las personas con menos maldad que conozco 🌸",
        "Si necesitás un abrazo virtual, andá al widget de acá abajo 🤗",
        "Sos una piba increíble, no hay vuelta que darle ⭐"
    ];
    const ruleta = document.getElementById('ruleta');
    const btnRuleta = document.getElementById('btn-ruleta');
    const ruletaResp = document.getElementById('ruleta-response');
    let rotacionActual = 0;
    let girando = false;
    if (btnRuleta && ruleta) {
        btnRuleta.addEventListener('click', () => {
            if (girando) return;
            girando = true;
            ruletaResp.textContent = '';
            const segAngle = 360 / ruletaMensajes.length;
            const indice = Math.floor(Math.random() * ruletaMensajes.length);
            const vueltasExtra = 5 * 360;
            // Para que el puntero (arriba, 0°) caiga en el centro del segmento elegido
            const objetivo = vueltasExtra + (360 - (indice * segAngle + segAngle / 2));
            rotacionActual += objetivo;
            ruleta.style.transform = `rotate(${rotacionActual}deg)`;
            setTimeout(() => {
                ruletaResp.textContent = ruletaMensajes[indice];
                girando = false;
            }, 4100);
        });
    }

    // ---------- 🫁 RESPIRACIÓN GUIADA ----------
    const circulo = document.getElementById('respiracion-circle');
    const textoResp = document.getElementById('respiracion-texto');
    const btnRespirar = document.getElementById('btn-respirar');
    let respirando = false;
    if (btnRespirar && circulo) {
        btnRespirar.addEventListener('click', () => {
            if (respirando) return;
            respirando = true;
            let ciclo = 0;
            const totalCiclos = 3;
            const paso = (fase) => {
                circulo.classList.remove('inhalar', 'exhalar');
                if (fase === 'inhalar') {
                    textoResp.textContent = 'Inhalá...';
                    circulo.classList.add('inhalar');
                } else if (fase === 'mantener') {
                    textoResp.textContent = 'Mantené...';
                } else {
                    textoResp.textContent = 'Exhalá...';
                    circulo.classList.add('exhalar');
                }
            };
            const secuencia = () => {
                if (ciclo >= totalCiclos) {
                    textoResp.textContent = 'Empezar';
                    circulo.classList.remove('inhalar', 'exhalar');
                    respirando = false;
                    return;
                }
                paso('inhalar');
                setTimeout(() => {
                    paso('mantener');
                    setTimeout(() => {
                        paso('exhalar');
                        setTimeout(() => {
                            ciclo++;
                            secuencia();
                        }, 4000);
                    }, 2000);
                }, 4000);
            };
            secuencia();
        });
    }

    // ---------- ✅ CHECKLIST DE AUTOCUIDADO ----------
    const checklistEls = document.querySelectorAll('#checklist input[type="checkbox"]');
    const rachaTexto = document.getElementById('racha-texto');

    function leerHistorial() {
        try {
            return JSON.parse(localStorage.getItem('valen_checklist_historial')) || {};
        } catch (e) {
            return {};
        }
    }

    function guardarHistorial(historial) {
        localStorage.setItem('valen_checklist_historial', JSON.stringify(historial));
    }

    function calcularRacha(historial) {
        let racha = 0;
        let fecha = new Date();
        // si hoy no está completo todavía, arrancamos a contar desde ayer
        const clave = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const hoyCompleto = historial[clave(fecha)] && historial[clave(fecha)].every(Boolean);
        if (!hoyCompleto) {
            fecha.setDate(fecha.getDate() - 1);
        }
        while (true) {
            const k = clave(fecha);
            if (historial[k] && historial[k].every(Boolean)) {
                racha++;
                fecha.setDate(fecha.getDate() - 1);
            } else {
                break;
            }
        }
        return racha;
    }

    function actualizarRachaTexto() {
        const historial = leerHistorial();
        const racha = calcularRacha(historial);
        rachaTexto.textContent = `🔥 Racha: ${racha} ${racha === 1 ? 'día' : 'días'}`;
    }

    if (checklistEls.length) {
        const historial = leerHistorial();
        const hoyVals = historial[hoyStr()] || [false, false, false, false];
        checklistEls.forEach(input => {
            const idx = Number(input.dataset.idx);
            input.checked = !!hoyVals[idx];
            input.addEventListener('change', () => {
                const h = leerHistorial();
                const arr = h[hoyStr()] || [false, false, false, false];
                arr[idx] = input.checked;
                h[hoyStr()] = arr;
                guardarHistorial(h);
                actualizarRachaTexto();
            });
        });
        actualizarRachaTexto();
    }

    // ---------- 📓 DIARIO RÁPIDO ----------
    const diarioInput = document.getElementById('diario-input');
    const btnDiario = document.getElementById('btn-diario');
    const diarioLista = document.getElementById('diario-lista');

    function leerDiario() {
        try {
            return JSON.parse(localStorage.getItem('valen_diario')) || [];
        } catch (e) {
            return [];
        }
    }

    function renderDiario() {
        const entradas = leerDiario();
        if (!entradas.length) {
            diarioLista.innerHTML = '<p class="widget-list-empty">Todavía no escribiste nada por acá.</p>';
            return;
        }
        diarioLista.innerHTML = entradas.map((e, i) => `
            <div class="widget-list-item">
                <div><span class="item-fecha">${e.fecha}</span>${e.texto}</div>
                <button class="item-borrar" data-i="${i}" title="Borrar">✕</button>
            </div>
        `).join('');
        diarioLista.querySelectorAll('.item-borrar').forEach(b => {
            b.addEventListener('click', () => {
                const entradas2 = leerDiario();
                entradas2.splice(Number(b.dataset.i), 1);
                localStorage.setItem('valen_diario', JSON.stringify(entradas2));
                renderDiario();
            });
        });
    }

    if (btnDiario && diarioInput) {
        btnDiario.addEventListener('click', () => {
            const texto = diarioInput.value.trim();
            if (!texto) return;
            const entradas = leerDiario();
            entradas.unshift({ fecha: hoyStr(), texto });
            if (entradas.length > 20) entradas.pop();
            localStorage.setItem('valen_diario', JSON.stringify(entradas));
            diarioInput.value = '';
            renderDiario();
        });
        renderDiario();
    }

    // ---------- 🙏 LISTA DE GRATITUD ----------
    const gratitudInput = document.getElementById('gratitud-input');
    const btnGratitud = document.getElementById('btn-gratitud');
    const gratitudLista = document.getElementById('gratitud-lista');

    function leerGratitud() {
        try {
            return JSON.parse(localStorage.getItem('valen_gratitud')) || [];
        } catch (e) {
            return [];
        }
    }

    function renderGratitud() {
        const items = leerGratitud();
        if (!items.length) {
            gratitudLista.innerHTML = '<p class="widget-list-empty">Sumá la primera cosita linda de hoy ✨</p>';
            return;
        }
        gratitudLista.innerHTML = items.map((txt, i) => `
            <div class="widget-list-item">
                <div>${txt}</div>
                <button class="item-borrar" data-i="${i}" title="Borrar">✕</button>
            </div>
        `).join('');
        gratitudLista.querySelectorAll('.item-borrar').forEach(b => {
            b.addEventListener('click', () => {
                const items2 = leerGratitud();
                items2.splice(Number(b.dataset.i), 1);
                localStorage.setItem('valen_gratitud', JSON.stringify(items2));
                renderGratitud();
            });
        });
    }

    if (btnGratitud && gratitudInput) {
        const agregar = () => {
            const txt = gratitudInput.value.trim();
            if (!txt) return;
            const items = leerGratitud();
            items.unshift(txt);
            if (items.length > 30) items.pop();
            localStorage.setItem('valen_gratitud', JSON.stringify(items));
            gratitudInput.value = '';
            renderGratitud();
        };
        btnGratitud.addEventListener('click', agregar);
        gratitudInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') agregar();
        });
        renderGratitud();
    }

    // ---------- 🤗 CAJA DE ABRAZOS ----------
    const abrazoMensajes = [
        "Ahí va un abrazo bien fuerte, de esos apretados 🤗",
        "Abrazo virtual enviado. Ojalá se sienta la mitad de real que lo digo 💗",
        "Un abrazo para que se te pase lo que sea que tengas encima 🫂",
        "Recibido: un abrazo gigante con cariño incluido ✨"
    ];
    const btnAbrazo = document.getElementById('btn-abrazo');
    const abrazoCard = document.getElementById('abrazo-card');
    const abrazoResp = document.getElementById('abrazo-response');
    if (btnAbrazo && abrazoCard) {
        btnAbrazo.addEventListener('click', () => {
            abrazoResp.textContent = abrazoMensajes[Math.floor(Math.random() * abrazoMensajes.length)];
            for (let i = 0; i < 6; i++) {
                setTimeout(() => {
                    const corazon = document.createElement('span');
                    corazon.className = 'heart-float';
                    corazon.textContent = ['💗', '💕', '✨', '💖'][Math.floor(Math.random() * 4)];
                    corazon.style.left = `${40 + Math.random() * 20}%`;
                    abrazoCard.appendChild(corazon);
                    setTimeout(() => corazon.remove(), 1900);
                }, i * 120);
            }
        });
    }

    // ---------- 🎮 MINI JUEGO ATRAPA CORAZONES ----------
    const juegoArea = document.getElementById('juego-area');
    const juegoOverlay = document.getElementById('juego-overlay');
    const btnJuego = document.getElementById('btn-juego');
    const juegoScore = document.getElementById('juego-score');
    let juegoInterval = null;
    let juegoTimeout = null;

    function terminarJuego(puntos) {
        clearInterval(juegoInterval);
        clearTimeout(juegoTimeout);
        juegoArea.querySelectorAll('.juego-corazon').forEach(h => h.remove());
        juegoOverlay.style.display = 'flex';
        juegoOverlay.innerHTML = `<button class="widget-btn" id="btn-juego">Jugar de nuevo</button>`;
        document.getElementById('btn-juego').addEventListener('click', iniciarJuego);
        juegoScore.textContent = `Puntos: ${puntos} 🎉`;
    }

    function iniciarJuego() {
        let puntos = 0;
        juegoScore.textContent = 'Puntos: 0';
        juegoOverlay.style.display = 'none';
        const areaWidth = juegoArea.clientWidth;

        juegoInterval = setInterval(() => {
            const corazon = document.createElement('button');
            corazon.className = 'juego-corazon';
            corazon.textContent = '🤍';
            corazon.style.left = `${Math.random() * Math.max(areaWidth - 30, 10)}px`;
            corazon.style.animationDuration = `${2 + Math.random() * 1.5}s`;
            corazon.addEventListener('click', () => {
                puntos++;
                juegoScore.textContent = `Puntos: ${puntos}`;
                corazon.remove();
            });
            corazon.addEventListener('animationend', () => corazon.remove());
            juegoArea.appendChild(corazon);
        }, 600);

        juegoTimeout = setTimeout(() => terminarJuego(puntos), 15000);
    }

    if (btnJuego) {
        btnJuego.addEventListener('click', iniciarJuego);
    }

    // ---------- 💌 CARTA SORPRESA ----------
    const sobre = document.getElementById('sobre');
    const sobreIcono = document.getElementById('sobre-icono');
    const cartaTexto = document.getElementById('carta-texto');
    if (sobre) {
        let abierta = false;
        sobre.addEventListener('click', () => {
            abierta = !abierta;
            cartaTexto.classList.toggle('hidden', !abierta);
            sobreIcono.textContent = abierta ? '💌' : '✉️';
        });
    }
});

// ============================================= //
// 🎁 WIDGETS EXTRA — TANDA 2                     //
// ============================================= //
document.addEventListener('DOMContentLoaded', () => {

    const hoyStr = () => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    // ---------- 🌠 LLUVIA DE ESTRELLAS ----------
    const cieloCanvas = document.getElementById('cielo-canvas');
    const cieloWrap = document.querySelector('.cielo-wrap');
    const cieloResp = document.getElementById('cielo-response');

    if (cieloCanvas && cieloWrap) {
        const ctx = cieloCanvas.getContext('2d');
        let cw, ch;

        function resizeCielo() {
            const w = cieloWrap.clientWidth;
            const h = cieloWrap.clientHeight;
            if (!w || !h) return; // sigue oculto, todavía no hay tamaño real
            cw = cieloCanvas.width = w;
            ch = cieloCanvas.height = h;
        }
        resizeCielo();
        window.addEventListener('resize', resizeCielo);
        if ('ResizeObserver' in window) {
            new ResizeObserver(resizeCielo).observe(cieloWrap);
        }

        // Estrellas fijas de fondo (titilan)
        const fondoEstrellas = Array.from({ length: 45 }, () => ({
            x: Math.random(),
            y: Math.random(),
            r: Math.random() * 1.3 + 0.4,
            fase: Math.random() * Math.PI * 2,
            vel: 0.5 + Math.random() * 1.2
        }));

        // Estrellas fugaces activas
        let fugaces = [];

        function crearFugaz(especial = false) {
            const startX = Math.random() * cw * 0.6;
            const startY = Math.random() * ch * 0.35;
            const ang = (Math.PI / 5) + Math.random() * 0.3; // diagonal hacia abajo-derecha
            const vel = especial ? 5.5 : 3.5 + Math.random() * 1.5;
            fugaces.push({
                x: startX,
                y: startY,
                vx: Math.cos(ang) * vel,
                vy: Math.sin(ang) * vel,
                vida: 1,
                especial,
                largo: especial ? 55 : 32
            });
        }

        let t = 0;
        let ultimoSpawn = 0;

        function loopCielo(ts) {
            if (!cw || !ch) { requestAnimationFrame(loopCielo); return; }
            t += 0.02;
            ctx.clearRect(0, 0, cw, ch);

            // fondo titilante
            fondoEstrellas.forEach(s => {
                const alpha = 0.35 + 0.5 * Math.abs(Math.sin(t * s.vel + s.fase));
                ctx.beginPath();
                ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
                ctx.arc(s.x * cw, s.y * ch, s.r, 0, Math.PI * 2);
                ctx.fill();
            });

            // spawn automático de fugaces suaves
            if (!ultimoSpawn || ts - ultimoSpawn > 2200 + Math.random() * 1800) {
                ultimoSpawn = ts;
                crearFugaz(false);
            }

            fugaces.forEach(f => {
                const tailX = f.x - f.vx * (f.largo / 4);
                const tailY = f.y - f.vy * (f.largo / 4);
                const grad = ctx.createLinearGradient(f.x, f.y, tailX, tailY);
                const color = f.especial ? '255,121,198' : '255,255,255';
                grad.addColorStop(0, `rgba(${color},${f.vida})`);
                grad.addColorStop(1, `rgba(${color},0)`);
                ctx.strokeStyle = grad;
                ctx.lineWidth = f.especial ? 2.4 : 1.6;
                ctx.beginPath();
                ctx.moveTo(f.x, f.y);
                ctx.lineTo(tailX, tailY);
                ctx.stroke();

                ctx.beginPath();
                ctx.fillStyle = `rgba(${color},${f.vida})`;
                ctx.arc(f.x, f.y, f.especial ? 2.2 : 1.4, 0, Math.PI * 2);
                ctx.fill();

                f.x += f.vx;
                f.y += f.vy;
                f.vida -= 0.012;
            });

            fugaces = fugaces.filter(f => f.vida > 0 && f.x < cw + 40 && f.y < ch + 40);

            requestAnimationFrame(loopCielo);
        }
        requestAnimationFrame(loopCielo);

        const deseosMsgs = [
            "Deseo enviado al cielo ✨",
            "Ya volando, ojalá se cumpla 🌠",
            "Pedido registrado en las estrellas 💫",
            "Que se cumpla lo que pediste 🤍"
        ];
        cieloWrap.addEventListener('click', (e) => {
            crearFugaz(true);
            cieloResp.textContent = deseosMsgs[Math.floor(Math.random() * deseosMsgs.length)];
        });
    }

    // ---------- 🃏 TARJETA PIROPO (flip card) ----------
    const piropos = [
        "Sos de las mejores personas que conozco, posta.",
        "Tenés una energía que ilumina cualquier lugar.",
        "Tu risa es de mis sonidos favoritos.",
        "Sos mucho más fuerte de lo que vos misma creés.",
        "Cualquiera que te tenga cerca tiene suerte.",
        "Sos re especial, no hay otra igual.",
        "Tu forma de ver las cosas me sigue sorprendiendo.",
        "Sos un lugar seguro para mucha gente, incluido yo."
    ];
    const flipCard = document.getElementById('flip-card');
    const flipInner = document.getElementById('flip-inner');
    const flipBackText = document.getElementById('flip-back-text');
    if (flipCard && flipInner) {
        flipCard.addEventListener('click', () => {
            const yaVolteada = flipInner.classList.contains('flipped');
            if (!yaVolteada) {
                flipBackText.textContent = piropos[Math.floor(Math.random() * piropos.length)];
            }
            flipInner.classList.toggle('flipped');
        });
    }

    // ---------- 🎨 PIZARRA PARA DIBUJAR ----------
    const pizarraCanvas = document.getElementById('pizarra-canvas');
    if (pizarraCanvas) {
        const pctx = pizarraCanvas.getContext('2d');
        let color = '#ff79c6';
        let dibujando = false;

        function resizePizarra() {
            const wrap = pizarraCanvas.parentElement;
            const w = wrap.clientWidth;
            const h = wrap.clientHeight;
            if (!w || !h) return; // sigue oculto, todavía no hay tamaño real
            let imgData = null;
            if (pizarraCanvas.width && pizarraCanvas.height) {
                imgData = pctx.getImageData(0, 0, pizarraCanvas.width, pizarraCanvas.height);
            }
            pizarraCanvas.width = w;
            pizarraCanvas.height = h;
            pctx.lineCap = 'round';
            pctx.lineJoin = 'round';
            pctx.lineWidth = 3.5;
            if (imgData) pctx.putImageData(imgData, 0, 0);
        }
        resizePizarra();
        window.addEventListener('resize', resizePizarra);
        if ('ResizeObserver' in window) {
            new ResizeObserver(resizePizarra).observe(pizarraCanvas.parentElement);
        }

        function coords(e) {
            const rect = pizarraCanvas.getBoundingClientRect();
            const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
            const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
            return { x: cx, y: cy };
        }

        function empezar(e) {
            dibujando = true;
            const { x, y } = coords(e);
            pctx.strokeStyle = color;
            pctx.beginPath();
            pctx.moveTo(x, y);
            e.preventDefault();
        }
        function dibujar(e) {
            if (!dibujando) return;
            const { x, y } = coords(e);
            pctx.lineTo(x, y);
            pctx.stroke();
            e.preventDefault();
        }
        function terminar() { dibujando = false; }

        pizarraCanvas.addEventListener('mousedown', empezar);
        pizarraCanvas.addEventListener('mousemove', dibujar);
        window.addEventListener('mouseup', terminar);
        pizarraCanvas.addEventListener('touchstart', empezar, { passive: false });
        pizarraCanvas.addEventListener('touchmove', dibujar, { passive: false });
        pizarraCanvas.addEventListener('touchend', terminar);

        document.querySelectorAll('.color-swatch').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.color-swatch').forEach(b => b.classList.remove('activo'));
                btn.classList.add('activo');
                color = btn.dataset.color;
            });
        });

        const btnLimpiar = document.getElementById('btn-limpiar-pizarra');
        if (btnLimpiar) {
            btnLimpiar.addEventListener('click', () => {
                pctx.clearRect(0, 0, pizarraCanvas.width, pizarraCanvas.height);
            });
        }
    }

    // ---------- 🧠 MEMORAMA DE CORAZONES ----------
    const memoGrid = document.getElementById('memorama-grid');
    const memoEstado = document.getElementById('memorama-estado');
    const btnMemoReset = document.getElementById('btn-memorama-reset');

    if (memoGrid) {
        const simbolos = ['💗', '💖', '💕', '💘'];
        let cartas = [];
        let volteadas = [];
        let movimientos = 0;
        let bloqueado = false;

        function barajar(arr) {
            const a = [...arr];
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        }

        function crearMemorama() {
            memoGrid.innerHTML = '';
            volteadas = [];
            movimientos = 0;
            bloqueado = false;
            memoEstado.textContent = 'Movimientos: 0';
            cartas = barajar([...simbolos, ...simbolos]);

            cartas.forEach((simbolo, i) => {
                const el = document.createElement('div');
                el.className = 'memo-card';
                el.dataset.simbolo = simbolo;
                el.dataset.idx = i;
                el.addEventListener('click', () => clickCarta(el));
                memoGrid.appendChild(el);
            });
        }

        function clickCarta(el) {
            if (bloqueado) return;
            if (el.classList.contains('volteada') || el.classList.contains('encontrada')) return;
            el.textContent = el.dataset.simbolo;
            el.classList.add('volteada');
            volteadas.push(el);

            if (volteadas.length === 2) {
                movimientos++;
                memoEstado.textContent = `Movimientos: ${movimientos}`;
                bloqueado = true;
                const [a, b] = volteadas;
                if (a.dataset.simbolo === b.dataset.simbolo) {
                    a.classList.add('encontrada');
                    b.classList.add('encontrada');
                    volteadas = [];
                    bloqueado = false;
                    const encontradas = memoGrid.querySelectorAll('.encontrada').length;
                    if (encontradas === cartas.length) {
                        memoEstado.textContent = `¡Completado en ${movimientos} movimientos! 🎉`;
                    }
                } else {
                    setTimeout(() => {
                        a.classList.remove('volteada');
                        b.classList.remove('volteada');
                        a.textContent = '';
                        b.textContent = '';
                        volteadas = [];
                        bloqueado = false;
                    }, 800);
                }
            }
        }

        crearMemorama();
        if (btnMemoReset) btnMemoReset.addEventListener('click', crearMemorama);
    }

    // ---------- 🎧 CANCIÓN SEGÚN TU HUMOR ----------
    const cancionesPorHumor = {
        genial: { titulo: 'DtMF', artista: 'Bad Bunny', nota: 'para bailar y que no te importe nada.' },
        bien: { titulo: 'Obsesionario en La Mayor', artista: 'Tan Biónica', nota: 'para acompañar un buen día.' },
        nostalgia: { titulo: 'Noches de insomnio', artista: 'Airbag', nota: 'para esos momentos pensativos.' },
        bajon: { titulo: 'Cicatrices', artista: 'Airbag', nota: 'para sentir y después estar mejor.' }
    };
    const cancionResp = document.getElementById('cancion-response');
    document.querySelectorAll('.cancion-mood-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const rec = cancionesPorHumor[btn.dataset.mood];
            if (rec && cancionResp) {
                cancionResp.textContent = `🎵 "${rec.titulo}" - ${rec.artista}, ${rec.nota}`;
            }
        });
    });

    // ---------- ❓ PREGUNTAS PARA CONOCERNOS MEJOR ----------
    const preguntas = [
        "¿Cuál es el recuerdo más random que tenés de este último tiempo?",
        "Si pudieras viajar a cualquier lado ahora mismo, ¿a dónde irías?",
        "¿Qué canción no podés dejar de escuchar últimamente?",
        "¿Cuál fue la última cosa que te hizo reír fuerte?",
        "Si tuvieras un día libre total, ¿qué harías?",
        "¿Qué es algo que te gustaría aprender este año?",
        "¿Cuál es tu comfort food favorita?",
        "¿Qué serie o peli recomendás sí o sí?",
        "¿Qué es algo que te haría un día perfecto?",
        "¿A qué le tenés un poco de miedo pero te gustaría intentar igual?"
    ];
    const preguntaTexto = document.getElementById('pregunta-texto');
    const btnPregunta = document.getElementById('btn-pregunta');
    let ultimaPregunta = -1;
    if (btnPregunta && preguntaTexto) {
        btnPregunta.addEventListener('click', () => {
            let idx;
            do {
                idx = Math.floor(Math.random() * preguntas.length);
            } while (idx === ultimaPregunta && preguntas.length > 1);
            ultimaPregunta = idx;
            preguntaTexto.textContent = preguntas[idx];
        });
    }

    // ---------- ⏱️ MINUTO DE CALMA ----------
    const minutoBarra = document.getElementById('minuto-barra');
    const btnMinuto = document.getElementById('btn-minuto');
    const minutoTexto = document.getElementById('minuto-texto');
    if (btnMinuto && minutoBarra) {
        btnMinuto.addEventListener('click', () => {
            btnMinuto.disabled = true;
            btnMinuto.style.opacity = '0.5';
            minutoTexto.textContent = 'Respirá tranquila, no hay apuro...';
            minutoBarra.style.width = '0%';
            void minutoBarra.offsetWidth; // fuerza reflow para reiniciar transición
            minutoBarra.style.width = '100%';
            setTimeout(() => {
                minutoTexto.textContent = 'Listo, un minuto solo para vos 💗';
                btnMinuto.disabled = false;
                btnMinuto.style.opacity = '1';
                minutoBarra.style.width = '0%';
            }, 60000);
        });
    }

    // ---------- ✉️ CÁPSULA DEL TIEMPO ----------
    const capsulaInput = document.getElementById('capsula-input');
    const btnCapsula = document.getElementById('btn-capsula');
    const capsulaLista = document.getElementById('capsula-lista');

    function leerCapsulas() {
        try {
            return JSON.parse(localStorage.getItem('valen_capsulas')) || [];
        } catch (e) {
            return [];
        }
    }

    function renderCapsulas() {
        const items = leerCapsulas();
        if (!items.length) {
            capsulaLista.innerHTML = '<p class="widget-list-empty">Todavía no guardaste ninguna cápsula.</p>';
            return;
        }
        capsulaLista.innerHTML = items.map((e, i) => `
            <div class="widget-list-item">
                <div><span class="item-fecha">Escrita el ${e.fecha}</span>${e.texto}</div>
                <button class="item-borrar" data-i="${i}" title="Borrar">✕</button>
            </div>
        `).join('');
        capsulaLista.querySelectorAll('.item-borrar').forEach(b => {
            b.addEventListener('click', () => {
                const items2 = leerCapsulas();
                items2.splice(Number(b.dataset.i), 1);
                localStorage.setItem('valen_capsulas', JSON.stringify(items2));
                renderCapsulas();
            });
        });
    }

    if (btnCapsula && capsulaInput) {
        btnCapsula.addEventListener('click', () => {
            const texto = capsulaInput.value.trim();
            if (!texto) return;
            const items = leerCapsulas();
            items.unshift({ fecha: hoyStr(), texto });
            if (items.length > 20) items.pop();
            localStorage.setItem('valen_capsulas', JSON.stringify(items));
            capsulaInput.value = '';
            renderCapsulas();
        });
        renderCapsulas();
    }

    // ---------- 🎲 TIRADA DEL DÍA ----------
    const dadoEmojis = ['✨', '🌸', '🎈', '🍀', '🌈', '🎧', '📚', '🧃', '🏐', '🌙', '☀️', '🦋', '🍕', '🎨', '💌'];
    const dadoFrases = [
        "Día para hacer algo random.",
        "Día ideal para escuchar música fuerte.",
        "Día para mandar un mensaje a alguien que extrañás.",
        "Día para consentirte un toque.",
        "Día para no exigirte tanto.",
        "Día para reírte de alguna boludez.",
        "Día para caminar un rato sin destino.",
        "Día para pedir lo que quieras sin culpa."
    ];
    const dadoDisplay = document.getElementById('dado-display');
    const btnDado = document.getElementById('btn-dado');
    if (btnDado && dadoDisplay) {
        btnDado.addEventListener('click', () => {
            const e1 = dadoEmojis[Math.floor(Math.random() * dadoEmojis.length)];
            const e2 = dadoEmojis[Math.floor(Math.random() * dadoEmojis.length)];
            const e3 = dadoEmojis[Math.floor(Math.random() * dadoEmojis.length)];
            const frase = dadoFrases[Math.floor(Math.random() * dadoFrases.length)];
            dadoDisplay.textContent = `${e1} ${e2} ${e3}`;
            dadoDisplay.parentElement.querySelector('.widget-sub').textContent = frase;
        });
    }
});
