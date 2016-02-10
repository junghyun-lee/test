if( livereLib.util.isTouchDevice() ) {
    livereLib.switchMobileView = true;
}

jQuery(livereLib).bind('livereEvent', function(event, param) {
    if (livereReply == null) return;
    var key = param['key'];
    var value = param['value'];

    switch (key) {
        case "livereDataInitComplete":
            livereReply.customWrite();
            /*if(megaLoginCheck()){
             jQuery('#livere_contentText').val(unescape(ReadCookie("content")));
             }*/
            break;
        case "drawPrimaryUserDataComplete" :
            if(livereLib.isLogged()){
                livereReply.choiceTextToWriteForm();
            }
            break;
        case "drawSNSBtnsComplete":
            jQuery('#livere_contentText').parent().click(function() {
                if(!livereLib.isLogged()){
                    popMemberInput('2');
                }
            });

            //textSave();

            //$('#livere_contentText').focus();
            break;
    }
});

/*function textSave() {
 jQuery('#livere_contentText').bind('keyup change', function() {
 document.cookie = "content=" + escape (jQuery(this).val()) + "; expires=-1; path=/";
 });
 }

 function ReadCookie (Name){
 var search = Name + "="
 if (document.cookie.length > 0){
 offset = document.cookie.indexOf(search);
 if (offset != -1){
 offset += search.length ;
 end = document.cookie.indexOf(";", offset) ;
 if (end == -1){
 end = document.cookie.length;
 }

 var content = document.cookie.substring(offset, end);

 console.log(content);
 return content === 'undefined' ? '' : content
 }
 }
 }*/

function megaLoginCheck(){

    if (livereLib.getSmartLoginData().group_data === null)
        return false;

    var memberData = livereLib.getSmartLoginData().member_datas;

    for(var i=0; i<memberData.length; i++){
        if(memberData[i].member_domain === "megastudy" && memberData[i].member_islogin === 1) {
            if(snsCheck())
                return true;
        }
    }
    return false;
}

function snsCheck(){
    if (livereLib.getSmartLoginData().group_data === null) {
        return false;
    }
    var memberData = livereLib.getSmartLoginData().group_data.member_datas;
    for(var i=0; i<memberData.length; i++){

        if((memberData[i].member_domain === "twitter" && memberData[i].member_islogin === 1) ||
            (memberData[i].member_domain === "naver" && memberData[i].member_islogin === 1) ||
            (memberData[i].member_domain === "facebook" && memberData[i].member_islogin === 1) ||
            (memberData[i].member_domain === "kakao" && memberData[i].member_islogin === 1) ){
            return true;
        }
    }
    return false;
}
livereReply.choiceTextToWriteForm = function() {
    var radioLeft = jQuery("#left .livere_choiceImg:checked").val(),
        radioRight = jQuery("#right .livere_choiceImg:checked").val(),
        hashTag = jQuery("#tag .livere_choiceImg:checked").val();
    jQuery("#livere_contentText").val( (typeof radioLeft === 'undefined' ? '' : radioLeft) + (typeof radioRight === 'undefined' ? '' : ' ' + radioRight) + (typeof hashTag === 'undefined' ? '' : '\n' + hashTag) );
    //$('#livere_contentText').focus();
};

livereReply.customWrite = function() {
    jQuery(".livere_choiceImg").click( function() {
        livereReply.choiceTextToWriteForm();
    });

    jQuery("#livereWriteBtn").unbind().click( function() {
        if( jQuery("#left .livere_choiceImg:checked").length > 0 && jQuery("#right .livere_choiceImg:checked").length > 0 ) {
            if(!megaLoginCheck()){
                var m_login = confirm('메가스터디 외 1개 이상의 SNS로 로그인해주셔야 참여가 완료됩니다.');
                if(m_login === true){
                    popMemberInput('2');
                }else if(m_login === false){
                    livereLib.processComplete();
                }
                return false;
            }
            if(typeof jQuery("#tag .livere_choiceImg:checked").val() === 'undefined'){
                alert("해시태그 삽입여부를 선택해주셔야 응모 가능합니다.");
                return false;
            }
            if(!(jQuery('input:checkbox[id="livereSNSPostCheck_naver"]').is(":checked") == true ||
                jQuery('input:checkbox[id="livereSNSPostCheck_facebook"]').is(":checked") == true ||
                jQuery('input:checkbox[id="livereSNSPostCheck_kakao"]').is(":checked") == true ||
                jQuery('input:checkbox[id="livereSNSPostCheck_twitter"]').is(":checked") == true) ){
                alert("공유 체크박스에 체크를 해주세요.");
                return;
            }
            livereLib.fire( function() {
                livereLib.processing = true;

                if( jQuery('#livere_description_1').length > 0 ) {
                    var description =  jQuery('.livere_choiceImg:checked').attr('id');
                    description = description.split("_")[2];
                    description = "livere_description_"+description;
                    description = jQuery("#"+description).val();
                    livereReply.desc    = description;
                }

                if( jQuery('#livere_choiceImg1').length > 0 ) {
                    var posting_img_url =  jQuery('.livere_choiceImg:checked').attr('id');
                    posting_img_url = posting_img_url.split("_")[2];
                    posting_img_url = "livere_choiceImg"+posting_img_url;
                    posting_img_url = jQuery("#"+posting_img_url).attr("src");
                    livereReply.logo    = posting_img_url;
                }

                if( jQuery(".livere_choiceSWF").length > 0 ) {
                    var posting_swf_url =  jQuery('.livere_choiceImg:checked').attr('id');
                    posting_swf_url = posting_swf_url.split("_")[2];
                    posting_swf_url = "livere_choiceSWF"+posting_swf_url;
                    posting_swf_url = jQuery("#"+posting_swf_url).attr("value");
                    livereReply.videosrc    = posting_swf_url;
                }

                if( jQuery(".livere_choiceSWFThumb").length > 0 ) {
                    var posting_swf_thumb_url =  jQuery('.livere_choiceImg:checked').attr('id');
                    posting_swf_thumb_url = posting_swf_thumb_url.split("_")[2];
                    posting_swf_thumb_url = "livere_choiceSWFThumb"+posting_swf_thumb_url;
                    posting_swf_thumb_url = jQuery("#"+posting_swf_thumb_url).attr("value");
                    livereReply.videothumb = posting_swf_thumb_url;
                }

                livereReply.writeHooker( function() {
                    jQuery("<input />").attr( { id : "info3", name : "info3" } ).attr("value" , jQuery('.livere_choiceImg:checked').attr('id').split("_")[2] ).attr("type","hidden").appendTo( "#livereWriteParamsForm" );
                } );

                livereReply.writeHooker( function() {
                    jQuery("#info3").remove();
                    jQuery(".livere_choiceImg").attr("checked", false);
                } , true );

                livereReply.write();
            }, "processing" );
        } else {
            alert( livereReply.choicePostingImg.message[0] );
            return false;
        }
    } );
};