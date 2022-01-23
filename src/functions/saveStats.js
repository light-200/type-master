import { saveAs } from "file-saver";
import domtoimage from "dom-to-image";
import { stats } from "../ui/uiElements";

function saveStats() {
  domtoimage.toBlob(stats).then((blob) => {
    window.saveAs(blob, "stats.png");
  });
}

export default saveStats;
