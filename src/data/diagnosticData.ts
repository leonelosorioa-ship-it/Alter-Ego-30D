import { DiagnosticStepInfo, MentorProfile } from '../types.ts';

export const MENTORS: Record<'mujer' | 'hombre', MentorProfile> = {
  mujer: {
    id: 'mujer',
    name: 'Mentora Clara Luz',
    title: 'Mentora de Soberanía & Magnetismo Personal',
    avatar: '✨',
    tone: 'Empático, cálido, firme, inspirador y magnético',
    specialty: [
      'Límites emocionales inquebrantables',
      'Erradicar la culpa por complacer a otros',
      'Soberanía personal y amor propio profundo',
      'Presencia elegante y voz con autoridad',
    ],
    themeColor: 'from-amber-600/30 via-rose-950/40 to-stone-950',
    accentColor: 'text-amber-300 border-amber-500/40 bg-amber-500/10',
    quote: '"Tu presencia no pide disculpas por existir; tu voz crea realidad."',
  },
  hombre: {
    id: 'hombre',
    name: 'Mentor Leo',
    title: 'Estratega de Temple, Disciplina & Alto Desempeño',
    avatar: '⚔️',
    tone: 'Estratégico, analítico, templado, directo y sereno bajo presión',
    specialty: [
      'Mente fría bajo conflicto y hostilidad',
      'Disciplina implacable y ejecución táctica',
      'Temple inquebrantable y presencia serena',
      'Liderazgo de impacto y negociación de negocios',
    ],
    themeColor: 'from-blue-900/30 via-emerald-950/30 to-stone-950',
    accentColor: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10',
    quote: '"Bajo fuego mantén la calma; en silencio ejecuta la victoria."',
  },
};

export const DIAGNOSTIC_STEPS: DiagnosticStepInfo[] = [
  {
    number: 1,
    variable: '$TERRENO_BLOQUEO',
    title: 'Terreno de Bloqueo',
    description: 'Área cotidiana o profesional donde te haces pequeño/a, dudas de tu voz o pierdes el control.',
    suggestions: {
      mujer: [
        'Al pedir aumentos o cobrar tarifas profesionales dignas',
        'Poner límites a familiares o expareja sin sentir culpa',
        'Hablar frente a directivos masculinos o juntas directivas',
        'Decir "NO" a favores que desgastan mi energía',
      ],
      hombre: [
        'Negociaciones de alta tensión con socios o clientes difíciles',
        'Confrontaciones laborales donde siento que reacciono impulsivo',
        'Cerrar tratos comerciales sin bajar mi precio por inseguridad',
        'Mantener la compostura cuando cuestionan mi autoridad en el equipo',
      ],
    },
  },
  {
    number: 2,
    variable: '$ENEMIGO_INTERIOR',
    title: 'Enemigo Interior',
    description: 'La voz interna de autosabotaje, crítica o síndrome del impostor en momentos clave.',
    suggestions: {
      mujer: [
        '"Van a pensar que eres egoísta o poco colaborativa"',
        '"No estás lo suficientemente preparada para liderar esto"',
        '"Si dices lo que piensas, se van a alejar de ti"',
        '"Mejor quédate callada para mantener la fiesta en paz"',
      ],
      hombre: [
        '"Te van a descubrir como un fraude si fallas este tiro"',
        '"No estás al nivel de los que están sentados en esta mesa"',
        '"Si te quedas callado evitas el conflicto, no arriesgues"',
        '"Vas a perder el control y arruinar tu reputación"',
      ],
    },
  },
  {
    number: 3,
    variable: '$ARQUETIPO_REFERENCIA',
    title: 'Arquetipo de Referencia',
    description: 'Figura histórica, personaje o modelo de referencia que admiras por su fuerza.',
    suggestions: {
      mujer: [
        'Atenea / Sofía (Sabiduría serena y estrategia implacable)',
        'Cleopatra / Eleanor Roosevelt (Diplomacia magnética y soberanía)',
        'Coco Chanel / Frida Kahlo (Autenticidad sin concesiones)',
        'Una líder o mentora real que jamás titubea en sus valores',
      ],
      hombre: [
        'Marco Aurelio (Estoicismo, temple de acero y mente lúcida)',
        'Winston Churchill / Julio César (Liderazgo en tiempos de caos)',
        'Michael Jordan / Kobe Bryant (Mentalidad implacable de ejecución)',
        'Un estratega sereno que escucha más de lo que habla y domina el juego',
      ],
    },
  },
  {
    number: 4,
    variable: '$FISIOLOGIA',
    title: 'Código Corporal & Fisiología',
    description: 'Alineación de columna, barbilla, mirada fija y tono de voz pausado.',
    suggestions: {
      mujer: [
        'Columna vertebral de reina, hombros relajados atrás, barbilla sutilmente elevada',
        'Mirada cálida pero fija a los ojos sin pestañeo ansioso',
        'Voz desde el diafragma: pausada, melódica, sin prisa por ser aprobada',
        'Manos tranquilas y gestos amplios que reclaman el espacio',
      ],
      hombre: [
        'Columna en bloque sólido, pies anclados al suelo, barbilla neutral',
        'Mirada inmutable de halcón, respiración nasal lenta y profunda',
        'Tono de voz grave, con pausas estratégicas de 2 segundos antes de responder',
        'Inmovilidad absoluta bajo presión: quien no se agita, manda',
      ],
    },
  },
  {
    number: 5,
    variable: '$TOTEM',
    title: 'Tótem Activador (Cognición Investida)',
    description: 'El accesorio, prenda o ritual físico de activación inmediata.',
    suggestions: {
      mujer: [
        'Un anillo dorado de obsidiana o cuarzo que giro antes de entrar a reunión',
        'Un blazer sastre de corte impecable o perfume de notas amaderadas y ámbar',
        'Ritual de 3 respiraciones profundas tocando mi esternón',
        'Un labial rojo carmín o pluma estilográfica dorada',
      ],
      hombre: [
        'Un reloj mecánico de esfera oscura que ajusto a mi muñeca como armadura',
        'Un anillo de sello metálico o pulsera de acero pulido',
        'Acomodo de puños de camisa + respiración de 3 tiempos de combate',
        'Una pluma pesada de metal con la que firmo y anoto con firmeza',
      ],
    },
  },
];

