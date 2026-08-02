import Head from 'next/head'
import { useEffect, useState } from 'react';

export default function AdminPage(){
  const [user, setUser] = useState(null);
  const [punches, setPunches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(()=>{ fetch('/api/auth/me').then(r=>r.json()).then(d=>{ if (d.user) setUser(d.user); }).catch(()=>{}); },[]);

  async function login(e){
    e.preventDefault();
    const res = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
    if (res.ok){ const d = await res.json(); setUser(d.user); loadPunches(); }
    else alert('falha ao autenticar');
  }

  async function loadPunches(){
    setLoading(true);
    const res = await fetch('/api/punches');
    if (!res.ok){ setLoading(false); alert('erro ao carregar'); return; }
    const d = await res.json(); setPunches(d.punches); setLoading(false);
  }

  return (
    <div style={{padding:20}}>
      <Head><title>Admin — Ponto</title></Head>
      <h1>Painel Admin — Colégio Municipal Faustino Dias Lima</h1>
      {!user && (
        <form onSubmit={login} style={{maxWidth:420}}>
          <h3>Login Admin</h3>
          <div><label>Email</label><br/><input value={email} onChange={(e)=>setEmail(e.target.value)} /></div>
          <div><label>Senha</label><br/><input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} /></div>
          <button>Entrar</button>
        </form>
      )}
      {user && (
        <div>
          <p>Olá, {user.name} ({user.email})</p>
          <button onClick={loadPunches}>Carregar registros</button>
          <a style={{marginLeft:12}} href="/admin/users">Gerenciar usuários</a>
          <div style={{marginTop:12}}>
            {loading ? <div>Carregando...</div> : (
              <table border={1} cellPadding={6} style={{borderCollapse:'collapse'}}>
                <thead><tr><th>ID</th><th>Usuário</th><th>Tipo</th><th>Timestamp</th></tr></thead>
                <tbody>
                  {punches.map(p => (
                    <tr key={p.id}><td>{p.id}</td><td>{p.user?.name}</td><td>{p.type}</td><td>{new Date(p.timestamp).toLocaleString()}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
