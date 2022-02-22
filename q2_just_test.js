/*USANDO A API DO GITHUB*/

axios = require("axios")
axios.get('https://progressivebot.netlify.app').then(
    function(answer){
        console.log(answer.data)//.headers, .status, .data.followers, .query, .params
    }
).catch(
    //mostrar caso haja algum erro
    function(error){
        if(error){
            console.log(error)
        }
    }
)
