let express = require('express');
let app = express();
let MongoClient = require('mongodb').MongoClient;
let mongoUrl = 'mongodb+srv://versusvirus:@PASSWORD@cluster0-philk.mongodb.net/test?retryWrites=true';
let globalCollection;

app.use(express.static('public'));

/**
 * Get method for business logic
 */
app.get('/bl.js', (req, res) => {
    let
        command = req.query.command,
        params = req.query.params && JSON.parse(req.query.params);

    switch (command) {
        case 'create':
            create(params)
                .then(() => {
                    res.sendStatus(200);
                })
                .catch(() => {
                    res.sendStatus(500);
                });
            break;
        case 'read':
            read(params)
                .then((item) => {
                    res.send(JSON.stringify(item));
                })
                .catch(() => {
                    res.sendStatus(500);
                });
            break;
        case 'update':
            update(params)
                .then(() => {
                    res.sendStatus(200);
                })
                .catch(() => {
                    res.sendStatus(500);
                });
            break;
        case 'delete':
            destroy(params)
                .then(() => {
                    res.sendStatus(200);
                })
                .catch(() => {
                    res.sendStatus(500);
                });
            break;
        case 'list':
            list()
                .then((list) => {
                    res.send(JSON.stringify(list));
                })
                .catch(() => {
                    res.sendStatus(500);
                });
            break;
    }
});


app.listen(3000, () => {
    MongoClient.connect(mongoUrl, {useNewUrlParser: true}, (err, client) => {
        globalCollection = client.db('test').collection('testcollection');
    });
    console.log('App is listening on 3000');
});

/**
 * Function create new document in database
 * @param title
 * @param text
 * @param id
 * @returns {Promise<>}
 */
create = ({title: title, text: text, id: id}) => {
    return new Promise((resolve, reject) => {
        globalCollection.insertOne({id: id, title: title, text: text}, (err) => {
            if (err) {
                reject("Item wasn't created");
            } else {
                resolve();
            }
        });
    });
};

/**
 * Function for update document in database
 * @param id - id of document
 * @param title - new title
 * @param text - new text
 * @returns {Promise<>}
 */
update = ({id: id, title: title, text: text}) => {
    return new Promise((resolve, reject) => {
        globalCollection.update({id: id}, {title: title, text: text}, (err) => {
            if (err) {
                reject("Item wasn't updated");
            } else {
                resolve();
            }
        });
    });
};

/**
 * Function return all documents from database
 * @returns {Promise<>}
 */
list = () => {
    return new Promise((resolve, reject) => {
        globalCollection.find({}).toArray((err, list) => {
            if (err) {
                reject("List wasn't read");
            } else {
                resolve(list);
            }
        });
    });
};

/**
 * Function delete element from database
 * @param id - id of document
 * @returns {Promise<>}
 */
destroy = ({id: id}) => {
    return new Promise((resolve, reject) => {
        globalCollection.deleteOne({id: id}, (err) => {
            if (err) {
                reject("Item wasn't deleted");
            } else {
                resolve();
            }
        });
    });
};

/**
 * Function read document from database
 * @param id - id of document
 * @returns {Promise<>}
 */
read = ({id: id}) => {
    return new Promise((resolve, reject) => {
        globalCollection.findOne({id: id}, (err, item) => {
            if (err) {
                reject("Item wasn't read");
            } else {
                resolve(item);
            }
        });
    });
};
