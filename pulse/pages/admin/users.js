import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function UsersPage(){
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('employee');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');

  useEffect(()=>{ load(); },[]);

  async function load(){
    const res = await fetch('/api/admin/users');
    if (!res.ok){ alert('erro ao carregar usuários'); return; }
    const d = await res.json(); setUsers(d.users);
  }

  async function createUser(e){
    e.preventDefault();
    const res = await fetch('/api/admin/users', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, email, role, password: password || undefined, pin: pin || undefined }) });
    if (res.ok){ setName(''); setEmail(''); setPassword(''); setPin(''); load(); }
    else alert('erro ao criar');
  }

  async function del(id){
    if (!confirm('Remover usuário?')) return;
    const res = await fetch('/api/admin/users', { method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id }) });
    if (res.ok) load(); else alert('erro');
  }

  return (
    <div style={{padding:20}}>
      <Head><title>Gerenciamento de Usuários</title></Head>
      <h1>Gerenciar Usuários</h1>
      <form onSubmit={createUser} style={{marginBottom:12}}>
        <div><label>Nome</label><br/><input value={name} onChange={e=>setName(e.target.value)} required/></div>
        <div><label>Email (opcional — para admin)</label><br/><input value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div><label>Senha (se email)</label><br/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <div><label>PIN (4 dígitos, para funcionário)</label><br/><input value={pin} onChange={e=>setPin(e.target.value)} /></div>
        <div><label>Role</label><br/>
          <select value={role} onChange={e=>setRole(e.target.value)}>
            <option value="employee">Funcionário</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button style={{marginTop:8}}>Criar</button>
      </form>

      <h3>Lista de usuários</h3>
      <table border={1} cellPadding={6} style={{borderCollapse:'collapse'}}>
        <thead><tr><th>ID</th><th>Nome</th><th>Email</th><th>Role</th><th>Ações</th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}><td>{u.id}</td><td>{u.name}</td><td>{u.email||'-'}</td><td>{u.role}</td><td><button onClick={()=>del(u.id)}>Remover</button></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
