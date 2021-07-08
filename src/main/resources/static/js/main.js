$(document).ready(function () {
    showHide()
    $('.card__container').empty()
    getArticle();
    logout();
    goHome();
    navBtn();
})

function goHome(){
    $('.main-title').on('click',function (){
        window.location.href="/"
    })
}

function navBtn(){
    $('.nav-git').on('click',function (){
        window.location.href="https://github.com/bebest90/project02"
    })
    $('.nav-pen').on('click',function (){
        if ($('.link-signup').text() == "회원 가입하러 가기" ){
            alert("게시물 작성을 위해선 로그인을 해야합니다.")
            window.location.href="/user/login"
            return;
        }
        $('.contents__container').hide();
        $('.posting__contianer').show();
    })
    $('.nav-key').on('click',function (){
        if ($('.link-signup').text() == "회원 가입하러 가기" ){
            window.location.href="/login"
            return;
        }
        alert('로그아웃 되었습니다. 감사합니다.')
        window.location.href="/user/logout"
    })
}
function logout(){
    $('.fa-sign-out-alt').on('click',function(){
        alert('로그아웃 되었습니다. 감사합니다.')
        window.location.href="/user/logout"
    })
}

function showHide() {
    $('#posting-pen').on('click', function () {
        if ($('.link-signup').text() == "회원 가입하러 가기" ){
            alert("게시물 작성을 위해선 로그인을 해야합니다.")
            window.location.href="/user/login"
            return;
        }
        $('.contents__container').hide();
        $('.posting__contianer').show();
    })

    $('#cancel-btn').on('click', function () {
        $('.posting__contianer').hide();
        $('.contents__container').show();

        $('.input-name').val('')
        $('.input-title').val('')
        $('.posting-textarea').val('')
    })
}

function postArticle() {
    let username = $('.cur_username').text()
    let title = $('.input-title').val()
    let contents = $('.posting-textarea').val()
    if (username == '') {
        alert('이름을 적어주세요!')
        return;
    } else if (title == '') {
        alert('제목을 적어주세요!')
        return
    } else if (contents == '') {
        alert('내용을 적어주세요!')
        return
    }
    let data = {'username': username, 'title': title, 'contents': contents}
    $.ajax({
        type:'POST',
        url:'/api/articles',
        contentType:'application/json',
        data: JSON.stringify(data),
        success: function (response){
            alert("게시물 작성이 완료 되었습니다!")
            window.location.reload()
        }
    })
}

function getArticle(){
    $.ajax({
        type:'GET',
        url:'/api/articles',
        success: function (response){
            for(let i=0; i<response.length; i++){
                let articles = response[i]
                addArticle(articles['id'], articles['username'], articles['title'], articles['contents'], articles['modifiedAt'])
            }
        }
    })
}
function addArticle(id, username, title, contents, modifiedAt){
    let tempHtml = `<div class="card">
                    <div class="card-header">
                        <a href="/detail?id=${JSON.stringify(id)}" class="article-title"><h2>${title}</h2></a>
                    </div>
                    <div class="card-body">
                        <p>
                            ${contents}
                        </p>
                    </div>
                    <div class="card-footer">
                        <p class="post-author"> ${username} <span class="post-date">|  ${modifiedAt}</span></p>
                    </div>
                </div>`
    $('.card__container').append(tempHtml)
}