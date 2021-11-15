/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/script.js":
/*!***********************!*\
  !*** ./src/script.js ***!
  \***********************/
/***/ (() => {

eval("const textContainer = document.querySelector(\".text\");\r\nconst words = document.querySelector(\".words\");\r\nconst speed = document.querySelector(\".speed\");\r\nvar totalWords = 0;\r\nvar text = \"\";\r\n\r\nconst getText = async () => {\r\n    //call the api here \r\n    const url = \"https://api.quotable.io/random\";\r\n    const data = await fetch(url).then(response => response.json()).then(data =>{ return data; } ).catch(error =>console.error(error));\r\n    // console.log(data);\r\n    text = textContainer.innerText = data.content;\r\n    setWords();\r\n    spanWrap();\r\n    start();\r\n}\r\n\r\nconst speedCalc = (totalWords, seconds) =>{\r\n    var minutes = seconds.toPrecision(2) / 60;\r\n    // console.log( totalWords , \" \" , minutes.toPrecision(2))\r\n    let tempSpeed = totalWords / minutes;\r\n    speed.innerText = Math.floor(tempSpeed.toPrecision(3));\r\n\r\n    // add a function to change the text here \r\n    setTimeout(() => {\r\n        getText();\r\n    }, 500);\r\n}\r\n\r\n//wraps all words in a span tag\r\nconst spanWrap = () => {\r\n    let newArr = [];\r\n    for(let i=0; i<text.length; i++){\r\n        newArr.push(`<span>${text[i]}</span>`);\r\n    };\r\n    let newText = newArr.join('');\r\n    textContainer.innerHTML = newText;\r\n}\r\n\r\n//sets total word value\r\nconst setWords = (typedWords = 0) => {\r\n    let whitespace = / /g,result,indices = [];\r\n    while(result = whitespace.exec(text)){\r\n        indices.push(result.index);\r\n    }\r\n    totalWords = indices.length + 1;\r\n\r\n    words.innerText = `${totalWords}/${typedWords}`;\r\n}\r\n// listents to the keyboard\r\nconst start = () => {\r\n    let firstCall = true;\r\n    let tempText = text;\r\n    let index = 0;\r\n    let typedWords = 0;\r\n    let start , end;\r\n    let Words = document.querySelectorAll(\".text>span\");\r\n    document.addEventListener('keypress' , (e)=>{\r\n        \r\n        if(e.key === tempText[0]){\r\n            if(firstCall){\r\n              start =  new Date().getTime();\r\n            //   console.log(start)\r\n              firstCall = false;\r\n            }\r\n            tempText = tempText.substr(1);\r\n\r\n           \r\n            Words[index].style.color = \"#ffd549\";\r\n            // console.log(tempText[0]);  gives the next word to type\r\n            // console.log(Words[index]); gives the current element in html\r\n            \r\n            if(tempText[0]== ' ' || tempText[0] == null){\r\n                ++typedWords;\r\n                setWords(typedWords);\r\n            }\r\n\r\n            if(index == text.length - 1){\r\n                end = new Date().getTime();\r\n               speedCalc(totalWords,(end-start)/1000)\r\n            }\r\n            \r\n            index++;\r\n        } else {\r\n            if(Words[index + 1] != null){\r\n                Words[index].style.color = \"#ff324d\";\r\n            }\r\n        }\r\n    })\r\n\r\n}\r\n\r\ngetText();\n\n//# sourceURL=webpack://type-master/./src/script.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/script.js"]();
/******/ 	
/******/ })()
;