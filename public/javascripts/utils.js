//https://www.quirksmode.org/js/cookies.html
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/aerie";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999; path=/aerie';  
}

function createToast(title, text, delay){
    if(!delay)
        delay = 3500;
    let toast = $('#toast-template').clone();
    toast.removeAttr('id').data('delay', delay).find('.toast-title').text(title);
    toast.find('.toast-body').text(text);
    toast.appendTo('#toast-wrapper');

    setTimeout( () => {
        toast.toast('show');
        setTimeout( ()=>{
            toast.remove();
        }, delay+1000);
    }, 100);
}