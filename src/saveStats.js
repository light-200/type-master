import {saveAs} from 'file-saver';
import domtoimage from 'dom-to-image';
let stats = document.querySelector('.stats');

function saveStats(){
    domtoimage.toBlob(stats).then( (blob)=>{
        window.saveAs(blob, "stats.png")
    })
}

export default saveStats; 