const express = require('express')
const app = express()
const port = 3000
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database:'nodedb'
};

const mysql = require('mysql')

// console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxx")

var connection;
async function getConnection()
{
    if(connection)
    {
        return connection;
    }
    connection = await mysql.createConnection(config)
    return connection;
}

async function executarsql(sql)
{
    console.log(connection)
    try {
        await getConnection()
        await connection.query(sql)
    } catch (error) {
        console.error('Erro ao executar a query:', error);
    } finally {
        // await connection.end();
    }
}

async function executarQueries()
{
    await executarsql(`CREATE TABLE people (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL);`);
    await executarsql(`INSERT INTO people(name) values('Wesley')`);
    await executarsql(`INSERT INTO people(name) values('Patric')`);
    await executarsql(`INSERT INTO people(name) values('Marcio')`);
}
executarQueries();


app.get('/', async (req,res) => {
    const sql = 'SELECT * FROM people';

    // Executar a consulta
    await connection.query(sql, (err, results) => {
        if (err) {
            console.error('Erro na consulta:', err);
            res.status(500).send('Erro na consulta ao banco de dados');
        } else {

            const namesList = results.map((person) => person.name).join(', ');

            const htmlResponse = `
                <h1>Full Cycle Rocks!</h1>
                <p>Lista de nomes cadastrada no banco de dados: ${namesList}</p>
            `;
            res.send(htmlResponse);
        }
    });    
})

app.listen(port, ()=> {
    console.log('Rodando na porta ' + port)
})