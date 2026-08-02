import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'

export default function ClockPage(){
  const [dateStr, setDateStr] = useState('--/--/----');
  const [timeStr, setTimeStr] = useState('--:--:--');
  const [message, setMessage] = useState('');
  const pinsRef = useRef([]);
  const STORAGE_KEY = 'ponto_records_v1';
  const [history, setHistory] = useState([]);

  useEffect(()=>{
    const t = setInterval(updateClock, 500);
    updateClock();
    loadHistory();
    return ()=>clearInterval(t);
  },[]);

  function pad(n){return n.toString().padStart(2,'0')}
  function updateClock(){
    const now = new Date();
    setDateStr(pad(now.getDate()) + '/' + pad(now.getMonth()+1) + '/' + now.getFullYear());
    setTimeStr(pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds()));
  }

  function getPinValue(){
    return (pinsRef.current || []).map(i=>i?.value||'').join('');
  }

  function loadHistory(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      const recs = raw ? JSON.parse(raw) : [];
      setHistory(recs.slice().reverse());
    }catch(e){ setHistory([]) }
  }

  function saveLocal(rec){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      arr.push(rec);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
      loadHistory();
    }catch(e){ console.warn(e) }
  }

  async function submitPin(){
    const pin = getPinValue();
    if (!/^\d{4}$/.test(pin)){
      setMessage('Informe a senha de 4 dígitos.');
      return;
    }
    try{
      const res = await fetch('/api/punch', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ pin }) });
      if (res.ok){
        const d = await res.json();
        setMessage('Ponto registrado com sucesso às ' + new Date(d.punch.timestamp).toLocaleTimeString());
        saveLocal({ pin, timestamp: d.punch.timestamp, type: 'Ponto' });
      }else{
        console.warn('API falhou', res.status);
        fallbackSave(pin);
      }
    }catch(e){
      console.warn('fetch error', e);
      fallbackSave(pin);
    }
    // clear inputs
    (pinsRef.current || []).forEach(i=>{ if (i) i.value = '' });
    if (pinsRef.current[0]) pinsRef.current[0].focus();
  }

  function fallbackSave(pin){
    const now = new Date();
    const rec = { pin: pin, timestamp: now.toISOString(), type: 'Ponto' };
    saveLocal(rec);
    setMessage('Ponto registrado localmente às ' + new Date(rec.timestamp).toLocaleTimeString());
  }

  function exportCSV(){
    try{
      const recs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (!recs.length){ alert('Nenhum registro para exportar'); return; }
      const headers = ['pin','timestamp','type'];
      const rows = recs.map(r => [r.pin, r.timestamp, r.type || 'Ponto']);
      const csv = [headers.join(','), ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(','))].join('\n');
      const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'ponto_export.csv'; document.body.appendChild(a); a.click(); URL.revokeObjectURL(url); a.remove();
    }catch(e){ console.warn(e) }
  }

  return (
    <div>
      <Head>
        <title>Colégio Municipal Faustino Dias Lima — Ponto</title>
      </Head>

      <header className="header">
        <div className="brand">Colégio Municipal<br/><strong>Faustino Dias Lima</strong></div>
      </header>

      <main className="container">
        <section className="clock-card card">
          <div className="date">{dateStr}</div>
          <div className="time">{timeStr}</div>
        </section>

        <section className="auth-card card">
          <label className="label">Senha de 4 dígitos</label>
          <div className="pin-inputs" id="pinInputs">
            {[0,1,2,3].map((n)=> (
              <input key={n} ref={el=>pinsRef.current[n]=el} inputMode="numeric" pattern="[0-9]*" maxLength={1} className="pin" onInput={(e)=>{ e.target.value = e.target.value.replace(/\D/g,'').slice(0,1); if (e.target.value && n<3) { pinsRef.current[n+1]?.focus() } }} onKeyDown={(e)=>{ if (e.key==='Backspace' && !e.target.value && n>0) pinsRef.current[n-1]?.focus() }} />
            ))}
          </div>
          <button id="submitBtn" className="btn" onClick={submitPin}>Bater Ponto</button>
          <div id="message" className="message" aria-live="polite">{message}</div>
        </section>

        <section className="history-card card">
          <h3>Histórico (local)</h3>
          <ul id="historyList" className="history-list">
            {history.length === 0 && <li className="small">Nenhum registro ainda</li>}
            {history.map((r, idx)=> (
              <li key={idx}><div><strong>{r.pin}</strong> <span className="small">({r.type||'Registro'})</span></div><div className="small">{new Date(r.timestamp).toLocaleString()}</div></li>
            ))}
          </ul>
          <button id="exportBtn" className="btn secondary" onClick={exportCSV}>Exportar CSV</button>
        </section>
      </main>

    </div>
  )
}
