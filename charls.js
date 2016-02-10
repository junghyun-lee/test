/**
 * Created by leejunghyun on 16. 2. 4..
 */
if( livereLib.util.isTouchDevice() ) {
    livereLib.switchMobileView = true;
}

jQuery(livereLib).bind('livereEvent', function(event, param) {
    document.querySelector('#livereContainer').style.display = 'none';

    if (livereReply == null) return;
    var key = param['key'];
    var value = param['value'];

    switch (key) {
        case "livereDataInitComplete":
            login_gate();

            break;
    }
});
function login_gate() {
    facebook.loginGate = function() {
        location.href=livereLib.util.getLoginPageURL(facebook.name);
    }
    kakao.loginGate = function() {
        location.href=livereLib.util.getLoginPageURL(kakao.name);
    }
    naver.loginGate = function() {
        location.href=livereLib.util.getLoginPageURL(naver.name);
    }
    twitter.loginGate = function() {
        location.href=livereLib.util.getLoginPageURL(twitter.name);
    }
    instagram.loginGate = function() {
        location.href=livereLib.util.getLoginPageURL(instagram.name);
    }
}
