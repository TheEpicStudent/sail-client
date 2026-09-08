const http = require('http');
const { env, loadEnvFile } = require('node:process');
loadEnvFile()
const express = require('express');
const app = express();
const server = http.createServer(app);
const PORT = env.PORT || 7023;
const { readFileSync } = require('fs')
const path = require('node:path');


app.use(express.static('public'));

app.get('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const filepath = path.join(__dirname, 'public', 'index.html');
    res.end(readFileSync(filepath));
});
app.get('/dashboard', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const filepath = path.join(__dirname, 'public/client', 'dash.html');
    res.end(readFileSync(filepath));
});
console.log(env.MODE)
app.get('/api/v1/dashboard/dashboard_cards', async (req, res) => { 
    try {
        if (env.MODE != 'dev') {res.status(401).send('401 Unauthorized'); return;}
        res.send(await GetDashCards())
    } catch (error) {
        res.status(500).send(error)
    }
}); 
app.get('/api/v1/courses/:id', async (req, res) => {
    try {
        if (env.MODE != 'dev') {res.status(401).send('401 Unauthorized'); return;}
        res.send(await getClassInfo(req.params.id))
    } catch (error) {
        res.status(500).send(error)
    }
})
app.get('/api/v1/planner/items/:id', async (req, res) => {
    try {
        if (env.MODE != 'dev') {res.status(401).send('401 Unauthorized'); return;}
        res.send(await getPlanner(req.params.id))
    } catch (error) {
        res.status(500).send(error)
    }
})
app.get('/api/mode', (req, res) => {
    res.send({"mode":env.MODE})
});

async function getPlanner(code) {
    const myHeaders = new Headers()
    myHeaders.append("Authorization", "Bearer " + env.DEVAPIKEY)
    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };
    try {
    const response = await fetch(`https://${env.DEVBASEURL}/api/v1/planner/items?context_codes[]=course_${code}`, requestOptions)
    const data = response.json()
    return data;
    } catch (error) {
        return;
    }
}
async function getClassInfo(id) {
    const myHeaders = new Headers()
    myHeaders.append("Authorization", "Bearer " + env.DEVAPIKEY)
    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };
    try {
    const response = await fetch(`https://${env.DEVBASEURL}/api/v1/courses/${id}?include[]=total_scores`, requestOptions)
    const data = response.json()
    return data;
    } catch (error) {
        return;
    }
}



async function GetDashCards() {
    const myHeaders = new Headers()
    myHeaders.append("Authorization", "Bearer " + env.DEVAPIKEY);
    const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
    };
    try {
    const response = await fetch(`https://${env.DEVBASEURL}/api/v1/dashboard/dashboard_cards`, requestOptions);
    const result = await response.json();
    return result
    } catch (error) {
    return
    };
}
async function sendRequest(type, custom) {
    const paths = [{"dashcards":"/api/v1/dashboard/dashboard_cards"}]
    const myHeaders = new Headers()
    myHeaders.append("Authorization", "Bearer " + env.DEVAPIKEY);
    const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
    };
    const URL = env.DEVBASEURL + paths.entries(type)
    const response = (await fetch(URL, requestOptions)).json();
    return response;
}

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});