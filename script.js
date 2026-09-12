// Criptosistema Clásico & Analizador Al-Kindi
// Autor: Emmanuel De Jesús López García
// Ingeniería en Sistemas Computacionales - Universidad Autónoma de Aguascalientes
//
// NOTA: este archivo se documenta por referencia cruzada, no con explicaciones
// dentro del código. Cada bloque está marcado con [N] y corresponde EXACTAMENTE
// a la sección N del reporte entregado, donde se explica qué hace y por qué.

const SPANISH_FREQUENCIES = {
  'a': 12.53, 'b': 1.42, 'c': 4.68, 'd': 5.86, 'e': 13.68, 'f': 0.69, 'g': 1.01,
  'h': 0.70, 'i': 6.25, 'j': 0.44, 'k': 0.02, 'l': 4.97, 'm': 3.15, 'n': 6.71,
  'ñ': 0.31, 'o': 8.68, 'p': 2.51, 'q': 0.88, 'r': 6.87, 's': 7.98, 't': 4.63,
  'u': 3.93, 'v': 0.90, 'w': 0.01, 'x': 0.22, 'y': 0.90, 'z': 0.52, ' ': 15.00
};

// ═══════════════════════════════════════════════════════════════════════
// [1] — Ver Sección 1 del reporte
// ═══════════════════════════════════════════════════════════════════════

function updateAlphabetLength() {
  const alphabet = document.getElementById('alphabetInput').value;
  document.getElementById('alphabetLength').innerText = alphabet.length;
}

function toggleShiftInput() {
  const cipher = document.getElementById('cipherSelect').value;
  const shiftGroup = document.getElementById('shiftGroup');
  shiftGroup.style.display = cipher === 'cesar' ? 'block' : 'none';
}

// ═══════════════════════════════════════════════════════════════════════
// [2] — Ver Sección 2 del reporte
// ═══════════════════════════════════════════════════════════════════════

function getAlphabetCodeTable(alphabet) {
  return Array.from(alphabet).map(ch => ch.charCodeAt(0));
}

// ═══════════════════════════════════════════════════════════════════════
// [3] — Ver Sección 3 del reporte
// ═══════════════════════════════════════════════════════════════════════

function cipherCesar(text, shift, alphabet, decrypt = false) {
  const codeTable = getAlphabetCodeTable(alphabet);
  const N = codeTable.length;
  let result = "";
  const effectiveShift = decrypt ? (N - (shift % N)) % N : shift % N;

  for (let char of text) {
    const charCode = char.charCodeAt(0);
    const idx = codeTable.indexOf(charCode);
    if (idx !== -1) {
      const newIdx = (idx + effectiveShift) % N;
      result += String.fromCharCode(codeTable[newIdx]);
    } else {
      result += char;
    }
  }
  return result;
}

function cipherAtbash(text, alphabet) {
  const codeTable = getAlphabetCodeTable(alphabet);
  const N = codeTable.length;
  let result = "";

  for (let char of text) {
    const charCode = char.charCodeAt(0);
    const idx = codeTable.indexOf(charCode);
    if (idx !== -1) {
      const newIdx = N - 1 - idx;
      result += String.fromCharCode(codeTable[newIdx]);
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

// ═══════════════════════════════════════════════════════════════════════
// [4] — Ver Sección 4 del reporte
// ═══════════════════════════════════════════════════════════════════════

function calculateChiSquared(text) {
  const cleanText = text.toLowerCase();
  const letterChars = [...cleanText].filter(ch => SPANISH_FREQUENCIES[ch] !== undefined);
  const totalLetters = letterChars.length;

  if (totalLetters < 5) return Infinity;

  const counts = {};
  for (const ch of letterChars) {
    counts[ch] = (counts[ch] || 0) + 1;
  }

  let chiSquared = 0;
  for (const ch in SPANISH_FREQUENCIES) {
    const expectedCount = (SPANISH_FREQUENCIES[ch] / 100) * totalLetters;
    const observedCount = counts[ch] || 0;
    chiSquared += Math.pow(observedCount - expectedCount, 2) / (expectedCount + 0.0001);
  }

  return chiSquared / totalLetters;
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

  const atbashText = cipherAtbash(text, alphabet);
  const atbashScore = calculateChiSquared(atbashText);

  if (atbashScore < bestCandidate.score) {
    bestCandidate = {
      text: atbashText,
      method: "Atbash",
      score: atbashScore
    };
  }

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

  if (bestCandidate.score === Infinity) {
    document.getElementById('detectedMethod').innerText = 'Muestra insuficiente para un análisis de frecuencias confiable';
    document.getElementById('decryptResult').innerText = '-';
    document.getElementById('decryptScore').innerText = '-';
    return;
  }

  document.getElementById('detectedMethod').innerText = `Detección Al-Kindi: ${bestCandidate.method}`;
  document.getElementById('decryptResult').innerText = bestCandidate.text;
  document.getElementById('decryptScore').innerText = bestCandidate.score.toFixed(2);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('alphabetInput').addEventListener('input', updateAlphabetLength);
  document.getElementById('cipherSelect').addEventListener('change', toggleShiftInput);
  document.getElementById('encryptBtn').addEventListener('click', executeEncryption);
  document.getElementById('autoDecryptBtn').addEventListener('click', executeAutoDecryption);

  updateAlphabetLength();
  toggleShiftInput();
});
