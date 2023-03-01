import { compareSync } from "bcrypt"  // Importa a função compareSync do pacote bcrypt para comparar senhas
import { randomUUID } from 'crypto' // Importa a função randomUUID do pacote crypto para gerar um token de autenticação único
import User from "../DAO/User.js"  // Importa a classe User do arquivo User.js na pasta DAO

export default class UserController { // Define o método rotas na classe UserController
    static rotas(app) {
        app.post('/login', UserController.login) // Define a rota POST /login com o método login da classe UserController como manipulador
    }

    static async login(req, res) {// Define o método login da classe UserController
        const { email, password } = req.body // Obtém o email e a senha do corpo da requisição
        if (!email || !password) { // Verifica se o email e a senha foram fornecidos
            return res.status(400).send({ // Se não foram, retorna uma resposta de erro com código 400 e uma mensagem
                message: 'Os campos "email" e "password" são obrigatórios'
            })
        }

        const user = await User.findByProperty('email', email) // Busca o usuário com o email fornecido no banco de dados
        if (!user) { // Se não houver usuário com esse email, retorna uma resposta de erro com código 404 e uma mensagem
            return res.status(404).send({
                message: 'Usuário não encontrado'
            })
        }

        const passwordsMatch = compareSync(password, user.encryptedPassword) // Compara a senha fornecida com a senha criptografada armazenada no banco de dados
        if (!passwordsMatch) { // Se as senhas não coincidirem, retorna uma resposta de erro com código 401 e uma mensagem
            return res.status(401).send({
                message: 'Senha incorreta'
            })
        }

        user.authToken = randomUUID() // Gera um novo token de autenticação único para o usuário
        await user.save() // Salva o usuário no banco de dados com o novo token de autenticação

        res.status(200).send({ // Retorna uma resposta de sucesso com código 200 e o token de autenticação do usuário
            token: user.authToken
        })
    }
}
