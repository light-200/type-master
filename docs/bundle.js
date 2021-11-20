/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/getText.js":
/*!************************!*\
  !*** ./src/getText.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   \"text\": () => (/* binding */ text)\n/* harmony export */ });\n/* harmony import */ var _mainUi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mainUi */ \"./src/mainUi.js\");\n/* harmony import */ var _start__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./start */ \"./src/start.js\");\n\r\n\r\n\r\n\r\nconst textContainer = document.querySelector(\".text\");\r\nvar text;\r\n\r\n// this function is responsible for fetching the text from api\r\nconst getText = async () => {\r\n    //call the api here \r\n    const url = \"https://api.quotable.io/random\";\r\n    const data = await fetch(url).then(response => response.json()).then(data =>{ return data; } ).catch(error =>console.error(error));\r\n    // console.log(data);\r\n    text = textContainer.innerText = data.content;\r\n    (0,_mainUi__WEBPACK_IMPORTED_MODULE_0__[\"default\"])();\r\n    (0,_mainUi__WEBPACK_IMPORTED_MODULE_0__.spanWrap)(textContainer);\r\n    (0,_start__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(text);\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getText); \r\n\n\n//# sourceURL=webpack://type-master/./src/getText.js?");

/***/ }),

/***/ "./src/handleProfile.js":
/*!******************************!*\
  !*** ./src/handleProfile.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst routs = document.querySelector('.profile>.routs')\r\n\r\nconst handleProfile = (element)=>{\r\n    routs.childNodes.forEach(e => {\r\n        if(!e.classList){\r\n            return\r\n        }\r\n        if(e == element){\r\n            e.classList.remove('hide')\r\n        } else{\r\n            !e.classList.contains('hide') && e.classList.add('hide');\r\n        }\r\n    })\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (handleProfile);\n\n//# sourceURL=webpack://type-master/./src/handleProfile.js?");

/***/ }),

/***/ "./src/localstorage.js":
/*!*****************************!*\
  !*** ./src/localstorage.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getData\": () => (/* binding */ getData),\n/* harmony export */   \"setData\": () => (/* binding */ setData)\n/* harmony export */ });\nconst LOCAL_STORAGE_DATA = 'user.data';\r\nconst storage = window.localStorage;\r\n\r\nfunction getData() {\r\n      let data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA));\r\n      return  data || { };\r\n}\r\n\r\nfunction setData(data) {\r\n    localStorage.setItem(LOCAL_STORAGE_DATA, JSON.stringify(data));\r\n    return data;\r\n} \r\n\r\n\n\n//# sourceURL=webpack://type-master/./src/localstorage.js?");

/***/ }),

