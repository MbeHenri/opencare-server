
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
const Utilisateur  = require('../models/Utilisateur')

const router = express.Router()

router.post('/login', async (req, res) => {
	const { username, passord } = req.body
	const utilisateur = await Utilisateur.findOne({ username })
	if(!utilisateur) return res.status(400).send('Utilisateur not found')
	const isMatch = await bcrypt.compare(passord, utilisateur.passord)
	if(!isMatch) return res.status(400).send('Invalid credentials')
	const token = jwt.sign({ id: utilisateur._id }, 'secret', { expiresIn: '1h' })
	res.json({ token })
})

module.exports = router