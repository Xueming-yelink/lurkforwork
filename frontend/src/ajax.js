export default function ajax (json) { 
 
    if(window.XMLHttpRequest){ 
        var ajax = new XMLHttpRequest(); 
    } 
    else{ 
        var ajax = new ActiveXObject( "Microsoft.XMLHTTP" ); 
    }

    // set send type
    json.type == 'post' ? ajax.open('post',json.url,true) : json.type == 'get' ? ajax.open('get',json.url+'?'+JsonToString(json.data),true) : ajax.open(json.type,json.url,true);

    // set user auth
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    ajax.setRequestHeader("Authorization", userInfo?.token);

    // set response charset
    ajax.setRequestHeader("Content-Type", "application/json; charset=utf-8");

    // set response type
    ajax.responseType = 'json'

    ajax.send(JSON.stringify(json.data));
     
    ajax.onreadystatechange = function(){ 
        if(ajax.readyState == 4){ 
            if(ajax.status === 200){
                json.success(ajax?.response);
            }else if(ajax.status === 403){
                router.push('login')
            }else{
                json.error && json.error(ajax?.response);
            } 
        }; 
    }; 
 
 
    function JsonToString(json){ 
        var arr = []; 
        for(var i in json){ 
            arr.push(i+'='+json[i]); 
        }; 
        return arr.join('&'); 
    } 
}