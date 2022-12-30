import express, {Express, NextFunction, Request, Response} from 'express';
import expressWs from 'express-ws';
import {connectUrbitClient, urbitCreateFile, urbitUpdateTagsToFile} from "./urbit";

const app = express();
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

connectUrbitClient({
    onEvent: (event: string) => {
        wsInstance.getWss().clients.forEach((client) => {
            client.send(event);
        })
    }
});

// @ts-ignore
app.ws('/ws', function (ws, req: Request) {
    ws.on('message', function (msg: any) {
        if (msg === "ping") {
            ws.send("pong");
        } else {
            console.log(msg);
        }
    });
});

app.listen(3000);