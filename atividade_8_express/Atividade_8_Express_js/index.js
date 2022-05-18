const express = require('express');
const app = express()
const port = 3000

var Post = /** @class */ (function () {
    function Post(id, text, likes) {
        this.id = id;
        this.text = text;
        this.likes = likes;
    }
    Post.prototype.curtir = function () {
        this.likes++;
    };
    //---------------------alterar texto
    Post.prototype.alterar = function (new_text) {
        this.text = new_text;
    };
    Post.prototype.alterarlike = function (new_like) {
        this.likes = new_like;
    };
    Post.prototype.toString = function () {
        return (this.text + " - " + this.likes);
    };
    return Post;
}());

var Microblog = /** @class */ (function () {
    function Microblog() {
        this.postagens = [];
    }
    //----------------------------------criar
    Microblog.prototype.create = function (post) {
        this.postagens.push(post);
    };

    Microblog.prototype.consultarIndice = function (numero) {
        var indice = -1;
        for (var i = 0; i < this.postagens.length; i++) {
            if (this.postagens[i].id == numero) {
                indice = i;
                break;
            }
        }
        return indice;
    };

    //----------------------------------mostrar
    Microblog.prototype.retrieve = function (numero) {
        exist = this.consultarIndice(numero);
        if (exist == -1) {
            return "post não encontrado : /"
        }

        return (this.postagens[numero]);
    };
    //-----------------------------------excluir
    Microblog.prototype.delete = function (numero) {
        var indice = this.consultarIndice(numero);
        if (indice != -1) {
            for (var i = indice; i < this.postagens.length; i++) {
                this.postagens[i] = this.postagens[i + 1];
            }
            this.postagens.pop();
        }
    };
    //-----------------------------------editar
    Microblog.prototype.update = function (post) {
        post.id = parseInt(post.id);
        var encontrou = this.consultarIndice(post.id);
        if (encontrou != -1) {
            this.postagens[encontrou].alterar(post.text);
        }
        else {
            console.log("post não encontrado : /");
        }
    };

    Microblog.prototype.updatelike = function (post) {
        post.id = parseInt(post.id);
        var encontrou = this.consultarIndice(post.id);
        if (encontrou != -1) {
            this.postagens[encontrou].alterarlike(post.likes);/////////////////////////////////////////////////////////////////
        }
        else {
            console.log("post não encontrado : /");
        }
    };

    //-------------------------------------retorna tudo
    Microblog.prototype.retrieveAll = function (post) {
        return this.postagens;
    };

    Microblog.prototype.hot_post = function () {
        var most_liked = 0;
        var post_liked = null;
        for (var i = 0; i < this.postagens.length; i++) {
            if (this.postagens[i].likes > most_liked) {
                most_liked = this.postagens[i].likes;
                post_liked = this.postagens[i];
            }
        }
        return post_liked;
    };
    Microblog.prototype.curtir_post = function (post) {
        var encontrou = this.consultarIndice(post.id);
        if (encontrou != -1) {
            this.postagens[encontrou].curtir();
        }
        else {
            console.log("post não encontrado");
        }
    };

    Microblog.prototype.toString = function () {
        for (var i = 0; i < this.postagens.length; i++) {
            console.log(this.postagens[i].toString());
        }
    };
    return Microblog;
}());

//main
var microblog = new Microblog();
microblog.create(new Post(0, "hello world.", 1));
microblog.create(new Post(1, "Cubo Esférico.", 33));
microblog.create(new Post(2, "Poesia sem Letra.", 45));
microblog.create(new Post(3, "Compilador de Portugol.", 0));
microblog.create(new Post(4, "A Estrada de Lugar Nenhum.", 0));

//response as Json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/posts', (request, response) => {
    response.send(microblog.retrieveAll())
})

app.get('/Posts/:id', function (request, response) {

    id = request.params.id;
    response.json(microblog.retrieve(id));
})

app.delete('/Posts/:id', (request, response) => {
    id = request.params.id;
    microblog.delete(id);
    response.status(204).send();
})
//=================================================
app.post('/Posts/Create', function (req, res) {
    console.log(req.body);
    microblog.create(new Post(parseInt(req.body.id), req.body.text, 0));
    res.status(201).send('created post');
});

app.put('/posts/:id', function (request, response) {
    id = parseInt(request.params.id);
    microblog.update(request.body)
    console.log(id)
    return response.status(200).send('Altered post')
});

app.patch('/posts/:id', function (req, res) {
    id = parseInt(req.params.id);
    if (microblog.consultarIndice(id) != -1) {
        microblog.update(req.body);
        microblog.updatelike(req.body);
        res.status(200).send('Altered');
    }else{
        res.status(404).send('There is nothing here ;-; try another way.')
    }
    

})

app.patch('/posts/:id/like', function (req, res) {
    id = parseInt(req.params.id);
    if (microblog.consultarIndice(id) != -1) {
        microblog.curtir_post(new Post(id));
        res.status(200).send('Liked');
    }
    res.status(404).send('There is nothing here ;-; try another way.')

})

app.use(function (req, res, next) {
    res.status(404).send('There is nothing here ;-; try another way.')
});

app.listen(port, () => {
    console.log(`listen on ${port}`)
})