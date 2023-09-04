let htop = document.getElementById('htop')
function getTop() {
    var mytop = document.documentElement.scrollTop
    if (mytop > 400) {
        htop.style.position='sticky'
    }else{
        htop.style.position='static'
    }
    setTimeout(getTop);
}
getTop();