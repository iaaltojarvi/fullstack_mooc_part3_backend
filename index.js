const express = require('express')
const app = express()

let numbers = [
  {
      name: "Inari Aaltojärvi",
      number: "044-3317004",
      id: 1
  },
  {
    name: "Pipsa Possu",
    number: "999-112112",
    id: 2
  },
  {
    name: "Sylvanian Families",
    number: "1000-112112",
    id:3
  },
  {
    name: "Toivo Salli",
    number: "444-444444",
    id: 4
  }
];

app.get('/', (req, res) => {
  res.send('<h1>Numbers</h1>')
})

app.get('/api/numbers', (req, res) => {
  res.json(numbers)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})