import { Router } from 'express';

import { SQLDatabasePersistence} from './persistence';
import { DomainModule } from './domain';
import { RestController } from './rest';
import { Server } from './server';


/* I've been playing with various domain-focused architectures recently and chose to use
use one here. A three-layer architecture is fairly common and this follows that paradigm, but 
changes the dependencies somewhat. The goal is to have the domain contain all the logic while 
having no dependencies. The persistence layer implements a domain interface and the user interface,
in this case a REST API, is passed the domain as a dependency along with an empty Express router.
The product is then passed into the server for hosting.

What I really like about this architecture is the flexibility. I can write a new persistence layer
that uses flat files, or a NoSQL database, or a combination of all three (including SQL) as long as
the product correctly implements the domain's persistence interface. The domain neither knows nor cares
how the persistence is done. Likewise, the router doesn't know the logic and the server only knows 
server configuration. It would even be possible to create multiple domain instances matched with 
different persistence layers and combined in a single REST API with very little refactoring, albeit
some extra unused code.

The cleanliness of this approach also helps combat the grossness of the last two codebases I've inherited
from previous teammates where controllers are making database queries, services are calling other services
to call back to themselves, routers are defining models/types, and... the result is a codebase that is
almost impossible to find anything in, is super fragile, requires extra testing time to make small changes,
and costs the company much, much more than it should.
*/

const db = new SQLDatabasePersistence();
const domain = new DomainModule(db);
const rest = new RestController(Router(), domain);
const server = new Server(rest.router, 3000);

server.start();
