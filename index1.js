import express from "express"
import bodyParser from "body-parser"
import pg from "pg"

const app = express()
const port = 3000

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "fais25",
  port: 5432,
})

db.connect()

let quiz = []
let totalCorrect = 0

db.query("SELECT * FROM capitals", (err, res) => {
  if (err) {
    console.log("Error executing query", err.stack)
  } else {
    quiz = res.rows
  }
})

// middleware
app.use(bodyParser.urlencoded({extend: true}))
app.use(express.static("public"))

let currentQuestion = {}

// get home page
app.get("/", async (req, res) => {
  totalCorrect = 0
  await nextQuestion()
  res.render("index.ejs", {
    question: currentQuestion
  })
})

// post a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim()
  let isCorrect = false
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++
    isCorrect = true
  }

  nextQuestion() 
    res.render("index.ejs", {
      question: currentQuestion,
      wasCorrect: isCorrect,
      totalScore: totalCorrect
    })
})

async function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)]
  currentQuestion = randomCountry
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})