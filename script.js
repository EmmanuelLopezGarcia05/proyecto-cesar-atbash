/**
 * Criptosistema Clásico & Analizador Al-Kindi
 * Autor: Emmanuel De Jesús López García
 * Ingeniería en Sistemas Computacionales - Universidad Autónoma de Aguascalientes
 *
 * Este módulo implementa cifrado/descifrado César y Atbash usando como base
 * el CÓDIGO ASCII/Unicode de cada carácter (charCodeAt / String.fromCharCode):
 * cada carácter del conjunto definido por el usuario se traduce primero a su
 * valor numérico de código, y toda la aritmética modular del cifrado se
 * realiza sobre esos códigos, no sobre el carácter en sí. Esto permite que
 * el conjunto de caracteres incluya símbolos fuera del ASCII estándar de 7
 * bits (como 'ñ' o acentos), ya que JavaScript representa cualquier carácter
 * como un código numérico (UTF-16), generalizando el mismo principio.
 */

// Frecuencias relativas esperadas en idioma español para análisis Chi-Cuadrado (Al-Kindi)
const SPANISH_FREQUENCIES = {
  'a': 12.53, 'b': 1.42, 'c': 4.68, 'd': 5.86, 'e': 13.68, 'f': 0.69, 'g': 1.01,
  'h': 0.70, 'i': 6.25, 'j': 0.44, 'k': 0.02, 'l': 4.97, 'm': 3.15, 'n': 6.71,
  'ñ': 0.31, 'o': 8.68, 'p': 2.51, 'q': 0.88, 'r': 6.87, 's': 7.98, 't': 4.63,
  'u': 3.93, 'v': 0.90, 'w': 0.01, 'x': 0.22, 'y': 0.90, 'z': 0.52, ' ': 15.00
};

// --- CONTROL DE INTERFAZ ---

function updateAlphabetLength() {
  const alphabet = document.getElementById('alphabetInput').value;
  document.getElementById('alphabetLength').innerText = alphabet.length;
}

function toggleShiftInput() {
  const cipher = document.getElementById('cipherSelect').value;
  const shiftGroup = document.getElementById('shiftGroup');
  shiftGroup.style.display = cipher === 'cesar' ? 'block' : 'none';
}

// --- ALGORITMOS DE CIFRADO Y DESCIFRADO (base: código ASCII/Unicode) ---

/**
 * Convierte el alfabeto/conjunto de caracteres definido por el usuario en su
 * tabla de códigos ASCII/Unicode. Esta tabla de códigos numéricos es la base
 * real sobre la que se hace la aritmética modular de César y Atbash.
 */
function getAlphabetCodeTable(alphabet) {
  return Array.from(alphabet).map(ch => ch.charCodeAt(0));
}

function cipherCesar(text, shift, alphabet, decrypt = false) {
  const codeTable = getAlphabetCodeTable(alphabet);
  const N = codeTable.length;
  let result = "";
  const effectiveShift = decrypt ? (N - (shift % N)) % N : shift % N;

  for (let char of text) {
    const charCode = char.charCodeAt(0);          // Paso 1: carácter -> código ASCII/Unicode
    const idx = codeTable.indexOf(charCode);       // Posición de ese código dentro de la tabla
    if (idx !== -1) {
      const newIdx = (idx + effectiveShift) % N;   // Aritmética modular sobre la tabla de códigos
      result += String.fromCharCode(codeTable[newIdx]); // Paso 2: código -> carácter
    } else {
      result += char; // Preserva el carácter si su código no pertenece al alfabeto definido
    }
  }
  return result;
}

function cipherAtbash(text, alphabet) {
  const codeTable = getAlphabetCodeTable(alphabet);
  const N = codeTable.length;
  let result = "";

  for (let char of text) {
    const charCode = char.charCodeAt(0);           // carácter -> código ASCII/Unicode
    const idx = codeTable.indexOf(charCode);
    if (idx !== -1) {
      const newIdx = N - 1 - idx;                  // espejo sobre la tabla de códigos
      result += String.fromCharCode(codeTable[newIdx]); // código -> carácter
    } else {
      result += char;
    }
  }
  return result;
}

function executeEncryption() {
  const text = document.getElementById('encryptInput').value;
  const alphabet = document.getElementById('alphabetInput').value;
  const cipher = document.getElementById('cipherSelect').value;
  const shift = parseInt(document.getElementById('shiftInput').value) || 0;

  if (!text || !alphabet) {
    alert("Por favor ingrese el texto y el alfabeto.");
    return;
  }

  let cipheredText = "";
  if (cipher === 'cesar') {
    cipheredText = cipherCesar(text, shift, alphabet);
  } else if (cipher === 'atbash') {
    cipheredText = cipherAtbash(text, alphabet);
  }

  document.getElementById('encryptResult').innerText = cipheredText;
}

// --- MOTOR DE ANÁLISIS ESTADÍSTICO (AL-KINDI) ---

function calculateChiSquared(text) {
  const cleanText = text.toLowerCase();
  const totalChars = cleanText.length;
  if (totalChars === 0) return Infinity;

  const counts = {};
  for (let char of cleanText) {
    counts[char] = (counts[char] || 0) + 1;
  }

  let chiSquared = 0;
  for (let char in SPANISH_FREQUENCIES) {
    const expectedFreq = SPANISH_FREQUENCIES[char];
    const expectedCount = (expectedFreq / 100) * totalChars;
    const observedCount = counts[char] || 0;

    chiSquared += Math.pow(observedCount - expectedCount, 2) / (expectedCount + 0.0001);
  }

  return chiSquared;
}

function executeAutoDecryption() {
  const text = document.getElementById('decryptInput').value;
  const alphabet = document.getElementById('alphabetInput').value;
  const N = alphabet.length;

  if (!text || !alphabet) {
    alert("Por favor ingrese el texto cifrado y el alfabeto.");
    return;
  }

  let bestCandidate = {
    text: "",
    method: "",
    score: Infinity
  };

  // 1. Probar Atbash
  const atbashText = cipherAtbash(text, alphabet);
  const atbashScore = calculateChiSquared(atbashText);

  if (atbashScore < bestCandidate.score) {
    bestCandidate = {
      text: atbashText,
      method: "Atbash",
      score: atbashScore
    };
  }

  // 2. Probar César para todos los desplazamientos k de 0 a N-1
  for (let k = 0; k < N; k++) {
    const cesarCandidate = cipherCesar(text, k, alphabet, true);
    const score = calculateChiSquared(cesarCandidate);

    if (score < bestCandidate.score) {
      bestCandidate = {
        text: cesarCandidate,
        method: `César (Módulo / Desplazamiento k = ${k})`,
        score: score
      };
    }
  }

  // Despliegue automático directo (sin intervención humana: solo se muestra
  // el candidato con menor puntaje Chi-Cuadrado, es decir, el más parecido
  // estadísticamente al español)
  document.getElementById('detectedMethod').innerText = `Detección Al-Kindi: ${bestCandidate.method}`;
  document.getElementById('decryptResult').innerText = bestCandidate.text;
  document.getElementById('decryptScore').innerText = bestCandidate.score.toFixed(2);
}

// --- REGISTRO DE EVENTOS (EVENT LISTENERS) ---

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('alphabetInput').addEventListener('input', updateAlphabetLength);
  document.getElementById('cipherSelect').addEventListener('change', toggleShiftInput);
  document.getElementById('encryptBtn').addEventListener('click', executeEncryption);
  document.getElementById('autoDecryptBtn').addEventListener('click', executeAutoDecryption);

  // Inicializar estado de interfaz
  updateAlphabetLength();
  toggleShiftInput();
});