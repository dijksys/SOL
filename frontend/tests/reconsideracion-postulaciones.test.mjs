// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const leer = (ruta) => readFileSync(new URL(ruta, import.meta.url), 'utf8');

test('la empresa comunica la reconsideración sin alterar la transición existente', () => {
  const pagina = leer('../src/pages/empresa/Postulaciones.jsx');
  const constantes = leer('../src/constants.js');

  assert.match(constantes, /no_seleccionado:\s*\['en_revision'\]/);
  assert.match(constantes, /pendiente:\s*\['en_revision', 'no_seleccionado'\]/);
  assert.match(constantes, /en_revision:\s*\['seleccionado', 'no_seleccionado'\]/);
  assert.match(pagina, /import \{[^}]*\bRotateCcw\b[^}]*\} from 'lucide-react'/s);
  assert.match(pagina, /<h3>Gestionar estado de postulación<\/h3>/);
  assert.match(pagina, /const puedeReconsiderar = !retirada && activo === 1 && estado === 'no_seleccionado';/);
  assert.match(pagina, /<Mensaje tipo="info">/);
  assert.match(pagina, /<strong>Reconsideración de candidato<\/strong>/);
  assert.match(pagina, /Esta postulación fue marcada anteriormente como «No seleccionado»/);
  assert.match(pagina, /const esReconsideracion = estado === 'no_seleccionado' && s === 'en_revision';/);
  assert.match(pagina, /<RotateCcw size=\{16\} aria-hidden="true" \/>/);
  assert.match(pagina, /Reconsiderar candidato/);
  assert.match(pagina, /cambiarEstadoPostulacion\(postulacion\.id, s\)/);
  assert.match(pagina, /alCambio\(\)/);
  assert.doesNotMatch(pagina, /Avanzar estado/);
});

test('el postulante recibe el aviso general solo cuando existen postulaciones', () => {
  const pagina = leer('../src/pages/postulante/MisPostulaciones.jsx');

  assert.match(pagina, /data && data\.length > 0 && \(\s*<Mensaje tipo="info">/s);
  assert.match(pagina, /<strong>Seguimiento de tu postulación<\/strong>/);
  assert.match(pagina, /puede reconsiderar una candidatura marcada como «No seleccionado»/);
  assert.match(pagina, /data && data\.length === 0/);
  assert.match(pagina, /retirarPostulacion\(id\)/);
  assert.match(pagina, /<Estado valor=\{p\.estado\} diccionario=\{ETIQUETA_ESTADO_POSTULACION\}/);
});

test('el aviso informativo utiliza tokens de tema', () => {
  const estilos = leer('../src/styles.css');

  assert.match(estilos, /\.alerta-info\s*\{[^}]*background:\s*var\(--sky\)[^}]*color:\s*var\(--blue-tx\)[^}]*border:\s*1px solid var\(--line\)/s);
});
