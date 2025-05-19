
document.addEventListener('DOMContentLoaded', ()=>{
    const path  = window.location.pathname;
    const body = document.body;

    if(path === '/login' || path === '/login/'){
        body.style.backgroundImage = 'url("/asset/login&signup/virtual-office-girl.svg")';
    }else if(path === '/signup' || path === '/signup/'){
        body.style.backgroundImage = 'url("/asset/login&signup/Collaborate-1.svg")';
        body.style.backgroundSize = '80% 80%';
        body.style.backgroundRepeat = 'no-repeat';
        body.style.backgroundPosition = 'center left';

    }
});