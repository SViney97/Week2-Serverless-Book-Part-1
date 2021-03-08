// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.database().ref('/mybooks');

/*
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});
*/

const getBooksFromDatabase = (res) => {
    let books = [];
    return db.on(
        'value',
        snapshot => {
            snapshot.forEach(book => {
                books.push({
                    id: book.key,
                    title: book.val().title,
                    author: book.val().author
                });
            });
            res.status(200).json(books);
        },
        error => {
            res.status(error.code).json({
                message: `Error: ${error.message}`
            });
        }
    );

};

exports.addBook = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'POST') {
            return res.status(401).json({
                message: 'Not allowed'
            });
        }
        const title = req.query.title;
        const author = req.query.author;
        db.push({ title, author });
        getBooksFromDatabase(res);
    });
});

exports.deleteBook = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
      if(req.method !== 'DELETE') {
        return res.status(401).json({
          message: 'Not allowed dude...'
        })
      }
      const id = req.query.id;
      //admin.database().ref(`/mybooks/${id}`).remove();
      db.child(id).remove();
      getBooksFromDatabase(res);
    });
  });

exports.getBooks = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'GET') {
            return res.status(404).json({
                message: 'Not allowed'
            })
        }
        getBooksFromDatabase(res);
    });
});