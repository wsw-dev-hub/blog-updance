(function(){
    'use strict';

    const STORAGE_KEY = 'udx:ficha:v1';
    const THEME_KEY = 'theme';
    const A4_HEIGHT_PX = 297 * (96 / 25.4);
    const A4_WIDTH_PX  = 210 * (96 / 25.4);
    const DEFAULT_LOGO_SRC = './logos/Norte Danse.png';

    /* ================================================================
       SEED DO EIXO PERFORMÁTICO (inativo por padrão)
    ================================================================ */
    const PERFORMATIVOS_SEED = [
        { id: 'planos',                nome: 'Planos',                    nota: null, tipo: 'performatico' },
        { id: 'direcoes',              nome: 'Direções',                  nota: null, tipo: 'performatico' },
        { id: 'aproveitamentoEspacial',nome: 'Aproveitamento espacial',   nota: null, tipo: 'performatico' },
        { id: 'expressividade',        nome: 'Expressividade',            nota: null, tipo: 'performatico' },
        { id: 'musicalidade',          nome: 'Musicalidade',              nota: null, tipo: 'performatico' },
        { id: 'potencia',              nome: 'Potência',                  nota: null, tipo: 'performatico' },
        { id: 'complexidadeMovimentos',nome: 'Complexidade de movimentos',nota: null, tipo: 'performatico' }
    ];
    const PAGINAS_FIXAS_KEYS = ['page1','pagePerf1','page2','pagePerf2','page3','pagePerf3'];
	const PAGINAS_FIXAS_LABELS = {
		page1:     'Fundamentos técnicos',
		pagePerf1: 'Critérios performáticos',
		page2:     'Leitura técnica',
		pagePerf2: 'Leitura performática',
		page3:     'Direcionamentos técnicos',
		pagePerf3: 'Direcionamentos performáticos'
	};

	const PAGE_ORDER_DEFAULT = [
		'page1',
		'pagePerf1',
		'page2',
		'pagePerf2',
		'page3',
		'pagePerf3'
	];

    /* ================================================================
       UTILS
    ================================================================ */
    function parseMD(text){
        const esc = String(text ?? '')
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return esc.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    }
    function fmtNota(n){
        if (n === null || n === undefined || n === '' || Number.isNaN(n)) return '—';
        return Number(n).toFixed(1);
    }
    function tierClass(n){
        if (n === null || n === undefined || n === '' || Number.isNaN(n)) return '';
        const v = Number(n);
        if (v >= 9.0) return 'score--indigo';
        if (v >= 7.5) return 'score--hot';
        if (v >= 6.5) return 'score--purple';
        return 'score--wine';
    }
    function tierColor(cls){
        return { 'score--wine':'#BF0449','score--purple':'#5708A6','score--hot':'#FA33A1','score--indigo':'#110273' }[cls] || '#ece7f3';
    }
    function faixaLabel(cls){
        return { 'score--wine':'a refinar','score--purple':'profundidade consolidada','score--hot':'presença viva','score--indigo':'domínio consciente' }[cls] || '—';
    }
    function isEmpty(n){ return n === null || n === undefined || n === '' || Number.isNaN(Number(n)); }

    /* ================================================================
       SEED
    ================================================================ */
    function readSeedFromDOM(){
        const scalar = k => (document.querySelector('[data-udx-field="'+k+'"]')?.textContent || '').trim();
        const tags = Array.from(document.querySelectorAll('[data-udx-list="tagsModalidades"] > span'))
            .filter(el => !el.hasAttribute('data-udx-derived'))
            .map(el => el.textContent.trim())
            .filter(Boolean);
        const observacoes = Array.from(document.querySelectorAll('[data-udx-list="observacoes"] .obs-item'))
            .map(item => ({
                lead: (item.querySelector('.lead')?.textContent || '').trim(),
                texto: (item.querySelectorAll('p')[1]?.innerHTML || '')
                    .replace(/<strong>(.*?)<\/strong>/gi, '**$1**').replace(/<[^>]+>/g, '').trim()
            }));
        const dicas = Array.from(document.querySelectorAll('[data-udx-list="dicas"] .tip-card'))
            .map(card => ({
                titulo: (card.querySelector('.tip-card__title')?.textContent || '').trim(),
                texto: (card.querySelector('.tip-card__text')?.innerHTML || '')
                    .replace(/<strong>(.*?)<\/strong>/gi, '**$1**').replace(/<[^>]+>/g, '').trim()
            }));
        const fundamentos = Array.from(document.querySelectorAll('[data-udx-list="fundamentos"] .fund-row'))
            .map(row => ({
                id:   row.dataset.fundId,
                nome: (row.querySelector('.fund-row__name')?.textContent || '').trim(),
                nota: parseFloat((row.querySelector('.fund-row__score')?.textContent || '').trim()) || null,
                tipo: row.dataset.fundTipo || 'fundamento'
            }));
        const paginasFixas = {};
        PAGINAS_FIXAS_KEYS.forEach(k => {
            const el = document.querySelector('[data-udx-fixed-page="'+k+'"]');
            if (!el){ paginasFixas[k] = (k === 'page1' || k === 'page2' || k === 'page3'); return; }
            paginasFixas[k] = !el.classList.contains('udx-hidden');
        });
        return {
            alunoNome:            scalar('alunoNome'),
            professorNome:        scalar('professorNome') === '—' ? '' : scalar('professorNome'),
            semestre:             scalar('semestre'),
            turmaOrganizacional:  scalar('turmaOrganizacional'),
            modalidadeTurma:      scalar('modalidadeTurma'),
            logoSrc:               document.querySelector('[data-udx-logo]')?.getAttribute('src') || DEFAULT_LOGO_SRC,
            tagsModalidades:      tags,
            observacoes, dicas, fundamentos,
            paginasExtras:               [],
			ordemPaginas:                [...PAGE_ORDER_DEFAULT],
            performaticos:               [],
            observacoesPerformaticas:    [],
            insightsPerformaticos:       [],
            dicasPerformaticas:          [],
            disciplinaPerfLabel:         'Hábito performático a cuidar',
            disciplinaPerfTexto:         '',
            paginasFixas
        };
    }

    /* ================================================================
       STORAGE
    ================================================================ */
    function loadState(){
        try{
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw){
                const s = JSON.parse(raw);
                const seed = readSeedFromDOM();
                if (!Array.isArray(s.fundamentos))              s.fundamentos              = seed.fundamentos;
                if (!Array.isArray(s.paginasExtras))            s.paginasExtras            = [];
				if (!Array.isArray(s.ordemPaginas)){
					s.ordemPaginas = [...PAGE_ORDER_DEFAULT];

					/*
					 * Migração dos arquivos antigos:
					 * páginas extras existentes são colocadas
					 * depois das páginas fixas.
					 */
					s.paginasExtras.forEach(pg => {
						if (pg && pg.id && !s.ordemPaginas.includes(pg.id)){
							s.ordemPaginas.push(pg.id);
						}
					});
					
					PAGE_ORDER_DEFAULT.forEach(id => {
						if (!s.ordemPaginas.includes(id)){
							s.ordemPaginas.push(id);
						}
					});

					s.paginasExtras.forEach(pg => {
						if (
							pg &&
							pg.id &&
							!s.ordemPaginas.includes(pg.id)
						){
							s.ordemPaginas.push(pg.id);
						}
					});
				}
                if (typeof s.logoSrc !== 'string' || !s.logoSrc) s.logoSrc = seed.logoSrc || DEFAULT_LOGO_SRC;
                if (!Array.isArray(s.performaticos))            s.performaticos            = [];
                if (!Array.isArray(s.observacoesPerformaticas)) s.observacoesPerformaticas = [];
                if (!Array.isArray(s.insightsPerformaticos))    s.insightsPerformaticos    = [];
                if (!Array.isArray(s.dicasPerformaticas))       s.dicasPerformaticas       = [];
                if (typeof s.disciplinaPerfLabel !== 'string')  s.disciplinaPerfLabel      = seed.disciplinaPerfLabel;
                if (typeof s.disciplinaPerfTexto !== 'string')  s.disciplinaPerfTexto      = '';
                if (!s.paginasFixas || typeof s.paginasFixas !== 'object'){
                    s.paginasFixas = seed.paginasFixas;
                }else{
                    PAGINAS_FIXAS_KEYS.forEach(k => {
                        if (typeof s.paginasFixas[k] !== 'boolean') s.paginasFixas[k] = seed.paginasFixas[k];
                    });
                }
                return s;
            }
        }catch(e){ console.warn('[UDX] localStorage inválido:', e); }
        return readSeedFromDOM();
    }
    let saveTimer = null;
    function saveState(){
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
            try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE)); }
            catch(e){ console.error('[UDX] Falha ao salvar:', e); }
        }, 300);
    }
    let STATE = loadState();

    /* ================================================================
       DERIVADOS — eixo técnico + eixo performático
    ================================================================ */
    function derivedTecnico(){
        const preenchidos = STATE.fundamentos.filter(f => !isEmpty(f.nota));
        const fundOnly    = preenchidos.filter(f => f.tipo === 'fundamento');
        const notas       = preenchidos.map(f => Number(f.nota));
        const mediaGeral  = notas.length ? (notas.reduce((a,b)=>a+b,0) / notas.length) : null;
        let pontoForte = null;
        preenchidos.forEach(f => { if (!pontoForte || Number(f.nota) > Number(pontoForte.nota)) pontoForte = f; });
        const emAtencao = preenchidos.filter(f => tierClass(f.nota) === 'score--wine');
        return {
            preenchidos, fundOnly, mediaGeral, pontoForte, emAtencao,
            contagemFundamentos: fundOnly.length,
            totalPreenchidos: preenchidos.length
        };
    }
    function derivedPerformatico(){
        const preenchidos = STATE.performaticos.filter(f => !isEmpty(f.nota));
        const notas       = preenchidos.map(f => Number(f.nota));
        const mediaGeral  = notas.length ? (notas.reduce((a,b)=>a+b,0) / notas.length) : null;
        let pontoForte = null;
        preenchidos.forEach(f => { if (!pontoForte || Number(f.nota) > Number(pontoForte.nota)) pontoForte = f; });
        const emAtencao = preenchidos.filter(f => tierClass(f.nota) === 'score--wine');
        return {
            preenchidos, mediaGeral, pontoForte, emAtencao,
            totalPreenchidos: preenchidos.length
        };
    }
    function derived(){ return derivedTecnico(); }

    /* ================================================================
       RENDER
    ================================================================ */
    function renderScalar(key){
        document.querySelectorAll('[data-udx-field="'+key+'"]').forEach(el => {
            const val = STATE[key];
            el.textContent = (key === 'professorNome' && !val) ? '—' : val;
        });
    }
    function renderLogo(){
        const src = STATE.logoSrc || DEFAULT_LOGO_SRC;
        document.querySelectorAll('[data-udx-logo]').forEach(img => {
            img.src = src;
        });
    }

    function renderTags(){
        const host = document.querySelector('[data-udx-list="tagsModalidades"]');
        if (!host) return;
        Array.from(host.querySelectorAll('span:not([data-udx-derived])')).forEach(s => s.remove());
        STATE.tagsModalidades.forEach(tag => {
            const span = document.createElement('span');
            span.textContent = tag;
            host.appendChild(span);
        });
    }
    function renderObservacoes(){
        const host = document.querySelector('[data-udx-list="observacoes"]');
        if (!host) return;
        host.innerHTML = '';
        STATE.observacoes.forEach(o => {
            const item = document.createElement('div');
            item.className = 'obs-item';
            item.innerHTML = '<p class="lead"></p><p></p>';
            item.children[0].textContent = o.lead;
            item.children[1].innerHTML = parseMD(o.texto);
            host.appendChild(item);
        });
    }
    function renderDicas(){
        const host = document.querySelector('[data-udx-list="dicas"]');
        if (!host) return;
        host.innerHTML = '';
        STATE.dicas.forEach((d, i) => {
            const card = document.createElement('div');
            card.className = 'tip-card';
            const num = String(i + 1).padStart(2, '0');
            card.innerHTML = '<div class="tip-card__num">'+num+'</div><div><h4 class="tip-card__title"></h4><p class="tip-card__text"></p></div>';
            card.querySelector('.tip-card__title').textContent = d.titulo;
            card.querySelector('.tip-card__text').innerHTML = parseMD(d.texto);
            host.appendChild(card);
        });
    }
    function renderFundamentos(){
        const host = document.querySelector('[data-udx-list="fundamentos"]');
        if (!host) return;
        host.innerHTML = '';
        STATE.fundamentos.forEach(f => {
            const row = document.createElement('div');
            row.className = 'fund-row';
            row.dataset.fundId   = f.id;
            row.dataset.fundTipo = f.tipo;
            if (f.id === 'improviso') row.style.gridColumn = '1 / -1';
            const cls  = tierClass(f.nota);
            const nota = isEmpty(f.nota) ? '—' : fmtNota(f.nota);
            row.innerHTML =
                '<span class="fund-row__name">'+f.nome+'</span>' +
                '<span class="fund-row__leader"></span>' +
                '<span class="fund-row__score '+cls+'">'+nota+'</span>';
            host.appendChild(row);
        });
    }
    function renderDerived(){
        const d = derivedTecnico();
        document.querySelectorAll('[data-udx-derived="mediaGeral"]').forEach(el => {
            el.textContent = d.mediaGeral === null ? '—' : fmtNota(d.mediaGeral);
        });
        const hero = document.querySelector('[data-udx-derived="mediaGeral-aria"]');
        if (hero) hero.setAttribute('aria-label', 'Nota geral ' + (d.mediaGeral === null ? '—' : fmtNota(d.mediaGeral)));
        const mLabel = document.querySelector('[data-udx-derived="mediaLabel"]');
        if (mLabel) mLabel.textContent = 'Média dos ' + d.totalPreenchidos + ' eixos';
        const mCap = document.querySelector('[data-udx-derived="mediaCaption"]');
        if (mCap) mCap.textContent = 'Faixa ' + faixaLabel(tierClass(d.mediaGeral));
        const pfNome = document.querySelector('[data-udx-derived="pontoForteNome"]');
        const pfCap  = document.querySelector('[data-udx-derived="pontoForteCaption"]');
        if (d.pontoForte){
            if (pfNome) pfNome.textContent = d.pontoForte.nome;
            if (pfCap)  pfCap.textContent  = faixaLabel(tierClass(d.pontoForte.nota)).replace(/^./, c=>c.toUpperCase()) + ' · nota ' + fmtNota(d.pontoForte.nota);
        }else{
            if (pfNome) pfNome.textContent = '—';
            if (pfCap)  pfCap.textContent  = 'Sem notas preenchidas';
        }
        document.querySelectorAll('[data-udx-derived="emAtencaoCount"]').forEach(el => el.textContent = d.emAtencao.length);
        const eaLista = document.querySelector('[data-udx-derived="emAtencaoLista"]');
        if (eaLista) eaLista.textContent = d.emAtencao.length ? d.emAtencao.map(f=>f.nome).join(' · ') : '—';
        const eaTit = document.querySelector('[data-udx-derived="emAtencaoTitulo"]');
        if (eaTit) eaTit.innerHTML = d.emAtencao.length ? d.emAtencao.map(f=>'<em>'+f.nome+'</em>').join(' · ') : '—';
        const focus = document.querySelector('[data-udx-derived-card="focusCallout"]');
        if (focus) focus.classList.toggle('udx-hidden', d.emAtencao.length === 0);
        const tag = document.querySelector('[data-udx-derived="contagemFundamentosTag"]');
        if (tag) tag.textContent = d.contagemFundamentos + ' Fundamentos';
    }
    function renderMeta(){
        document.title = 'UDX · Ficha de Avaliação · ' + STATE.alunoNome;
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.content = 'Ficha de avaliação individual — Up Dance Xperience. Fundamentos, leitura técnica e direcionamentos de treino · ' + STATE.alunoNome + '.';
    }

    /* ================================================================
       RENDER — EIXO PERFORMÁTICO
    ================================================================ */
    function renderPerformaticos(){
        const host = document.querySelector('[data-udx-list="performaticos"]');
        if (!host) return;
        host.innerHTML = '';
        STATE.performaticos.forEach(f => {
            const row = document.createElement('div');
            row.className = 'fund-row';
            row.dataset.fundId   = f.id;
            row.dataset.fundTipo = f.tipo;
            const cls  = tierClass(f.nota);
            const nota = isEmpty(f.nota) ? '—' : fmtNota(f.nota);
            row.innerHTML =
                '<span class="fund-row__name">'+f.nome+'</span>' +
                '<span class="fund-row__leader"></span>' +
                '<span class="fund-row__score '+cls+'">'+nota+'</span>';
            host.appendChild(row);
        });
    }
    function renderObservacoesPerformaticas(){
        const host = document.querySelector('[data-udx-list="observacoesPerformaticas"]');
        if (!host) return;
        host.innerHTML = '';
        STATE.observacoesPerformaticas.forEach(o => {
            const item = document.createElement('div');
            item.className = 'obs-item';
            item.innerHTML = '<p class="lead"></p><p></p>';
            item.children[0].textContent = o.lead;
            item.children[1].innerHTML   = parseMD(o.texto);
            host.appendChild(item);
        });
    }
    function renderInsightsPerformaticos(){
        const host = document.querySelector('[data-udx-list="insightsPerformaticos"]');
        if (!host) return;
        host.innerHTML = '';
        STATE.insightsPerformaticos.forEach(ins => {
            const card = document.createElement('div');
            card.className = 'insight-card';
            card.innerHTML = '<span class="insight-card__label"></span><p class="insight-card__text"></p>';
            card.querySelector('.insight-card__label').textContent = ins.label;
            card.querySelector('.insight-card__text').innerHTML    = parseMD(ins.texto);
            host.appendChild(card);
        });
    }
    function renderDicasPerformaticas(){
        const host = document.querySelector('[data-udx-list="dicasPerformaticas"]');
        if (!host) return;
        host.innerHTML = '';
        STATE.dicasPerformaticas.forEach((d, i) => {
            const card = document.createElement('div');
            card.className = 'tip-card';
            const num = String(i + 1).padStart(2, '0');
            card.innerHTML = '<div class="tip-card__num">'+num+'</div><div><h4 class="tip-card__title"></h4><p class="tip-card__text"></p></div>';
            card.querySelector('.tip-card__title').textContent = d.titulo;
            card.querySelector('.tip-card__text').innerHTML    = parseMD(d.texto);
            host.appendChild(card);
        });
    }
    function renderDisciplinaPerf(){
        const box   = document.querySelector('[data-udx-derived-card="disciplinaNotaPerformatica"]');
        const label = document.querySelector('[data-udx-field="disciplinaPerfLabel"]');
        const texto = document.querySelector('[data-udx-field="disciplinaPerfTexto"]');
        if (label) label.textContent = STATE.disciplinaPerfLabel || 'Hábito performático a cuidar';
        if (texto) texto.innerHTML   = parseMD(STATE.disciplinaPerfTexto || '');
        if (box)   box.classList.toggle('udx-hidden', !(STATE.disciplinaPerfTexto && STATE.disciplinaPerfTexto.trim()));
    }
    function renderDerivedPerformatico(){
        const d = derivedPerformatico();
        document.querySelectorAll('[data-udx-derived="mediaGeralPerformatica"]').forEach(el => {
            el.textContent = d.mediaGeral === null ? '—' : fmtNota(d.mediaGeral);
        });
        const hero = document.querySelector('[data-udx-derived="mediaGeralPerformatica-aria"]');
        if (hero) hero.setAttribute('aria-label', 'Nota performática ' + (d.mediaGeral === null ? '—' : fmtNota(d.mediaGeral)));
        const tag = document.querySelector('[data-udx-derived="contagemPerformaticosTag"]');
        if (tag) tag.textContent = d.totalPreenchidos + (d.totalPreenchidos === 1 ? ' Critério' : ' Critérios');
        const mLabel = document.querySelector('[data-udx-derived="mediaPerfLabel"]');
        if (mLabel) mLabel.textContent = 'Média dos ' + d.totalPreenchidos + ' critérios (perf.)';
        const mCap = document.querySelector('[data-udx-derived="mediaPerfCaption"]');
        if (mCap) mCap.textContent = 'Faixa ' + faixaLabel(tierClass(d.mediaGeral));
        const pfNome = document.querySelector('[data-udx-derived="pontoFortePerfNome"]');
        const pfCap  = document.querySelector('[data-udx-derived="pontoFortePerfCaption"]');
        if (d.pontoForte){
            if (pfNome) pfNome.textContent = d.pontoForte.nome;
            if (pfCap)  pfCap.textContent  = faixaLabel(tierClass(d.pontoForte.nota)).replace(/^./, c=>c.toUpperCase()) + ' · nota ' + fmtNota(d.pontoForte.nota);
        }else{
            if (pfNome) pfNome.textContent = '—';
            if (pfCap)  pfCap.textContent  = 'Sem notas preenchidas';
        }
        document.querySelectorAll('[data-udx-derived="emAtencaoPerfCount"]').forEach(el => el.textContent = d.emAtencao.length);
        const eaLista = document.querySelector('[data-udx-derived="emAtencaoPerfLista"]');
        if (eaLista) eaLista.textContent = d.emAtencao.length ? d.emAtencao.map(f=>f.nome).join(' · ') : '—';
        const eaTit = document.querySelector('[data-udx-derived="emAtencaoPerfTitulo"]');
        if (eaTit) eaTit.innerHTML = d.emAtencao.length ? d.emAtencao.map(f=>'<em>'+f.nome+'</em>').join(' · ') : '—';
        const focus = document.querySelector('[data-udx-derived-card="focusCalloutPerf"]');
        if (focus) focus.classList.toggle('udx-hidden', d.emAtencao.length === 0);
    }

    /* ================================================================
       ESTADO GLOBAL DO EIXO PERFORMÁTICO
    ================================================================ */
    function hasPerformaticCriteria(){
        return Array.isArray(STATE.performaticos) && STATE.performaticos.length > 0;
    }

    function syncPerformaticAxisState(){
        const active = hasPerformaticCriteria();
        const block = document.getElementById('udxPerfEditorBlock');
        if (block) block.classList.toggle('udx-hidden', !active);

        // Sem critérios, nenhuma página do eixo performático pode permanecer no preview.
        if (!active){
            STATE.paginasFixas.pagePerf1 = false;
            STATE.paginasFixas.pagePerf2 = false;
            STATE.paginasFixas.pagePerf3 = false;
        }
        return active;
    }

    /* ================================================================
       VISIBILIDADE DAS PÁGINAS FIXAS
    ================================================================ */
    function applyPageVisibility(){
        PAGINAS_FIXAS_KEYS.forEach(k => {
            let el;
            if (k === 'page1' || k === 'page2' || k === 'page3'){
                el = document.querySelector('.' + k);
            }else{
                el = document.querySelector('[data-udx-fixed-page="'+k+'"]');
            }
            if (!el) return;
            const isPerf = k === 'pagePerf1' || k === 'pagePerf2' || k === 'pagePerf3';
            const visible = !!STATE.paginasFixas[k] && (!isPerf || hasPerformaticCriteria());
            el.classList.toggle('udx-hidden', !visible);
        });
    }

    /* ================================================================
       PÁGINAS EXTRAS + RENUMERAÇÃO
    ================================================================ */
	function getPaginaElement(pageId){
		if (!pageId) return null;

		/*
		 * Página extra.
		 */
		if (String(pageId).startsWith('pg-')){
			return document.querySelector(
				'.page-extra[data-page-extra-id="' + pageId + '"]'
			);
		}

		/*
		 * Páginas fixas principais.
		 */
		if (
			pageId === 'page1' ||
			pageId === 'page2' ||
			pageId === 'page3'
		){
			return document.querySelector('.' + pageId);
		}

		/*
		 * Páginas performáticas.
		 */
		return document.querySelector(
			'[data-udx-fixed-page="' + pageId + '"]'
		);
	}

	function getPaginasVisiveis(){
		return Array.from(
			document.querySelectorAll(
				'.page1, .pagePerf1, .page2, .pagePerf2, .page3, .pagePerf3, .page-extra'
			)
		).filter(el => !el.classList.contains('udx-hidden'));
	}

	function realocarSignOff(){
		const signOff = document.querySelector('[data-udx-signoff]');
		if (!signOff) return;

		const paginas = getPaginasVisiveis();
		if (!paginas.length) return;

		const ultimaPagina = paginas[paginas.length - 1];

		const footer = ultimaPagina.querySelector(':scope > .page__footer');

		if (footer){
			ultimaPagina.insertBefore(signOff, footer);
		}else{
			ultimaPagina.appendChild(signOff);
		}
	}

    function renderPaginasExtras(){
		const signOff = document.querySelector('[data-udx-signoff]');
		const p3 = document.querySelector('.page3');

		/*
		 * Antes de destruir páginas extras anteriores,
		 * protege o sign-off recolocando-o temporariamente
		 * em uma página fixa.
		 */
		if (signOff && signOff.closest('.page-extra') && p3){
			const footerP3 = p3.querySelector(':scope > .page__footer');

			if (footerP3){
				p3.insertBefore(signOff, footerP3);
			}else{
				p3.appendChild(signOff);
			}
		}
		
		const editor = document.getElementById('udxEditor');
		const container = p3 ? p3.parentNode : document.body;

        STATE.paginasExtras.forEach(pg => {
            const el = document.createElement('section');
            el.className = 'page-extra';
            el.dataset.pageExtraId = pg.id;
            el.innerHTML =
                '<div class="journey" data-udx-journey></div>' +
                '<header class="page__header">' +
                '  <span class="eyebrow"><img class="ico" src="/images/icons/udx-icon.ico"/><span class="eyebrow-dot"></span>Página adicional</span>' +
                '  <span class="chapter-tag"><span data-udx-field="alunoNome">'+(STATE.alunoNome||'')+'</span> · Ficha <span data-udx-fichanum>--</span></span>' +
                '</header>' +
                '<h2 class="page-extra__title">'+(pg.titulo||'Sem título')+'</h2>' +
                '<div class="page-extra__body">'+parseMD(pg.conteudo||'')+'</div>' +
                '<footer class="page__footer">' +
                '  <span class="brand"><span class="brand-mark"></span>Up Dance Xperience</span>' +
                '  <span class="num" data-udx-pagenum>página -- / --</span>' +
                '</footer>';
				
            if (editor && editor.parentNode === container){
				container.insertBefore(el, editor);
			}else{
				container.appendChild(el);
			}
        });
		realocarSignOff();
        renumerarPaginas();
    }
    function renumerarPaginas(){
		const pages = getPaginasVisiveis();
		const total = pages.length;
		
        pages.forEach((page, idx) => {
            const j = page.querySelector('[data-udx-journey]');
            if (j){
                j.innerHTML = '';
                for (let i = 0; i < total; i++){
                    const dot = document.createElement('span');
                    if (i === idx) dot.classList.add('is-here');
                    j.appendChild(dot);
                }
            }
            const num = page.querySelector('[data-udx-pagenum]');
            if (num){
                const cur = String(idx+1).padStart(2,'0');
                const tot = String(total).padStart(2,'0');
                num.innerHTML = 'página <b>'+cur+'</b> / '+tot;
            }
        });
        let fichaCounter = 0;
        pages.forEach(page => {
            const slot = page.querySelector('[data-udx-fichanum]');
            if (slot){
                fichaCounter++;
                slot.textContent = String(fichaCounter).padStart(2,'0');
            }
        });
    }

    function render(){
        ['alunoNome','professorNome','semestre','turmaOrganizacional','modalidadeTurma'].forEach(renderScalar);
        renderLogo();
        renderTags();
        renderObservacoes();
        renderDicas();
        renderFundamentos();
        renderPerformaticos();
        renderObservacoesPerformaticas();
        renderInsightsPerformaticos();
        renderDicasPerformaticas();
        renderDisciplinaPerf();
        renderPaginasExtras();
        syncPerformaticAxisState();
		applyPageVisibility();
		renderDerived();
		renderDerivedPerformatico();
		renderMeta();
        renderFixedPagesEditor();
		realocarSignOff();
		renumerarPaginas();
		updateOverflow();
    }

    /* ================================================================
       OVERFLOW MONITOR
    ================================================================ */
    function updateOverflow(){
        const host = document.getElementById('udxOverflow');
        if (!host) return;
        const pages = getPaginasVisiveis();
		
        const rows = pages.map((el, i) => {
            const h = el.offsetHeight;
            const pct = Math.round((h / A4_HEIGHT_PX) * 100);
            return { idx: i+1, h, pct, over: h > A4_HEIGHT_PX + 2 };
        });
        host.innerHTML =
            '<div style="font-weight:600; margin-bottom:4px;">Altura vs. A4 (297mm)</div>' +
            rows.map(r =>
                '<div class="udx-editor__overflow-row '+(r.over?'is-over':'is-ok')+'">' +
                '<span>Página '+r.idx+'</span>' +
                '<span>'+r.h+'px · '+r.pct+'%'+(r.over?' ⚠':'')+'</span>' +
                '</div>'
            ).join('');
    }

    /* ================================================================
       EDITOR — escalares
    ================================================================ */
    function bindScalarInputs(){
        document.querySelectorAll('[data-udx-input]').forEach(input => {
            const key = input.dataset.udxInput;
            input.value = STATE[key] ?? '';
            input.addEventListener('input', () => {
                STATE[key] = input.value;
                if (key === 'disciplinaPerfLabel' || key === 'disciplinaPerfTexto'){
                    renderDisciplinaPerf();
                }else{
                    renderScalar(key);
                }
                if (key === 'alunoNome'){
                    renderMeta();
                    document.querySelectorAll('.page-extra [data-udx-field="alunoNome"]').forEach(el => el.textContent = STATE.alunoNome);
                }
                saveState(); updateOverflow();
            });
        });
    }

    /* ================================================================
       EDITOR — listas
    ================================================================ */
    function buildTagRow(value, idx){
        const row = document.createElement('div');
        row.className = 'udx-editor__tag-row';
        row.innerHTML = '<input type="text"><button type="button" class="udx-editor__btn udx-editor__btn--sm udx-editor__btn--danger">×</button>';
        const inp = row.querySelector('input');
        inp.value = value;
        inp.addEventListener('input', () => { STATE.tagsModalidades[idx] = inp.value; renderTags(); saveState(); updateOverflow(); });
        row.querySelector('button').addEventListener('click', () => { STATE.tagsModalidades.splice(idx,1); rebuildEditorList('tagsModalidades'); renderTags(); saveState(); updateOverflow(); });
        return row;
    }
    function buildObsItem(obs, idx){
        const item = document.createElement('div');
        item.className = 'udx-editor__item';
        item.innerHTML =
            '<div class="udx-editor__item-head"><span>Observação '+(idx+1)+'</span>' +
            '<button type="button" class="udx-editor__btn udx-editor__btn--sm udx-editor__btn--danger">Remover</button></div>' +
            '<label>Título</label><input type="text" data-role="lead">' +
            '<label>Texto</label><textarea data-role="texto"></textarea>';
        const lead = item.querySelector('[data-role="lead"]');
        const txt  = item.querySelector('[data-role="texto"]');
        lead.value = obs.lead; txt.value = obs.texto;
        lead.addEventListener('input', () => { STATE.observacoes[idx].lead = lead.value; renderObservacoes(); saveState(); updateOverflow(); });
        txt .addEventListener('input', () => { STATE.observacoes[idx].texto = txt.value; renderObservacoes(); saveState(); updateOverflow(); });
        item.querySelector('button').addEventListener('click', () => { STATE.observacoes.splice(idx,1); rebuildEditorList('observacoes'); renderObservacoes(); saveState(); updateOverflow(); });
        return item;
    }
    function buildDicaItem(dica, idx){
        const item = document.createElement('div');
        item.className = 'udx-editor__item udx-editor__item--dica';
        item.innerHTML =
            '<div class="udx-editor__item-head"><span>Dica '+String(idx+1).padStart(2,'0')+'</span>' +
            '<button type="button" class="udx-editor__btn udx-editor__btn--sm udx-editor__btn--danger">Remover</button></div>' +
            '<label>Título</label><input type="text" data-role="titulo">' +
            '<label>Texto</label><textarea data-role="texto"></textarea>';
        const tit = item.querySelector('[data-role="titulo"]');
        const txt = item.querySelector('[data-role="texto"]');
        tit.value = dica.titulo; txt.value = dica.texto;
        tit.addEventListener('input', () => { STATE.dicas[idx].titulo = tit.value; renderDicas(); saveState(); updateOverflow(); });
        txt.addEventListener('input', () => { STATE.dicas[idx].texto = txt.value; renderDicas(); saveState(); updateOverflow(); });
        item.querySelector('button').addEventListener('click', () => { STATE.dicas.splice(idx,1); rebuildEditorList('dicas'); renderDicas(); saveState(); updateOverflow(); });
        return item;
    }
    function buildFundRow(f, idx){
        const row = document.createElement('div');
        row.className = 'udx-editor__nota-row';
        row.innerHTML =
            '<span class="udx-editor__nota-name">'+f.nome+'<span class="udx-editor__nota-tipo">'+(f.tipo==='complementar'?'compl.':'fund.')+'</span></span>' +
            '<input type="number" min="0" max="10" step="0.1">' +
            '<span class="udx-editor__nota-tier"></span>';
        const inp = row.querySelector('input');
        const dot = row.querySelector('.udx-editor__nota-tier');
        inp.value = isEmpty(f.nota) ? '' : f.nota;
        dot.style.background = tierColor(tierClass(f.nota));
        inp.addEventListener('input', () => {
            let raw = inp.value.trim();
            if (raw === ''){ STATE.fundamentos[idx].nota = null; }
            else {
                let v = parseFloat(raw);
                if (Number.isNaN(v)) v = null;
                else v = Math.max(0, Math.min(10, v));
                STATE.fundamentos[idx].nota = v;
            }
            dot.style.background = tierColor(tierClass(STATE.fundamentos[idx].nota));
            renderFundamentos(); renderDerived(); saveState(); updateOverflow();
        });
        return row;
    }
    function buildPageItem(pg, idx){
        const item = document.createElement('div');
        item.className = 'udx-editor__page-item';
        item.innerHTML =
            '<div class="udx-editor__item-head"><span>Página extra '+(idx+1)+'</span>' +
            '<button type="button" class="udx-editor__btn udx-editor__btn--sm udx-editor__btn--danger">Remover</button></div>' +
            '<label>Título</label><input type="text" data-role="titulo">' +
            '<label>Conteúdo</label><textarea data-role="conteudo" style="min-height:100px;"></textarea>';
        const tit = item.querySelector('[data-role="titulo"]');
        const txt = item.querySelector('[data-role="conteudo"]');
        tit.value = pg.titulo || ''; txt.value = pg.conteudo || '';
        tit.addEventListener('input', () => { STATE.paginasExtras[idx].titulo = tit.value; renderPaginasExtras(); saveState(); updateOverflow(); });
        txt.addEventListener('input', () => { STATE.paginasExtras[idx].conteudo = txt.value; renderPaginasExtras(); saveState(); updateOverflow(); });
        item.querySelector('button').addEventListener('click', () => { STATE.paginasExtras.splice(idx,1); rebuildEditorList('paginasExtras'); renderPaginasExtras(); saveState(); updateOverflow(); });
        return item;
    }
    /* Builders do eixo performático */
    function buildPerfRow(f, idx){
        const row = document.createElement('div');
        row.className = 'udx-editor__nota-row';
        row.innerHTML =
            '<span class="udx-editor__nota-name">'+f.nome+'<span class="udx-editor__nota-tipo">perf.</span></span>' +
            '<input type="number" min="0" max="10" step="0.1" aria-label="Nota de '+f.nome.replace(/"/g, '&quot;')+'">' +
            '<span class="udx-editor__nota-tier"></span>';
        const inp = row.querySelector('input');
        const dot = row.querySelector('.udx-editor__nota-tier');
        inp.value = isEmpty(f.nota) ? '' : f.nota;
        dot.style.background = tierColor(tierClass(f.nota));
        inp.addEventListener('input', () => {
            let raw = inp.value.trim();
            if (raw === ''){ STATE.performaticos[idx].nota = null; }
            else {
                let v = parseFloat(raw);
                if (Number.isNaN(v)) v = null;
                else v = Math.max(0, Math.min(10, v));
                STATE.performaticos[idx].nota = v;
            }
            dot.style.background = tierColor(tierClass(STATE.performaticos[idx].nota));
            renderPerformaticos();
            renderDerivedPerformatico();
            saveState();
            updateOverflow();
        });
        return row;
    }
    function buildObsPerfItem(obs, idx){
        const item = document.createElement('div');
        item.className = 'udx-editor__item';
        item.innerHTML =
            '<div class="udx-editor__item-head"><span>Observação perf. '+(idx+1)+'</span>' +
            '<button type="button" class="udx-editor__btn udx-editor__btn--sm udx-editor__btn--danger">Remover</button></div>' +
            '<label>Título</label><input type="text" data-role="lead">' +
            '<label>Texto</label><textarea data-role="texto"></textarea>';
        const lead = item.querySelector('[data-role="lead"]');
        const txt  = item.querySelector('[data-role="texto"]');
        lead.value = obs.lead; txt.value = obs.texto;
        lead.addEventListener('input', () => { STATE.observacoesPerformaticas[idx].lead = lead.value; renderObservacoesPerformaticas(); saveState(); updateOverflow(); });
        txt .addEventListener('input', () => { STATE.observacoesPerformaticas[idx].texto = txt.value; renderObservacoesPerformaticas(); saveState(); updateOverflow(); });
        item.querySelector('button').addEventListener('click', () => { STATE.observacoesPerformaticas.splice(idx,1); rebuildEditorList('observacoesPerformaticas'); renderObservacoesPerformaticas(); saveState(); updateOverflow(); });
        return item;
    }
    function buildInsightPerfItem(ins, idx){
        const item = document.createElement('div');
        item.className = 'udx-editor__item';
        item.innerHTML =
            '<div class="udx-editor__item-head"><span>Insight perf. '+(idx+1)+'</span>' +
            '<button type="button" class="udx-editor__btn udx-editor__btn--sm udx-editor__btn--danger">Remover</button></div>' +
            '<label>Rótulo</label><input type="text" data-role="label">' +
            '<label>Texto</label><textarea data-role="texto"></textarea>';
        const lab = item.querySelector('[data-role="label"]');
        const txt = item.querySelector('[data-role="texto"]');
        lab.value = ins.label; txt.value = ins.texto;
        lab.addEventListener('input', () => { STATE.insightsPerformaticos[idx].label = lab.value; renderInsightsPerformaticos(); saveState(); updateOverflow(); });
        txt.addEventListener('input', () => { STATE.insightsPerformaticos[idx].texto = txt.value; renderInsightsPerformaticos(); saveState(); updateOverflow(); });
        item.querySelector('button').addEventListener('click', () => { STATE.insightsPerformaticos.splice(idx,1); rebuildEditorList('insightsPerformaticos'); renderInsightsPerformaticos(); saveState(); updateOverflow(); });
        return item;
    }
    function buildDicaPerfItem(dica, idx){
        const item = document.createElement('div');
        item.className = 'udx-editor__item udx-editor__item--dica';
        item.innerHTML =
            '<div class="udx-editor__item-head"><span>Dica perf. '+String(idx+1).padStart(2,'0')+'</span>' +
            '<button type="button" class="udx-editor__btn udx-editor__btn--sm udx-editor__btn--danger">Remover</button></div>' +
            '<label>Título</label><input type="text" data-role="titulo">' +
            '<label>Texto</label><textarea data-role="texto"></textarea>';
        const tit = item.querySelector('[data-role="titulo"]');
        const txt = item.querySelector('[data-role="texto"]');
        tit.value = dica.titulo; txt.value = dica.texto;
        tit.addEventListener('input', () => { STATE.dicasPerformaticas[idx].titulo = tit.value; renderDicasPerformaticas(); saveState(); updateOverflow(); });
        txt.addEventListener('input', () => { STATE.dicasPerformaticas[idx].texto = txt.value; renderDicasPerformaticas(); saveState(); updateOverflow(); });
        item.querySelector('button').addEventListener('click', () => { STATE.dicasPerformaticas.splice(idx,1); rebuildEditorList('dicasPerformaticas'); renderDicasPerformaticas(); saveState(); updateOverflow(); });
        return item;
    }

    /* Controle global de ativação/remoção do eixo performático */
    function renderPerfActivate(){
        const host = document.getElementById('udxPerfActivateHost');
        if (!host) return;
        host.innerHTML = '';

        const active = syncPerformaticAxisState();
        renderFixedPagesEditor();

        if (!active){
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'udx-editor__activate';
            btn.textContent = '+ Inserir eixo performático';
            btn.addEventListener('click', () => {
                STATE.performaticos = JSON.parse(JSON.stringify(PERFORMATIVOS_SEED));
                STATE.paginasFixas.pagePerf1 = true;
                STATE.paginasFixas.pagePerf2 = true;
                STATE.paginasFixas.pagePerf3 = true;
                rebuildEditorList('performaticos');
                renderPerfActivate();
                render();
                renderPerfHiddenFlags();
                saveState();
            });
            host.appendChild(btn);
            return;
        }

        const actions = document.createElement('div');
        actions.className = 'udx-editor__perf-axis-actions';

        const status = document.createElement('span');
        status.className = 'udx-editor__perf-axis-status';
        status.textContent = STATE.performaticos.length + (STATE.performaticos.length === 1 ? ' critério ativo' : ' critérios ativos');
        actions.appendChild(status);

        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'udx-editor__btn udx-editor__btn--sm udx-editor__btn--danger udx-editor__perf-remove-all';
        remove.textContent = '× Remover eixo performático';
        remove.addEventListener('click', () => {
            if (!confirm('Remover todo o eixo performático? Critérios, observações, insights e dicas performáticas serão apagados da ficha.')) return;

            STATE.performaticos = [];
            STATE.observacoesPerformaticas = [];
            STATE.insightsPerformaticos = [];
            STATE.dicasPerformaticas = [];
            STATE.disciplinaPerfTexto = '';
            STATE.paginasFixas.pagePerf1 = false;
            STATE.paginasFixas.pagePerf2 = false;
            STATE.paginasFixas.pagePerf3 = false;

            ['performaticos','observacoesPerformaticas','insightsPerformaticos','dicasPerformaticas'].forEach(rebuildEditorList);
            const disciplinaInput = document.querySelector('[data-udx-input="disciplinaPerfTexto"]');
            if (disciplinaInput) disciplinaInput.value = '';

            renderPerformaticos();
            renderObservacoesPerformaticas();
            renderInsightsPerformaticos();
            renderDicasPerformaticas();
            renderDisciplinaPerf();
            renderDerivedPerformatico();
            syncPerformaticAxisState();
            renderPerfActivate();
            applyPageVisibility();
            renderPerfHiddenFlags();
            realocarSignOff();
            renumerarPaginas();
            saveState();
            updateOverflow();
        });
        actions.appendChild(remove);
        host.appendChild(actions);
    }

    function rebuildEditorList(key){
        const host = document.querySelector('[data-udx-input-list="'+key+'"]');
        if (!host) return;
        host.innerHTML = '';
        if (key === 'tagsModalidades')           STATE.tagsModalidades.forEach((v,i) => host.appendChild(buildTagRow(v,i)));
        if (key === 'observacoes')               STATE.observacoes.forEach((v,i) => host.appendChild(buildObsItem(v,i)));
        if (key === 'dicas')                     STATE.dicas.forEach((v,i) => host.appendChild(buildDicaItem(v,i)));
        if (key === 'fundamentos')               STATE.fundamentos.forEach((v,i) => host.appendChild(buildFundRow(v,i)));
        if (key === 'paginasExtras')             STATE.paginasExtras.forEach((v,i) => host.appendChild(buildPageItem(v,i)));
        if (key === 'performaticos')             STATE.performaticos.forEach((v,i) => host.appendChild(buildPerfRow(v,i)));
        if (key === 'observacoesPerformaticas')  STATE.observacoesPerformaticas.forEach((v,i) => host.appendChild(buildObsPerfItem(v,i)));
        if (key === 'insightsPerformaticos')     STATE.insightsPerformaticos.forEach((v,i) => host.appendChild(buildInsightPerfItem(v,i)));
        if (key === 'dicasPerformaticas')        STATE.dicasPerformaticas.forEach((v,i) => host.appendChild(buildDicaPerfItem(v,i)));
    }
    function bindAddButtons(){
        document.querySelectorAll('[data-udx-add]').forEach(btn => {
            const key = btn.dataset.udxAdd;
            btn.addEventListener('click', () => {
                if (key === 'tagsModalidades')          STATE.tagsModalidades.push('Nova tag');
                if (key === 'observacoes')              STATE.observacoes.push({ lead: 'Novo tópico', texto: 'Escreva aqui. Use **negrito** onde precisar.' });
                if (key === 'dicas')                    STATE.dicas.push({ titulo: 'Novo tópico', texto: 'Escreva aqui. Use **negrito** onde precisar.' });
                if (key === 'performaticos'){
                    STATE.performaticos.push({ id: 'perf-'+Date.now(), nome: 'Novo critério', nota: null, tipo: 'performatico' });
                    STATE.paginasFixas.pagePerf1 = true;
                    STATE.paginasFixas.pagePerf2 = true;
                    STATE.paginasFixas.pagePerf3 = true;
                }
                if (key === 'paginasExtras')            STATE.paginasExtras.push({ id: 'pg-'+Date.now(), titulo: 'Nova página', conteudo: 'Conteúdo. Use **negrito** onde precisar.' });
                if (key === 'observacoesPerformaticas') STATE.observacoesPerformaticas.push({ lead: 'Novo tópico', texto: 'Escreva aqui. Use **negrito** onde precisar.' });
                if (key === 'insightsPerformaticos')    STATE.insightsPerformaticos.push({ label: 'Novo insight', texto: 'Escreva aqui. Use **negrito** onde precisar.' });
                if (key === 'dicasPerformaticas')       STATE.dicasPerformaticas.push({ titulo: 'Novo tópico', texto: 'Escreva aqui. Use **negrito** onde precisar.' });
                rebuildEditorList(key);
                if (key === 'tagsModalidades')          renderTags();
                if (key === 'observacoes')              renderObservacoes();
                if (key === 'dicas')                    renderDicas();
                if (key === 'performaticos'){
                    renderPerformaticos();
                    syncPerformaticAxisState();
                    renderPerfActivate();
                    applyPageVisibility();
                    renderPerfHiddenFlags();
                    realocarSignOff();
                    renumerarPaginas();
                }
                if (key === 'paginasExtras')            renderPaginasExtras();
                if (key === 'observacoesPerformaticas') renderObservacoesPerformaticas();
                if (key === 'insightsPerformaticos')    renderInsightsPerformaticos();
                if (key === 'dicasPerformaticas')       renderDicasPerformaticas();
                renderDerived(); renderDerivedPerformatico(); saveState(); updateOverflow();
            });
        });
    }

    /* ================================================================
       AÇÕES
    ================================================================ */
    function bindActions(){
        document.getElementById('udxSave')?.addEventListener('click', () => {
            clearTimeout(saveTimer);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE));
            alert('Salvo em localStorage.');
        });
        document.getElementById('udxExport')?.addEventListener('click', () => {
            const blob = new Blob([JSON.stringify(STATE, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'ficha-' + (STATE.alunoNome || 'aluno').toLowerCase().replace(/\s+/g,'-') + '.json';
            a.click();
            URL.revokeObjectURL(url);
        });
        document.getElementById('udxReset')?.addEventListener('click', () => {
            if (!confirm('Restaurar o conteúdo original da ficha? Perderá as edições atuais.')) return;
            localStorage.removeItem(STORAGE_KEY);
            location.reload();
        });
        const logoInput = document.getElementById('udxLogoInput');
        const logoFilename = document.getElementById('udxLogoFilename');
        const setLogoFilename = (name) => {
            if (logoFilename) logoFilename.textContent = name || 'Nenhum arquivo selecionado';
        };
        logoInput?.addEventListener('change', () => {
            const file = logoInput.files && logoInput.files[0];
            if (!file){ setLogoFilename('Nenhum arquivo selecionado'); return; }
            setLogoFilename(file.name);
            const reader = new FileReader();
            reader.onload = () => {
                STATE.logoSrc = String(reader.result || DEFAULT_LOGO_SRC);
                renderLogo(); saveState(); updateOverflow();
            };
            reader.readAsDataURL(file);
        });
        document.getElementById('udxLogoReset')?.addEventListener('click', () => {
            STATE.logoSrc = DEFAULT_LOGO_SRC;
            if (logoInput) logoInput.value = '';
            setLogoFilename('Logo padrão restaurada');
            renderLogo(); saveState(); updateOverflow();
        });

        const themeToggle = document.getElementById('udxThemeToggle');
        const applyTheme = (theme) => {
            const resolved = theme === 'dark' ? 'dark' : 'light';
            document.body.dataset.udxTheme = resolved;
            document.documentElement.setAttribute('data-bs-theme', resolved);
            if (themeToggle){
                const dark = resolved === 'dark';
                themeToggle.setAttribute('aria-pressed', String(dark));
                const icon = themeToggle.querySelector('.udx-theme-toggle__icon');
                const text = themeToggle.querySelector('.udx-theme-toggle__text');
                if (icon) icon.textContent = dark ? '☀' : '☾';
                if (text) text.textContent = dark ? 'Claro' : 'Escuro';
                themeToggle.title = dark ? 'Ativar tema claro' : 'Ativar tema escuro';
            }
        };
        let currentTheme = 'light';
        try{ currentTheme = localStorage.getItem(THEME_KEY) || 'light'; }catch(e){}
        applyTheme(currentTheme);
        themeToggle?.addEventListener('click', () => {
            const next = document.body.dataset.udxTheme === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            try{ localStorage.setItem(THEME_KEY, next); }catch(e){}
        });

        const printBar = document.getElementById('udxPrintPreviewBar');

        /* Zoom visual do preview: não altera dimensões A4 nem a impressão real. */
        const ZOOM_MIN  = 50;
        const ZOOM_MAX  = 160;
        const ZOOM_STEP = 10;
        let previewZoom = 100;
        const zoomOut   = document.getElementById('udxZoomOut');
        const zoomIn    = document.getElementById('udxZoomIn');
        const zoomReset = document.getElementById('udxZoomReset');

        const applyPreviewZoom = (value) => {
            previewZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, Number(value) || 100));
            document.body.style.setProperty('--udx-preview-zoom', String(previewZoom / 100));
            if (zoomReset) zoomReset.textContent = previewZoom + '%';
            if (zoomOut) zoomOut.disabled = previewZoom <= ZOOM_MIN;
            if (zoomIn)  zoomIn.disabled  = previewZoom >= ZOOM_MAX;
        };
        applyPreviewZoom(100);
        zoomOut?.addEventListener('click', () => applyPreviewZoom(previewZoom - ZOOM_STEP));
        zoomIn?.addEventListener('click',  () => applyPreviewZoom(previewZoom + ZOOM_STEP));
        zoomReset?.addEventListener('click', () => applyPreviewZoom(100));

        const openPrintPreview = () => {
            applyPageVisibility();
            realocarSignOff();
            renumerarPaginas();
            document.body.classList.add('udx-print-preview');
            updateResponsivePreview();
            printBar?.setAttribute('aria-hidden', 'false');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        const closePrintPreview = () => {
            document.body.classList.remove('udx-print-preview');
            updateResponsivePreview();
            printBar?.setAttribute('aria-hidden', 'true');
        };

        /* ============================================================
           V18 — EXPORTAÇÃO DAS PÁGINAS VISÍVEIS PARA PDF
           Captura o DOM já renderizado para preservar cores, gradientes,
           tipografia, imagens, logos, pseudo-elementos e paginação.
        ============================================================ */
        let pdfExporting = false;

        const getVisiblePdfPages = () => Array.from(document.querySelectorAll(
            '#udxAssessmentApp > .page, #udxAssessmentApp > .page1, #udxAssessmentApp > .page2, #udxAssessmentApp > .page3, ' +
            '#udxAssessmentApp > .pagePerf1, #udxAssessmentApp > .pagePerf2, #udxAssessmentApp > .pagePerf3, #udxAssessmentApp > .page-extra'
        )).filter(page => {
            if (page.classList.contains('udx-hidden')) return false;
            const style = window.getComputedStyle(page);
            return style.display !== 'none' && style.visibility !== 'hidden';
        });

        const waitForPdfAssets = async (pages) => {
            try{ await document.fonts?.ready; }catch(_){}
            const images = pages.flatMap(page => Array.from(page.querySelectorAll('img')));
            await Promise.all(images.map(img => {
                if (img.complete && img.naturalWidth > 0){
                    if (typeof img.decode === 'function') return img.decode().catch(() => undefined);
                    return Promise.resolve();
                }
                return new Promise(resolve => {
                    const done = () => resolve();
                    img.addEventListener('load', done, { once:true });
                    img.addEventListener('error', done, { once:true });
                    setTimeout(done, 8000);
                });
            }));
        };

        /* V19 — prepara imagens para uma captura independente de origem.
           Em localhost e produção, recursos relativos/same-origin são convertidos
           temporariamente para data URLs. Isso elimina canvas "tainted" e torna a
           captura previsível. */
        const blobToDataUrl = (blob) => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.onerror = () => reject(reader.error || new Error('Falha ao converter imagem para data URL.'));
            reader.readAsDataURL(blob);
        });

        const imageSourceToDataUrl = async (src) => {
            if (!src || /^data:/i.test(src)) return src;
            const absolute = new URL(src, window.location.href);

            if (absolute.protocol === 'file:') {
                throw new Error('A página foi aberta via file://. Execute-a por http://localhost para permitir a leitura segura dos recursos.');
            }

            const sameOrigin = absolute.origin === window.location.origin;
            const response = await fetch(absolute.href, {
                method: 'GET',
                mode: 'cors',
                credentials: sameOrigin ? 'same-origin' : 'omit',
                cache: 'force-cache'
            });
            if (!response.ok) {
                throw new Error('Imagem inacessível (' + response.status + '): ' + absolute.pathname);
            }
            return blobToDataUrl(await response.blob());
        };

        const preparePdfImageSources = async (pages, progressText) => {
            const images = Array.from(new Set(pages.flatMap(page => Array.from(page.querySelectorAll('img')))));
            const restore = [];

            for (let i = 0; i < images.length; i++) {
                const img = images[i];
                const rawSrc = img.getAttribute('src') || img.currentSrc || '';
                if (!rawSrc) continue;

                if (progressText) progressText.textContent = 'Preparando imagem ' + (i + 1) + ' de ' + images.length + '…';

                if (/^data:/i.test(rawSrc)) {
                    if (typeof img.decode === 'function') await img.decode().catch(() => undefined);
                    continue;
                }

                try {
                    const dataUrl = await imageSourceToDataUrl(img.currentSrc || rawSrc);
                    if (!dataUrl) continue;
                    restore.push({ img, src: rawSrc });
                    img.src = dataUrl;
                    if (typeof img.decode === 'function') await img.decode().catch(() => undefined);
                } catch (error) {
                    const absolute = (() => { try { return new URL(img.currentSrc || rawSrc, window.location.href); } catch (_) { return null; } })();
                    const label = img.alt ? '“' + img.alt + '”' : (absolute?.pathname || rawSrc);
                    throw new Error('Não foi possível preparar a imagem ' + label + '. ' + (error?.message || error));
                }
            }

            return () => {
                restore.forEach(item => { item.img.setAttribute('src', item.src); });
            };
        };

        const makePdfProgress = () => {
            const overlay = document.createElement('div');
            overlay.className = 'udx-pdf-progress';
            overlay.setAttribute('role', 'status');
            overlay.setAttribute('aria-live', 'polite');
            overlay.innerHTML =
                '<div class="udx-pdf-progress__card">' +
                    '<div class="udx-pdf-progress__title">Gerando PDF</div>' +
                    '<div class="udx-pdf-progress__text">Preparando páginas…</div>' +
                    '<div class="udx-pdf-progress__track"><div class="udx-pdf-progress__bar"></div></div>' +
                '</div>';
            document.body.appendChild(overlay);
            return {
                root: overlay,
                text: overlay.querySelector('.udx-pdf-progress__text'),
                bar: overlay.querySelector('.udx-pdf-progress__bar')
            };
        };

        const safePdfFilename = () => {
            const base = String(STATE.alunoNome || 'aluno')
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '') || 'aluno';
            return 'ficha-' + base + '.pdf';
        };

        const exportVisiblePagesToPdf = async () => {
            if (pdfExporting) return;

            if (window.location.protocol === 'file:'){
                alert('Para gerar o PDF, execute o projeto por um servidor local (http://localhost) ou online.\n\nNo VS Code/Windows 11, use Live Server ou execute: py -m http.server 5500');
                return;
            }

            const html2canvasLib = window.html2canvas;
            const JsPdf = window.jspdf?.jsPDF;
            if (typeof html2canvasLib !== 'function' || typeof JsPdf !== 'function'){
                alert('Os módulos de geração de PDF não foram carregados. Verifique a conexão e recarregue a página.');
                return;
            }

            applyPageVisibility();
            realocarSignOff();
            renumerarPaginas();

            const pagesBeforePreview = getVisiblePdfPages();
            if (!pagesBeforePreview.length){
                alert('Não há páginas visíveis para exportar.');
                return;
            }

            pdfExporting = true;
            const pdfButtons = [
                document.getElementById('udxExportPdf'),
                document.getElementById('udxExportPdfPreview')
            ].filter(Boolean);
            pdfButtons.forEach(btn => btn.disabled = true);

            const progress = makePdfProgress();
            const wasPreview = document.body.classList.contains('udx-print-preview');
            const previousZoom = previewZoom;
            const previousScrollX = window.scrollX;
            const previousScrollY = window.scrollY;
            let restorePreparedImages = null;

            try{
                /* A classe de preview neutraliza o tema escuro e reproduz o
                   papel claro utilizado na impressão. O zoom é fixado em 100%
                   somente durante a captura. */
                document.body.classList.add('udx-print-preview', 'udx-pdf-exporting');
                applyPreviewZoom(100);
                document.body.style.removeProperty('--udx-responsive-zoom');
                await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

                const pages = getVisiblePdfPages();
                await waitForPdfAssets(pages);
                restorePreparedImages = await preparePdfImageSources(pages, progress.text);
                await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

                const pdf = new JsPdf({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4',
                    compress: true,
                    putOnlyUsedFonts: true
                });
                pdf.setProperties({
                    title: 'Ficha de Avaliação · ' + (STATE.alunoNome || 'Aluno'),
                    subject: 'Up Dance Xperience · Ficha de Avaliação',
                    author: 'Up Dance Xperience',
                    creator: 'UDX Editor'
                });

                for (let i = 0; i < pages.length; i++){
                    const page = pages[i];
                    progress.text.textContent = 'Renderizando página ' + (i + 1) + ' de ' + pages.length + '…';
                    progress.bar.style.width = Math.round((i / pages.length) * 100) + '%';

                    const captureWidth  = Math.round(page.offsetWidth  || A4_WIDTH_PX);
                    const captureHeight = Math.round(page.offsetHeight || A4_HEIGHT_PX);
                    const canvas = await html2canvasLib(page, {
                        scale: 2,
                        useCORS: true,
                        allowTaint: false,
                        backgroundColor: '#ffffff',
                        logging: false,
                        imageTimeout: 20000,
                        width: captureWidth,
                        height: captureHeight,
                        windowWidth: Math.max(document.documentElement.clientWidth, captureWidth),
                        windowHeight: Math.max(document.documentElement.clientHeight, captureHeight),
                        scrollX: 0,
                        scrollY: 0,
                        foreignObjectRendering: false,
                        removeContainer: true,
                        onclone: (clonedDocument) => {
                            clonedDocument.body.classList.add('udx-print-preview', 'udx-pdf-exporting');
                            clonedDocument.querySelectorAll('.udx-page-remove, .udx-editor, .udx-editor__toggle, .udx-editor__quick-print, .udx-assessment-topbar, .udx-print-preview-bar').forEach(el => el.remove());
                        }
                    });

                    /* Normaliza a imagem para a proporção física A4 sem
                       distorcer o conteúdo. Se existir overflow vertical, a
                       parte além da folha é cortada como ocorreria no papel. */
                    const a4Ratio = 297 / 210;
                    const targetHeight = Math.round(canvas.width * a4Ratio);
                    const normalized = document.createElement('canvas');
                    normalized.width = canvas.width;
                    normalized.height = targetHeight;
                    const ctx = normalized.getContext('2d', { alpha:false });
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, normalized.width, normalized.height);
                    const copyHeight = Math.min(canvas.height, targetHeight);
                    ctx.drawImage(canvas, 0, 0, canvas.width, copyHeight, 0, 0, canvas.width, copyHeight);

                    if (i > 0) pdf.addPage('a4', 'portrait');
                    const imageData = normalized.toDataURL('image/jpeg', 0.96);
                    pdf.addImage(imageData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');

                    progress.bar.style.width = Math.round(((i + 1) / pages.length) * 100) + '%';
                    await new Promise(resolve => requestAnimationFrame(resolve));
                }

                progress.text.textContent = 'Finalizando arquivo…';
                progress.bar.style.width = '100%';
                pdf.save(safePdfFilename());
            }catch(error){
                console.error('[UDX] Falha ao gerar PDF:', error);
                const detail = String(error?.message || error || 'Erro desconhecido');
                alert('Não foi possível gerar o PDF.\n\nDetalhe técnico: ' + detail + '\n\nConfirme que o projeto está aberto por http://localhost (Live Server/servidor local) ou por HTTPS em produção.');
            }finally{
                try{ restorePreparedImages?.(); }catch(_){}
                progress.root.remove();
                document.body.classList.remove('udx-pdf-exporting');
                if (!wasPreview) document.body.classList.remove('udx-print-preview');
                applyPreviewZoom(previousZoom);
                updateResponsivePreview();
                printBar?.setAttribute('aria-hidden', wasPreview ? 'false' : 'true');
                pdfButtons.forEach(btn => btn.disabled = false);
                pdfExporting = false;
                window.scrollTo(previousScrollX, previousScrollY);
            }
        };

        document.getElementById('udxExportPdf')?.addEventListener('click', exportVisiblePagesToPdf);
        document.getElementById('udxExportPdfPreview')?.addEventListener('click', exportVisiblePagesToPdf);

        document.getElementById('udxPrintPreview')?.addEventListener('click', openPrintPreview);
        document.getElementById('udxPrintPreviewQuick')?.addEventListener('click', openPrintPreview);
        document.getElementById('udxPrintPreviewClose')?.addEventListener('click', closePrintPreview);
        document.getElementById('udxPrintNow')?.addEventListener('click', () => window.print());
        window.addEventListener('beforeprint', () => {
            applyPageVisibility();
            realocarSignOff();
            renumerarPaginas();
        });
        document.addEventListener('keydown', (event) => {
            if (!document.body.classList.contains('udx-print-preview')) return;
            const target = event.target;
            const editing = target && (target.matches?.('input, textarea, select, [contenteditable=\"true\"]'));
            if (!editing && (event.key === '+' || event.key === '=')){
                event.preventDefault();
                applyPreviewZoom(previewZoom + ZOOM_STEP);
                return;
            }
            if (!editing && event.key === '-'){
                event.preventDefault();
                applyPreviewZoom(previewZoom - ZOOM_STEP);
                return;
            }
            if (!editing && event.key === '0'){
                event.preventDefault();
                applyPreviewZoom(100);
                return;
            }
            if (event.key === 'Escape') closePrintPreview();
        });

        const toggle = document.getElementById('udxEditorToggle');
        const editor = document.getElementById('udxEditor');
        toggle?.addEventListener('click', () => {
            editor.classList.toggle('is-collapsed');
            document.body.classList.toggle('udx-editor-collapsed');
            toggle.setAttribute('aria-expanded', String(!editor.classList.contains('is-collapsed')));
            requestAnimationFrame(() => {
                updateResponsivePreview();
                updateOverflow();
            });
        });
    }

    function renderFixedPagesEditor(){
        const host = document.getElementById('udxFixedPagesEditor');
        if (!host) return;

        host.innerHTML = '';

        PAGINAS_FIXAS_KEYS.forEach(key => {
            const isPerf = key === 'pagePerf1' || key === 'pagePerf2' || key === 'pagePerf3';
            const perfAvailable = hasPerformaticCriteria();

            // Sem eixo performático ativo, as páginas performáticas não fazem parte
            // da composição atual da ficha e não precisam ocupar espaço no editor.
            if (isPerf && !perfAvailable) return;

            const row = document.createElement('div');
            row.className = 'udx-editor__fixed-page-row';
            row.dataset.pageKey = key;

            const info = document.createElement('div');
            info.className = 'udx-editor__fixed-page-info';

            const title = document.createElement('strong');
            title.className = 'udx-editor__fixed-page-title';
            title.textContent = PAGINAS_FIXAS_LABELS[key] || key;

            const status = document.createElement('span');
            const visible = !!STATE.paginasFixas[key];
            status.className = 'udx-editor__fixed-page-status ' + (visible ? 'is-visible' : 'is-hidden');
            status.textContent = visible ? 'Visível' : 'Removida';

            info.appendChild(title);
            info.appendChild(status);

            const button = document.createElement('button');
            button.type = 'button';
            button.className = visible
                ? 'udx-editor__btn udx-editor__btn--sm udx-editor__btn--danger'
                : 'udx-editor__btn udx-editor__btn--sm udx-editor__btn--ghost';
            button.textContent = visible ? 'Remover' : 'Reinserir';
            button.setAttribute('aria-label',
                (visible ? 'Remover ' : 'Reinserir ') + (PAGINAS_FIXAS_LABELS[key] || key)
            );
            button.addEventListener('click', () => {
                if (visible) hidePage(key);
                else showPage(key);
            });

            row.appendChild(info);
            row.appendChild(button);
            host.appendChild(row);
        });

        if (!host.children.length){
            const empty = document.createElement('div');
            empty.className = 'udx-editor__fixed-pages-empty';
            empty.textContent = 'Nenhuma página fixa disponível.';
            host.appendChild(empty);
        }
    }

    /* ================================================================
       REMOÇÃO E REINSERÇÃO DE PÁGINAS FIXAS
    ================================================================ */
    function bindPageRemovers(){
        document.querySelectorAll('[data-udx-remove-page]').forEach(btn => {
            btn.addEventListener('click', () => hidePage(btn.dataset.udxRemovePage));
        });
        ['page1','page2','page3'].forEach(k => {
            const page = document.querySelector('.' + k);
            if (!page || page.querySelector('.udx-page-remove')) return;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'udx-page-remove';
            btn.dataset.udxRemovePage = k;
            btn.textContent = '× Remover';
            btn.addEventListener('click', () => hidePage(k));
            page.appendChild(btn);
        });
    }
    function hidePage(key){
        if (!PAGINAS_FIXAS_KEYS.includes(key)) return;
        STATE.paginasFixas[key] = false;
        applyPageVisibility();
        renderPerfHiddenFlags();
		realocarSignOff();
        renumerarPaginas();
        saveState();
        updateOverflow();
    }
    function showPage(key){
        if (!PAGINAS_FIXAS_KEYS.includes(key)) return;
        const isPerf = key === 'pagePerf1' || key === 'pagePerf2' || key === 'pagePerf3';
        if (isPerf && !hasPerformaticCriteria()){
            renderPerfActivate();
            return;
        }
        STATE.paginasFixas[key] = true;
        applyPageVisibility();
        renderPerfHiddenFlags();
		realocarSignOff();
        renumerarPaginas();
        saveState();
        updateOverflow();
    }
    function renderPerfHiddenFlags(){
        // Compatibilidade com chamadas legadas: o estado das páginas agora
        // é representado diretamente pelo painel "Páginas da ficha".
        document.querySelectorAll('.udx-editor__hidden-flag').forEach(el => el.remove());
        renderFixedPagesEditor();
    }

    /* ================================================================
       BOOT
    ================================================================ */
    document.body.classList.add('udx-editor-open');
    render();
    bindScalarInputs();
    [
        'tagsModalidades','observacoes','dicas','fundamentos','paginasExtras',
        'performaticos','observacoesPerformaticas','insightsPerformaticos','dicasPerformaticas'
    ].forEach(rebuildEditorList);
    bindAddButtons();
    bindActions();
    bindPageRemovers();
    syncPerformaticAxisState();
    renderPerfActivate();
    applyPageVisibility();
    renderPerfHiddenFlags();
    realocarSignOff();
    renumerarPaginas();
    function updateResponsivePreview(){
        if (document.body.classList.contains('udx-print-preview')){
            document.body.style.removeProperty('--udx-responsive-zoom');
            return;
        }

        const viewport = document.documentElement.clientWidth || window.innerWidth;
        const editor = document.getElementById('udxEditor');
        const isCollapsed = document.body.classList.contains('udx-editor-collapsed');
        const editorConsumesLayout = viewport > 1100 && editor && !isCollapsed;
        const editorWidth = editorConsumesLayout ? editor.getBoundingClientRect().width : 0;
        const gutter = viewport <= 640 ? 16 : viewport <= 1100 ? 24 : 40;
        const available = Math.max(220, viewport - editorWidth - gutter);
        const scale = Math.min(1, available / A4_WIDTH_PX);

        document.body.style.setProperty('--udx-responsive-zoom', scale.toFixed(4));
    }

    updateResponsivePreview();
    window.addEventListener('resize', () => {
        updateResponsivePreview();
        updateOverflow();
    });
    console.log('[UDX] Editor v19 · exportação PDF fiel das páginas visíveis carregada · persistência: '+STORAGE_KEY);
})();
