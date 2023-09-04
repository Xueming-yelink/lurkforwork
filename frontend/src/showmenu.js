let menu =document.getElementById('menu')
let list = document.getElementById('list')
menu.onmouseenter=function(){
    list.style.height="160px"
    list.style.border='1px solid #cfcfcf'
}
menu.onmouseleave =function(){
    list.style.height=''
    list.style.border=''
}
list.onmouseenter=function(){
    list.style.height="160px"
    list.style.border='1px solid #cfcfcf'
}
list.onmouseleave =function(){
    list.style.height=''
    list.style.border=''
}