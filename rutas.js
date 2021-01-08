const axios = require('axios').default;
const remote = require('electron').remote;

const apiUrl = `http://74.208.65.93:8082/api`;

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
        console.log(resDevices);
    }else{
        alert("Error!");
    }
}

(async ()=> {
    window.addEventListener("DOMContentLoaded",() => {
        const buttons = document.querySelectorAll(".btn-token");
       
        buttons.forEach(b => b.addEventListener("click", e => getDevices(e.target.id)));
    });
})();