/***/ "./src/mainUi.js":
/*!***********************!*\
  !*** ./src/mainUi.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   \"spanWrap\": () => (/* binding */ spanWrap),\n/* harmony export */   \"totalWords\": () => (/* binding */ totalWords),\n/* harmony export */   \"moveElement\": () => (/* binding */ moveElement),\n/* harmony export */   \"handleStats\": () => (/* binding */ handleStats)\n/* harmony export */ });\n/* harmony import */ var _getText__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getText */ \"./src/getText.js\");\n/* harmony import */ var _handleProfile__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./handleProfile */ \"./src/handleProfile.js\");\n/* harmony import */ var _localstorage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./localstorage */ \"./src/localstorage.js\");\n/* harmony import */ var _script__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./script */ \"./src/script.js\");\n\r\n\r\n\r\n\r\nconst words = document.querySelector(\".words\");\r\nconst profile = document.querySelector(\".profile\")\r\nconst dragProfile = document.querySelector('.profile>.top>.move')\r\nconst profileButton = document.querySelector(\".profileBtn\")\r\nconst stats = document.querySelector('.profile>.routs>.stats')\r\nconst signupBtn = document.querySelector('.profile>.top>.options>.signupBtn')\r\n\r\nvar totalWords;\r\n\r\n//sets total word value\r\nconst setWords = (typedWords = 0) => {\r\n    let whitespace = / /g,result,indices = [];\r\n    while(result = whitespace.exec(_getText__WEBPACK_IMPORTED_MODULE_0__.text)){\r\n        indices.push(result.index);\r\n    }\r\n    totalWords = indices.length + 1;\r\n    words.innerText = `${totalWords}/${typedWords}`;\r\n}\r\n\r\n//wraps all words in a span tag\r\nconst spanWrap = (textContainer) => {\r\n    let newArr = [];\r\n    for(let i=0; i<_getText__WEBPACK_IMPORTED_MODULE_0__.text.length; i++){\r\n        newArr.push(`<span>${_getText__WEBPACK_IMPORTED_MODULE_0__.text[i]}</span>`);\r\n    };\r\n    let newText = newArr.join('');\r\n    textContainer.innerHTML = newText;\r\n    \r\n}\r\n\r\nprofileButton.addEventListener('click',()=>{\r\n    profile.classList.toggle('hide')\r\n    if((0,_localstorage__WEBPACK_IMPORTED_MODULE_2__.getData)()){\r\n        signupBtn.innerText = 'update'\r\n    }\r\n})\r\n\r\n//event listener for close button on the profile window\r\nprofile.addEventListener('click',(e)=> {\r\n    e.target.classList.contains('close') && profile.classList.toggle('hide');\r\n})\r\n\r\ndragProfile.addEventListener('drag',(e)=>{\r\n    let element =  profile;\r\n    element.style.filter = 'brightness(.7)';\r\n})\r\n\r\ndragProfile.addEventListener('dragend',(e)=>{\r\n    let element =  profile;\r\n    element.style.filter = 'brightness(1)';\r\n    moveElement(e,element);\r\n})\r\n\r\nconst handleStats = (user) => {\r\n    if (user){\r\n        stats.childNodes.forEach((element)=>{\r\n            if(!element.classList){\r\n                return\r\n            } else if(element.classList.contains('name')){\r\n                element.innerText = user.userName ;\r\n            } else if(element.classList.contains('topSpeed')){\r\n                element.innerText = 'topspeed: ' + user.topSpeed; \r\n            }\r\n        })\r\n        ;(0,_handleProfile__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(stats)\r\n    } else {\r\n        (0,_handleProfile__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(_script__WEBPACK_IMPORTED_MODULE_3__.signupForm)\r\n    }\r\n    return user;\r\n}\r\n\r\nconst moveElement = (e,element)=>{\r\n    element.style.left =  (e.pageX - 20) +'px';\r\n    element.style.top =  (e.pageY - 20)+'px';\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (setWords);\r\n\r\n\r\n\n\n//# sourceURL=webpack://type-master/./src/mainUi.js?");

/***/ }),

/***/ "./src/script.js":
/*!***********************!*\
  !*** ./src/script.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"signupForm\": () => (/* binding */ signupForm),\n/* harmony export */   \"stats\": () => (/* binding */ stats)\n/* harmony export */ });\n/* harmony import */ var _getText__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getText */ \"./src/getText.js\");\n/* harmony import */ var _handleProfile__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./handleProfile */ \"./src/handleProfile.js\");\n/* harmony import */ var _localstorage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./localstorage */ \"./src/localstorage.js\");\n/* harmony import */ var _mainUi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./mainUi */ \"./src/mainUi.js\");\n\r\n\r\n\r\n\r\n\r\nconst signupForm = document.querySelector('.profile>.routs>.signUp')\r\nconst signupBtn = document.querySelector('.profile>.top>.options>.signupBtn')\r\nconst stats = document.querySelector('.profile>.routs>.stats')\r\n\r\n\r\n//signupform form handler\r\nsignupForm.addEventListener('submit',(e)=>{\r\n    e.preventDefault();\r\n    let oldData = (0,_localstorage__WEBPACK_IMPORTED_MODULE_2__.getData)().topSpeed || 0;\r\n    let data = {\r\n        userName : e.target.username.value,\r\n        topSpeed : oldData\r\n    }\r\n    data = (0,_localstorage__WEBPACK_IMPORTED_MODULE_2__.setData)(data)\r\n    ;(0,_mainUi__WEBPACK_IMPORTED_MODULE_3__.handleStats)(data)\r\n})\r\n\r\n\r\nsignupBtn.addEventListener('click',()=>{\r\n    ;(0,_handleProfile__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(signupForm);\r\n})\r\n\r\n;(0,_getText__WEBPACK_IMPORTED_MODULE_0__[\"default\"])();\r\n\r\n\n\n//# sourceURL=webpack://type-master/./src/script.js?");

