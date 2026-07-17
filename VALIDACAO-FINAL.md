# Validação Final — Performance e Qualidade

Auditoria em **3 de julho de 2026** sobre o **build de produção** (`npm run build` + `npm run preview`).

| Item | Valor |
|---|---|
| Preview | `http://127.0.0.1:4322/` |
| Páginas no build | **198** |
| Tamanho `dist/` | **62,7 MB** |
| HTML total | **5,43 MB** (198 arquivos) |
| HTML médio | **~28,7 KB** por página (só `.html`, sem imagens) |
| Relatórios Lighthouse | `lighthouse-reports/*.report.html` e `*.report.json` |

---

## Scores Lighthouse

### Home (`/`)

| Categoria | Mobile | Desktop |
|---|---:|---:|
| Performance | **100** | **100** |
| Accessibility | **88** | **88** |
| Best Practices | **77** | **77** |
| SEO | **100** | **100** |

### Artigo do blog (`/blog/dicas-entrevista-emprego-pat/`)

| Categoria | Mobile | Desktop |
|---|---:|---:|
| Performance | **100** | **100** |
| Accessibility | **86** | **86** |
| Best Practices | **77** | **77** |
| SEO | **100** | **100** |

### Relatório de Atividades (`/relatorio-de-atividades/`)

| Categoria | Mobile | Desktop |
|---|---:|---:|
| Performance | **100** | **100** |
| Accessibility | **87** | **87** |
| Best Practices | **77** | **77** |
| SEO | **100** | **100** |

Performance e SEO estão excelentes em todas as amostras. Os pontos que puxam Accessibility e Best Practices para baixo são **os mesmos em todas as páginas** (design system + AdSense), não específicos de uma rota.

---

## Top 5 oportunidades / falhas (Lighthouse)

Ordenadas por impacto prático no score e na qualidade:

### 1. Contraste de cor insuficiente (`color-contrast`) — Accessibility

- **Problema:** texto `--color-accent-text` (`#8a6d00`) sobre `--color-accent` (`#ffca00`) tem contraste **3,2:1** (mínimo WCAG AA para texto normal: 4,5:1).
- **Onde:** botões/CTAs accent e tags (ex.: botão “Doe”, badges de projetos, botões “Seja um Investidor” / “Ver relatório”).
- **Páginas:** home, blog, relatório (e qualquer página que use `btn--accent` / `cta-doe` / tags accent).
- **Sugestão (não aplicada):** escurecer `--color-accent-text` (ex. `#5c4a00` ou similar) ou usar texto escuro/preto nos botões amarelos.

### 2. JavaScript não utilizado (`unused-javascript`) — Performance (oportunidade)

- **Economia estimada:** ~152–157 KiB.
- **Origem:** scripts do **Google AdSense** (`adsbygoogle.js` + `show_ads_impl_*.js`), não código do site.
- **Páginas:** todas (script no `BaseLayout`).
- **Nota:** esperado enquanto o AdSense está só para verificação de domínio, sem blocos de anúncio. Partytown ou carregar o script só em páginas com ads reduziria o peso, mas não é obrigatório agora.

### 3. Links sem nome acessível (`link-name`) — Accessibility

- **Problema:** links `.article-card__media` envolvem a imagem da capa com `alt=""` (decorativo) e **não têm** `aria-label` nem texto visível.
- **Onde:** `src/components/blog/ArticleCard.astro` (listagens do blog e “Artigos recentes” na home).
- **Sugestão:** `aria-label={article.data.title}` no link da mídia, ou unificar em um único link com o título.

### 4. `aria-hidden="true"` em elemento focável (`aria-hidden-focus`) — Accessibility

- **Problema:** o checkbox do menu mobile (`#mobile-menu-toggle`) tem `aria-hidden="true"` mas continua focável via teclado.
- **Onde:** `src/components/layout/Header.astro`.
- **Sugestão:** remover `aria-hidden="true"` do checkbox (já é `sr-only`) ou usar `tabindex="-1"` de forma coerente com o padrão de acessibilidade do menu.

### 5. Best Practices: cookies de terceiros + Issues do Chrome

- **`third-party-cookies`:** cookie do AdSense/Google.
- **`inspector-issues`:** issues registradas no DevTools (associadas ao carregamento de terceiros/AdSense em ambiente local `http://127.0.0.1`).
- **Impacto:** puxam Best Practices para **77** em todas as páginas.
- Em produção com HTTPS e conta AdSense aprovada, parte disso pode se comportar diferente; ainda assim, terceiros sempre pesam em Best Practices.

Não houve oportunidades relevantes de “Reduce unused CSS”, “Properly size images” ou “Serve images in next-gen formats” nas três páginas amostradas (scores de performance 100).

