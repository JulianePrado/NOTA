import { verificarToken } from "../middleware/authorization.js"
import Home from "../DAO/Home.js"

// home irá ser home 
// home controller vira homecontroller 


// O método estático "rotas" adiciona duas rotas ao objeto "app"
export default class HomeController {
    static rotas(app) {
        app.get('/paginas/:id', HomeController.listar)
        app.patch('/paginas/:id', verificarToken, HomeController.atualizar)
    } // A primeira rota é um endpoint HTTP GET que escuta em "/paginas/:id"

    // A segunda rota é um endpoint HTTP PATCH que escuta em "/paginas/:id"

    // e requer um token válido para acessar


    // O método estático "listar" é chamado quando a rota GET "/paginas/:id" é acessada
    static async listar(req, res) {
        // Extrai o parâmetro ":id" da requisição usando a desestruturação de objetos
        const {id} = req.params
        // Usa o método "findByProperty" do modelo "Page" para buscar uma página com o mesmo valor de id
        const home = await Home.findByProperty('id', id)

     // Se não houver uma página com esse id, retorna uma mensagem de erro (status 404)
        if (!home) { 
            return res.status(404).send({
                message: 'Página não encontrada' 
            }) // Se a página for encontrada, retorna uma mensagem de sucesso (status 200) e a página encontrada.
        }
      
        res.status(200).send({
            message: 'Sucesso ao buscar página',
            data: page
        })
    }

    static async atualizar(req, res) {
        const {id} = req.params
        const {title, text} = req.body
        const home = await Home.findByProperty('id', id)
        if (!home) {
            return res.status(404).send({
                message: 'Página não encontrada'
            })
        }
        if (title) {
            home.title = title
        }
        if (text) {
            home.text = text
        }
        await home.save()
        res.status(200).send({
            message: 'Sucesso ao alterar dados da página',
            data: home
        })
    }
}
