//PART 1
const express = require("express");
const mysql = require("mysql2/promise"); // Using mysql2 with Promises

const app = express();
const port = 3000;

// Database Configuration
const dbConfig = {
    host: "localhost", 
    port: 3306, //docker ps shows port 3306 for mariadb
    user: "root",
    password: "123456",
    database: "in-class-db"
};

app.use(express.json());

//PART 3
// When we send to create a new resource, we use POST
/*
{
    message: "lorem ipsum",
    name: "John Doe",
    email: "john@mail.com"
}
*/
app.post("/api/message", async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const conn = await mysql.createConnection(dbConfig);
        const query = "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)";
        await conn.execute(query, [name, email, message]);
        await conn.end();
    } catch (error) {
        res.status(500).json({ error: "Something happens in the server" });
    }
});

app.get("/api/messages", async (req, res) => {
    try {
        const conn = await mysql.createConnection(dbConfig);
        const [rows] = await conn.execute("SELECT * FROM users"); 
        await conn.end();
        res.status(200).json(rows); //array of message objects
    } catch (error) {
        res.status(500).json({ error: "Fail" }); 
    }
});


//PART 2
// Initialize the database
async function initDatabase() {
    try {
        const conn = await mysql.createConnection(dbConfig);

        // Check if the table exists
        const [tables] = await conn.query("SHOW TABLES LIKE 'messages'");

        if (tables.length === 0) {
            const createTableQuery = `
                CREATE TABLE messages (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(200) NOT NULL,
                    email VARCHAR(200) NOT NULL,
                    message TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `;

            await conn.query(createTableQuery);
            console.log("Table 'messages' created successfully.");
        } else {
            console.log("Table 'messages' already exists.");
        }

        await conn.end(); // Close connection after execution
    } catch (error) {
        console.error("Database ERROR:", error);
        process.exit(1);
    }
}

// Call the function to initialize the database
initDatabase().then(() => {
    app.listen(port, () => {
        console.log(`The server is running, PORT: ${port}`);
    });
});
