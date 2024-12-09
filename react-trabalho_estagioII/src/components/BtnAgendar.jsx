export default function BtnAgendar({nome, esporte, horario, data, onMensagem}) {
    async function agendar(event) {
        event.preventDefault()
        event.stopPropagation()

        // Variáveis com a função de ajudar na busca por registros parecidos...
        // ...sem elas, o código iria permitir com que o usuário marcasse horários...
        // ... iguais a outros já existentes no banco.
        const formattedData = new Date(data).toISOString().split('T')[0]
        const formattedHorario = horario.toString().trim()
        
        const response = await fetch('http://localhost:3000/agendamento', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, data: formattedData, horario: formattedHorario, esporte})
        })

        console.log('Resposta do servidor:', response)
        
        if (response.ok) {
            console.log('Agendamento bem-sucedido')
            onMensagem('sucesso', 'Agendamento feito com sucesso.')
        } else {
            const errorData = await response.json()
            onMensagem('erro', errorData.message || 'Erro ao realizar agendamento.')
        }
    }

    return (
        <>
            <button className="botões" onClick={agendar}>Agendar</button>
        </>
    )
}
