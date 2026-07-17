/**
 * Motor compartilhado para formulários Formly/Lovable.
 * @param {string} rootId
 * @param {{ formId: string, endpoint: string, supabaseUrl: string, supabaseKey: string, bucket: string }} config
 */
export function initFormlyForm(rootId, config) {
  const root = document.getElementById(rootId);
  if (!root || root.dataset.formlyInit) return;
  root.dataset.formlyInit = '1';

  const form = root.querySelector('form');
  if (!form) return;

  const errorEl = root.querySelector('[data-formly-error]');
  const successEl = root.querySelector('[data-formly-success]');
  const submitBtn = form.querySelector('button[type=submit]');
  const submitLabel = submitBtn?.textContent?.trim() || 'Enviar';
  const loadingLabel = 'Enviando...';

  const { formId, endpoint, supabaseUrl, supabaseKey, bucket } = config;

  function showError(message) {
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.removeAttribute('hidden');
  }

  function hideError() {
    if (!errorEl) return;
    errorEl.textContent = '';
    errorEl.setAttribute('hidden', '');
  }

  function maskCPF(v) {
    v = v.replace(/\D/g, '').slice(0, 11);
    return v
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  function maskCNPJ(v) {
    v = v.replace(/\D/g, '').slice(0, 14);
    return v
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }

  function maskCEP(v) {
    v = v.replace(/\D/g, '').slice(0, 8);
    return v.replace(/(\d{5})(\d)/, '$1-$2');
  }

  function validCPF(c) {
    c = c.replace(/\D/g, '');
    if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
    let s = 0;
    for (let i = 0; i < 9; i++) s += parseInt(c[i], 10) * (10 - i);
    let d = 11 - (s % 11);
    if (d > 9) d = 0;
    if (d !== parseInt(c[9], 10)) return false;
    s = 0;
    for (let i = 0; i < 10; i++) s += parseInt(c[i], 10) * (11 - i);
    d = 11 - (s % 11);
    if (d > 9) d = 0;
    return d === parseInt(c[10], 10);
  }

  function validCNPJ(c) {
    c = c.replace(/\D/g, '');
    if (c.length !== 14 || /^(\d)\1+$/.test(c)) return false;
    let w = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let s = 0;
    for (let i = 0; i < 12; i++) s += parseInt(c[i], 10) * w[i];
    let d = s % 11 < 2 ? 0 : 11 - (s % 11);
    if (d !== parseInt(c[12], 10)) return false;
    w.unshift(6);
    s = 0;
    for (let i = 0; i < 13; i++) s += parseInt(c[i], 10) * w[i];
    d = s % 11 < 2 ? 0 : 11 - (s % 11);
    return d === parseInt(c[13], 10);
  }

  function readFieldValue(fid) {
    const wrap = form.querySelector(`[data-formly-field="${fid}"]`);
    if (!wrap) return '';

    const checks = wrap.querySelectorAll(`input[type=checkbox][name="${fid}"]`);
    if (checks.length > 1) {
      const arr = [];
      checks.forEach((c) => {
        if (c.checked) arr.push(c.value);
      });
      return arr;
    }
    if (checks.length === 1) {
      return checks[0].checked ? checks[0].value || 'true' : '';
    }

    const radios = wrap.querySelectorAll(`input[type=radio][name="${fid}"]`);
    if (radios.length) {
      let v = '';
      radios.forEach((r) => {
        if (r.checked) v = r.value;
      });
      return v;
    }

    const el = wrap.querySelector(`[name="${fid}"]`);
    return el ? el.value : '';
  }

  function evalCondition(cond) {
    const v = readFieldValue(cond.fieldId);
    const filled = Array.isArray(v) ? v.length > 0 : v !== '' && v != null;
    if (cond.operator === 'filled') return filled;
    const target = (cond.value || '').toString();
    if (cond.operator === 'equals') {
      return Array.isArray(v) ? v.indexOf(target) !== -1 : String(v) === target;
    }
    if (cond.operator === 'not_equals') {
      return Array.isArray(v) ? v.indexOf(target) === -1 : String(v) !== target;
    }
    return true;
  }

  function applyVisibility() {
    form.querySelectorAll('[data-formly-visibleif]').forEach((wrap) => {
      let cond;
      try {
        cond = JSON.parse(wrap.getAttribute('data-formly-visibleif'));
      } catch {
        return;
      }
      const show = evalCondition(cond);
      wrap.style.display = show ? '' : 'none';
      wrap.querySelectorAll('input,select,textarea,button').forEach((el) => {
        el.disabled = !show;
      });
    });
  }

  form.addEventListener('input', applyVisibility);
  form.addEventListener('change', applyVisibility);
  applyVisibility();

  form.querySelectorAll('[data-formly-mask]').forEach((el) => {
    const kind = el.getAttribute('data-formly-mask');
    el.addEventListener('input', () => {
      el.value =
        kind === 'cpf' ? maskCPF(el.value) : kind === 'cnpj' ? maskCNPJ(el.value) : maskCEP(el.value);
    });
  });

  form.querySelectorAll('[data-formly-mask="cep"]').forEach((el) => {
    const target = form.querySelector(`[data-formly-cep-for="${el.name}"]`);
    el.addEventListener('blur', async () => {
      const cep = el.value.replace(/\D/g, '');
      if (cep.length !== 8) {
        if (target) target.textContent = '';
        return;
      }
      if (target) target.textContent = 'Buscando endereço...';
      try {
        const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const j = await r.json();
        if (j.erro) {
          if (target) target.textContent = 'CEP não encontrado';
          return;
        }
        el.dataset.address = JSON.stringify(j);
        if (target) {
          target.innerHTML = `<strong>${j.logradouro}</strong>${j.bairro ? `, ${j.bairro}` : ''} — ${j.localidade}/${j.uf}`;
        }
      } catch {
        if (target) target.textContent = 'Não foi possível buscar o CEP';
      }
    });
  });

  form.querySelectorAll('[data-formly-rating]').forEach((wrap) => {
    const hidden = wrap.querySelector('input[type=hidden]');
    const stars = wrap.querySelectorAll('[data-formly-star]');

    function paint(n) {
      stars.forEach((s) => {
        const starValue = parseInt(s.getAttribute('data-formly-star'), 10);
        s.classList.toggle('formly-star--active', starValue <= n);
      });
    }

    stars.forEach((s) => {
      s.addEventListener('click', () => {
        const n = parseInt(s.getAttribute('data-formly-star'), 10);
        hidden.value = String(n);
        paint(n);
      });
      s.addEventListener('mouseenter', () => {
        paint(parseInt(s.getAttribute('data-formly-star'), 10));
      });
    });

    wrap.addEventListener('mouseleave', () => {
      paint(parseInt(hidden.value, 10) || 0);
    });
  });

  async function uploadFile(fileInput) {
    const file = fileInput.files[0];
    if (!file) return null;

    const maxMB = parseFloat(fileInput.getAttribute('data-formly-max-mb')) || 10;
    if (file.size > maxMB * 1024 * 1024) {
      throw new Error(`Arquivo maior que ${maxMB}MB`);
    }

    const name = fileInput.getAttribute('data-formly-upload');
    const status = form.querySelector(`[data-formly-upload-status-for="${name}"]`);
    if (status) status.textContent = 'Enviando arquivo...';

    const safe = file.name.replace(/[^\w.\-]/g, '_');
    const path = `${formId}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${safe}`;
    const url = `${supabaseUrl}/storage/v1/object/${bucket}/${path}`;

    const r = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
        apikey: supabaseKey,
        'Content-Type': file.type || 'application/octet-stream',
        'x-upsert': 'false',
      },
      body: file,
    });

    if (!r.ok) throw new Error('Upload falhou');
    if (status) status.textContent = `✓ ${file.name}`;
    return { path, name: file.name, size: file.size, type: file.type };
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    if (!form.noValidate && !form.reportValidity()) {
      return;
    }

    let invalid = null;
    form.querySelectorAll('[data-formly-mask="cpf"]').forEach((el) => {
      if (!el.disabled && el.value && !validCPF(el.value)) {
        invalid = invalid || 'CPF inválido';
      }
    });
    form.querySelectorAll('[data-formly-mask="cnpj"]').forEach((el) => {
      if (!el.disabled && el.value && !validCNPJ(el.value)) {
        invalid = invalid || 'CNPJ inválido';
      }
    });
    if (invalid) {
      showError(invalid);
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = loadingLabel;
    }

    try {
      const uploads = form.querySelectorAll('[data-formly-upload]');
      const uploadResults = {};

      for (let i = 0; i < uploads.length; i++) {
        if (uploads[i].disabled) continue;
        const meta = await uploadFile(uploads[i]);
        if (meta) uploadResults[uploads[i].getAttribute('data-formly-upload')] = meta;
      }

      const data = {};
      new FormData(form).forEach((v, k) => {
        if (data[k] !== undefined) {
          if (!Array.isArray(data[k])) data[k] = [data[k]];
          data[k].push(v);
        } else {
          data[k] = v;
        }
      });

      Object.keys(uploadResults).forEach((k) => {
        data[k] = uploadResults[k];
      });

      form.querySelectorAll('[data-formly-mask="cep"]').forEach((el) => {
        if (!el.disabled && el.dataset.address) {
          try {
            data[el.name] = { cep: el.value, address: JSON.parse(el.dataset.address) };
          } catch {
            /* ignore malformed address payload */
          }
        }
      });

      const r = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form_id: formId, data }),
      });

      if (!r.ok) throw new Error(`Erro ${r.status}`);

      form.hidden = true;
      if (successEl) {
        successEl.removeAttribute('hidden');
      }
    } catch (err) {
      const isNetworkError =
        err instanceof TypeError && /fetch/i.test(err.message);
      const message = isNetworkError
        ? 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.'
        : err instanceof Error && err.message
          ? `Erro ao enviar: ${err.message}`
          : 'Não foi possível enviar o formulário. Tente novamente em instantes.';
      showError(message);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitLabel;
      }
    }
  });
}

/**
 * @param {HTMLElement} root
 */
export function initFormlyFormFromRoot(root) {
  if (!(root instanceof HTMLElement) || !root.id) return;

  initFormlyForm(root.id, {
    formId: root.dataset.formId || '',
    endpoint: root.dataset.endpoint || '',
    supabaseUrl: root.dataset.supabaseUrl || '',
    supabaseKey: root.dataset.supabaseKey || '',
    bucket: root.dataset.bucket || '',
  });
}
