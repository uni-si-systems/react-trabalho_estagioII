import { useEffect, useState } from "react"
import { formatDate } from "../utils/dateUtils"
import { esportes, horas } from "../utils/consts"

export default function AgendLista() {
    const [agendamentos, setAgendamentos] = useState(null)
    
    // Função para fazer a busca de agendamentos filtrada pelo nome
    async function fetchAgendamentos(nome = '') {
        const response = await fetch(`http://localhost:3000/agendamento?nome=${encodeURIComponent(nome)}`);
        if (!response.ok) {
            console.error('Erro ao buscar agendamentos:', response.statusText);
            return;
        }
        const agendamentosData = await response.json();
        setAgendamentos(agendamentosData);
    }

    // Ao apertar enter, as buscas são feitas
    function keyPressBuscar(event) {
        if (event.key === 'Enter') {
            const nome = inputBuscar.value.trim()
            fetchAgendamentos(nome)
        }
    }

    useEffect(() => {
        fetchAgendamentos()
        window.addEventListener('carregar-agendamentos', fetchAgendamentos)
    
        return () => {
            window.removeEventListener('carregar-agendamentos', fetchAgendamentos)
        }
    }, [])

    return (
        <>
            <fieldset>
                <legend className="campoBuscar"><input id="inputBuscar" onKeyUp={keyPressBuscar} placeholder="Buscar por nome..." /></legend>
                <div>
                    {
                        agendamentos?.map(item => <AgendItem 
                            key={item.id} 
                            item={item}
                            setAgendamentos={setAgendamentos}  // Passando a função setAgendamentos
                            />)
                    }
                </div>
            </fieldset>
        </>
    )
}

function AgendItem({item, setAgendamentos}) {
    const [nomeValue, setNomeValue] = useState(item.nome)
    const [esporteValue, setEsporteValue] = useState(item.esporte)
    const [dataValue, setDataValue] = useState(item.data)
    const [horaValue, setHoraValue] = useState(item.horario)
    const [editando, setEditando] = useState(false)

    // Função para habilitar o modo de edição
    function editarAgendamentos() {
        setEditando(true)
    }

    // Salva as mudanças
    async function salvarAgendamentos() {
        const updatedData = {
            nome: nomeValue,
            data: dataValue,
            horario: horaValue,
            esporte: esporteValue
        }

        // O objeto updatedData após receber os novos valores inseridos pelo usuário...
        // ...faz a atualização dos dados através do método PUT.
        const response = await fetch(`http://localhost:3000/agendamento/${item.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })

        if (response.ok) {
            alert('Atualização de agendamento feita com sucesso.')
            setEditando(false)
        } else {
            alert('Erro ao atualizar agendamento.')
        }
    }

    // Deleta um item da lista de agendamentos após o clique no botão de deletar.
    // Também deleta os dados referente a aquele item no banco de dados através do método DELETE.
    async function deletarAgendamentos() {
        const response = await fetch(`http://localhost:3000/agendamento/${item.id}`, {
            method: 'DELETE',
        });
    
        if(response.ok) {
            // Atualiza o estado removendo o item deletado e evita com que todos...
            // ...os outros agendamentos sejam apagados da página.
            setAgendamentos((prevAgendamentos) => 
                prevAgendamentos.filter(agendamento => agendamento.id !== item.id)
            );
        }
    }

    return (
        <div key={item.id}>
            <fieldset>
                <div className="row">
                    <div className="column">
                        <label>Nome:</label>
                    </div>
                    <input className="inputNome" type="text" value={nomeValue} onChange={(e) => setNomeValue(e.target.value)} disabled={!editando} />

                    <div className="column">
                        <label>Esporte:</label>
                    </div>
                    <select className="opções2" value={esporteValue} onChange={(e) => setEsporteValue(e.target.value)} disabled={!editando}>
                        {
                            Object.keys(esportes).map(esporteKey => <option key={esporteKey} value={esportes[esporteKey]}>{esportes[esporteKey]}</option>)
                        }
                    </select>

                    <div className="column">
                        <label>Data:</label>
                    </div>
                    <input className="opções2" type="date" value={formatDate(dataValue)} onChange={(e) => setDataValue(e.target.value)} disabled={!editando} />

                    <div className="column">
                        <label>Horário:</label>
                    </div>
                    <select className="opções2" value={horaValue} onChange={(e) => setHoraValue(e.target.value)}  disabled={!editando}>
                        {
                            Object.keys(horas).map(horaKey => <option key={horaKey} value={horas[horaKey]}>{horas[horaKey]}</option>)
                        }
                    </select>
                </div>
                {!editando && <button className="btnEditar" onClick={() => editarAgendamentos(item.id)}>Editar</button>}
                {editando && <button className="btnSalvar" onClick={() => salvarAgendamentos(item.id)}>Salvar</button>}
                <button className="btnDeletar" onClick={() => deletarAgendamentos(item.id)}>Deletar</button>
            </fieldset>
        </div>
    )
}
