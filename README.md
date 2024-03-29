# Dyesaster
-----
## Vídeo de Youtube
>(https://www.youtube.com/watch?v=WZ9HVHNQlCU)
## 1. Información general
>
> ### **1.1 Resumen y caracteristicas generales**
>En Dyesaster tomamos el control de un trabajador de una gran estación espacial. Debido a un fallo en el sistema hemos generado un agujero negro que está expandiéndose y absorbiendo todo desde abajo, mientras al mismo tiempo expulsa objetos. Sólo hay sitio para un jugador en la cápsula de escape de emergencia situada arriba así que nuestro objetivo será ser el primero.
>> + **Competitividad**: el principal objetivo del juego es superar al resto de jugadores en alcanzar la cima, no sólo mediante la rapidez sino también obstaculizando el camino de los demás.
>> + **Estrategia:** los colores toman un papel esencial en la mecánica de juego.  Dependiendo del color del personaje seremos capaces de interactuar con distintas plataformas y será el deber del jugador saber cómo elegirlos.
>> + **Rapidez:** pese a todas las posibilidades de acción que tiene cada jugador durante el juego para dificultar el camino al resto, al final lo más importante es ser el primero, lo cual sólo se podrá conseguir con reflejos y movimientos rápidos.
>
> ### **1.2 Género**
> Dyesaster es un videojuego de plataformas 2D run and gun en el que el protagonista se desplaza a pie con la posibilidad de saltar. La perspectiva de desplazamiento es vertical y presenta movimiento multidireccional. 
-----
## **2. Marketing**
> ### **2.1. Público objetivo**
> Dyesaster es un juego enfocado a un público joven de edades entre 15 y 25 años. En concreto jugadores con gustos en juegos casuales sin mucha trama ni complicación pero que se puedan disfrutar con amigos. Un ejemplo son grupos de estudiantes de instituto/universidad que quieran distraerse un rato después de las clases.
>
> Nuestro juego tendrá una calificación PEGI 7, pues incluye contenido violento pero poco realista.
>
> ### **2.2. Plataforma**
> Estará disponible para PC.
>
> ### **2.3. Competidores**
> En este apartado comparamos juegos con ya sean mecánicas, temática o estética similares a nuestra propuesta, pero con diferencias fundamentales.
>> + **Aesthetic Melody:** se trata de un juego con una estética vaporwave, también de plataformas. Sin embargo Dyesaster difiere en puntos clave. En primer lugar se trata de un juego competitivo así que la experiencia es completamente distinta, mucho más frenética y dinámica.
>
> ### **2.4. Software de terceros usados**
> Durante el desarrollo del juego se utilizará Krita y Photoshop para los gráficos, Phaser 3 para las mecánicas 
>
> Para la producción de la música del juego emplearemos FL Studio y Pro Tools.
-----
## **3. Historia**
> Dyesaster comienza en un futuro lejano con la aparición de un agujero negro en la estación espacial donde se encuentran todos los personajes. En esta estación conviven un gran número de científicos de planetas diferentes y el agujero se ha generado a causa de un fallo del sistema que surge mientras hacían experimentos. 
>
>Poco a poco el agujero está absorbiendo toda la energía de la nave y sus elementos, expandiéndose en todas las direcciones y no sólo eso sino que también expulsa objetos extraños. 
>
> En la cima de la estación espacial hay una única cápsula de emergencia que se pueda usar para escapar pues el resto se situaba en una zona que ya ha sido absorbida. Cada jugador intentará como pueda llegar a esa cápsula y luchar por su vida.
-----
## **4. Gameplay**
> ### **4.1. Diagrama de clases**
>
> ![alt text](/src/main/resources/static/assets/DiagramaDeClases.jpeg)
>
> ### **4.2. Modos de juego**
> Serán partidas todos contra todos de 2, 3 o 4 jugadores. Existirá un modo multijugador local y uno online, en el local todos los jugadores ven la misma pantalla y sólo se permite el 1vs1, mientras que en el multijugador cada uno ve su propio personaje.
>
> ### **4.3. Objetivos y condiciones de victoria**
> El objetivo es conseguir el mayor número de puntos, ya sea llegando más alto o disparando al mayor número de jugadores. Una vez solo queda un jugador vivo, la partida acaba.
>
> ### **4.4. Mecánicas de juego**
> **Características principales:**
>> + El jugador podrá moverse a la izquierda, derecha y saltar.
>> + En la parte de abajo de la pantalla habrá un agujero negro que irá aumentando de tamaño y absorbiendo las plataformas, lo que añade un “contrarreloj” para llegar a la meta.
>> + Si un jugador cae al agujero negro, quedará eliminado.
>> Los jugadores tendrán colores asignados. Pulsando x tecla el jugador puede cambiar de color a alguno de los colores libres del equipo en la pila de colores. Ejemplo: Tenemos equipo de 4 jugadores, con los colores: A, B, C, D. Por el momento no tienen colores disponibles a los que cambiar. Si A muere, B podría obtener el color de A dejando el suyo propio libre para los demás jugadores en caso de que quieran cambiarlo.
>> + Existen pistolas para tirar a los contrincantes de las plataformas. Estas tendrán x número de balas que al acabarse se recargarán solas después de x tiempo. 
>> + Habrá plataformas de colores que estarán desactivadas de principio. Podrán ser activadas por el jugador del color correspondiente para que los demás las puedan usar. Estas estarán activas durante x tiempo pudiendo volver a activarlas.
> ### **4.5. HUDs**
> Durante el juego el interfaz que tiene el jugador en pantalla se basa únicamente en una barra con los colores disponibles en ese momento con los que poder cambiarse. Esto será así tanto en el local como en el online con la única diferencia que en local aparecerán los colores disponibles de los respectivos jugadores a lados opuestos de la pantalla.
-----
## **5. Arte y temática**
> ### **5.1. Estética**
> La temática para el proyecto será Vaporwave. Sabíamos que queríamos un estilo artístico que aunase imagen y sonido en una estética a su vez relacionada con los principales elementos jugables y mecánicas, también quisimos apostar por algo dentro del espectro wave/cyberpunk tan popular en la actualidad para aprovechar el tirón del mismo contando con un amplio nicho de mercado.
>
> Teniendo en cuenta la relevancia del color en las mecánicas, el tono frenético pero no caótico y cierta cohesión narrativa decidimos que la estética del juego sería Vaporwave; relacionada con el espectro mencionado pero no tan explorada como otros estilismos, lo que aportará familiaridad sin perder el toque de frescura.
>
> El Vaporwave se caracteriza por elementos como tipografías japonesas, arquitectura retro, luces de neón, colores pastel, luz ultravioleta, láser, fluorescencia, retrofuturismo o robots. Se trata de un estilismo que surge en los 80, más colorido que el New Wave, con elementos en común con el Synthwave (cuya música asociada es bastante similar), menos agresivo que el Cyberpunk.
>
> Es fácil imaginar cómo todo esto encaja a la perfección con plataformas de colores en una estación espacial que es absorbida por un agujero negro, con láseres multicolor al ritmo de la música ochentera.
>
> ## **5.2. Concept art**
> ![alt text](/Imagenes/nivel.JPG)
>
> Concept simple que nos otorga una visión general de los elementos que constituyen un nivel, sus posiciones respecto de la pantalla y un ligero atisbo de la línea estética que se seguirá (Colores seleccionados, inclusión de efectos como ruido, etc).
>
> ## **5.3. Sonido**
> Los sonidos para botones, menús e interacciones serán de reminiscencia Vaporwave, es decir, generados con sintetizadores, basados en aparatos retro o bien en efectos sonoros de computadores PC o Mac de los 80. Para los efectos sonoros de disparos, saltos y similar el tono será entre realista y cartoon. La banda sonora musical será de género vaporwave.

>## **5.4. Protocolo de websockets**
>El protocolo asíncrono de comunicación mediante websockets empleado centraliza toda la información, la lógica y físicas del juego en el servidor, siendo todos los usuarios clientes.
>Los clientes se comunican con el servidor mediante mensajes pero no guardan información alguna en el mismo; funcionan como meros mandos de juego enviando únicamente las entradas de controles por teclado.
>El servidor realiza todos los cálculos necesarios empleando hilos para aligerar los tiempos de proceso (un hilo por partida, para las físicas de cada jugador un hilo independiente, para las balas diferentes hilos etc...) cuya concurrencia se resuelve en la mayoría de los casos mediante sincronismos sobre las propias clases, o bien con estructuras de datos específicas y sus respectivos métodos concurrentes para garantizar la integridad del funcionamiento del sistema.
>Los clientes reciben mensajes que actualizan variables globales en Phaser activando los distintos cambios en el juego; desde pasar de una escena a otra hasta los movimientos de cada jugador o el nivel generado aleatoriamente adaptado al número de jugadores. De este modo recae en Phaser exclusivamente el peso gráfico del juego, evitando así la posibilidad de que los usuarios efectúen cambios anómalos en el funcionamiento del videojuego
-----
## Integrantes del equipo
> **Pablo López Pérez-Esparza:**
>> + **Correo universidad:** p.lopezpe.2017@alumnos.urjc.es
>> + **Cuenta github:** pablolpe@outlook.com
>
> **María Fuentes Rodríguez:**
>> + **Correo universidad:** m.fuentes.2017@alumnos.urjc.es
>> + **Cuenta github:** m.fuentes.2017@alumnos.urjc.es
>
> **Alberto Alcázar Martín:**
>> + **Correo universidad:** a.alcazarm.2017@alumnos.urjc.es
>> + **Cuenta github:** sevenwordsmusic@gmail.com
>
> **Belén González Mateo:**
>> + **Correo universidad:** b.gonzalezm.2017@alumnos.urjc.es
>> + **Cuenta github:** belen.gm15@gmail.com
>
-----
### Enlaces externos
> **Trello:** <https://trello.com/b/zI3NdsXB/dyesaster>  
> **Presentación:** <https://prezi.com/krbozzr-ajd-/?utm_campaign=share&utm_medium=copy>
