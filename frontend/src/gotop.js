// go top
var gotop = document.getElementById('top-back')
window.onscroll=function(){
    let res = document.documentElement.scrollTop
    if(res>600){             
        gotop.style.display='block'
    }else{
        gotop.style.display='none'
    }
}
var times
gotop.onclick=function(){
    clearInterval(times)//Clear the last opened timer to prevent more and more timers from being opened
    times=setInterval(()=>{
        var topsc=document.documentElement.scrollTop //Calculate the distance per browser scroll
        // var speed = Math.floor(topsc/10) //From slow to fast, note that except for the 10 final browsers will only scroll to 10px from the top
        if(topsc<=0){
            clearInterval(times);
        }else{  //Uniformity back to top
            document.documentElement.scrollTop=topsc-30;
        }
    })
}