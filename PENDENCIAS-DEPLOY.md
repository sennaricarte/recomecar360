# Pendências de Deploy — Instituto Recomeçar

Varredura realizada em **3 de julho de 2026**. Nenhuma correção foi aplicada neste passo — apenas inventário.

Build de verificação: `npm run build` → **198 page(s) built**, exit code **0**.

---

## Resumo por prioridade

| Prioridade | Itens |
|---|---|
| 🔴 Bloqueia produção | Web3Forms sem access key real (4 formulários) |
| 🟡 Degrada qualidade | Logo placeholder, foto do fundador placeholder, 43 capas de artigo com `_placeholder.svg`, ~119 links legados `recomecar360.org` no corpo dos artigos, `ads.txt` com Publisher ID fictício |
| 🟢 Cosmético / opcional | Atributos HTML `placeholder=` em formulários, seletor CSS `:placeholder-shown`, aviso npm `devdir` no ambiente local |

---

## 🔴 Bloqueia produção

### 1. `SEU_ACCESS_KEY_AQUI` (Web3Forms)

Os 4 formulários enviam para `https://api.web3forms.com/submit` com access key **placeholder**. Em produção, os envios **falham** até a chave real ser configurada.

| Arquivo | Linha |
|---|---|
| `src/components/forms/ContactForm.astro` | 9 |
| `src/components/forms/NewsletterForm.astro` | 9 |
| `src/components/forms/StudentForm.astro` | 9 |
| `src/components/forms/PartnerForm.astro` | 9 |

**Ação:** substituir `SEU_ACCESS_KEY_AQUI` pela access key real do Web3Forms (mesma chave nos 4, ou chaves distintas se preferir).

---

## 🟡 Degrada qualidade (não quebra o build)

### 2. `SEU_PUBLISHER_ID_AQUI` (AdSense / ads.txt)

| Arquivo | Linha |
|---|---|
| `public/ads.txt` | 1 |

Conteúdo atual:

```txt
google.com, pub-SEU_PUBLISHER_ID_AQUI, DIRECT, f08c47fec0942fa0
```

**Ação:** trocar por `pub-XXXXXXXX` real quando a conta AdSense estiver aprovada. Enquanto isso, o arquivo não quebra o site, mas **não habilita** anúncios/validação AdSense.

### 3. Arquivos de imagem com "placeholder" no nome

| Arquivo | Uso |
|---|---|
| `public/logo-placeholder.svg` | Header, Footer, JSON-LD (`src/lib/jsonld.ts` L16), fallback em `src/lib/blog-image.ts` L74, `src/pages/blog/[slug].astro` L74 |
| `src/assets/blog/_placeholder.svg` | Capas de artigos sem imagem real; fallback em `src/lib/blog-image.ts` L68 |
| `src/assets/founder-placeholder.jpg` | Página Quem Somos (`src/pages/quem-somos.astro` L7) |

**Ação:** substituir pelo logo oficial e pela foto real de Leonardo Precioso; popular capas reais dos artigos listados abaixo.

### 4. Artigos com `image: "blog/_placeholder.svg"`

**Total: 43 artigos** (de 149). Slugs:

1. `a-cor-da-crise-no-empreendedorismo`
2. `bem-vindo-a-poa`
3. `busca-por-livros-aumenta-nos-presidios-do-estado-de-sao-paulo`
4. `chegou-o-bazar-recomecar-abuse-e-reuse`
5. `cicero-lima-entrevista-na-radio-olinda`
6. `cnj-lanca-aplicativo-para-egressos-do-sistema-prisional`
7. `cnj-vai-garantir-documentacao-civil-a-pessoas-presas`
8. `como-se-tornar-um-empreendedor-social-de-sucesso` *(status: draft — não gera página pública)*
9. `contaminacao-por-covid-19-cai-nos-presidios-de-sao-paulo`
10. `desdobramentos-da-lei-de-execucao-penal`
11. `dia-do-trabalho-tem-origem-na-luta-de-operarios-pela-reducao-da-jornada-para-8-horas`
12. `educacao-para-todos`
13. `ela-so-quer-uma-vaga-de-trabalho`
14. `empreendedor-alex-sandro-da-conceicao`
15. `empreendedorismo-como-solucao-de-renda-para-o-egresso-do-sistema-prisional`
16. `empregos-formais-crescem-92-em-janeiro-no-alto-tiete`
17. `equipe-itinerante-comeca-os-trabalhos-pelo-bairro-do-jaragua`
18. `espacos-educacionais-de-presidios-paulistas-passam-por-melhorias`
19. `fomento-ao-empreendedorismo-para-egressos-do-sistema-carcerario`
20. `francisco-pereira-por-que-voce-apoia-o-recomecar`
21. `leonardo-precioso-participou-da-live-do-ifmsa`
22. `livro-incentiva-autoconhecimento-e-valorizacao-feminina-de-reclusas`
23. `mais-de-2-400-presos-de-sp-sao-classificados-no-enem`
24. `maternidade-digna-marco-legal-da-primeira-infancia`
25. `medalhas-de-prata-e-ouro-impulsionam-a-moda-streetwear`
26. `novo-caminho`
27. `o-direito-ao-voto-do-preso`
28. `parceria-movimento-happiness-e-instituto-recomecar`
29. `presidios-visitas-presenciais-serao-retomadas`
30. `presos-de-sp-iniciam-curso-off-line-ead-sobre-educacao-para-a-paz`
31. `problematicas-da-seguranca-na-gestao-publica`
32. `reclusas-e-egressas-apresentam-novo-livro-de-poesias`
33. `recomecar-desembarca-em-brasilia`
34. `recomecei-e-venci-episodio-1-julio-cesar`
35. `reducao-da-populacao-carceraria-a-importancia-de-politicas-judiciarias`
36. `rostos-do-recomecar-katiane`
37. `rostos-do-recomecar-nayara-tatiane`
38. `sandra-gioffi-por-que-voce-apoia-o-recomecar`
39. `senado-proibe-despejo-e-desocupacao-ate-o-fim-de-2021`
40. `setembro-amarelo-prevencao-do-suicidio`
41. `solange-rosalem-por-que-voce-apoia-o-recomecar`
42. `vencendo-o-coronavirus-vacina-e-cuidados`
43. `vida-pos-carcere`

