//router list
var routes = [{
    id: 'profile',
    title: 'profile',
    handler: function(){
        removeScript()
        document.getElementById('htop').style.display = 'block'
        let script = document.createElement('script')
        script.type = 'module'
        script.src = './src/profile.js'
        script.class = 'extraScript'
        document.body.appendChild(script)
    }
}, {
    id: 'index',
    title: 'index',
    handler: function(){
        removeScript()
        document.getElementById('htop').style.display = 'block'
        // add index script
        let script = document.createElement('script')
        script.type = 'module'
        script.src = './src/index.js'
        script.class = 'extraScript'
        document.body.appendChild(script)
    }
}, {
    id: 'login',
    title: 'login',
    handler: function() {
        removeScript()
        document.getElementById('htop').style.display = 'none'
        let script = document.createElement('script')
        script.type = 'module'
        script.src = './src/login.js'
        script.class = 'extraScript'
        document.body.appendChild(script)
    }
}, {
    id: 'regist',
    title: 'regist',
    handler: function() {
        removeScript()
        document.getElementById('htop').style.display = 'none'
        let script = document.createElement('script')
        script.type = 'module'
        script.src = './src/regist.js'
        script.class = 'extraScript'
        document.body.appendChild(script)
    }
}]

function removeScript(){
    let extraSCript = document.querySelectorAll('.extraScript')
    for (let i in [].slice.call(extraSCript)) {
        extraSCript[i]?.parentNode?.removeChild(extraSCript[i])
    }
}
// router
var router = new Router(routes, 'index');