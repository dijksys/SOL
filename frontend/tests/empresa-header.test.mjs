// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const leer = (ruta) => readFileSync(new URL(ruta, import.meta.url), 'utf8');

test('el separador de Empresa usa el ancho del workspace sin perder el límite de contenido', () => {
  const layout = leer('../src/layouts/LayoutEmpresa.jsx');
  const estilos = leer('../src/empresa.css');

  assert.match(layout, /className="empresa-header-rule"/);
  assert.match(
    estilos,
    /\.app-empresa \.app-workspace\s*\{[^}]*position:\s*relative[^}]*container-type:\s*inline-size/s,
  );
  assert.match(
    estilos,
    /\.app-empresa \.content > div:has\(> \.page-head\)\s*\{\s*display:\s*contents/s,
  );
  assert.match(
    estilos,
    /\.app-empresa \.content \.page-head\s*\{[^}]*position:\s*sticky[^}]*top:\s*0[^}]*z-index:\s*20[^}]*background:\s*var\(--white\)/s,
  );
  assert.match(
    estilos,
    /@media \(max-width:\s*860px\)[\s\S]*?\.app-empresa \.content \.page-head\s*\{[^}]*position:\s*relative/s,
  );
  assert.match(
    estilos,
    /@container \(min-width:\s*1601px\)[\s\S]*?\.app-empresa \.empresa-header-rule\s*\{[^}]*position:\s*absolute[^}]*left:\s*0[^}]*right:\s*0[^}]*background:\s*var\(--line\)[^}]*z-index:\s*30/s,
  );
  assert.match(
    estilos,
    /@container \(min-width:\s*1601px\)[\s\S]*?\.app-empresa \.content \.page-head\s*\{\s*border-bottom:\s*0/s,
  );
  assert.match(estilos, /\.app-empresa \.content\s*\{[^}]*max-width:\s*1600px/s);
});
