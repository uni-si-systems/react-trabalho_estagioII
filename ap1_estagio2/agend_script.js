document.addEventListener("DOMContentLoaded", async () => {
    const agendItensDiv = document.getElementById('agendItens')
    const inputBuscar = document.getElementById('inputBuscar')

    // Função para fazer a busca de agendamentos filtrada pelo nome
    async function fetchAgendamentos(nome = '') {
        const response = await fetch(`http://localhost:3000/agendamento?nome=${encodeURIComponent(nome)}`)
        
        if (!response.ok) {
            console.error('Erro ao buscar agendamentos:', response.statusText)
            return
        }

        const data = await response.json()

        agendItensDiv.innerHTML = ''

        // Função para que a data apareça de maneira funcional na listagem
        function formatDate(dateString) {
            const date = new Date(dateString)
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            return `${year}-${month}-${day}`
        }

        // Cria divs referentes aos rows no banco de dados
        data.forEach(item => {
            const div = document.createElement('div')
            div.id = `agendamento-${item.id}`
            div.className = "agendamento"

            div.innerHTML = `
            <fieldset>
                <div class="row">
                    <div class="column">
                        <label>Nome:</label>
                    </div>
                    <input class="inputNome" type="text" value="${item.nome}" disabled>

                    <div class="column">
                        <label>Esporte:</label>
                    </div>
                    <select class="opções2" disabled>
                        <option value="Futebol" ${item.esporte === 'Futebol' ? 'selected' : ''}>Futebol</option>
                        <option value="Vôlei" ${item.esporte === 'Vôlei' ? 'selected' : ''}>Vôlei</option>
                    </select>

                    <div class="column">
                        <label>Data:</label>
                    </div>
                    <input class="opções2" type="date" value="${formatDate(item.data)}" disabled>

                    <div class="column">
                        <label>Horário:</label>
                    </div>
                    <select class="opções2" disabled>
                        <option value="08:00" ${item.horario === '08:00:00' ? 'selected' : ''}>08:00</option>
                        <option value="09:00" ${item.horario === '09:00:00' ? 'selected' : ''}>09:00</option>
                        <option value="16:00" ${item.horario === '16:00:00' ? 'selected' : ''}>16:00</option>
                        <option value="17:00" ${item.horario === '17:00:00' ? 'selected' : ''}>17:00</option>
                    </select>
                </div>
                <button class="btnEditar" onclick="editarAgendamentos(${item.id})">Editar</button>
                <button class="btnSalvar" onclick="salvarAgendamentos(${item.id})" style="display:none">Salvar</button>
                <button class="btnDeletar" onclick="deletarAgendamentos(${item.id})">Deletar</button>
            </fieldset>
            `
            agendItensDiv.appendChild(div)
        })
    }

    // Ao apertar enter, as buscas são feitas
    inputBuscar.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const nome = inputBuscar.value.trim()
            fetchAgendamentos(nome)
        }
    })

    // Função para habilitar o modo de edição
    window.editarAgendamentos = (id) => {
        const div = document.getElementById(`agendamento-${id}`)
        const inputs = div.querySelectorAll('input')
        const selects = div.querySelectorAll('select')
        const editButton = div.querySelector('.btnEditar')
        const saveButton = div.querySelector('.btnSalvar')

        inputs.forEach(input => input.disabled = false)
        selects.forEach(select => select.disabled = false)
        editButton.style.display = 'none'
        saveButton.style.display = 'inline'
    }

    // Salva as mudanças
    window.salvarAgendamentos = async (id) => {
        const div = document.getElementById(`agendamento-${id}`)
        const inputs = div.querySelectorAll('input')
        const selects = div.querySelectorAll('select')

        const updatedData = {
            nome: inputs[0].value,
            data: inputs[1].value,
            horario: selects[1].value,
            esporte: selects[0].value
        }

        // O objeto updatedData após receber os novos valores inseridos pelo usuário...
        // ...faz a atualização dos dados através do método PUT.
        const response = await fetch(`http://localhost:3000/agendamento/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })

        if (response.ok) {
            alert('Atualização de agendamento feita com sucesso.')
            // Após a conclusão do processo de edição, os inputs e os selects ficam desabilitados.
            inputs.forEach(input => input.disabled = true)
            selects.forEach(select => select.disabled = true)
            // O botão "Salvar" vira "Editar".
            div.querySelector('.btnEditar').style.display = 'inline'
            div.querySelector('.btnSalvar').style.display = 'none'
        } else {
            alert('Erro ao atualizar agendamento.')
        }
    }

    // Deleta um item da lista de agendamentos após o clique no botão de deletar.
    // Também deleta os dados referente a aquele item no banco de dados através do método DELETE.
    window.deletarAgendamentos = async (id) => {
        const response = await fetch(`http://localhost:3000/agendamento/${id}`, {
            method: 'DELETE',
        })

        if (response.ok) {
            const div = document.getElementById(`agendamento-${id}`)
            div.remove()
        } else {
            alert('Erro ao deletar item.')
        }
    }

    fetchAgendamentos()
})