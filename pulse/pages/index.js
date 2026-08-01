import Head from 'next/head'

export default function Home(){
  return (
    <>
      <Head>
        <title>Colégio Municipal Faustino Dias Lima — Ponto (Backend)</title>
      </Head>
      <main style={{padding:20}}>
        <h1>Backend pronto</h1>
        <p>O backend (API) foi criado em /pulse/pages/api. A UI está disponível em <code>/pulse/index.html</code> (estática).</p>
        <p>Use os endpoints <code>/api/punch</code> (POST) e <code>/api/punches</code> (GET).</p>
      </main>
    </>
  )
}
