import express, {Express, NextFunction, Request, Response} from 'express';
import expressWs from 'express-ws';
import {
    connectUrbitClient,
    urbitCreateFile,
    urbitCreateLinkFileToFile,
    urbitDeleteFile,
    urbitDeleteLinkFileToFile,
    urbitGetFileEntries,
    urbitGetLink,
    urbitGetLinks,
    urbitGetNodes,
    urbitRenameFile,
    urbitUpdateFile,
    urbitUpdateTagsToFile
} from "./urbit";

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
const wsInstance = expressWs(app);

app.post('/create-node', function (req: Request, res: Response, next: NextFunction) {
    console.log("req.body", req.body);
    urbitCreateFile(req.body.name).then(() => {
        res.send("ok");
    }).catch((err => {
        res.status(500).send(err);
    }));
});

app.post('/update-tags', function (req: Request, res: Response, next: NextFunction) {
    urbitUpdateTagsToFile(req.body.id, req.body.tags).then(() => {
        res.send("ok");
    }).catch((err => {
        res.status(500).send(err);
    }));
});

app.post('/update-content', function (req: Request, res: Response, next: NextFunction) {
    urbitUpdateFile(req.body.id, req.body.content).then(() => {
        res.send("ok");
    }).catch((err => {
        res.status(500).send(err);
    }));
});

app.post('/rename-node', function (req: Request, res: Response, next: NextFunction) {
    urbitRenameFile(req.body.id, req.body.name).then(() => {
        res.send("ok");
    }).catch((err => {
        res.status(500).send(err);
    }));
});

app.post('/create-link', function (req: Request, res: Response, next: NextFunction) {
    urbitCreateLinkFileToFile(req.body.from, req.body.to).then(() => {
        res.send("ok");
    }).catch((err => {
        res.status(500).send(err);
    }));
});

app.post('/delete-link', function (req: Request, res: Response, next: NextFunction) {
    urbitDeleteLinkFileToFile(req.body.id).then(() => {
        res.send("ok");
    }).catch((err => {
        res.status(500).send(err);
    }));
});

app.post('/delete-node', function (req: Request, res: Response, next: NextFunction) {
    urbitDeleteFile(req.body.id).then(() => {
        res.send("ok");
    }).catch((err => {
        res.status(500).send(err);
    }));
});

app.get('/entries/ids', function (req: Request, res: Response, next: NextFunction) {
    // @ts-ignore
    urbitGetFileEntries(req.query.id).then((data) => {
        res.send(data);
    }).catch((err => {
        res.status(500).send(err);
    }));
});

app.get('/entries/all', function (req: Request, res: Response, next: NextFunction) {
    // @ts-ignore
    urbitGetNodes().then((data) => {
        res.send(data);
    }).catch((err => {
        res.status(500).send(err);
    }));
});

app.get('/links/all', function (req: Request, res: Response, next: NextFunction) {
    // @ts-ignore
    urbitGetLinks().then((data) => {
        res.send(data);
    }).catch((err => {
        res.status(500).send(err);
    }));
});

app.get('/links/ids', function (req: Request, res: Response, next: NextFunction) {
    // @ts-ignore
    urbitGetLink(req.query.id).then((data) => {
        res.send(data);
    }).catch((err => {
        res.status(500).send(err);
    }));
});

connectUrbitClient({
    onEvent: (event: string) => {
        wsInstance.getWss().clients.forEach((client) => {
            client.send(JSON.stringify(event));
        })
    }
});

// @ts-ignore
app.ws('/ws', function (ws, req: Request) {
    ws.on('message', function (msg: any) {
        if ("ping" in JSON.parse(msg)) {
            ws.send(JSON.stringify({ping: Date.now()}));
        } else {
            console.log(msg);
        }
    });
});

app.listen(process.env.LISTEN_PORT || 3000);