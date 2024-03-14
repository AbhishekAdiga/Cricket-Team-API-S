const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

const app = express()
app.use(express.json())

const dbpath = path.join(__dirname, 'cricketTeam.db')

let db = null

//initializing the server and connecting to the database
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server is running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error : ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

//API-1 gettting all the players list
app.get('/players/', async (request, response) => {
  const playerQuery = `SELECT * FROM cricket_team ORDER BY player_id;`
  const playersArray = await db.all(playerQuery)
  response.send(playersArray)
})

//API-2 inserting new player in players list
app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {player_id, player_name, jersey_number, role} = playerDetails
  const newPlayerQuery = `INSERT INTO cricket_team(player_id,player_name,jersey_number,role) VALUES (${player_id},'${player_name}',${jersey_number},'${role}');`
  const dbresponse = await db.run(newPlayerQuery)
  response.send('Player Added to Team')
})

//API-3 getting a player in players list
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerIDQuery = `SELECT * FROM cricket_team WHERE player_id = ${playerId} ;`
  const player = await db.get(playerIDQuery)
  response.send(player)
})

//API-4 updating a player in players list
app.post('/players/:playerId/', async (request, response) => {
  const {params} = request.params
  const playerDetails = request.body
  const {player_id, player_name, jersey_number, role} = playerDetails
  const newPlayerQuery = `UPDATE cricket_team SET player_id = ${player_id},player_name = '${player_name}',jersey_number = ${jersey_number},role = '${role}' WHERE player_id = ${params};`
  const dbresponse = await db.run(newPlayerQuery)
  response.send('Player Details Updated')
})

//API-5 deleating a player in players list
app.post('/players/:playerId/', async (request, response) => {
  const {params} = request.params
  const newPlayerQuery = `UPDATE FROM cricket_team WHERE player_id = ${params};`
  const dbresponse = await db.run(newPlayerQuery)
  response.send('Player Removed')
})

module.exports = app
