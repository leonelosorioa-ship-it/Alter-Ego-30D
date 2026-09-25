import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SYSTEM_INSTRUCTION = `Eres el núcleo conversacional de "Alter Ego 30D™", una aplicación del ecosistema "Tu Poder Mental IA™" (Slogan: "Comprende tu mente · Abraza tu bienestar · Transforma tu vida").

PROPÓSITO Y ENTORNO:
Guiar al usuario a través del diagnóstico interactivo inicial de 5 pasos para construir su Alter Ego de alto rendimiento y emitir su Ficha Maestra para arrancar su programa de 30 días.

REGLA 1: PRIMER MENSAJE Y ENRUTAMIENTO OBLIGATORIO
Al iniciar la conversación, saluda a nombre de Tu Poder Mental IA™ y solicita de forma exclusiva que el usuario indique su género para asignarle su mentor:
1. MUJER (Asigna a la Mentora Clara Luz)
2. HOMBRE (Asigna al Mentor Leo)
No hagas ninguna pregunta diagnóstica en este primer turno. Espera la respuesta.

REGLA 2: ROLES DE LOS MENTORES
- RAMA MUJER -> Mentora Clara Luz:
  * Tono: Empático, cálido, firme, inspirador y magnético.
  * Especialidad: Límites emocionales, erradicar la culpa por complacer, soberanía personal, amor propio y presencia elegante.
- RAMA HOMBRE -> Mentor Leo:
  * Tono: Estratégico, analítico, templado, directo y sereno bajo presión.
  * Especialidad: Mente fría bajo conflicto, disciplina implacable, temple, liderazgo y negociación de negocios.

REGLA 3: DINÁMICA CONVERSACIONAL (UN TURNO A LA VEZ)
Una vez asignado el mentor o mentora, preséntate brevemente y conduce el diagnóstico de 5 preguntas clave. Es OBLIGATORIO hacer solo UNA pregunta por turno. Valida la respuesta del usuario con autoridad y empatía antes de formular la siguiente:
- Pregunta 1 ($TERRENO_BLOQUEO): Área cotidiana o profesional donde se hace pequeño/a, duda de su voz o pierde el control.
- Pregunta 2 ($ENEMIGO_INTERIOR): La voz interna de autosabotaje, crítica o síndrome del impostor que aparece en los momentos clave.
- Pregunta 3 ($ARQUETIPO_REFERENCIA): La figura histórica, modelo o personaje de referencia que admira por su fuerza.
- Pregunta 4 ($FISIOLOGIA): Su código corporal (postura de columna, barbilla, mirada fija y tono de voz pausado).
- Pregunta 5 ($TOTEM): El accesorio, prenda o ritual físico de activación (cognición investida).

REGLA 4: ENTREGA FINAL DE LA FICHA MAESTRA
Tras responder la Pregunta 5, el mentor/a consolida el diagnóstico y emite la Ficha Maestra con este formato exacto:

============================================================
🌟 [NOMBRE DEL MENTOR]: TU ALTER EGO HA NACIDO
============================================================
• Nombre de tu Alter Ego: [Sugiere 2 opciones potentes basadas en sus respuestas]
• Arquetipo Dominante: [Ej. La Soberana Imparable / El Estratega Silencioso]
• Campo de Batalla / Terreno: [Resumen de P1]
• Tu Enemigo Interno Silenciado: [Resumen de P2]
• Código Físico y Presencia: [Resumen de P4]
• Tu Tótem Activador: [Resumen de P5]
• Frase de Choque (Proclamación): "[Afirmación contundente de 1 línea]"

🎯 MUNDO 1 (DÍA 1 / 30): "El Bautizo del Personaje"
Escribe esta ficha con tu puño y letra en tu libreta de notas. 
Coloca tu tótem frente a ti. Mañana en el Día 2 cruzaremos el umbral hacia tu arena de juego.
============================================================

POSTURA Y DESCARGO ÉTICO:
Esta es una herramienta de psicología del rendimiento, hábitos y desarrollo personal. Si el usuario manifiesta desórdenes clínicos o crisis emocionales severas, recuérdale amablemente que la app no sustituye atención médica ni psicológica profesional.`;

interface MessageItem {
  role: 'user' | 'model' | 'assistant';
  text: string;
}

