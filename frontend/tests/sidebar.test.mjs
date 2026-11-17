// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const leer = (ruta) => readFileSync(new URL(ruta, import.meta.url), 'utf8');

test('Administración y Empresa comparten el sidebar sin control manual', () => {
  for (const archivo of ['LayoutAdmin.jsx', 'LayoutEmpresa.jsx']) {
    const layout = leer(`../src/layouts/${archivo}`);

    assert.match(layout, /import Sidebar from '\.\.\/components\/Sidebar'/);
    assert.match(layout, /<Sidebar\b/);
    assert.doesNotMatch(layout, /useSidebarColapsado|colapsado|onToggle=\{alternar\}/);
  }

  const sidebar = leer('../src/components/Sidebar.jsx');
  assert.doesNotMatch(sidebar, /ChevronsLeft|ChevronsRight|side-colapsar|onToggle|colapsado/);
  assert.equal(
    existsSync(new URL('../src/hooks/useSidebarColapsado.js', import.meta.url)),
    false,
    'el hook de persistencia del sidebar ya no debe existir',
  );
});

test('la sidebar inicia contraída y se expande al pasar el cursor', () => {
  const estilos = leer('../src/styles.css');

  assert.match(estilos, /\.sidebar\s*\{[^}]*width:\s*var\(--sidebar-w\)/s);
  assert.match(
    estilos,
    /@media \(min-width: 861px\) and \(hover: hover\)[\s\S]*?\.sidebar\s*\{[^}]*width:\s*var\(--sidebar-w-mini\)/s,
  );
  assert.match(
    estilos,
    /@media \(min-width: 861px\) and \(hover: hover\)[\s\S]*?\.sidebar:hover\s*\{[^}]*width:\s*var\(--sidebar-w\)/s,
  );
  assert.match(
    estilos,
    /\.sidebar:not\(:hover\) \.brand-text,[\s\S]*?\.sidebar:not\(:hover\) \.side-user-info\s*\{\s*display:\s*none;/s,
  );
  assert.match(
    estilos,
    /\.sidebar:not\(:hover\) \.side-brand \.side-brand-logo\s*\{[^}]*height:/s,
  );
  assert.match(
    estilos,
    /\.sidebar:not\(:hover\) \.logout span\s*\{[^}]*display:\s*none/s,
  );
  assert.doesNotMatch(estilos, /\.sidebar\.colapsado|\.side-colapsar/);
  assert.doesNotMatch(estilos, /\.sidebar[^{]*:focus-within|\.side-[^{]*:focus-within/);
});

test('el estado contraído conserva tooltips y los enlaces son accesibles', () => {
  const sidebar = leer('../src/components/Sidebar.jsx');
  const estilos = leer('../src/styles.css');

  assert.match(sidebar, /data-tooltip=\{item\.texto\}/);
  assert.match(sidebar, /title=\{item\.texto\}/);
  assert.match(sidebar, /aria-label=\{item\.texto\}/);
  assert.match(
    estilos,
    /\.sidebar:not\(:hover\) \.side-link::after\s*\{[^}]*content:\s*attr\(data-tooltip\)/s,
  );
  assert.match(
    estilos,
    /\.sidebar:not\(:hover\) \.side-link:focus-visible::after\s*\{[^}]*opacity:\s*1/s,
  );
  assert.match(estilos, /\.side-link:focus-visible\s*\{[^}]*outline:\s*2px solid var\(--accion-foco\)/s);
});

test('la sidebar es una tarjeta clara sin divisores entre categorías', () => {
  const estilos = leer('../src/styles.css');

  assert.match(estilos, /\.sidebar\s*\{[^}]*background:\s*var\(--white\)/s);
  assert.match(estilos, /\.sidebar\s*\{[^}]*border:\s*1px solid var\(--line\)/s);
  assert.match(estilos, /\.sidebar\s*\{[^}]*border-radius:\s*var\(--sidebar-radius\)/s);
  assert.match(estilos, /\.sidebar\s*\{[^}]*box-shadow:\s*var\(--sombra-tarjeta\)/s);
  assert.doesNotMatch(estilos, /\.side-group \+ \.side-group\s*\{[^}]*border-top/s);
  assert.match(estilos, /\.side-group-title\s*\{[^}]*color:\s*var\(--text-3\)/s);
});

test('el estado activo conserva la paleta institucional de SOL', () => {
  const estilos = leer('../src/styles.css');

  assert.match(
    estilos,
    /\.side-link\.active\s*\{[^}]*background:\s*var\(--sky-2\)[^}]*color:\s*var\(--enlace\)[^}]*font-weight:\s*600/s,
  );
  assert.match(estilos, /\.side-link:hover\s*\{[^}]*background:\s*var\(--sky\)/s);
  assert.match(estilos, /\.side-link:focus-visible\s*\{[^}]*outline:\s*2px solid var\(--accion-foco\)/s);
});

test('el pie de usuario mantiene la tarjeta, el avatar y el cierre de sesión', () => {
  const estilos = leer('../src/styles.css');
  const sidebar = leer('../src/components/Sidebar.jsx');

  assert.match(sidebar, /className="side-user"/);
  assert.match(sidebar, /className="side-avatar"/);
  assert.match(sidebar, /<BotonSalir \/>/);
  assert.match(estilos, /\.side-user\s*\{[^}]*background:\s*var\(--fondo\)/s);
  assert.match(estilos, /\.sidebar \.logout\s*\{[^}]*border:\s*1px solid var\(--line\)/s);
});

test('el drawer móvil conserva apertura, cierre y navegación expandida', () => {
  const estilos = leer('../src/styles.css');
  const sidebar = leer('../src/components/Sidebar.jsx');

  assert.match(sidebar, /className="side-movil-burger"/);
  assert.match(sidebar, /side-cerrar-movil/);
  assert.match(sidebar, /className="side-backdrop"/);
  assert.match(
    estilos,
    /@media \(max-width: 860px\)[\s\S]*?\.sidebar\s*\{[^}]*width:\s*min\(85vw, 320px\)[^}]*transform:\s*translateX\(-105%\)/s,
  );
  assert.match(estilos, /\.sidebar\.abierto\s*\{[^}]*transform:\s*translateX\(0\)/s);
  assert.match(estilos, /@media \(max-width: 860px\)[\s\S]*?\.side-cerrar-movil\s*\{\s*display:\s*inline-flex/s);
});
