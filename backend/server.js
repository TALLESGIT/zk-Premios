const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

const reservas = []; // Array to store reserved numbers and participant info

// Get all reserved numbers
app.get("/reservas", (req, res) => {
	res.json(reservas);
});

// Add a new reservation
app.post("/reservas", (req, res) => {
	const { numero, nome, telefone } = req.body;

	if (!numero || !nome || !telefone) {
		return res
			.status(400)
			.json({ error: "Número, nome e telefone são obrigatórios." });
	}

	// Check if number is already reserved
	const exists = reservas.find((r) => r.numero === numero);
	if (exists) {
		return res.status(409).json({ error: "Número já reservado." });
	}

	reservas.push({ numero, nome, telefone });
	res.status(201).json({ message: "Reserva criada com sucesso." });
});

app.listen(port, () => {
	console.log(`API backend rodando na porta ${port}`);
});
