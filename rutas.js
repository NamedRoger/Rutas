const axios = require('axios').default;
const remote = require('electron').remote;
const hbs = require('handlebars');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

const apiUrl = `http://74.208.65.93:8082/api`;



class HttpException {
    constructor(messaje){
        this.exception = "HttpException";
        this.messaje = messaje;
    }
}

const compile = async (templateName,data) => {
    // leo la carpeta de donde se guardará el archivo
    const filePath = path.join(__dirname,`${templateName}.hbs`);
    // leo el html
    const html = await fs.readFileSync(filePath,'utf-8');
    // compilo el html con el formato hbs
    return hbs.compile(html)({devices:data});
}

hbs.registerHelper('isOff',value => {
    return value === 'online';
});

const getAuth = async (token) => {
    const session = remote.getCurrentWindow().webContents.session;
    const sessionCookie = await session.cookies.get({name:"JSESSIONID"});
    if(sessionCookie.length > 0){
           session.cookies.remove("http://74.208.65.93:8082/","JSESSIONID");
    }
    const res = await axios.get(`${apiUrl}/session/?token=${token}`).catch(e => e);
    return res;
}

const getDevices = async (token) => {
    const resAuth = await getAuth(token);
    if(resAuth.status === 200){
        const resDevices = await axios.get(`${apiUrl}/devices`);
        return resDevices.data;
    }else{
        const exception = new HttpException(resAuth);
        throw exception.messaje;
    }
}

(async ()=> {
    window.addEventListener("DOMContentLoaded",() => {
        const buttons = document.querySelectorAll(".btn-token");
        
        buttons.forEach(b => b.addEventListener("click", async e => {
            // crea una instania del navegador para crear el documento pdf
            const browser = await puppeteer.launch();
            try{
                const fileName = e.target.previousSibling.textContent;
                const devices = await getDevices(e.target.id);
                //obtengo el copilado del template del html
                const html = await compile("rutas",devices.sort((a,b) => {
                    if(a.name > b.name){
                        return 1;
                    }
                    if(a.name < b.name){
                        return -1;
                    }
                    return 0;
                }));

                //creo una nueva página, que será el documento pdf
                const page = await browser.newPage();
                // // seteo el contenido de la página
                await page.setContent(html);
                await page.emulateMediaType('screen');
                const p = await page.pdf({
                    path: path.join(__dirname,'files',`${fileName}.pdf`),
                    format: 'A4',
                    printBackground:true
                });
                 
                showNotification();
            }catch(exception){
                alert(exception);
            }finally{
                //cierro la instancia del navegador
                await browser.close();
            }
        }));
    });
})();


function showNotification () {
    const notification = {
      title: 'Listo',
      body: 'Se ha generado el reporte'
    }
    const p = new remote.Notification(notification).show();
  }
  

