import { saveAs } from "file-saver";
import domtoimage from "dom-to-image-more";
import { stats } from "../ui/uiElements";
import { getUserData } from "../storage/localstorage";

function saveStats() {
  domtoimage.toBlob(stats).then(async (blob) => {
    let user = await getUserData();
    let name = user.userName + user.topSpeed;
    window.saveAs(blob, name);
  });
}

export default saveStats;
