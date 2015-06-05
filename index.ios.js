'use strict';

// TODO: Replace AsyncStorage with sqlite: http://herman.asia/building-a-flashcard-app-with-react-native

var React = require('react-native');
var SearchPage = require('./SearchPage');
var ReviewPage = require('./ReviewPage');
var QuizPage = require('./QuizPage');

var {
  AppRegistry,
  AsyncStorage,
  NavigatorIOS,
  PickerIOS,
  StyleSheet,
  TabBarIOS,
  Text,
  TouchableHighlight,
  View,
} = React;

  var PickerItemIOS = PickerIOS.Item;

  var DAILY = '@GV:daily';
  var LISTS = ['daily', 'weekly', 'monthy', 'yearly'];
  var DATA = [{ger: "abgehen", eng: "to depart (by train, bus), leave (the state)", list: 0, points:0},
    {ger:"angehen", eng: "to begin", list: 0, points: 0},
    {ger: "auf-gehen", eng: "to rise (of celestial bodies), to (come) upon", list:0, points:0} ];


class GermanVocab extends React.Component {
  render() {
    return (
      <NavigatorIOS
      style={styles.body}
      initialRoute={{
      title: 'My German Vocab',
      component: Main,
      }}/>
    );
  }
}



var Main = React.createClass({

  componentDidMount() {
    // fetch list from disk, set retrieved data to currentList
  //  this.saveList("daily", JSON.stringify(DATA));
    AsyncStorage.getItem(DAILY)
    .then((value) => {
      if (value !== null){
        value = JSON.parse(value);
        console.log('Data from disk: ' + JSON.stringify(value));
        this.setState({currentList: value});
      } else {
        console.log('No selection found on disk.');
        this.setState({currentList: DATA});
      }
    })
    .catch((error) => console.log('AsyncStorage error: ' + error.message))
    .done();

  },
  // fetches list and sets result to currentList
  fetchList(l) {
    AsyncStorage.getItem(l)
    .then((value) => {
      if (value !== null){
        return value = JSON.parse(value);
        console.log('Data from disk: ' + JSON.stringify(value));
      } else {
        console.log('No selection found on disk.');
        return null;
      }})
    .catch((error) => console.log('AsyncStorage error: ' + error.message))
    .done();
  },


  goToSearch() {
    var o = {title: 'Search',
             component: SearchPage,
             passProps: {save: this.saveToDaily}};
    this.props.navigator.push(o); },

  goToReview() {
    var o = {title: 'Daily', // TODO: Make dynamic
             component: ReviewPage,
             passProps: {list: this.state.currentList}};
    this.props.navigator.push(o);},

  goToQuiz() {
    var o = {title: 'Quiz Me', // TODO: Make dynamic
             component: QuizPage,
             passProps: {listName: LISTS[0],
                         list: this.state.currentList,
                         saveList: saveList}};
    this.props.navigator.push(o); },

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
    AsyncStorage.getItem(DAILY)
    .then((value) => {
      value = JSON.parse(value);
      value = value.concat(words);
      this.saveList(DAILY, value)})
    .catch((error) => console.log('AsyncStorage saveToDaily error: ' + error.message))
    .done();
  },

  //   _onValueChange(selectedValue) {
  //     this.setState({selectedValue});
  //     AsyncStorage.setItem(DAILY, selectedValue)
  //       .then(() => console.log('Saved selection to disk: ' + selectedValue))
  //       .catch((error) => console.log('AsyncStorage error: ' + error.message))
  //         .done();
  //   },

  _removeStorage() {
    AsyncStorage.removeItem(DAILY)
    .then(() => this._appendMessage('Selection removed from disk.'))
    .catch((error) => { this._appendMessage('AsyncStorage error: ' + error.message) })
    .done();
  },

  render() {
    return (
      <View style={styles.container}>

      <TouchableHighlight style={styles.body}
      onPress={this.goToSearch}
      underlayColor='#99d9f4'>
      <Text style={styles.welcome}>Search</Text>
      </TouchableHighlight>

      <TouchableHighlight style={styles.body}
      onPress={this.goToReview}
      underlayColor='#99d9f4'>
      <Text style={styles.welcome}>Review</Text>
      </TouchableHighlight>

      <TouchableHighlight style={styles.body}
      onPress={this.goToQuiz}
      underlayColor='#99d9f4'>
      <Text style={styles.welcome}>Quiz</Text>
      </TouchableHighlight>


      </View>
    );
  },
});

var styles = StyleSheet.create({
  body: {
    flex: 1,
    //    justifyContent: 'center',
    //    alignItems: 'center',
  },
  container: {
    backgroundColor: '#F5FCFF',
    padding: 30,
    marginTop: 65,
    alignItems: 'center',
    flex: 1
  },
  welcome: {
    fontSize: 20,
    color: '#656565',
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  text: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 30,
    margin: 80
  }
});

AppRegistry.registerComponent('GermanVocab', () => GermanVocab);
//   <PickerIOS
// selectedValue={list}
// onValueChange={this._onValueChange}>
//   {LISTS.map((value) => (
//       <PickerItemIOS
//         key={value}
//         value={value}
//         label={value}
//       />))}
// </PickerIOS>
//   <View >
//     <Text  style={styles.instructions}>
//       {'Selected: '}
//     <Text>
//       {this.state.selectedValue}
//     </Text>
//     </Text>
//   <Text>{' '}</Text>
//   <Text onPress={this._removeStorage}>
//   Press here to remove from storage.
//   </Text>