---

## Confirmações técnicas no `dist/`

### Scripts no HTML

| Tipo | Quantidade |
|---|---:|
| `<script type="application/ld+json">` | 159 |
| Script AdSense (`adsbygoogle` / `googlesyndication`) | 198 (1 por página HTML) |
| **Outros `<script>`** | **0** |

Nenhum JavaScript custom do projeto no HTML renderizado — apenas JSON-LD e AdSense, como esperado.

### Imagens: `width` / `height`

| Situação | Quantidade |
|---|---:|
| Total de `<img>` no `dist/` | 1.443 |
| **Sem** `width` e/ou `height` | **60** |
| Com `width` e `height` | 1.383 |

As **60** sem dimensões estão no **corpo HTML dos artigos** (conteúdo migrado), com `src` em `supabase.co/.../article-images/...` — não passam pelo componente `<Image />` do Astro. Capas de cards, hero e assets locais **têm** width/height explícitos.

### Imagens: `alt`

| Situação | Quantidade |
|---|---:|
| Sem atributo `alt` | **0** |
| `alt` vazio (decorativo, ex. cards) | 752 |
| `alt` com texto | 691 |

Todos os `<img>` têm `alt` (mesmo que vazio). O Lighthouse ainda aponta `link-name` porque o **link** da mídia do card não tem nome acessível, não porque falte `alt` na imagem.

### Links externos `target="_blank"`

- Links com `target="_blank"` **sem** `rel` contendo `noopener`: **0**
- Todos os amostrados no `dist/` usam `rel="noopener noreferrer"` (ou equivalente com `noopener`).

### Hierarquia de headings (5 páginas)

| Página | Resultado |
|---|---|
| `/` (home) | OK — sem pulos de nível |
| `/blog/dicas-entrevista-emprego-pat/` | OK |
| `/relatorio-de-atividades/` | OK |
| `/quem-somos/` | OK |
| `/contato/` | OK |

---

## Checklist de acessibilidade manual

| Item | Status |
|---|---|
| Todo `<img>` tem `alt` | **Sim** (0 sem atributo) |
| Hierarquia de headings sem pular níveis (5 páginas) | **Sim** |
| `target="_blank"` com `rel="noopener noreferrer"` | **Sim** (0 violações no `dist/`) |
| Contraste AA em botões accent | **Não** (3,2:1 em `#8a6d00` / `#ffca00`) |
| Links de mídia dos cards com nome acessível | **Não** (falta `aria-label`) |
| Checkbox do menu mobile sem `aria-hidden` conflitante | **Não** (tem `aria-hidden="true"` e é focável) |

---

## Tamanho do artefato

| Métrica | Valor |
|---|---|
| `dist/` total | **62,7 MB** |
| HTML total | **5,43 MB** |
| HTML médio | **~28,7 KB** |
| Observação | Grande parte do peso está em PDFs de relatório (`public/docs/relatorio-atividades-*.pdf`) e imagens otimizadas em `_astro/` |

---

## Priorização sugerida (sem correção automática)

| Prioridade | Item | Esforço | Impacto |
|---|---|---|---|
| Alta (a11y) | Contraste accent-text / accent | Baixo | Sobe Accessibility em todas as páginas |
| Alta (a11y) | `aria-label` no link da imagem do `ArticleCard` | Baixo | Corrige `link-name` |
| Média (a11y) | Checkbox do menu mobile (`aria-hidden`) | Baixo | Corrige `aria-hidden-focus` |
| Média (CLS/conteúdo) | `width`/`height` nas 60 imagens inline do corpo dos artigos | Médio | Evita CLS em posts com embeds legados |
| Baixa (perf) | AdSense unused JS | Depende da estratégia de ads | Só relevante quando houver blocos de anúncio |
| Baixa | Best Practices por cookies de terceiros | Limitado | Efeito colateral do AdSense |

---

## Arquivos gerados nesta auditoria

- `lighthouse-reports/home-desktop.report.html` / `.json`
- `lighthouse-reports/home-mobile.report.html` / `.json`
- `lighthouse-reports/blog-desktop.report.html` / `.json`
- `lighthouse-reports/blog-mobile.report.html` / `.json`
- `lighthouse-reports/relatorio-desktop.report.html` / `.json`
- `lighthouse-reports/relatorio-mobile.report.html` / `.json`
- Scripts auxiliares: `scripts/audit-dist.mjs`, `scripts/audit-headings.mjs`, `scripts/audit-imgs.mjs`

Nenhuma correção de código de produção foi aplicada — apenas este relatório e os artefatos de auditoria.
