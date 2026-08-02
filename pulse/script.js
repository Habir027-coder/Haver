// Atualiza data e hora
function pad(n){return n.toString().padStart(2,'0')}
function updateClock(){
  const now = new Date();
  const dateEl = document.getElementById('date');
  const timeEl = document.getElementById('time');
  if (dateEl) dateEl.textContent = pad(now.getDate()) + '/' + pad(now.getMonth()+1) + '/' + now.getFullYear();
  if (timeEl) timeEl.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
}
setInterval(updateClock, 500);
updateClock();

// PIN inputs comportamento
const pins = Array.from(document.querySelectorAll('.pin'));
pins.forEach((input, idx) => {
  input.addEventListener('input', (e) => {
    const v = e.target.value.replace(/\D/g,'').slice(0,1);
    e.target.value = v;
    if (v && idx < pins.length-1) pins[idx+1].focus();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !e.target.value && idx>0){
      pins[idx-1].focus();
    }
  });
});
document.getElementById('submitBtn').addEventListener('click', submitPin);

// Histórico na UI / storage
const STORAGE_KEY = 'ponto_records_v1';
function loadRecords(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){return []}
}
function saveRecords(arr){localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))}
function renderHistory(){
  const list = document.getElementById('historyList');
  const recs = loadRecords();
  list.innerHTML = recs.slice().reverse().map(r => {
    const date = new Date(r.timestamp);
    const when = date.toLocaleString();
    return `<li><div><strong>${r.pin}</strong> <span class="small">(${r.type||'Registro'})</span></div><div class="small">${when}</div></li>`;
  }).join('') || '<li class="small">Nenhum registro ainda</li>';
}
renderHistory();

// Submeter PIN
function getPinValue(){ return pins.map(i=>i.value||'').join('') }
async function submitPin(){
  const pin = getPinValue();
  const message = document.getElementById('message');
  if (!/^\d{4}$/.test(pin)){
    message.textContent = 'Informe a senha de 4 dígitos.';
    message.style.color = '#d33';
    return;
  }

  // Tenta enviar ao backend; se falhar, salva localmente
  try{
    const res = await fetch('/api/punch', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ pin })
    });
    if (res.ok){
      const d = await res.json();
      message.textContent = 'Ponto registrado com sucesso às ' + new Date(d.punch.timestamp).toLocaleTimeString();
      message.style.color = '#0a6';
      // também guarda local para histórico local
      const arr = loadRecords(); arr.push({ pin, timestamp: d.punch.timestamp, type: 'Ponto' }); saveRecords(arr); renderHistory();
    }else{
      // fallback para local
      const text = await res.text();
      console.warn('API falhou', text);
      fallbackSave(pin, message);
    }
  }catch(e){
    console.warn('erro fetch', e);
    fallbackSave(pin, message);
  }

  pins.forEach(i=>i.value='');
  pins[0].focus();
}

function fallbackSave(pin, message){
  const now = new Date();
  const rec = { pin: pin, timestamp: now.toISOString(), type: 'Ponto' };
  const arr = loadRecords(); arr.push(rec); saveRecords(arr); renderHistory();
  message.textContent = 'Ponto registrado localmente às ' + new Date(rec.timestamp).toLocaleTimeString();
  message.style.color = '#0a6';
}

// Export CSV
function exportCSV(){
  const recs = loadRecords();
  if (!recs.length){ alert('Nenhum registro para exportar'); return; }
  const headers = ['pin','timestamp','type'];
  const rows = recs.map(r => [r.pin, r.timestamp, r.type || 'Ponto']);
  const csv = [headers.join(','), ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(','))].join('\n');
  const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'ponto_export.csv'; document.body.appendChild(a); a.click();
  URL.revokeObjectURL(url); a.remove();
}
document.getElementById('exportBtn').addEventListener('click', exportCSV);
