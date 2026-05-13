const express = require('express')
const cors = require('cors')
const fs = require('fs');
const { error } = require('console');

const app = express()
const PORT = 3000;

app.use(cors())
app.use(express.json())

app.post('/api/contact', (req, res) => {
    const {imie, nazwisko, email, wiadomosc} = req.body
    const dataText = `Imie: ${imie} | Nazwisko: ${nazwisko} | E-mail: ${email} | Wiadomosc: ${wiadomosc} \n`

    fs.appendFile('widomoscZeStony.txt', dataText, (error) => {
        if (error) {
            console.error('Błąd:', error)
            return res.status(500).json({message: "błąd"})
        }
        console.log('Nowa wiadomosc zapisana!')
        res.status(200).json({message: 'Nowa wiadomosc zapisana!'})
    })
})

app.listen(PORT, () => {
    console.log(`Serwer jest pod adresą: http://localhost:${PORT}`)
})
