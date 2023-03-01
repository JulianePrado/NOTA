import { verificarToken } from "../middleware/authorization.js" // Importa o middleware verificarToken
import Product from "../DAO/Product.js" // Importa o DAO (Data Access Object) do produto

export default class ProductController { // Define a classe ProductController
    static rotas(app) {// Define o método estático rotas que recebe o objeto app como parâmetro
        app.post('/produtos', verificarToken, ProductController.inserir) // Define a rota POST /produtos, usando o middleware verificarToken e o método estático inserir como callback
        app.get('/produtos', ProductController.listarTodos)// Define a rota GET /produtos, usando o método estático listarTodos como callback
        app.patch('/produtos/:id', verificarToken, ProductController.atualizar) // Define a rota PATCH /produtos/:id, usando o middleware verificarToken e o método estático atualizar como callback
        app.delete('/produtos/:id', verificarToken, ProductController.deletar) // Define a rota DELETE /produtos/:id, usando o middleware verificarToken e o método estático deletar como callback
    }

    static async inserir(req, res) { // Define o método estático inserir, que recebe o objeto req como parâmetro (representando a requisição) e o objeto res como parâmetro (representando a resposta)
        const { title, description } = req.body // Obtém os dados do novo produto a partir do corpo da requisição

        if (!title || !description) { // Verifica se os campos "title" e "description" foram informados
            return res.status(400).send({ // Se algum deles estiver faltando, retorna um erro 400 com uma mensagem explicando o erro
                message: 'Os campos "title" e "description" são obrigatórios'
            })
        }

        const product = new Product() // Cria uma nova instância da classe Product
        product.title = title // Define o título do novo produto
        product.description = description // Define a descrição do novo produto

        await product.save() // Salva o novo produto no banco de dados

        res.status(200).send({ // Retorna uma resposta com código 200 (OK) e um objeto contendo a mensagem "Produto criado com sucesso!" e os dados do novo produto
            message: 'Produto criado com sucesso!',
            data: product
        })
    }

    static async listarTodos(req, res) { // Define o método estático listarTodos, que recebe o objeto req como parâmetro (representando a requisição) e o objeto res como parâmetro (representando a resposta)
        const products = await Product.findAll() // Obtém todos os produtos do banco de dados
        res.status(200).send({ // Retorna uma resposta com código 200 (OK) e um objeto contendo a mensagem "Produtos listados com sucesso!" e um array contendo os dados de todos os produtos
            message: 'Produtos listados com sucesso!',
            data: products
        })
    }

    static async atualizar(req, res) {  // Define o método estático atualizar, que recebe o objeto req como parâmetro (representando a requisição) e o objeto res como parâmetro (representando a resposta)
        const {id} = req.params // Obtém o ID do produto a ser atualizado a partir dos parâmetros da requisição
        
        const product = await Product.findByProperty('id', id)
        // verifica se o produto foi encontrado
        if (!product) {
            return res.status(404).send({
                message: `O produto de id ${id} não existe`
            })
        }

        const {title, description} = req.body // extrai os campos "title" e "description" do corpo da requisição

         // verifica se o campo "title" foi fornecido na requisição e atualiza a propriedade correspondente do objeto "product"
        if (title) {
            product.title = title
        }
        // verifica se o campo "description" foi fornecido na requisição e atualiza a propriedade correspondente do objeto "product"
        if (description) {
            product.description = description
        }

         // salva as alterações do objeto "product" no banco de dados
        await product.save()

         // retorna uma resposta com código de status 200 (sucesso), uma mensagem informando que o produto foi alterado e os dados do produto atualizados
        res.status(200).send({
            message: 'Produto alterado com sucesso!',
            data: product
        })
    }

    static async deletar(req, res) {
        const {id} = req.params

        const product = await Product.findByProperty('id', id)
        if (!product) {
            return res.status(404).send({
                message: `O produto de id ${id} não existe`
            })
        }

        await product.delete()

        res.status(200).send({
            message: 'Produto deletado com sucesso!'
        })
    }
} // sjdjhduhwoid