import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase/config';  //make this module by yourself that exports your firebase config object 
import getText from './getText';




initializeApp(firebaseConfig);



getText();