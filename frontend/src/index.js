import ajax from "./ajax.js"
import { jobFeed, userGU, jobCUD, userWatch, jobLike, jobComment } from "./config.js"
window.onload = () => {
    // get a list of all the job posts
    let loadingFlag = true
    let jobHistoryData = []
    const getPost = (index = 0) => {
        ajax({
            url: jobFeed,
            type: 'get',
            data: {
                start: index
            },
            success: (data) => {
                loadingFlag = !!data.length
                loadingFlag && jobCardRender(data)
            }
        })
    }

    // get user info
    let userInfo = JSON.parse(localStorage.getItem('userInfo')) || {}
    let watcheeUserIds = []
    let userEmail = ''
    let userName = ''
    const getUserInfo = () => {
        ajax({
            url: userGU,
            type: 'get',
            data: {
                userId: userInfo.userId
            },
            success: (data) => {
                let user = document.querySelectorAll('.user_name')
                let userPhoto = document.querySelectorAll('.user_photo')
                userEmail = data.email
                userName = data.name
                for (let i in [].slice.call(user)) {
                    user[i].innerText = data?.name
                }
                for (let i in [].slice.call(userPhoto)) {
                    userPhoto[i].src = data?.image || './img/head.png'
                }

                // get watch user
                watcheeUserIds = data.watcheeUserIds || []
                watcheeUserIds.length && getWatchUser()
            }
        })
    }
    getUserInfo()

    // get watch user
    let step = 0
    let watchUserData = []
    function getWatchUser() {
        ajax({
            url: userGU,
            type: 'get',
            data: {
                userId: watcheeUserIds[step]
            },
            success: (data) => {
                watchUserData.push(data)
                step++
                step < watcheeUserIds.length ? getWatchUser() : network()
            }
        })
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

    // scroll handle
    let pageIndex = 0
    window.onscroll = function () {
        let t = document.documentElement.scrollTop || document.body.scrollTop;
        let clientH = document.documentElement.clientHeight
        let scrollHeight = document.body.scrollHeight

        if ((Math.ceil(t + clientH) >= scrollHeight) && loadingFlag) {
            pageIndex += 5
            getPost(pageIndex)
        }
    }

    // network render
    let networkWrap = document.querySelector('.network_wrap')
    const network = () => {
        let netTemp = ''
        watchUserData.forEach(item => {
            netTemp += `
                        <div class="mritem1_bot_item">
                            <div class="mritem1_bot_item1" data-id="${item.id}">
                                <a href="javascript:;"><img src="${item.image}" class="user_photo"></a>
                            </div>
                            <div class="mritem1_bot_item2">
                                <div class="mbiname"><a href="javascript:;">${item.name}</a></div>
                                <div class="mritem1_bot_item2_3" data-email="${item.email}"><a href="javascript:;"><img src="./img/add.png"> <span class="follow">UnFollow</span></a></div>
                            </div>
                        </div>
                    `
        })
        networkWrap.insertAdjacentHTML('beforeEnd', netTemp)

        // unWatch user
        let followBtn = document.querySelectorAll('.mritem1_bot_item2_3')
        for (let i in [].slice.call(followBtn)) {
            followBtn[i].onclick = () => {
                let email = followBtn[i].getAttribute('data-email')
                ajax({
                    url: userWatch,
                    type: 'put',
                    data: {
                        email,
                        turnon: false
                    },
                    success: (data) => {
                        window.location.reload()
                    }
                })
            }
        }

        // see user info
        let userInfoSee = document.querySelectorAll('.mritem1_bot_item1')
        for (let i in [].slice.call(userInfoSee)) {
            userInfoSee[i].onclick = () => {
                let id = userInfoSee[i].getAttribute('data-id')
                lookUserInfo(id)
            }
        }

        //get post
        getPost()
    }

    // upload photo
    let files = document.getElementById('upload_img')
    let postImg = document.querySelector('.post_img')
    let postImgUrl = ''
    files.addEventListener('change', function (event) {
        let file = event.target.files[0]
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function () {
            postImg.src = reader.result
            postImgUrl = reader.result
        }
    })

    // create post
    let write = document.querySelector('.write_art')
    let jobTit = document.querySelector('.job_title')
    let jobDesc = document.querySelector('.job_desc')
    write.onclick = () => {
        ajax({
            url: jobCUD,
            type: 'post',
            data: {
                title: jobTit.value,
                image: postImgUrl,
                start: new Date(),
                description: jobDesc.value
            },
            success: (data) => {
                if (data?.id) {
                    alert('create post success!')
                    localStorage.setItem('newJob', true)
                    window.location.reload()
                }
            }
        })
    }

    // notification
    if (localStorage.getItem('newJob')) {
        document.querySelector('.badge').style.display = 'block'
    }

    // del notify
    document.querySelector('.notify').onclick = () => {
        localStorage.removeItem('newJob')
        document.querySelector('.badge').style.display = 'none'
    }

    // render job card
    let jobCardWrap = document.querySelector('.pcard_item')
    const jobCardRender = (row) => {
        let jobData = row || []
        jobHistoryData = [...jobHistoryData, ...row]
        let cardHTML = ''
        jobData.forEach(element => {
            cardHTML += `
                    <div class="post_container">
                        <div class="pcard_item2">
                            <div class="pcard_item2_1" data-id="${element.creatorId}"><a href="javascript:;"><img src="./img/head.png" class=""></a></div>
                            <div class="pcard_item2_2">
                                <div><a href="javascript:;" class="username">${watchUserData.find(el => el.id === element.creatorId)?.name ?? 'User Name'}</a></div>
                                <div class="job">${new Date(element?.start).toDateString()}</div>
                            </div>
                            <div class="pcard_item2_3">
                                ${element.creatorId === userInfo.userId ? `<span class="j_del" data-id="${element.id}">Delete</span><span class="j_edit" data-id="${element.id}">Edit</span>` : ''}
                            </div>
                        </div>
                        <div class="pcard_item3">${element.title}</div>
                        <div class="pcard_item4">
                            <img src="${element.image}">
                        </div>
                        <div class="pcard_item5">
                            <div class="pcard_item5_1">${element.description}</div>
                            <div class="pcard_item5_2"><span>${new Date(element?.createdAt).toLocaleString()}</span></div>
                        </div>
                        <div class="pcard_item6">
                            <div class="pcard_item6_1"><img src="./img/like.png"><span class="like_num">${element?.likes?.length}</span></div>
                            <div><span class="comment_len">${element?.comments?.length}</span> comments</div>
                        </div>
                        <div class="pcard_item7">
                            <div class="mdtop_item2">
                                <a href="javascript:;" class="mdtop_item2_2 pcard_item7_item post_like" data-id="${element.id}"><img src="./img/compliment.png"><span class="like_txt">${element?.likes?.map(el => el.userId)?.includes(userInfo.userId) ? 'Cancel Like' : 'Like'}</span></a> 
                                <a href="javascript:;" class="mdtop_item2_2 pcard_item7_item post_comments"><img src="./img/reply.png"><span>Comment</span></a> 
                            </div>
                            <div class="comments_content" style="display:none;">
                                <div class="comments_list">
                                    ${element.comments?.map(item => {
                return `<div><a href="">${item.userName}：</a><span>${item.comment}</span></div>`
            }).join('')
                }
                                </div>
                                <div class="comments_inp">
                                    <input class="comment_txt" placeholder="please input your comments" /><button class="comment_send" data-id="${element.id}">send</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
        });
        jobCardWrap.insertAdjacentHTML('beforeEnd', cardHTML)

        // post like
        let likeBtn = document.querySelectorAll('.post_like')
        for (let i in [].slice.call(likeBtn)) {
            likeBtn[i].onclick = () => {
                let id = likeBtn[i].getAttribute('data-id')
                let likeNum = likeBtn[i].parentNode.parentNode.parentNode.querySelector('.like_num')
                let likesFlag = likeBtn[i].querySelector('.like_txt').innerText == 'Like' ? true : false
                ajax({
                    url: jobLike,
                    type: 'put',
                    data: {
                        id,
                        turnon: likesFlag
                    },
                    success: (data) => {
                        likeBtn[i].querySelector('.like_txt').innerText = likesFlag ? 'Cancel Like' : 'Like'
                        let num = parseInt(likeNum.innerText)
                        likeNum.innerText = likesFlag ? num + 1 : num - 1
                    }
                })
            }
        }

        // comments show
        let commentBtn = document.querySelectorAll('.post_comments')
        for (let i in [].slice.call(commentBtn)) {
            commentBtn[i].onclick = () => {
                let commentsContent = commentBtn[i].parentNode.parentNode.querySelector('.comments_content')
                commentBtn[i].parentNode.parentNode.querySelector('.comments_content').style.display = commentsContent.style.display === 'none' ? 'block' : 'none'

                // comment send
                let commenSend = commentsContent.querySelector('.comment_send')
                let commentTxt = commentsContent.querySelector('.comment_txt')
                commenSend.onclick = () => {
                    let id = commenSend.getAttribute('data-id')
                    ajax({
                        url: jobComment,
                        type: 'post',
                        data: {
                            id,
                            comment: commentTxt.value
                        },
                        success: (data) => {
                            let commoList = `<div><a href="">${userName}：</a><span>${commentTxt.value}</span></div>`
                            commentsContent.querySelector('.comments_list').insertAdjacentHTML('beforeEnd', commoList)
                            commentTxt.value = ''
                            commentBtn[i].parentNode.parentNode.parentNode.querySelector('.comment_len').innerText = parseInt(commentBtn[i].parentNode.parentNode.parentNode.querySelector('.comment_len').innerText) + 1
                        }
                    })
                }
            }
        }

        // post delete
        let postDelBtn = document.querySelectorAll('.j_del')
        for (let i in [].slice.call(postDelBtn)) {
            postDelBtn[i].onclick = () => {
                let id = postDelBtn[i].getAttribute('data-id')
                ajax({
                    url: jobCUD,
                    type: 'delete',
                    data: { id },
                    success: (data) => {
                        localStorage.removeItem('newJob')
                        window.location.reload()
                    }
                })
            }
        }

        // post edit
        let postEditBtn = document.querySelectorAll('.j_edit')
        for (let i in [].slice.call(postEditBtn)) {
            postEditBtn[i].onclick = () => {
                let id = postEditBtn[i].getAttribute('data-id')
                let postData = jobHistoryData.find(el => el.id === id)
                postDialog.style.display = 'block'
                let jTit = postDialog.querySelector('.j_tit')
                let jDesc = postDialog.querySelector('.j_desc')
                let jImg = postDialog.querySelector('.j_img')

                jTit.value = postData.title
                jDesc.value = postData.description
                jImg.src = postData.image

                // upload photo
                let imgs = document.getElementById('up_img')
                imgs.addEventListener('change', function (event) {
                    let file = event.target.files[0]
                    let reader = new FileReader()
                    reader.readAsDataURL(file)
                    reader.onload = function () {
                        jImg.src = reader.result
                    }
                })

                // save update job
                postDialog.querySelector('.job_edit_save').onclick = () => {
                    ajax({
                        url: jobCUD,
                        type: 'put',
                        data: {
                            id,
                            title: jTit.value,
                            description: jDesc.value,
                            image: jImg.src,
                            start: new Date()
                        },
                        success: (data) => {
                            window.location.reload()
                            // postDialog.style.display = 'none'
                            // getPost()
                        }
                    })
                }
            }
        }

        // see user info
        let photos = document.querySelectorAll('.pcard_item2_1')
        for (let i in [].slice.call(photos)) {
            photos[i].onclick = () => {
                let id = photos[i].getAttribute('data-id')
                lookUserInfo(id)
            }
        }
    }

    // see user info handle
    const lookUserInfo = (id) => {
        router.push(`profile=${id}`)
    }

    // job edit dialog
    let postDialog = document.getElementById('post_dialog')
    document.getElementById('job_close').onclick = () => {
        postDialog.style.display = 'none'
    }

    // sign out
    let signOut = document.querySelector('.logout')
    signOut.onclick = () => {
        localStorage.removeItem('userInfo')
        // window.location.href = './login.html'
        router.push('login')
    }
}