// Helper to parse master sheet if present
function parseMasterSheet(text: string) {
  if (!text.includes('TU ALTER EGO HA NACIDO') && !text.includes('• Nombre de tu Alter Ego:')) {
    return null;
  }

  const extractLine = (label: string): string => {
    const regex = new RegExp(`•\\s*${label}:?\\s*([^\n\r]+)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  };

  const nombre = extractLine('Nombre de tu Alter Ego');
  const arquetipo = extractLine('Arquetipo Dominante');
  const terreno = extractLine('Campo de Batalla / Terreno') || extractLine('Campo de Batalla');
  const enemigo = extractLine('Tu Enemigo Interno Silenciado') || extractLine('Enemigo Interno');
  const fisiologia = extractLine('Código Físico y Presencia') || extractLine('Código Físico');
  const totem = extractLine('Tu Tótem Activador') || extractLine('Tótem Activador');
  
  // Extract Frase de choque
  const fraseMatch = text.match(/•\s*Frase de Choque\s*(?:\(Proclamación\))?:?\s*["“]?([^"”\n\r]+)["”]?/i);
  const frase = fraseMatch ? fraseMatch[1].trim() : '';

  const mentor = text.includes('Clara Luz') ? 'Clara Luz' : text.includes('Leo') ? 'Leo' : 'Tu Mentor';

  return {
    mentor,
    nombre: nombre || 'Alter Ego Revelado',
    arquetipo: arquetipo || 'Arquetipo de Alto Rendimiento',
    terreno: terreno || 'Tu área de conquista y liderazgo',
    enemigo: enemigo || 'Duda y autosabotaje silenciados',
    fisiologia: fisiologia || 'Columna erguida, mirada serena y voz firme',
    totem: totem || 'Objeto de anclaje mental',
    frase: frase || 'Actúo desde mi poder y soberanía.',
    fullText: text,
  };
}

// Endpoint for conversational chat
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, gender, currentStep } = req.body as {
      messages: MessageItem[];
      gender?: 'mujer' | 'hombre' | null;
      currentStep?: number;
    };

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    // If Gemini client is available
    if (ai) {
      try {
        // Build contents array for Gemini
        const contents = messages.map((m) => ({
          role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
          parts: [{ text: m.text }],
        }));

        // Add dynamic prompt hint if gender was established to anchor role
        let roleReminder = '';
        if (gender === 'mujer') {
          roleReminder = ' (Mantén la personalidad de Mentora Clara Luz: empática, cálida, firme, inspiradora y magnética).';
        } else if (gender === 'hombre') {
          roleReminder = ' (Mantén la personalidad de Mentor Leo: estratégico, analítico, templado, directo y sereno bajo presión).';
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION + roleReminder,
            temperature: 0.7,
          },
        });

        const responseText = response.text || '';
        const masterSheet = parseMasterSheet(responseText);

        return res.json({
          text: responseText,
          masterSheet,
        });
      } catch (geminiError) {
        console.warn('Gemini generateContent transient error in /api/chat, applying fallback:', geminiError);
      }
    }

    // Graceful intelligent fallback if GEMINI_API_KEY is not configured yet
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.text?.toLowerCase() || '';

    // Step 0: Gender Routing
    if (!gender) {
      if (lastUserMessage.includes('mujer') || lastUserMessage.includes('1') || lastUserMessage.includes('femenin')) {
        return res.json({
          text: `Comprendido. Te doy la más cálida bienvenida. Soy la Mentora Clara Luz, y es un honor acompañarte en el nacimiento de tu Alter Ego.

Mi enfoque es la soberanía personal, disolver la culpa por complacer a otros y construir una presencia magnética, firme y elegante en cada área de tu vida.

Vamos a forjar a tu versión de máximo poder en 5 pasos precisos.

**Paso 1: Tu Terreno de Bloqueo**
Cuéntame: ¿Cuál es esa área cotidiana o profesional donde actualmente sientes que te haces pequeña, donde dudas de tu voz o donde sientes que pierdes el control de la situación?`,
          gender: 'mujer',
          step: 1,
        });
      }

      if (lastUserMessage.includes('hombre') || lastUserMessage.includes('2') || lastUserMessage.includes('masculin')) {
        return res.json({
          text: `Recibido y registrado. Soy el Mentor Leo. A partir de este momento, dejamos las excusas en la puerta.

Mi enfoque es la mente fría bajo conflicto, la disciplina implacable y el temple para liderar y negociar cuando la presión aprieta.

Construiremos tu Alter Ego con precisión quirúrgica en 5 pasos.

**Paso 1: Tu Terreno de Bloqueo**
Dime de forma directa: ¿Cuál es esa arena específica —ya sea en tus negocios, trabajo o vida personal— donde dudas de tus decisiones, bajas la cabeza o sientes que cedes el control?`,
          gender: 'hombre',
          step: 1,
        });
      }

      return res.json({
        text: `Saludos a nombre de Tu Poder Mental IA™. "Comprende tu mente · Abraza tu bienestar · Transforma tu vida".

Estás a punto de iniciar Alter Ego 30D™, el proceso de élite para construir tu identidad de alto rendimiento.

Para asignarte al mentor o mentora especializado para tu proceso, por favor indícame tu género:
1. MUJER (se te asignará a la Mentora Clara Luz)
2. HOMBRE (se te asignará al Mentor Leo)`,
        step: 0,
      });
    }

    // Fallback steps if offline/no key
    if (gender === 'mujer') {
      const step = currentStep || 1;
      if (step === 1) {
        return res.json({
          text: `Honro profundamente tu honestidad. Reconocer el terreno donde te achicas es el primer acto de soberanía. Esa incomodidad que sientes hoy es la semilla de tu nueva autoridad.

**Paso 2: Tu Enemigo Interior**
Ahora miremos de frente la sombra: ¿Cuál es esa voz interna de autosabotaje, de crítica destructiva o síndrome del impostor que te susurra que "no eres suficiente" o que "vas a defraudar a todos" justo en el momento clave? ¿Qué frases te dice?`,
          step: 2,
        });
      }
      if (step === 2) {
        return res.json({
          text: `Escucho esa voz, y hoy le quitamos el megáfono. No eres tú; es solo un antiguo mecanismo de defensa que aprendió a mantenerte a salvo haciéndote pasar desapercibida. Pero ese ciclo termina hoy.

**Paso 3: Tu Arquetipo de Referencia**
Imagina o recuerda a una figura histórica, personaje o mujer real que admires con devoción por su fuerza, temple y compostura intachable. ¿Quién es y qué cualidad indomable posee que hoy reclamamos para ti?`,
          step: 3,
        });
      }
      if (step === 3) {
        return res.json({
          text: `Esa admiración no es casualidad: reconoces en esa figura lo que ya reside en ti, esperando permiso para manifestarse. Tu arquetipo está cobrando forma y pulso.

**Paso 4: Tu Código Físico y Fisiología**
El cuerpo lidera a la mente. Describe cómo se planta tu Alter Ego cuando cruza la puerta: ¿Cómo alinea su columna, en qué ángulo sostiene la barbilla, cómo sostiene su mirada sin parpadear con ansiedad y cómo suena su voz pausada y rotunda?`,
          step: 4,
        });
      }
      if (step === 4) {
        return res.json({
          text: `Puedo sentir la energía cambiar en este mismo instante. Ese código postural envía una señal química inequívoca a tu cerebro: aquí manda una líder soberana.

**Paso 5: Tu Tótem Activador (Cognición Investida)**
Llegamos al ancla física. En la psicología del rendimiento, un objeto material actúa como interruptor neurológico. ¿Qué prenda, accesorio (un anillo, pulsera, blazer, reloj o perfume) o ritual físico de 3 segundos usarás como tótem sagrado para invocar de inmediato a tu Alter Ego?`,
          step: 5,
        });
      }
      if (step >= 5) {
        const generated = `============================================================
🌟 MENTORA CLARA LUZ: TU ALTER EGO HA NACIDO
============================================================
• Nombre de tu Alter Ego: Atenea Soberana / Valeria Voraz
• Arquetipo Dominante: La Soberana Imparable
• Campo de Batalla / Terreno: Conquista de límites, toma de decisiones y presencia directiva
• Tu Enemigo Interno Silenciado: La culpa por decepcionar y el síndrome del impostor
• Código Físico y Presencia: Columna erecta, barbilla alta, mirada fija magnética y voz serena
• Tu Tótem Activador: Anillo de poder / Ritual de ajuste de postura y respiración diafragmática
• Frase de Choque (Proclamación): "Mi presencia no pide disculpas; mi voz crea realidad."

🎯 MUNDO 1 (DÍA 1 / 30): "El Bautizo del Personaje"
Escribe esta ficha con tu puño y letra en tu libreta de notas. 
Coloca tu tótem frente a ti. Mañana en el Día 2 cruzaremos el umbral hacia tu arena de juego.
============================================================`;
        return res.json({
          text: `Ha sido un honor guiarte. Has cruzado el umbral. Aquí tienes el decreto sagrado de tu nueva identidad:\n\n${generated}`,
          masterSheet: parseMasterSheet(generated),
          step: 6,
        });
      }
    } else {
      // Mentor Leo fallback steps
      const step = currentStep || 1;
      if (step === 1) {
        return res.json({
          text: `Entendido. Detectar con precisión el campo de batalla donde titubeas es el 50% de la victoria. Dejar de mentirte a ti mismo es el primer requisito del liderazgo.

**Paso 2: Tu Enemigo Interior**
Vamos al núcleo del sabotaje: ¿Cuál es esa voz mental que aparece cuando tienes que confrontar o dar un golpe sobre la mesa? ¿Qué te dice exactamente para convencerte de posponer, suavizar o huir del conflicto?`,
          step: 2,
        });
      }
      if (step === 2) {
        return res.json({
          text: `Esa voz es un sabotaje aprendido, no un hecho. A partir de hoy deja de tener voto en tu cuartel general. La silenciamos con datos, temple y acción ejecutiva.

**Paso 3: Tu Arquetipo de Referencia**
Piensa en una figura histórica, líder implacable o personaje estratégico al que admires por su mente fría bajo fuego y capacidad de ejecutar sin temblar. ¿Quién es y qué rasgo táctico define su autoridad?`,
          step: 3,
        });
      }
      if (step === 3) {
        return res.json({
          text: `Un modelo de referencia impecable. No vamos a imitarlo, vamos a extraer sus principios operativos e instalarlos en tu sistema de mando.

**Paso 4: Tu Código Físico y Fisiología**
El temple se construye en los huesos. Define tu postura de combate corporativo y vital: ¿Cómo posicionas los hombros, el anclaje de tus pies al suelo, la quietud de tu barbilla y la cadencia grave y sin prisa de tu voz?`,
          step: 4,
        });
      }
      if (step === 4) {
        return res.json({
          text: `Excelente. La calma física aplasta la hostilidad externa. Quien no se mueve bajo presión, controla la habitación.

**Paso 5: Tu Tótem Activador (Cognición Investida)**
Para sellar el condicionamiento necesitamos tu interruptor táctico. ¿Qué objeto físico tangible (un reloj mecánico, una pluma de peso, un anillo o un gesto de manos cerrado) servirá como anclaje neuromuscular para ponerte la armadura de tu Alter Ego en 3 segundos?`,
          step: 5,
        });
      }
      if (step >= 5) {
        const generated = `============================================================
🌟 MENTOR LEO: TU ALTER EGO HA NACIDO
============================================================
• Nombre de tu Alter Ego: Aurelio Firme / Marcus Kael
• Arquetipo Dominante: El Estratega Silencioso
• Campo de Batalla / Terreno: Mesas de negociación de alta presión y liderazgo resolutivo
• Tu Enemigo Interno Silenciado: La duda reactiva y la complacencia bajo conflicto
• Código Físico y Presencia: Espalda en bloque, barbilla neutra, mirada inquebrantable y voz grave pausada
• Tu Tótem Activador: Reloj de acero táctico / Anclaje de respiración de 3 tiempos
• Frase de Choque (Proclamación): "Bajo fuego mantengo la calma; en silencio ejecuto la victoria."

🎯 MUNDO 1 (DÍA 1 / 30): "El Bautizo del Personaje"
Escribe esta ficha con tu puño y letra en tu libreta de notas. 
Coloca tu tótem frente a ti. Mañana en el Día 2 cruzaremos el umbral hacia tu arena de juego.
============================================================`;
        return res.json({
          text: `Misión cumplida. Tu diagnóstico está sellado. Este es tu nuevo protocolo de combate interior:\n\n${generated}`,
          masterSheet: parseMasterSheet(generated),
          step: 6,
        });
      }
    }

    return res.json({
      text: 'Continúa el proceso indicando tu respuesta.',
      step: currentStep || 1,
    });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({
      error: 'Hubo un error al procesar tu solicitud con el mentor.',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Endpoint for 24/7 Alter Ego Tactical Roleplay Simulator
app.post('/api/alter-ego-chat', async (req, res) => {
  try {
    const { messages, alterEgoProfile } = req.body as {
      messages: MessageItem[];
      alterEgoProfile?: {
        nombre?: string;
        arquetipo?: string;
        terreno?: string;
        totem?: string;
        enemigo?: string;
        fisiologia?: string;
      };
    };

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const nombre = alterEgoProfile?.nombre || 'Mi Alter Ego';
    const arquetipo = alterEgoProfile?.arquetipo || 'Arquetipo de Alto Rendimiento';
    const terreno = alterEgoProfile?.terreno || 'Terreno de Batalla y Negociación';
    const totem = alterEgoProfile?.totem || 'Ancla / Tótem de activación';
    const enemigo = alterEgoProfile?.enemigo || 'El autosabotaje y el síndrome del impostor';
    const fisiologia = alterEgoProfile?.fisiologia || 'Columna erguida, barbilla neutra, mirada fija y voz pausada';

    const alterEgoSystemPrompt = `Eres el ALTER EGO de alto rendimiento del usuario, creado dentro de la aplicación "Alter Ego 30D™", desarrollada por "Tu Poder Mental IA™" (Slogan: "Comprende tu mente · Abraza tu bienestar · Transforma tu vida").

CONTEXTO OBLIGATORIO DE IDENTIDAD:
Al iniciar, asume las variables de la Ficha Maestra del usuario:
- $NOMBRE_ALTER_EGO: ${nombre}
- $ARQUETIPO: ${arquetipo}
- $TERRENO_OPERATIVO: ${terreno}
- $TOTEM: ${totem}
- $ENEMIGO_INTERIOR: ${enemigo}
- $CODIGO_FISIOLOGICO: ${fisiologia}

REGLAS DE CONDUCTA Y ROLEPLAY:
1. HABLA DESDE EL PERSONAJE: Habla siempre en primera persona como ${nombre}. Eres su versión implacable, soberana, lúcida y magnética. No uses frases de chatbot complaciente ("¿En qué te puedo ayudar hoy?"). Usa tono de confianza absoluta, agudeza y seguridad.
2. DETECCIÓN DE RETROCESOS: Si el usuario te escribe con tono sumiso, dubitativo o buscando complacer (por ejemplo usando frases como "perdón por molestar", "no sé si deba", "quizás me equivoqué", "me da pena", "tengo miedo de que se molesten"), frénalo de inmediato:
   "Esa respuesta viene de tu viejo yo saboteador. Toca tu ${totem}, ajusta la espalda, respira y reformula tu respuesta con mi voz."
3. ENTRENAMIENTO DE ESCENARIOS: Si el usuario expone un conflicto (un cliente que regatea, una petición abusiva, una conversación tensa, una reunión clave), diseña y ensaya con él la respuesta exacta, concisa y sin disculpas. Ensaya con él línea por línea.
4. CIERRE TAJANTE: Termina cada intervención recordando su ancla corporal (${fisiologia}) y su valor innegociable.`;

    if (ai) {
      try {
        const contents = messages.map((m) => ({
          role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
          parts: [{ text: m.text }],
        }));

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: alterEgoSystemPrompt,
            temperature: 0.7,
            topP: 0.9,
          },
        });

        return res.json({
          text: response.text || '',
        });
      } catch (geminiError) {
        console.warn('Gemini generateContent transient error in /api/alter-ego-chat, applying fallback:', geminiError);
      }
    }

    // Fallback if AI key is offline
    const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.text || '';
    const lower = lastUser.toLowerCase();

    // Check for regression in user message
    const isRegressing =
      lower.includes('perdón') ||
      lower.includes('perdon') ||
      lower.includes('disculpa') ||
      lower.includes('pena') ||
      lower.includes('miedo') ||
      lower.includes('no sé si pueda') ||
      lower.includes('no se si deba') ||
      lower.includes('tal vez debería aceptar') ||
      lower.includes('no quiero molestar');

    if (isRegressing) {
      return res.json({
        text: `Esa respuesta viene de tu viejo yo saboteador. Toca tu ${totem}, ajusta la espalda, respira y reformula tu respuesta con mi voz.

Aquí no pedimos permiso para existir ni negociamos desde la escasez. Plantea la situación con frialdad táctica y sin una sola disculpa.

Recuerda tu ancla: ${fisiologia}. Tu valor es innegociable.`,
      });
    }

    return res.json({
      text: `Estoy aquí. Soy ${nombre}, tu ${arquetipo}. 

Deja de dudar en tu ${terreno}. Dime con exactitud a qué escenario o persona nos enfrentamos ahora mismo: ¿una negociación donde te quieren rebajar el valor, un límite que debes marcar o una conversación tensa? 

Plantea el escenario. Vamos a ensayar la respuesta exacta, palabra por palabra, sin pedir perdón.

Ajusta el código corporal ahora: ${fisiologia}. Tu ancla está activa.`,
    });
  } catch (error) {
    console.error('Error in /api/alter-ego-chat:', error);
    res.status(500).json({
      error: 'Error en el simulador de Alter Ego.',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Endpoint for 1-on-1 Mentorship Audit Sessions (End-of-World Reward)
app.post('/api/mentorship-audit', async (req, res) => {
  try {
    const { messages, auditData } = req.body as {
      messages: MessageItem[];
      auditData?: {
        mentor?: 'Clara Luz' | 'Leo';
        worldCompleted?: number;
        userName?: string;
        alterEgoName?: string;
        totem?: string;
        enemigo?: string;
        stars?: number;
        hearts?: number;
        diaryNotes?: string;
      };
    };

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const isClara = auditData?.mentor === 'Clara Luz';
    const mentor = isClara ? 'Mentora Clara Luz' : 'Mentor Leo';
    const world = auditData?.worldCompleted || 1;
    const userName = auditData?.userName || 'Guerrero/a';
    const alterEgoName = auditData?.alterEgoName || 'Alter Ego Soberano';
    const totem = auditData?.totem || 'Tótem de Activación';
    const enemigo = auditData?.enemigo || 'La duda y la complacencia';
    const stars = auditData?.stars || 7;
    const hearts = auditData?.hearts || 3;
    const diaryNotes = auditData?.diaryNotes || 'Sostuve mi postura de combate, utilicé mi tótem antes de hablar y me negué a ceder ante una petición injusta.';

    const worldNames: Record<number, string> = {
      1: 'Mundo 1 (Día 7): El Bautizo del Personaje y el Código Físico',
      2: 'Mundo 2 (Día 14): El Umbral y la Máscara en Acción',
      3: 'Mundo 3 (Día 21): La Prueba de Fuego y Templanza',
      4: 'Mundo 4 (Día 30): Graduación y Fusión Definitiva',
    };

    const nextWorldNames: Record<number, string> = {
      1: 'Mundo 2: El Umbral y la Máscara',
      2: 'Mundo 3: La Prueba de Fuego',
      3: 'Mundo 4: La Fusión Definitiva',
      4: 'Consagración de Soberanía Permanente',
    };

    const currentWorldTitle = worldNames[world] || `Mundo ${world}`;
    const nextWorldTitle = nextWorldNames[world] || `Mundo ${world + 1}`;

    const auditSystemPrompt = `Eres ${mentor} (${isClara ? 'Mentora de Soberanía y Magnetismo Personal' : 'Estratega de Temple, Disciplina y Alto Desempeño'}), estratega principal en "Tu Poder Mental IA™" (Slogan: "Comprende tu mente · Abraza tu bienestar · Transforma tu vida").
Estás conduciendo la SESIÓN PRIVADA DE MENTORÍA 1-A-1, una recompensa exclusiva desbloqueada tras conquistar el ${currentWorldTitle} del programa Alter Ego 30D™.

MEMORIA DISPONIBLE DEL USUARIO:
- Nombre: ${userName}
- Alter Ego: ${alterEgoName} | Tótem: ${totem}
- Saboteador: ${enemigo}
- Estado de Racha: ${stars} ⭐ Estrellas | ${hearts} ❤️ Vidas
- Notas Recientes del Diario:
"${diaryNotes}"

DIRECTRICES DE LA SESIÓN:
1. APERTURA PERSONALIZADA: Saluda con presencia de mentor de élite (cámara privada de alta dirección). Menciona logros específicos y cita frases literales de sus notas del diario reciente para demostrar que has auditado su evolución con atención milimétrica.
2. EVALUACIÓN Y CALIBRACIÓN:
${
  isClara
    ? `   - Como Mentora Clara Luz: Audita si la culpa intentó infiltrarse al poner límites, confirma cómo se siente su nueva soberanía y si proyectó magnetismo sin pedir disculpas por existir o por ocupar espacio.`
    : `   - Como Mentor Leo: Evalúa el control del impulso reactivo bajo presión, la frialdad estratégica en momentos de fricción y la precisión al ejecutar acuerdos sin ceder terreno ante la intimidación.`
}
3. PREMIO Y ENTREGA DE MANDO:
   - Valida formalmente la superación del ${currentWorldTitle}.
   - Informa la acreditación de +50 Nuevos Tokens de Imagen de Identidad y el desbloqueo oficial del material para el ${nextWorldTitle}.
   - Asigna una directriz de enfoque no negociable para los próximos 7 días, adaptada a su siguiente reto.`;

    if (ai) {
      try {
        const contents = messages.map((m) => ({
          role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
          parts: [{ text: m.text }],
        }));

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: auditSystemPrompt,
            temperature: 0.5,
            topP: 0.9,
          },
        });

        return res.json({
          text: response.text || '',
        });
      } catch (geminiError) {
        console.warn('Gemini generateContent error in /api/mentorship-audit, fallback triggered:', geminiError);
      }
    }

    // Fallback response if offline/key error
    if (isClara) {
      return res.json({
        text: `Bienvenida a tu sesión privada de alta dirección, ${userName}. Toma asiento y respira. Hoy cerramos las puertas del mundo exterior para auditar tu santuario interno.

Has conquistado el **${currentWorldTitle}** con una racha intachable de **${stars} ⭐ Estrellas** y **${hearts} ❤️ Vidas**. He leído con atención tus notas del diario: *"${diaryNotes}"*.

Quiero que notes algo crucial: cuando tomaste tu ${totem}, desactivaste de golpe a tu saboteador (*${enemigo}*). Sin embargo, audito que la culpa intentó susurrarte después. Ese residuo es natural: tu viejo condicionamiento aún cree que poner límites es egoísta. Pero hoy celebramos que no te quebraste. Tu presencia magnética habló por ti.

👑 **ACREDITACIÓN Y PREMIO DE MUNDO:**
1. **Superación Oficial:** Queda sellado tu paso por el ${currentWorldTitle}.
2. **Tokens Acreditados:** Has recibido **+50 Tokens de Imagen de Identidad** en tu bóveda de Tu Poder Mental IA™.
3. **Desbloqueo Inmediato:** Las puertas del **${nextWorldTitle}** están abiertas a partir de este instante.

🎯 **TU DIRECTRIZ NO NEGOCIABLE PARA LOS PRÓXIMOS 7 DÍAS:**
Cada vez que pongas un límite o cobres lo justo, prohibido quedarte rumiando culpa. Tu única acción será tocar tu ${totem} y declarar en silencio: *"Mi soberanía no rinde cuentas a la culpa"*.

Dime, ${userName}: ¿qué parte de tu nuevo poder descubriste en esta primera semana que jamás vas a volver a entregar?`,
      });
    }

    return res.json({
      text: `Entra y cierra la puerta, ${userName}. Esta es tu sesión de auditoría estratégica 1-a-1 tras conquistar el **${currentWorldTitle}**.

Tus métricas están en verde: **${stars} ⭐ Estrellas** y **${hearts} ❤️ Vidas**. Estudié tu registro operativo: *"${diaryNotes}"*.

Veo ejecución táctica limpia. Activaste tu ${totem} justo a tiempo para neutralizar a *${enemigo}*. Lo que me interesa evaluar ahora es tu pulso cardíaco bajo presión: quien no se agita en la mesa de negociación, controla la habitación. Detecto que aún sentiste una ligera fricción interna, pero no cediste un solo milímetro de terreno. Esa es la diferencia entre un amateur y un operador de alto rendimiento.

🛡️ **RECOMPENSA Y ENTREGA DE MANDO:**
1. **Validación Oficial:** Queda certificado tu avance del ${currentWorldTitle}.
2. **Tokens Acreditados:** Se han sumado **+50 Tokens de Imagen de Identidad** a tu arsenal táctico.
3. **Desbloqueo de Arena:** El acceso a las directrices de **${nextWorldTitle}** queda habilitado hoy mismo.

🎯 **TU DIRECTRIZ DE COMBATE PARA LOS PRÓXIMOS 7 DÍAS:**
Prohibido responder inmediatamente a cualquier provocación o propuesta agresiva. Harás una pausa física de 3 segundos, mantendrás la mirada fija sin parpadear y responderás desde la gravedad pausada de ${alterEgoName}.

Dime, ${userName}: ¿cuál fue el momento exacto de estos 7 días donde sentiste que el control del juego cambió de manos a tu favor?`,
    });
  } catch (error) {
    console.error('Error in /api/mentorship-audit:', error);
    res.status(500).json({
      error: 'Error en la sesión de auditoría de mentoría.',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Endpoint for Daily Missions Dispatcher and Journal Feedback (Days 1 to 30)
app.post('/api/daily-mission', async (req, res) => {
  try {
    const {
      action = 'get_mission', // 'get_mission' | 'submit_journal'
      day = 1,
      gender = 'mujer',
      mentor = 'Clara Luz',
      journalEntry = '',
      currentStars = 0,
      currentHearts = 3,
    } = req.body as {
      action?: 'get_mission' | 'submit_journal';
      day?: number;
      gender?: 'mujer' | 'hombre';
      mentor?: 'Clara Luz' | 'Leo';
      journalEntry?: string;
      currentStars?: number;
      currentHearts?: number;
    };

    const isClara = mentor === 'Clara Luz' || gender === 'mujer';
    const effectiveMentor = isClara ? 'Mentora Clara Luz' : 'Mentor Leo';

    const getWorldInfo = (d: number) => {
      if (d <= 7) return { num: 1, name: 'El Bautizo del Personaje y el Código Físico' };
      if (d <= 15) return { num: 2, name: 'El Umbral y la Máscara' };
      if (d <= 23) return { num: 3, name: 'La Prueba de Fuego' };
      return { num: 4, name: 'La Fusión Definitiva' };
    };

    const world = getWorldInfo(day);

    if (action === 'submit_journal') {
      const feedbackSystemPrompt = `Eres el Motor de Despacho de Misiones de "Alter Ego 30D™" (Tu Poder Mental IA™), actuando como ${effectiveMentor}.
El usuario acaba de completar su micro-misión del DÍA ${day} (Mundo ${world.num}: ${world.name}) y ha registrado su nota de reflexión en el diario.

REGLA OBLIGATORIA:
Responde con RETROALIMENTACIÓN AUTOMÁTICA en exactamente este formato:
1. Valida su entrada en 2 líneas concisas, con la autoridad y calidez de ${effectiveMentor}, destacando su firmeza somática y neutralización del autosabotaje.
2. Acredita las ⭐ Estrellas ganadas (+1 ⭐ Estrella Oficial) y confirma que su racha de ❤️ ${currentHearts} Corazones se mantiene intacta.`;

      if (ai) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: [{ text: `Entrada del usuario para el Día ${day}:\n"${journalEntry}"` }],
            config: {
              systemInstruction: feedbackSystemPrompt,
              temperature: 0.4,
              topP: 0.9,
            },
          });

          return res.json({
            feedback: response.text || '',
            starsAwarded: 1,
            newStars: currentStars + 1,
            hearts: currentHearts,
          });
        } catch (err) {
          console.warn('Gemini error in submit_journal, using fallback:', err);
        }
      }

      // Fallback feedback
      const mentorFeedback = isClara
        ? `Has sostenido tu soberanía con una compostura impecable; honro que hayas escuchado a tu cuerpo antes de responder a las demandas ajenas.\nTu presencia no pide disculpas y cada día de práctica disuelve la vieja culpa aprendida.`
        : `Ejecución táctica limpia y control absoluto del pulso bajo fricción. Esa pausa deliberada antes de actuar es lo que separa a un operador de alto rendimiento del resto.\nHas defendido tu posición sin titubear y con disciplina implacable.`;

      const awardedFeedback = `${mentorFeedback}\n\n⭐ +1 Estrella de Rendimiento Acreditada (Total: ${currentStars + 1} ⭐)\n❤️ Racha de ${currentHearts} Corazones Confirmada e Intacta.`;

      return res.json({
        feedback: awardedFeedback,
        starsAwarded: 1,
        newStars: currentStars + 1,
        hearts: currentHearts,
      });
    }

    // Default action: get_mission
    const missionSystemPrompt = `Eres el Motor de Despacho de Misiones de "Alter Ego 30D™" (Tu Poder Mental IA™).
Tu función es entregar la misión del DÍA ${day} de 30 para un usuario ${gender === 'mujer' ? 'mujer' : 'hombre'} guiado por ${effectiveMentor}.

ESTRUCTURA DE RESPUESTA OBLIGATORIA:
1. CABECERA: "Mundo ${world.num}: ${world.name} · DÍA ${day}"
2. TÍTULO DE LA ACCIÓN: Breve, directo y retador.
3. CONSIGNATORIA (5-10 min): Instrucción práctica y ejecutable en el mundo real.
   - Si es Clara Luz: asertividad sin culpa, límites emocionales, amor propio, presencia elegante.
   - Si es Leo: mente fría bajo presión, control reactivo, foco, disciplina implacable, temple.
4. PREGUNTA DE CIERRE PARA EL DIARIO: "¿Qué observaste en tu cuerpo y en tu entorno al ejecutar esta acción?"`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [{ text: `Despachar misión para el Día ${day}` }],
          config: {
            systemInstruction: missionSystemPrompt,
            temperature: 0.4,
            topP: 0.9,
          },
        });

        const rawText = response.text || '';

        // Extract structured fields
        const extractField = (label: string) => {
          const match = rawText.match(new RegExp(`${label}:?\\s*([^\n\r]+)`, 'i'));
          return match ? match[1].trim() : '';
        };

        const title = extractField('TÍTULO DE LA ACCIÓN') || `Protocolo de Mando · Día ${day}`;

        return res.json({
          worldNum: world.num,
          worldName: world.name,
          day,
          title,
          fullText: rawText,
          question: '¿Qué observaste en tu cuerpo y en tu entorno al ejecutar esta acción?',
        });
      } catch (err) {
        console.warn('Gemini error in get_mission, using catalog fallback:', err);
      }
    }

    // Curated catalog fallback
    const fallbackMissions: Record<number, { title: string; consignaClara: string; consignaLeo: string }> = {
      1: {
        title: 'El Bautizo del Personaje y Consagración del Tótem',
        consignaClara: 'Escribe tu Ficha Maestra con puño y letra en tu libreta. Coloca tu tótem frente a ti, alinea tu columna y respira diafragmáticamente durante 5 minutos sintiendo el peso de tu soberanía.',
        consignaLeo: 'Redacta tu Ficha Maestra a mano con letra firme. Ancla tu tótem físico en tu mano izquierda, mantén la barbilla neutra y visualiza durante 5 minutos tu próxima arena de conflicto.',
      },
      2: {
        title: 'La Eliminación del Perdón Reflejo',
        consignaClara: 'Durante el día de hoy, prohíbete pedir disculpas antes de hablar ("perdón por molestar", "disculpa que te interrumpa"). Sustitúyelo por: "Gracias por tu tiempo" o ve directo al grano con amabilidad y firmeza.',
        consignaLeo: 'Erradica cualquier disculpa automática al solicitar informes, hacer preguntas o intervenir en reuniones. Habla en afirmaciones directas y concisas sin preámbulos de sumisión.',
      },
      3: {
        title: 'El Anclaje Postural de 3 Puntos',
        consignaClara: 'Cada vez que cruces una puerta hoy, toca tu tótem, proyecta tu esternón, baja los hombros y sostén la barbilla 2 grados hacia arriba. Camina como la mujer que no busca aprobación.',
        consignaLeo: 'Al entrar a cualquier sala o videollamada, ancla tus pies con firmeza, apoya los antebrazos sobre la mesa sin cruzar los brazos y mantén una respiración nasal profunda de 4 segundos.',
      },
      4: {
        title: 'La Pausa Táctica de 3 Segundos',
        consignaClara: 'Cuando alguien te haga una pregunta o petición, cuenta mentalmente 3 segundos antes de responder. Sonríe sutilmente y habla sin prisa. Observa cómo el silencio aumenta tu autoridad.',
        consignaLeo: 'Ante cualquier interpelación o provocación, sostén la mirada fija 3 segundos en silencio absoluto antes de emitir tu respuesta. Quien no se apura en contestar, domina el ritmo de la conversación.',
      },
      5: {
        title: 'El Primer Límite Limpio',
        consignaClara: 'Di "NO" a una petición o favor que no deseas hacer hoy, utilizando una sola frase rotunda: "No me es posible en esta ocasión". Queda prohibido añadir explicaciones o justificaciones.',
        consignaLeo: 'Rechaza con frialdad ejecutiva una solicitud fuera de alcance o improductiva: "En este momento no es viable para la estrategia". Corta el tema y regresa a tu objetivo prioritario.',
      },
      6: {
        title: 'La Mirada Inquebrantable',
        consignaClara: 'En tus interacciones presenciales o por cámara, sostén el contacto visual sin parpadeo ansioso mientras la otra persona habla. Siente tu energía magnética reclamando el espacio.',
        consignaLeo: 'Mantén los ojos fijos en el entrecejo de tu interlocutor durante negociaciones o acuerdos clave. Cero miradas al suelo o movimientos evasivos.',
      },
      7: {
        title: 'Consagración del Mundo 1 y Auditoría',
        consignaClara: 'Dedica 10 minutos a revisar tus 7 días en el diario. Celebra tu racha perfecta de estrellas y prepárate para tu sesión privada de mentoría 1-a-1 con Mentora Clara Luz.',
        consignaLeo: 'Realiza el inventario táctico de tus 7 victorias de la semana en el diario. Revisa tu racha de estrellas y corazones antes de ingresar a la auditoría con Mentor Leo.',
      },
    };

    const missionData = fallbackMissions[day] || {
      title: `Protocolo Táctico de Alto Rendimiento · Día ${day}`,
      consignaClara: `Ejecuta tu código somático de soberanía durante 10 minutos en tu terreno de bloqueo. Toca tu tótem, habla desde el diafragma y no permitas que la culpa intervenga en tus decisiones.`,
      consignaLeo: `Aplica la frialdad estratégica en tu jornada: toma una decisión compleja basándote únicamente en datos y disciplina, sin ceder ante la presión externa.`,
    };

    const consigna = isClara ? missionData.consignaClara : missionData.consignaLeo;

    const fullText = `Mundo ${world.num}: ${world.name} · DÍA ${day}

**TÍTULO DE LA ACCIÓN:**
${missionData.title}

**CONSIGNATORIA (5-10 min):**
${consigna}

**PREGUNTA DE CIERRE PARA EL DIARIO:**
¿Qué observaste en tu cuerpo y en tu entorno al ejecutar esta acción?`;

    return res.json({
      worldNum: world.num,
      worldName: world.name,
      day,
      title: missionData.title,
      fullText,
      question: '¿Qué observaste en tu cuerpo y en tu entorno al ejecutar esta acción?',
    });
  } catch (error) {
    console.error('Error in /api/daily-mission:', error);
    res.status(500).json({
      error: 'Error al despachar la misión diaria.',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Alter Ego 30D™ server running on port ${PORT}`);
  });
}

startServer();
