// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const leer = (ruta) => readFileSync(new URL(ruta, import.meta.url), 'utf8');

test('la política global oculta las barras sin desactivar el desplazamiento', () => {
  const estilos = leer('../src/styles.css');

  assert.match(
    estilos,
    /html,\s*body,\s*#root,\s*#root \*,\s*body \*,\s*\.scrollbar-hidden,\s*\.admin-scroll-container\s*\{[^}]*scrollbar-width:\s*none[^}]*-ms-overflow-style:\s*none/s,
  );
  assert.match(
    estilos,
    /html::-webkit-scrollbar,\s*body::-webkit-scrollbar,\s*#root::-webkit-scrollbar,\s*#root \*::-webkit-scrollbar,\s*body \*::-webkit-scrollbar,\s*\.scrollbar-hidden::-webkit-scrollbar,\s*\.admin-scroll-container::-webkit-scrollbar\s*\{[^}]*display:\s*none[^}]*width:\s*0[^}]*height:\s*0/s,
  );
  assert.match(estilos, /#root \*[\s\S]*?body \*[\s\S]*?\.scrollbar-hidden[\s\S]*?\.admin-scroll-container/);
  assert.doesNotMatch(estilos, /::-webkit-scrollbar-(track|thumb)/);
  assert.doesNotMatch(estilos, /\[data-theme="dark"\] ::-webkit-scrollbar/);
  assert.doesNotMatch(estilos, /scrollbar-width:\s*thin/);
});

test('los componentes no duplican la política global de scrollbars', () => {
  for (const archivo of [
    '../src/components/Dropdown/Dropdown.css',
    '../src/postulante.css',
    '../src/admin.css',
    '../src/empresa.css',
  ]) {
    const css = leer(archivo);
    assert.doesNotMatch(css, /scrollbar-width|scrollbar-color|-ms-overflow-style|::-webkit-scrollbar/);
  }
});

test('los contenedores conservan sus ejes de desplazamiento', () => {
  const estilos = leer('../src/styles.css');
  const admin = leer('../src/admin.css');
  const empresa = leer('../src/empresa.css');
  const postulante = leer('../src/postulante.css');
  const dropdown = leer('../src/components/Dropdown/Dropdown.css');

  assert.match(estilos, /\.tabla-scroll\s*\{[^}]*overflow-x:\s*auto/s);
  assert.match(estilos, /\.cv-historial-tabla\s*\{[^}]*overflow-x:\s*auto/s);
  assert.match(estilos, /\.legal-table-wrap\s*\{[^}]*overflow-x:\s*auto/s);
  assert.match(estilos, /\.side-nav\s*\{[^}]*overflow-y:\s*auto/s);
  assert.match(estilos, /\.modal-cuerpo\s*\{[^}]*overflow-y:\s*auto/s);
  assert.match(estilos, /\.rte \.ProseMirror\s*\{[^}]*overflow-y:\s*auto/s);

  assert.match(admin, /\.app-admin \.content\s*\{[^}]*overflow-y:\s*auto/s);
  assert.match(empresa, /\.app-empresa \.content\s*\{[^}]*overflow-y:\s*auto/s);
  assert.match(postulante, /\.app-postulante \.post-nav\s*\{[^}]*overflow-x:\s*auto/s);
  assert.match(postulante, /\.app-postulante \.lista-ofertas\s*\{[^}]*overflow-y:\s*auto/s);
  assert.match(postulante, /\.app-postulante \.panel-contenido\s*\{[^}]*overflow-y:\s*auto/s);
  assert.match(dropdown, /\.dropdown-panel\s*\{[^}]*overflow-y:\s*auto/s);
});
