/*USANDO A API DO GITHUB*/

axios = require("axios")
axios.get('https://api.github.com/users/weslley-david').then(
    function(answer){
        console.log(answer.data.bio)//.headers, .status, .data.followers, .query, .params
        console.log(answer.status)
        console.log(answer.headers.server)
    }
).catch(
    //mostrar caso haja algum erro
    function(error){
        if(error){
            console.log(error)
        }
    }
)
