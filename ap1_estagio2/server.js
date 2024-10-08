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
    const { nome, data, horario, esporte, esporte_id } = req.body
    const query = 'INSERT INTO agendamentos (nome, data, horario, esporte, esporte_id) VALUES (?, ?, ?, ?, ?)'
    db.query(query, [nome, data, horario, esporte, esporte_id], (err, result) => {
        if (err) {
            console.error('Erro ao inserir agendamento:', err)
            res.status(500).json({ message: 'Erro ao realizar agendamento' })
            return
        }
        res.json({ message: 'Agendamento realizado com sucesso!' })
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

    const query = 'UPDATE agendamentos SET nome = ?, data = ?, horario = ?, esporte = ? WHERE id = ?'
    db.query(query, [nome, data, horario, esporte, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar agendamento:', err)
            res.status(500).json({ message: 'Erro ao atualizar agendamento' })
            return
        }
        res.json({ message: 'Agendamento atualizado com sucesso!' })
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