import '../styles.css'
import { useEffect } from 'react'

export default function MyApp({ Component, pageProps }){
  useEffect(()=>{
    // ensure focus styles or global JS if needed
  },[])
  return <Component {...pageProps} />
}
