const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'web_banco'
})

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err)
        return
    }
    console.log('Conectado ao banco de dados MySQL')
})

// Método POST para inserir valores no banco de dados
app.post('/agendamento', (req, res) => {
    const { nome, data, horario, esporte } = req.body

    // Checar registros parecidos:
    const checarRegParecidos = 'SELECT * FROM agendamentos WHERE data = ? AND horario = ?'
    db.query(checarRegParecidos, [data, horario], (err, results) => {
        if (err) {
            console.error('Erro ao consultar o banco de dados:', err)
            return res.status(500).json({ message: 'Erro ao consultar o banco de dados' })
        }

        // Estrutura condicional que checa os registros parecidos
        if (results.length > 0) {
            return res.status(401).json({ message: 'DATA e HORÁRIO já foram registrados anteriormente.' });
        } else {
            const query = 'INSERT INTO agendamentos (nome, data, horario, esporte) VALUES (?, ?, ?, ?)'
            db.query(query, [nome, data, horario, esporte], (err, result) => {
                if (err) {
                    console.error('Erro ao inserir agendamento:', err)
                    return res.status(500).json({ message: 'Erro ao inserir agendamento' })
                }
                res.json({ message: 'Agendamento realizado com sucesso!' })
            })
        }
    })
})

// Método GET para fazer as buscas filtradas
app.get('/agendamento', (req, res) => {
    const nome = req.query.nome ? `%${req.query.nome}%` : '%'
    const query = 'SELECT * FROM agendamentos WHERE nome LIKE ?'

    db.query(query, [nome], (err, results) => {
        if (err) {
            console.error('Erro ao buscar agendamentos:', err)
            res.status(500).json({ message: 'Erro ao buscar agendamentos' })
            return
        }
        res.json(results)
    })
})

// Método PUT para fazer as atualizações de dados com base no id
app.put('/agendamento/:id', (req, res) => {
    const { nome, data, horario, esporte } = req.body
    const { id } = req.params

    // Checar registros parecidos, mas excluir o próprio agendamento da busca (id != ?)
    const checarRegParecidos = 'SELECT * FROM agendamentos WHERE data = ? AND horario = ? AND id != ?'
    db.query(checarRegParecidos, [data, horario, id], (err, results) => {
        if (err) {
            console.error('Erro ao consultar o banco de dados:', err);
            return res.status(500).json({ message: 'Erro ao consultar o banco de dados' })
        }

        // Se houver outro agendamento com a mesma data e horário, mas com id diferente, retorna erro
        if (results.length > 0) {
            return res.status(401).json({ message: 'DATA e HORÁRIO já foram registrados anteriormente' })
        } else {
            // Caso contrário, faz a atualização do agendamento
            const query = 'UPDATE agendamentos SET nome = ?, data = ?, horario = ?, esporte = ? WHERE id = ?'
            db.query(query, [nome, data, horario, esporte, id], (err, result) => {
                if (err) {
                    console.error('Erro ao atualizar agendamento:', err)
                    return res.status(500).json({ message: 'Erro ao atualizar agendamento' })
                }
                res.json({ message: 'Agendamento atualizado com sucesso!' })
            })
        }
    })
})

// Método DELETE para deletar os dados com base no id
app.delete('/agendamento/:id', (req, res) => {
    const { id } = req.params

    const query = 'DELETE FROM agendamentos WHERE id = ?'
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Erro ao deletar agendamento:', err)
            res.status(500).json({ message: 'Erro ao deletar agendamento' })
            return
        }
        res.json({ message: 'Agendamento deletado com sucesso!' })
    })
})

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})