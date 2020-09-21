# Playground Landing Page
Web app front-end side rendering con Vue in modalità non SPA, Nodejs + Express.js + Mongodb.

## IMPORTANTE
È necessario avere installato nodejs per eseguire la web app.

## Installazione
Eseguire da terminale il comando `node -v` per visualizzare la versione attuale di nodejs.
In caso di mancata risposta alla versione, installare nodejs https://nodejs.org/it/

Dopo ever installato nodejs, effettuare il clone del progetto tramite il comando `git clone <remote_url>` oppure scaricare
direttamente il file zip che Github mette a diposizione.

Una volta che il progetto è stato scaricato, spostatevi nella cartella tramite il comando `cd <vostra_cartella>` del terminale.
Eseguire il comando `npm install` per installare tutti i pacchetti node_modules necessari per l'avvio della web app.

Dopo aver installato i node_modules, la web app potrà essere eseguita con due diverse modalità: "development" e "production", entrambe lanceranno il server alla porta `127.0.0.1:3000` dove potrà essere visualizzata ed utilizzata la web app.

Per lanciare l'applicazione in modalità "development" eseguire il comando `npm run start` in questo caso la web app effettuerà il salvataggio dei dati nel file `root/dev-data/jsondb.json` simulando il salvataggio online. Questa modalità viene utilizzata in fase di testing.  

Per lanciare l'applicazione in modalità "production" eseguire il comando `npm run start:prod` in questa fase, verrà effettuata una connessione al db mongodb con nome "pixelsc-app" appoggiato sulla piattaforma https://www.mongodb.com/cloud/atlas, tutte le operazioni di salvataggio verranno effettuate online.

Per poter accedere al db online si deve scaricare gratuitamente il software MongoDb Compass https://www.mongodb.com/products/compass, una volta scaricato si deve creare la connessione alla piattaforma Atlas tramite il comando New Connection e incollare la seguente stringa: `mongodb+srv://admin:tx0dtaGCmON6Rncl@cluster0.dt9v8.gcp.mongodb.net/pixelsc-app` a questo punto si ha il controllo del db online per verificare i dati.







