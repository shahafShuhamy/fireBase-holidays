const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

const admin = require('firebase-admin');
admin.initializeApp();
const app = express();

const COLLECTION_NAME = "events";

app.use(cors({origin: true}));
/**
 * method gets all events by date ascending
 */
app.get('/', async (req, res) => {
    const snapshot = await admin.firestore().collection(COLLECTION_NAME).orderBy("date", "asc").get();
    let holidays = [];
    snapshot.forEach(doc => {
        let id = doc.id;
        let data = doc.data();

        holidays.push({id, ...data});
    });
    res.status(200).send(JSON.stringify(holidays));
});


/**
 * method returning an event according to it's ID.
 */
app.get("/:id", async (req, res) => {
    const snapshot = await admin.firestore().collection(COLLECTION_NAME).doc(req.params.id).get();
    const eventId = snapshot.id;
    const eventData  = snapshot.data();

    res.status(200).send(JSON.stringify({id: eventId, ...eventData}));
});


/**
 * method addes an event with current date to dataBase
 */
app.post('/', async (req, res) => {
    let holiday = req.body;
    holiday.date = new Date();
    await admin.firestore().collection(COLLECTION_NAME).add(holiday);
    res.status(201).send();
});


/**
 * method adds an event to database
 */
app.post('/withDate', async (req, res) => {
    let holiday = req.body;
    await admin.firestore().collection(COLLECTION_NAME).add(holiday);
    res.status(201).send();
});

/**
 * method deleting an document
 */
app.delete("/:id", async (req, res) => {
    await admin.firestore().collection(COLLECTION_NAME).doc(req.params.id).delete();
    res.status(200).send(`item with the id ${req.params.id} was deleted`);
});

exports.events = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
