const { response } = require('express');
const express = require('express')
const app = express()

//response as Json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//config do Firestore
var admin = require("firebase-admin");
var serviceAccount = require("./keys.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

//Endpoints

//see all posts
app.get('/posts', async (request, response) => {
    postsDoc = await db.collection("posts").orderBy('date','desc').startAt(0).endAt(0).limit(1).get()

    const posts = []
    postsDoc.forEach(doc => posts.push({ id: doc.id, ...doc.data() }));
    response.status(200).json(posts);
})

//search post
// url: http://localhost:3000/post?name=Theodore
app.get("/post", (req, res)=>{
    var name = req.query.name;
    console.log(name)
    db.collection("posts").where("text", "==", name)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            result = doc.data();
            res.json({
                result
              })
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
  })
//see a especific post
app.get('/Posts/:id', function (request, response) {
    id = request.params.id;
    id = id.substring(1);
    var docRef = db.collection("posts").doc(id);
    docRef.get().then((doc) => {
        if (doc.exists) {
            //console.log(doc._fieldsProto.likes.integerValue)//caminho para pegar o número de likes de um post
            response.status(200).json(doc.data());
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
})

//alter post
app.put('/posts/:id', async (request, response) => {
    id = request.params.id;
    id = id.substring(1);
    db.collection("posts").doc(id).set({
        likes: request.body.likes,
        text: request.body.text,
        date: request.body.date
    })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    return response.status(200).send('Altered post')
})

//Update Post
app.patch('/posts/:id', function (request, response) {
    id = request.params.id;
    id = id.substring(1);
    var postRef = db.collection("posts").doc(id);
    return postRef.update({
        text: request.body.text,
    })
        .then(() => {
            console.log("Document successfully updated!");
            response.status(201).json('altered');
        })
        .catch((error) => {
            console.error("Error updating document: ", error);
        });
});
app.patch('/posts/:id/like', function (request, response) {
    id = request.params.id;
    id = id.substring(1);
    //pega o conteúdo de um post(curtidas)
    var docRef = db.collection("posts").doc(id);
    
    docRef.get().then((doc) => {
        if (doc.exists) {
            return docRef.update({
                likes: parseInt(doc._fieldsProto.likes.integerValue) + 1
            })
                .then(() => {
                    console.log("Document successfully updated!");
                    response.status(201).json('liked');
                })
                .catch((error) => {
                    console.error("Error updating document: ", error);
                });
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
});

//create a post 
app.post('/posts', async (request, response) => {
    const { text, likes, date } = request.body

    const post = { text, likes, date }

    const result = await db.collection('posts').add(post);

    response.status(201).json({ id: result.id });
})

//delete post
app.delete('/Posts/:id', (request, response) => {
    id = request.params.id;
    id = id.substring(1);
    db.collection("posts").doc(id).delete().then(() => {
        console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
    response.status(204).send();
})

//Run server
app.listen(3000, () => {
    console.log('Running Server UwU')
})