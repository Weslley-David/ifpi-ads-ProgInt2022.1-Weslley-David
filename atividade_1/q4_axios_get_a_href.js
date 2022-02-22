axios = require("axios").default
let url = 'https://www.pygame.org/docs/'

function procura_link(html_content){
    html_content_array = html_content.split('<a href');
    
    for(i in html_content_array){
        temp = html_content_array[i].split('>')
        temp_2 = temp[0].split('"')
        console.log(temp_2[1])
    }
}


axios.get(`${url}`)
    .then(function(answer){
        all_html = `${ answer.data }`;
        //console.log(all_html);
        console.log(typeof(all_html))
        procura_link(all_html)
        }
    )
    .catch(
    //mostrar caso haja algum erro
    function(error){
        if(error){
            console.log(error)
            }
        }
    )
/*
 const r = ''
async function getLocais() {
    try {
      r = await fetch('https://progressivebot.netlify.app');
      return r;
    } catch (e) {
      return null
    }
  }
  console.log(r)*/