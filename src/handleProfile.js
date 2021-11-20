const routs = document.querySelector('.profile>.routs')

const handleProfile = (element)=>{
    routs.childNodes.forEach(e => {
        if(!e.classList){
            return
        }
        if(e == element){
            e.classList.remove('hide')
        } else{
            !e.classList.contains('hide') && e.classList.add('hide');
        }
    })
}

export default handleProfile;