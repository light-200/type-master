import { getUserData } from "./localstorage"
import { routs, saveStatsBtn } from './ui'

const handleProfile = (element) => {
    let user = getUserData();
    routs.childNodes.forEach(e => {
        if (!e.classList) {
            return
        }
        if (e == element) {
            e.classList.remove('hide')
            if (e.classList.contains('stats') && user) {
                saveStatsBtn.classList.remove('hide')
            } else {
                saveStatsBtn.classList.add('hide')
            }
        } else {
            !e.classList.contains('hide') && e.classList.add('hide');
        }
    })
}

export default handleProfile;