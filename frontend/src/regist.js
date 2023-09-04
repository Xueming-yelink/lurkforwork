import ajax from "./ajax.js"
import { register } from "./config.js"
window.onload = () => {
    let oReg = document.getElementById('regist')
    let oLogin = oReg.querySelector('.regbtn')
    let email = oReg.querySelector('.email')
    let userName = oReg.querySelector('.user_name')
    let pwd = oReg.querySelector('.pwd')
    let error = oReg.querySelector('.error')
    let show = oReg.querySelector('.show')
    let pwdShow = false

    // login
    oLogin.onclick = () => {
        // email/pwd check
        error.style.display = 'none'
        if (!email.value || !pwd.value || !userName.value) {
            error.style.display = 'block'
            error.innerText = 'Please enter your email address user name or mobile number.'
            return
        }
        ajax({
            url: register,
            type: 'post',
            data: {
                email: email.value,
                password: pwd.value,
                name: userName.value
            },
            success: function (data) {
                alert('registe success! jump to login')
                router.push('login')
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
}