Referências de código ao fallback:

| Arquivo | Linha |
|---|---|
| `src/lib/blog-image.ts` | 68 (`blog/_placeholder.svg`) |
| `src/lib/blog-image.ts` | 74 (`/logo-placeholder.svg`) |

### 5. URLs `recomecar360.org` no corpo do conteúdo

Escopo: `src/content/articles/*.md` (corpo/frontmatter dos artigos — **não** layout/componentes).

| Métrica | Valor |
|---|---|
| Arquivos de artigo afetados | **84** |
| Ocorrências totais de `recomecar360.org` | **119** |

Tipos comuns:

- Links internos legados (`https://recomecar360.org/quem-somos/`, `/blog/...`, etc.) — no domínio novo (`institutorecomecar.org.br`) podem redirecionar ou quebrar, dependendo do DNS/redirect do domínio antigo.
- Imagens hospedadas no WordPress antigo (`https://recomecar360.org/wp-content/uploads/...`) — dependem do site legado continuar no ar.
- E-mails no texto (ex.: `comunicacao@recomecar360.org`) — domínio de e-mail, não necessariamente URL de página.

**Ação recomendada (pós-deploy ou em lote):** reescrever links internos para paths relativos (`/quem-somos/`, `/blog/{slug}/`) e migrar imagens críticas para `src/assets` / `astro:assets`.

> **Nota:** `public/docs/artigos.js` e arquivos relacionados em `public/docs/` também contêm muitas URLs `recomecar360.org`, mas são artefatos de exportação legada, **não** páginas do site Astro. Avaliar se devem ser removidos do `public/` antes do deploy (não servem ao site estático atual).

### 6. Outras referências a assets placeholder em código (não em `src/content`)

| Arquivo | Linha | Conteúdo |
|---|---|---|
| `src/pages/quem-somos.astro` | 7 | `import founderImage from '../assets/founder-placeholder.jpg'` |
| `src/pages/blog/[slug].astro` | 74 | `logo-placeholder.svg` no JSON-LD |
| `src/lib/jsonld.ts` | 16 | `logo-placeholder.svg` no schema NonprofitOrganization |
| `src/components/layout/Header.astro` | 31 | `<img src="/logo-placeholder.svg" ...>` |
| `src/components/layout/Footer.astro` | 46 | `src="/logo-placeholder.svg"` |

---

## 🟢 Cosmético / opcional (não bloqueia)

### 7. Atributos HTML `placeholder=` em formulários

São placeholders de UX legítimos (texto de exemplo nos inputs), **não** conteúdo temporário de deploy:

| Arquivo | Linhas |
|---|---|
| `src/components/forms/ContactForm.astro` | 34, 48, 61, 75, 89 |
| `src/components/forms/NewsletterForm.astro` | 38 |
| `src/components/forms/StudentForm.astro` | 63, 76, 185 |
| `src/components/forms/PartnerForm.astro` | 72, 85 |
| `src/components/forms/form-styles.css` | 77–78 (`:placeholder-shown` — seletor CSS) |

### 8. `TODO` / `FIXME` / `XXX`

Nenhuma ocorrência real de comentários `TODO`, `FIXME` ou `XXX` em `src/` ou `public/`.

As buscas por `\bTODO\b` só encontraram a palavra portuguesa **"todo"** / **"Todo"** em textos corridos (ex.: "Todo o conteúdo…", "todo o processo…") — **falsos positivos**, sem ação.

### 9. `console.log`, `debugger`, `// TEMP`

**Nenhuma ocorrência** em `src/`.

### 10. Warnings do `npm run build`

| Warning | Origem | Impacto |
|---|---|---|
| `npm warn Unknown env config "devdir"` | Ambiente local do npm (config do usuário/sandbox), **não** do projeto | Cosmético; não afeta o artefato em `dist/` |

Não houve `[WARN]` do Astro (content collections, imagens, etc.) nesta execução. Build:

```
198 page(s) built
Complete!
```

---

## Checklist mínimo antes de produção

1. [ ] Colocar access key real do Web3Forms nos 4 formulários
2. [ ] Substituir `logo-placeholder.svg` pelo logo oficial (Header, Footer, JSON-LD)
3. [ ] Substituir `founder-placeholder.jpg` pela foto real
4. [ ] (Opcional mas recomendado) Capas reais nos 43 artigos com `_placeholder.svg`
5. [ ] (Opcional) Migrar/reescrever links `recomecar360.org` no corpo dos artigos
6. [ ] (Quando tiver AdSense) Atualizar `public/ads.txt` com Publisher ID real
7. [ ] Confirmar se `public/docs/artigos*.js|json|csv` devem ir ao ar (provavelmente não)

---

*Gerado automaticamente pela varredura de pré-deploy. Nenhuma alteração de código além deste arquivo.*
