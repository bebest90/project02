$(document).ready(function(){
    home()
})

function home(){
    $('.login__title').on('click',function (){
        window.location.href="/"
    })
}

function blank_check(){

    frm1 = document.signup_form;
    if(frm1.username.value=='' || frm1.password.value=='' || frm1.password_check.value=='' || frm1.email.value=='' ){
        alert('필수 입력란이 비었습니다! 확인해주세요.')
        return false;
    }
    
}