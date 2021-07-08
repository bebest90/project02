$(document).ready(function () {
    backHome()
    getId()
    showHide()
    deleteArticle()
    $('.comment__card-box').empty();


    let rn = Math.floor(Math.random() * 4) + 1;
    $('.header').addClass('header'+ rn);
})

function getId() {
    let id = location.search.split('=')[1]
    getDetail(id)
    getComment(id)
}

function backHome() {
    $('#home').on('click', function () {
        window.location.href = "/"
    })
}

function getDetail(id) {
    let idx = id
    $.ajax({
        type: 'GET',
        url: `/api/detail/${idx}`,
        success: function (response) {
            addDetail(response['id'], response['username'], response['title'], response['contents'], response['modifiedAt'])
        }
    })
}

function addDetail(id, username, title, contents, modifiedAt) {
    let tempHtml = `<div class ="detail">
    <div class="content-header">
          <h1 class="title">${title}</h1>
          <p class="post-author">
            <span class="username">${username}</span> <span class="post-date">| ${modifiedAt}</span>
          </p>
          <hr />
        </div>
        <div class="content-body">
          <p class="contents">
            ${contents}
          </p>
        </div>
    </div>`
    $('.content__container').append(tempHtml)
}

function showHide() {
    $('#edit').on('click', function () {
        let username = $('.username').text()
        let cur_username = $('.username01').text()
        if (cur_username != username){
            alert("자신이 작성한 글만 수정이 가능합니다!")
            return;
        }
        $('.detail').hide()
        $('.detail__edit').show()
        let title = $('.title').text()
        let contents = $('.contents').text().trim()
        let author = $('.post-author').text().trim()
        $('.post-author-edit').text(author)
        $('.detail-input').val(title)
        $('.detail-textarea').val(contents)
    })
    $('.cancel').on('click', function () {
        $('.detail').show()
        $('.detail__edit').hide()
        $('.detail-input').val('')
        $('.detail-textarea').val('')
    })
}

function editArticle() {
    let id = location.search.split('=')[1]
    let title = $('.detail-input').val();
    let contents = $('.detail-textarea').val();
    let username = $('.username').text()

    if (title == '') {
        alert("수정하실 제목을 적어 주세요!")
        return
    }
    if (contents == '') {
        alert("수정하실 내용을 적어 주세요!")
        return;
    }
    let data = {'username': username, 'title': title, 'contents': contents}
    $.ajax({
        type: "PUT",
        url: `/api/articles/${id}`,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            alert("수정이 완료되었습니다!")
            window.location.reload();
        }
    })
}

function deleteArticle() {

    $('#delete').on('click', function () {
        let username = $('.username').text()
        let cur_username = $('.username01').text()

        if (cur_username != username){
            alert("자신이 작성한 글만 삭제가 가능합니다!")
            return;
        }
        let id = location.search.split('=')[1]
        $.ajax({
            type: "DELETE",
            url:`/api/articles/${id}`,
            success:function (response){
                alert("삭제 되었습니다.")
                window.location.href = "/"
            }
        })
    })
}

function create_comment() {
    let article_id = location.search.split('=')[1]
    let name = $('.username01').text();
    let contents = $('.post__comment-textarea').val();
    if (!name || $('.link-signup').text() == '로그인 하러 가기') {
        alert("로그인을 하셔야 댓글을 달수 있습니다!")
        return;
    }
    if (contents == '') {
        alert("댓글을 적어주세요!!")
        return
    }
    let data = {'article_id':article_id, 'username':name, 'contents':contents};

    $.ajax({
        type:'POST',
        url:'/api/comments',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response){
            console.log(data)
            alert('댓글이 성공적으로 작성되었습니다!')
            window.location.reload();
        }

    })
}


function getComment(id) {
    let index = id
    $.ajax({
        type: 'GET',
        url: `/api/comment/${index}`,
        success: function (response) {
            for(let i=0; i< response.length; i++){
                console.log(response[i])
                let comment = response[i];
                let tempHtml = addComments(comment)
                $('.comment__card-box').append(tempHtml);
            }
        }
    });
}

function addComments(comment){
    return `<div class="comment__card">
            <div class="comment__card-header">
              <span id="${comment.id}-comment_user">${comment.username}</span><span class="comment-date">${comment.modifiedAt}</span>
            </div>
            <div class="comment__card-body">
              <div class="edit-comment-wrap">
                <div id="${comment.id}-comment" class="comment">${comment.contents}</div>
                <textarea
                  class="edit-comment-textarea"
                  id="${comment.id}-edit-comment-textarea"
                  name=""
                  id=""
                  cols="30"
                  rows="10"
                ></textarea>
              </div>
              <div class="comment-btn">
                <div class="befor" id="${comment.id}-befor">
                  <i class="far fa-edit" id="${comment.id}-edit-btn" onclick="edit_start_comment(${comment.id})" ></i>
                  <i class="fas fa-trash-alt" id="${comment.id}-delete-btn" onclick="delete_comment(${comment.id})"></i>
                </div>
                <div class="after" id="${comment.id}-after">
                  <i class="fas fa-check"  id="${comment.id}-check-btn" onclick="edit_comment(${comment.id})" ></i>
                  <i class="fas fa-times" id="${comment.id}-cancel-btn" onclick="edit_end_comment(${comment.id})" ></i>
                </div>
              </div>
            </div>
          </div>`;

}

function edit_start_comment(id){
    let comment_user = $(`#${id}-comment_user`).text()
    let cur_username = $('.username01').text()

    if (comment_user != cur_username){
        alert("본인의 댓글만 수정 하실수 있습니다.")
        return;
    }
    $(`#${id}-befor`).hide()
    $(`#${id}-after`).show()
    $(`#${id}-edit-comment-textarea`).show()
    $(`#${id}-comment`).hide()
    $(`#${id}-edit-comment-textarea`).val($(`#${id}-comment`).text())

}

function edit_comment(id){
    let article_id = location.search.split('=')[1]
    let username = $('.username01').text()
    let contents = $(`#${id}-edit-comment-textarea`).val()
    if(contents==''){
        alert('수정하실 내용을 작성 해주세요!')
        return;
    }
    let data = {'article_id':article_id,'username':username,'contents':contents}

    $.ajax({
        type:'PUT',
        url:`/api/comments/${id}`,
        contentType:'application/json',
        data:JSON.stringify(data),
        success:function (response){
            alert('댓글이 수정 되었습니다.')
            window.location.reload();
        }
    })
}


function edit_end_comment(id){
    $(`#${id}-befor`).show()
    $(`#${id}-after`).hide()

    $(`#${id}-edit-comment-textarea`).hide()
    $(`#${id}-comment`).show()
    $(`#${id}-edit-comment-textarea`).val('')
}

function delete_comment(id){
    let comment_user = $(`#${id}-comment_user`).text()
    let cur_username = $('.username01').text()

    if (comment_user != cur_username){
        alert("본인의 댓글만 삭제하실수 있습니다.")
        return;
    }
    $.ajax({
        type:'DELETE',
        url:`api/comments/${id}`,
        success: function (response){
            alert('댓글이 삭제 되었습니다.')
            window.location.reload();
        }
    })
}