export const WORLDS_ROADMAP = [
  {
    world: 1,
    title: 'El Bautizo del Personaje y el Código Físico',
    days: 'Días 1 a 7',
    tagline: 'Construcción del alter ego y anclaje somático',
    milestones: [
      'Día 1: Bautizo y consagración de la Ficha Maestra con puño y letra.',
      'Día 2: Primer cruce del umbral con el tótem físico frente a ti.',
      'Día 3: Instalación del código corporal: barbilla y mirada sin parpadeo ansioso.',
      'Día 5: La prueba del silencio: pausas deliberadas en conversaciones.',
      'Día 7: Revisión de la primera semana y bautismo consolidado.',
    ],
  },
  {
    world: 2,
    title: 'El Umbral y la Máscara',
    days: 'Días 8 a 15',
    tagline: 'Cognición investida en tu arena real de juego',
    milestones: [
      'Día 8: Activar el tótem en tu terreno de bloqueo número 1.',
      'Día 10: Erradicar la respuesta automática de pedir disculpas sin motivo.',
      'Día 12: Toma de una decisión difícil usando exclusivamente la voz del Alter Ego.',
      'Día 15: Medición de impacto: cómo reacciona tu entorno a tu nueva presencia.',
    ],
  },
  {
    world: 3,
    title: 'La Prueba de Fuego',
    days: 'Días 16 a 23',
    tagline: 'Mente fría bajo conflicto y límites inquebrantables',
    milestones: [
      'Día 16: Confrontación sin ira: sostener la mirada y exponer datos con serenidad.',
      'Día 18: Decir "NO" a una petición demandante sin dar justificaciones.',
      'Día 20: Negociación o petición audaz en tu ámbito profesional.',
      'Día 23: Silenciar definitivamente al Enemigo Interior en vivo.',
    ],
  },
  {
    world: 4,
    title: 'La Fusión Definitiva',
    days: 'Días 24 a 30',
    tagline: 'La máscara se vuelve tu rostro: soberanía permanente',
    milestones: [
      'Día 24: Integrar el Alter Ego a tu identidad basal: ya no es actuación, eres tú.',
      'Día 27: Transmitir calma y autoridad a otros en momentos de caos.',
      'Día 29: El inventario de victorias de los 30 días.',
      'Día 30: Graduación: Emisión del Sello de Soberanía de Tu Poder Mental IA™.',
    ],
  },
];