/***/ }),

/***/ "./src/speed.js":
/*!**********************!*\
  !*** ./src/speed.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   \"speed\": () => (/* binding */ speed)\n/* harmony export */ });\n/* harmony import */ var _getText__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getText */ \"./src/getText.js\");\n/* harmony import */ var _localstorage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./localstorage */ \"./src/localstorage.js\");\n\r\n\r\n\r\nconst speedIndicator = document.querySelector(\".speed\");\r\nvar speed;\r\n\r\n// this function is responsible for calculating the speed \r\nconst speedCalc = (totalWords, seconds) =>{\r\n    var minutes = seconds.toPrecision(2) / 60;\r\n    // console.log( totalWords , \" \" , minutes.toPrecision(2))\r\n    let tempSpeed = totalWords / minutes;\r\n    speed = Math.floor(tempSpeed.toPrecision(3));\r\n    speedIndicator.innerText = speed;\r\n\r\n    let user = (0,_localstorage__WEBPACK_IMPORTED_MODULE_1__.getData)()\r\n    if(speed>user.topSpeed){\r\n        user = {...user,topSpeed: speed};\r\n        (0,_localstorage__WEBPACK_IMPORTED_MODULE_1__.setData)(user)\r\n    }\r\n\r\n    // add a function to change the text here \r\n    setTimeout(() => {\r\n        (0,_getText__WEBPACK_IMPORTED_MODULE_0__[\"default\"])();\r\n    }, 500);\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (speedCalc);\r\n\n\n//# sourceURL=webpack://type-master/./src/speed.js?");

/***/ }),

/***/ "./src/start.js":
/*!**********************!*\
  !*** ./src/start.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _mainUi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mainUi */ \"./src/mainUi.js\");\n/* harmony import */ var _speed__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./speed */ \"./src/speed.js\");\n\r\n\r\n\r\n\r\n// listents to the keyboard\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((text) => {\r\n    let firstCall = true;\r\n    // this tempText will be reduced by one word as we type the word \r\n    let tempText = text;\r\n    let index = 0;\r\n    let typedWords = 0;\r\n    let start , end;\r\n    let Words = document.querySelectorAll(\".text>span\");\r\n    document.addEventListener('keypress' , (e)=>{\r\n        \r\n        if(e.key === tempText[0]){\r\n            if(firstCall){\r\n              start =  new Date().getTime();\r\n            //   console.log(start)\r\n              firstCall = false;\r\n            }\r\n            tempText = tempText.substr(1);\r\n\r\n           \r\n            Words[index].style.color = \"#ffd549\";\r\n            // console.log(tempText[0]);  gives the next word to type\r\n            // console.log(Words[index]); gives the current element in html\r\n            \r\n            if(tempText[0]== ' ' || tempText[0] == null){\r\n                ++typedWords;\r\n                (0,_mainUi__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(typedWords);\r\n            }\r\n\r\n            if(index == text.length - 1){\r\n                end = new Date().getTime();\r\n               (0,_speed__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(_mainUi__WEBPACK_IMPORTED_MODULE_0__.totalWords,(end-start)/1000)\r\n            }\r\n            \r\n            index++;\r\n        } else {\r\n            if(Words[index + 1] != null){\r\n                Words[index].style.color = \"#ff324d\";\r\n            }\r\n        }\r\n    })\r\n\r\n});\r\n\r\n\n\n//# sourceURL=webpack://type-master/./src/start.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/script.js");
/******/ 	
/******/ })()
;