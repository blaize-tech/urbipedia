import express, {Express, NextFunction, Request, Response} from 'express';
import expressWs from 'express-ws';

const app = express();
expressWs(app);

app.get('/', function (req: Request, res: Response, next: NextFunction) {
    console.log('get route', req.body);
    res.send("test ok");
});

// @ts-ignore
app.ws('/', function (ws: any, req: Request) {
    ws.on('message', function (msg: any) {
        console.log(msg);
    });
    console.log('socket', req.body);
});

app.listen(3000);