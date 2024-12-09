import { useState } from 'react'
import './App.css'
import BtnAgendar from './components/BtnAgendar'
import { formatDate } from "./utils/dateUtils"
import { esportes, horas } from "./utils/consts"
import MensagemSucErro from './components/MensagemSucErro'

export default function App() {
    // useStates responsáveis por atualizar o estado dos componentes desta função.
    // Ex: "nome" é o estado atual do componente, setNome é a função que irá atualizar o estado desta varíavel
    const [nome, setNome] = useState('')
    const [esporte, setEsporte] = useState(esportes.FUTEBOL)
    const [data, setData] = useState(new Date())
    const [horario, setHorario] = useState(horas.HORA_8)
    const [mensagem, setMensagem] = useState('')
    const [mensagemTipo, setMensagemTipo] = useState('')
    const [contadorSucessos, setContadorSucessos] = useState(0)

    const handleMensagem = (tipo, texto) => {
        if (tipo === 'sucesso') {
            setContadorSucessos(prevCount => prevCount + 1)
        }
        setMensagemTipo(tipo)
        setMensagem(texto)
    }

    return (
        <>
            <div className="container1">
                <h1>Agendamento de Quadra Esportiva</h1>
                <form id="agendForm">
                    <fieldset>
                        <div className="row">
                            <div className="column">
                                <label htmlFor="nome">Nome:</label>
                                <input
                                // useState sendo utilizado aqui para mudar o valor de "nome"...
                                // assim que o usuário escrever algo no input.
                                    onChange={(e) => setNome(e.target.value)}
                                    className="opções" 
                                    type="text" 
                                    id="nome" 
                                    value={nome} 
                                    name="nome" 
                                    placeholder="Escreva seu nome..." 
                                    required 
                                />
                            </div>
                            <div className="column">
                                <label htmlFor="esporte">Esportes </label>
                                <select 
                                onChange={(e) => setEsporte(e.target.value)}
                                value={esporte}
                                className="opções" 
                                id="esporte" 
                                name="esporte" 
                                required>
                                    {
                                        Object.keys(esportes).map(esporteKey => <option key={esporteKey} value={esportes[esporteKey]}>{esportes[esporteKey]}</option>)
                                    }
                                </select>
                            </div>
                        </div>

                        <div className="row">
                            <div className="column">
                                <label htmlFor="data">Data:</label>
                                <input 
                                onChange={(e) => setData(e.target.value)}
                                value={formatDate(data)}
                                className="opções" 
                                type="date" 
                                id="data" 
                                name="data" 
                                required />
                            </div>
                            <div className="column">
                                <label htmlFor="horario">Horários Disponíveis:</label>
                                <select 
                                onChange={(e) => setHorario(e.target.value)}
                                value={horario}
                                className="opções" 
                                id="horario" 
                                name="horario" 
                                required>
                                    {
                                        Object.keys(horas).map(horaKey => <option key={horaKey} value={horas[horaKey]}>{horas[horaKey]}</option>)
                                    }
                                </select>
                            </div>
                        </div>
                        <BtnAgendar 
                        nome={nome} 
                        esporte={esporte} 
                        horario={horario} 
                        data={data}
                        onMensagem={handleMensagem}
                        />
                        <a href='Page2.html'><button className="botões" type="button">Ver Agendamentos {'>>>'}</button></a>
                    </fieldset>
                </form>
                <MensagemSucErro tipo={mensagemTipo} mensagem={mensagem} contadorSucessos={contadorSucessos} />
            </div>
        </>
    )
}
