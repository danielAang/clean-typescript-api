import express from 'express'

const port = 5050

const app = express()
app.listen(port, () => console.log(`Server running at port http://localhost:${port}`))
