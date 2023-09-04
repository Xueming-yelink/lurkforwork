import ajax from "./ajax.js"
import { login } from "./config.js"
window.onload = () => {
    let loginWrap = document.getElementById('login')
    let oLogin = loginWrap.querySelector('.logbtn')
    let phone = loginWrap.querySelector('.phone')
    let pwd = loginWrap.querySelector('.pwd')
    let error = loginWrap.querySelector('.error')
    let show = loginWrap.querySelector('.show')
    let reg = loginWrap.querySelectorAll('.reg')
    let pwdShow = false

    // login
    oLogin.onclick = () => {
        // email/phone/pwd check
        error.style.display = 'none'
        if (!phone.value || !pwd.value) {
            error.style.display = 'block'
            error.innerText = 'Please enter your email address or mobile number.'
            return
        }
        ajax({
            url: login,
            type: 'post',
            data: {
                email: phone.value,
                password: pwd.value
            },
            success: function (data) {
                localStorage.setItem('userInfo', JSON.stringify(data))
                router.push('index')
            },
            error: function (data) {
                error.style.display = 'block'
                let err = data.error || 'bad request'
                error.innerText = err
                alert(err)
            }
        })
    }

    // pwd show
    show.onclick = () => {
        pwdShow = !pwdShow
        pwd.type = pwdShow ? 'text' : 'password'
    }

    // go reg
    for (let i in [].slice.call(reg)) {
        reg[i].onclick = () => {
            router.push('regist')
        }
    }
}