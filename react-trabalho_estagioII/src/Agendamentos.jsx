import './App.css'
import AgendLista from './components/AgendLista'

export default function Agendamentos() {
  return (
    <>
        <div className="container2">
            <h1>Horários Agendados</h1>
            <a href="pag_principal.html"><button className="botões">{'<<<'} Voltar</button></a>
            <AgendLista/>
        </div>
    </>
  )
}
