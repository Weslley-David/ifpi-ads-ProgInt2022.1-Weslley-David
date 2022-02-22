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



/*const axios = require("axios");
const geturl = 'https://recode.com'

const get_all= () =>
    axios
        .get(geturl)
        .then((res) => console.log(res.data))
        .catch(console.error)

const get_by_id = (id) =>
    axios
        .get(`${geturl}${id}`)
        .then((res) => console.log(res.data))
        .catch(console.error)

get_all(73)*/