const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

const db = new sqlite3.Database('./jewelia.db');
db.serialize(() => {
    
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT, 
        email TEXT UNIQUE, 
        password TEXT
    )`);

    
    db.run(`CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT, 
        date TEXT, 
        jewellery TEXT
    )`);
    
    console.log("Database tables checked and ready.");
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/admin-users', (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) return res.send("Error reading database.");
        
        let html = `
        <html>
        <head>
            <style>
                body { 
                    background-color: #fcf9f5; 
                    font-family: 'Georgia', serif; 
                    color: #4a0e0e; 
                    padding: 40px; 
                }
                .container { 
                    max-width: 900px; 
                    margin: auto; 
                    background: white; 
                    padding: 30px; 
                    border-radius: 10px; 
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    border: 1px solid #d4a373;
                }
                h1 { 
                    text-align: center; 
                    color: #7b0f2b; 
                    border-bottom: 2px solid #7b0f2b;
                    padding-bottom: 10px;
                    letter-spacing: 2px;
                }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin-top: 20px; 
                }
                th { 
                    background-color: #7b0f2b; 
                    color: white; 
                    padding: 12px; 
                    text-transform: uppercase;
                    font-size: 14px;
                }
                td { 
                    padding: 12px; 
                    border-bottom: 1px solid #eee; 
                    text-align: center; 
                }
                tr:hover { background-color: #fff5f5; }
                .back-btn { 
                    display: inline-block; 
                    margin-top: 20px; 
                    text-decoration: none; 
                    color: #7b0f2b; 
                    font-weight: bold; 
                    border: 1px solid #7b0f2b;
                    padding: 8px 15px;
                    border-radius: 5px;
                }
                .back-btn:hover { background: #7b0f2b; color: white; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Jewelia: Registered Users</h1>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Email Address</th>
                            <th>Secret Password</th>
                        </tr>
                    </thead>
                    <tbody>`;
        
        rows.forEach(row => {
            html += `
                <tr>
                    <td>${row.id}</td>
                    <td><b>${row.name}</b></td>
                    <td>${row.email}</td>
                    <td><code>${row.password}</code></td>
                </tr>`;
        });

        html += `
                    </tbody>
                </table>
                <a href="/index.html" class="back-btn">← Return to Home</a>
            </div>
        </body>
        </html>`;

        res.send(html);
    });
});
app.get('/admin-view', (req, res) => {
    db.all("SELECT * FROM appointments", [], (err, rows) => {
        if (err) return res.send("Error reading database.");
        
        let html = `
        <html>
        <head>
            <style>
                body { 
                    background-color: #fcf9f5; 
                    font-family: 'Georgia', serif; 
                    color: #4a0e0e; 
                    padding: 40px; 
                }
                .container { 
                    max-width: 900px; 
                    margin: auto; 
                    background: white; 
                    padding: 30px; 
                    border-radius: 10px; 
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    border: 1px solid #d4a373;
                }
                h1 { 
                    text-align: center; 
                    color: #7b0f2b; 
                    border-bottom: 2px solid #7b0f2b;
                    padding-bottom: 10px;
                    letter-spacing: 2px;
                }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin-top: 20px; 
                }
                th { 
                    background-color: #7b0f2b; 
                    color: white; 
                    padding: 12px; 
                    text-transform: uppercase;
                    font-size: 14px;
                }
                td { 
                    padding: 12px; 
                    border-bottom: 1px solid #eee; 
                    text-align: center; 
                }
                tr:hover { background-color: #fff5f5; }
                .back-btn { 
                    display: inline-block; 
                    margin-top: 20px; 
                    text-decoration: none; 
                    color: #7b0f2b; 
                    font-weight: bold; 
                    border: 1px solid #7b0f2b;
                    padding: 8px 15px;
                    border-radius: 5px;
                }
                .back-btn:hover { background: #7b0f2b; color: white; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Jewelia: Appointment Records</h1>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Customer Name</th>
                            <th>Date</th>
                            <th>Jewellery Type</th>
                        </tr>
                    </thead>
                    <tbody>`;
        
        rows.forEach(row => {
            html += `
                <tr>
                    <td>${row.id}</td>
                    <td><b>${row.name}</b></td>
                    <td>${row.date}</td>
                    <td>${row.jewellery}</td>
                </tr>`;
        });

        html += `
                    </tbody>
                </table>
                <a href="/index.html" class="back-btn">← Return to Home</a>
            </div>
        </body>
        </html>`;

        res.send(html);
    });
});
app.get('/profile', (req, res) => {
    const userEmail = req.query.email; // Get the email from the URL
    
    db.get("SELECT * FROM users WHERE email = ?", [userEmail], (err, row) => {
        if (err || !row) {
            return res.send("<h1>User not found</h1><a href='/'>Go to Login</a>");
        }

        res.send(`
        <html>
        <head>
            <style>
                body { background-color: #fcf9f5; font-family: 'Georgia', serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                .profile-card { background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid #d4a373; text-align: center; width: 350px; }
                .avatar { width: 100px; height: 100px; background: #7b0f2b; color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 40px; margin: 0 auto 20px; }
                h1 { color: #7b0f2b; margin-bottom: 5px; }
                p { color: #666; margin-bottom: 25px; }
                .btn { display: block; text-decoration: none; padding: 12px; margin: 10px 0; border-radius: 5px; font-weight: bold; transition: 0.3s; }
                .home-btn { background: #7b0f2b; color: white; }
                .logout-btn { border: 1px solid #7b0f2b; color: #7b0f2b; }
                .logout-btn:hover { background: #fee2e2; }
            </style>
        </head>
        <body>
            <div class="profile-card">
                <div class="avatar">${row.name.charAt(0).toUpperCase()}</div>
                <h1>Welcome, ${row.name}!</h1>
                <p>${row.email}</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <a href="/index.html" class="btn home-btn">Continue Shopping</a>
                <a href="/" class="btn logout-btn">Logout</a>
            </div>
        </body>
        </html>
        `);
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
    
    
    db.get(query, [email, password], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.send("Error during login.");
        }

        if (row) {
            
            res.redirect(`/profile.html?name=${encodeURIComponent(row.name)}&email=${encodeURIComponent(row.email)}`);
        } else {
            res.send("<h1>Invalid credentials</h1><a href='/'>Try again</a>");
        }
    });
});
app.post('/appointment', (req, res) => {
    const { name, date, jewellery } = req.body;
    const query = `INSERT INTO appointments (name, date, jewellery) VALUES (?, ?, ?)`;
    
    db.run(query, [name, date, jewellery], function(err) {
        if (err) {
            console.error(err.message);
            return res.send("Error saving appointment.");
        }
        
        res.send(`
            <div style="font-family: 'Georgia', serif; text-align: center; padding: 50px;">
                <h1 style="color: #7b0f2b;">Appointment Booked!</h1>
                <p>Thank you, ${name}. We look forward to seeing you.</p>
                <a href="/index.html" style="color: #7b0f2b;">Return to Jewelia</a>
            </div>
        `);
    });
});
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
    
    
    db.run(query, [name, email, password], function(err) {
        if (err) {
            console.error(err.message);
            return res.send("<h1>Email already exists!</h1><a href='/signup.html'>Try again</a>");
        }
        
        
        res.redirect(`/profile.html?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`);
    });
});

app.listen(3000, () => {
    console.log("Server is running! Testing http://localhost:3000");
});