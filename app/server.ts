import { Express, static as static_ } from "express";
import path from "path";
import { router as userRouter } from "./routes/user"
import {router as adminRouter} from './routes/admin'
import { LooseAuthProp } from '@clerk/clerk-sdk-node';
import { router as dnsRouter } from "./routes/dns"
import { cors_policy } from './utils'

declare global {
    namespace Express {
        interface Request extends LooseAuthProp { }
    }
}

export class Server {
    private app: Express;
    constructor(app: Express) {
        this.app = app;
        this.applyMiddlewares();
        this.addRoutes();
    }

    public applyMiddlewares(){
        this.app.use(cors_policy);
        // this.app.use((req, res, next) => {
        //     if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
        //         next();
        //     } else {
        //         res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        //         res.header('Expires', '-1');
        //         res.header('Pragma', 'no-cache');
        //         res.sendFile(path.resolve("./") + "/build/frontend/index.html");
        //     }
        // });
        this.app.use(static_(path.resolve("./") + "/build/frontend"));
    }

    public addRoutes(){
        this.app.use("/dns", dnsRouter)
        this.app.use("/user", userRouter)
        this.app.use("/admin", adminRouter)
    }

    public start(port: number) {
        this.app.listen(port, () => {
            console.log(`server started on ${port}`)
        })
    }
}

