
import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";

// Set the configuration for your app
// TODO: Replace with your project's config object
const firebaseConfig = {
    apiKey: "AIzaSyAYogMcVUqjPkbrltK02NGe_cGQlmO04AY",
    authDomain: "haselab-flow-chat.firebaseapp.com",
    // For databases not in the us-central1 location, databaseURL will be of the
    // form https://[databaseName].[region].firebasedatabase.app.
    // For example, https://your-database-123.europe-west1.firebasedatabase.app
    databaseURL: "https://haselab-flow-chat-default-rtdb.asia-southeast1.firebasedatabase.app",
    storageBucket: "haselab-flow-chat.appspot.com"
};

const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase(app);

alert("A");