// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const leer = (ruta) => readFileSync(new URL(ruta, import.meta.url), 'utf8');

test('el botón de CV ocupa el ancho interior de la zona de carga', () => {
  const componente = leer('../src/components/CvUploader.jsx');
  const estilos = leer('../src/styles.css');

  assert.match(componente, /className="cv-zona"/);
  assert.match(componente, /className="btn btn-gris cv-subir"/);
  assert.match(componente, /type="file"/);
  assert.match(componente, /accept=\{FORMATOS\}/);
  assert.match(componente, /Subir CV/);
  assert.match(componente, /Actualizar CV/);
  assert.match(componente, /Subiendo CV…/);
  assert.match(componente, /const MAX_MB = 5/);
  assert.match(componente, /const permitidos = \['PDF', 'DOC', 'DOCX'\]/);
  assert.match(estilos, /\.cv-zona > \.btn\s*\{[^}]*width:\s*100%[^}]*min-height:\s*48px/s);
  assert.match(estilos, /\.cv-zona > \.btn\s*\{[^}]*justify-content:\s*center/s);
});

test('el botón de foto usa solo el icono Camera y conserva accesibilidad y Quitar', () => {
  const pagina = leer('../src/pages/postulante/Perfil.jsx');
  const estilos = leer('../src/postulante.css');

  assert.match(pagina, /import \{[^}]*\bCamera\b[^}]*\} from 'lucide-react'/s);
  assert.match(pagina, /className=\{`btn btn-gris perfil-foto-btn/);
  assert.match(pagina, /aria-label=\{fotoUrl \? 'Cambiar foto de perfil' : 'Subir foto de perfil'\}/);
  assert.match(pagina, /title=\{fotoUrl \? 'Cambiar foto de perfil' : 'Subir foto de perfil'\}/);
  assert.match(pagina, /<Camera size=\{19\} aria-hidden="true" \/>/);
  assert.match(pagina, /role="button"/);
  assert.match(pagina, /tabIndex=\{cargando \? -1 : 0\}/);
  assert.match(pagina, /accept="image\/jpeg,image\/png,image\/webp"/);
  assert.match(pagina, /archivo\.size > 8 \* 1024 \* 1024/);
  assert.match(pagina, /Quitar/);
  assert.doesNotMatch(pagina, /\{fotoUrl \? 'Cambiar' : 'Subir foto'\}/);
  assert.doesNotMatch(pagina, />\s*(Subir foto|Cambiar)\s*</);
  assert.match(
    estilos,
    /\.app-postulante \.perfil-foto-acciones \.perfil-foto-btn\s*\{[^}]*min-height:\s*44px/s,
  );
});
