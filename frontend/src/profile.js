import ajax from "./ajax.js"
import { userGU, userWatch } from "./config.js"
window.onload = () => {
    let profile = document.getElementById('profile')
    let userName = document.querySelectorAll('.user_name')
    let firstName = document.querySelector('.first_name')
    let email = document.querySelector('.email')
    let pwd = document.querySelector('.password')

    // get user info
    let userInfo = JSON.parse(localStorage.getItem('userInfo')) || {}
    let follow = document.querySelector('.card1_item1_img2')
    const getUserInfo = () => {
        let queryId = location.hash?.split('=')[1] || userInfo.userId
        let userPhoto = document.querySelectorAll('.user_photo')
        ajax({
            url: userGU,
            type: 'get',
            data: {
                userId: queryId
            },
            success: (data) => {
                for (let i in [].slice.call(userName)) {
                    userName[i].innerText = data?.name
                }
                for (let i in [].slice.call(userPhoto)) {
                    userPhoto[i].src = data?.image
                }
                if (data.id === userInfo.userId) follow.style.display = 'none'
                firstName.value = data?.name
                email.value = data?.email
                open2.src = data?.image
                phtoImg = data?.image

                // render job
                renderJob(data.jobs)
            }
        })
    }
    getUserInfo()

    // render job
    let jobList = profile.querySelector('.mleft')
    const renderJob = (data) => {
        let jobData = data || []
        jobData.forEach(element => {
            let jobTemp = `
                <div class="per_jobs">
                    <div class="per_job_title">${element.title}</div>
                    <div class="per_job_desc">${element.description}</div>
                    <div class="per_job_image">
                        <img src="${element.image}" width="200" />
                    </div>
                </div>
            `
            jobList.insertAdjacentHTML('beforeEnd', jobTemp)
        });
    }

    // search user
    document.getElementById('user_search').onkeypress = (e) => {
        let charCode = (e.charCode) ? e.charCode : ((e.which) ? e.which : e.keyCode)
        if (charCode == 13 || charCode == 3) {
            ajax({
                url: userWatch,
                type: 'put',
                data: {
                    email: e.target.value,
                    turnon: true
                },
                success: () => {
                    alert('watch user success!')
                    window.location.reload()
                },
                error: (data) => {
                    alert(data.error)
                }
            })
        }
    }

    // watch user
    follow.onclick = () => {
        ajax({
            url: userWatch,
            type: 'put',
            data: {
                email: email.value,
                turnon: true
            },
            success: () => {
                alert('watch user success!')
                window.location.reload()
            },
            error: (data) => {
                alert(data.error)
            }
        })
    }

    // edit user info
    document.querySelector('.info_edit_save').onclick = () => {
        updateUserInfo({
            email: email.value,
            name: firstName.value,
            password: pwd.value
        })
    }

    // update user info
    function updateUserInfo(data) {
        ajax({
            url: userGU,
            type: 'put',
            data,
            success: (data) => {
                alert('update user info success!')
                for (let i in [].slice.call(userName)) {
                    userName[i].innerText = firstName?.value
                }
                waibu.style.display = 'none'
                waibu2.style.display = 'none'
                getUserInfo()
            },
            error: (error) => {
                alert(error?.error || 'edit error')
            }
        })
    }

    // upload photo
    let files = document.getElementById('upload_photo')
    let images = document.querySelector('.n2img')
    let phtoImg = images.children[0].src
    files.addEventListener('change', function (event) {
        let file = event.target.files[0]
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function () {
            let img = new Image()
            img.src = reader.result
            phtoImg = reader.result
            images.removeChild(images.children[0])
            images.appendChild(img)
        }
    })

    // update photo
    document.querySelector('.save_photo').onclick = () => {
        updateUserInfo({
            image: phtoImg
        })
    }

    // menu show
    let open = document.getElementById('open')
    let close = document.getElementById('close')
    let waibu = document.getElementById('waibu')
    open.onclick = function () {
        waibu.style.display = 'block'
    }
    close.onclick = function () {
        waibu.style.display = 'none'
    }


    let open2 = document.getElementById('open2')
    let close2 = document.getElementById('close2')
    let waibu2 = document.getElementById('waibu2')
    open2.onclick = function () {
        waibu2.style.display = 'block'
        images.children[0].src = phtoImg
    }
    close2.onclick = function () {
        waibu2.style.display = 'none'
    }

    // sign out
    let signOut = document.querySelector('.logout')
    signOut.onclick = () => {
        localStorage.removeItem('userInfo')
        // window.location.href = '/frontend/login.html'
        router.push('login')
    }
}