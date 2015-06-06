'use strict';

var React = require('react-native');


class Storage {
  formatWords(words) {
    return words.map(function(w){
      var dict = {};
      dict.list = 0;
      dict.points = 0;
      dict.ger = w[0];
      dict.eng = w[1];
      return dict;})
  },

  saveList(name, list) {
    var key = "@GV:" + name;
    list = JSON.stringify(list);
    AsyncStorage.setItem(name, list)
    .then(() => console.log('Saved selection to disk: ' + list))
    .catch((error) => console.log('AsyncStorage error: ' + error.message))
    .done();
  },

  saveToDaily(words) {
    words = this.formatWords(words);
    AsyncStorage.getItem('@GV:daily')
    .then((value) => {
      value = JSON.parse(value);
      value = value.concat(words);
      this.saveList(DAILY, value)})
    .catch((error) => console.log('AsyncStorage saveToDaily error: ' + error.message))
    .done();
  },


}




module.exports = saveToDaily;
