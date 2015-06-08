'use strict';

var React = require('react-native');

var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  Component,
  AsyncStorage,
  NavigatorIOS,
  PickerIOS
} = React;

var PickerItemIOS = PickerIOS.Item;
var LISTS = ['daily', 'weekly', 'monthy', 'yearly'];
var DAILY = '@GV:daily';
var DATA = [{ger: "abgehen", eng: "to depart (by train, bus), leave (the state)", list: 0, points:0},
    {ger:"angehen", eng: "to begin", list: 0, points: 0},
    {ger: "auf-gehen", eng: "to rise (of celestial bodies), to (come) upon", list:0, points:0} ];


function makeKey(name) {
  return "@GV:" + name
}

var QuizPage = React.createClass({
  render() {
    return (<NavigatorIOS
            style={styles.body}
            initialRoute={{
            title: 'Review',
            component: Select,
            }}/>
           )}
});

var Select = React.createClass({

  getInitialState() {
    return {selectedValue: 'daily'}},

  goToQuiz() {
    var o = {title: 'Quiz Me', // TODO: Make dynamic
             component: Quiz,
             passProps: {listName: this.state.selectedValue,
                         list: [],
                         saveList: "saveList"}};
    var key = makeKey(this.state.selectedValue);
    AsyncStorage.getItem(key)
    .then((value) => {
      if (value !== null){
        value = JSON.parse(value);
        o.passProps.list = value;
        this.props.navigator.push(o);
      } else {
        console.log('No selection found on disk.');
        return null;
      }})
    .catch((error) => console.log('AsyncStorage error: ' + error.message))
    .done();
  },

  onSelectChange(selectedValue) {
    this.setState({selectedValue});
  },

  render(){
    return (
      <View style={styles.body}>
      <Text style={styles.welcome}>Select a list to review</Text>
      <PickerIOS
        selectedValue={this.state.selectedValue}
        onValueChange={this.onSelectChange}>
        {LISTS.map(value => (
        <PickerItemIOS
        key={value}
        value={value}
        label={value}
      />
    ))}
    </PickerIOS>
      <View style={styles.buttonView}>
         <TouchableHighlight style={styles.button}
           underlayColor='#99d9f4'
           onPress={this.goToQuiz}>
          <Text style={styles.buttonText}>Review</Text>
         </TouchableHighlight>
       </View>
      </View>
  )}
});

var Quiz = React.createClass({

  result: [],

  getInitialState() {
    return {current: 0,
            ger: true,
            list: [],
           };
  },


  saveList() {
    var key = "@GV:" + this.props.listName;
    var list = JSON.stringify(this.result);
    console.log(this.state.result);
    AsyncStorage.setItem(key, list)
    .then(() => console.log('Saved selection to disk: ' + list))
    .catch((error) => console.log('AsyncStorage error: ' + error.message))
    .done();

    this.props.navigator.pop();
  },

  reveal() {
    this.setState({ger: false})
  },

  gotIt () {
    var word = this.props.list[this.state.current];
    word.points++
    this.result.push(word);
    this.setState({ current: this.state.current + 1, ger: true});
  },

  notYet() {
    var word = this.props.list[this.state.current];
    this.setState({ current: this.state.current + 1, ger: true});
    this.result.push(word);
  },

  render() {
    console.log(this.props.saveList);
    if (this.state.current === this.props.list.length) {
      return (
        <View style={styles.buttonView}>
        <TouchableHighlight style={styles.button}
          underlayColor='#99d9f4'
          onPress={this.saveList} >
        <Text style={styles.container}>Save</Text>
        </TouchableHighlight>
        </View>
      )
    } else {
      var card = this.props.list[this.state.current];
      var word = this.state.ger ? card.ger : card.eng;
      return (
        <View style={styles.container}>
        <View style={styles.card}>
        <Text numberOfLines={2} ref="definition" style={styles.definition}>{word}</Text>
        </View>
        {this.state.ger ? <RevealButton  fun={this.reveal}/> : <ResultButtons gotIt={this.gotIt} notYet={this.notYet} />}
        </View>
      );
    }
  }
});

var ResultButtons = React.createClass({
  render() {
    return (
      <View style={styles.buttons}>
      <TouchableHighlight style={styles.button}
      underlayColor='#99d9f4'
      onPress={this.props.gotIt}>
      <Text style={styles.buttonText}>Got it</Text>
      </TouchableHighlight>

      <TouchableHighlight style={styles.button}
      underlayColor='#99d9f4'
      onPress={this.props.notYet}>
      <Text style={styles.buttonText}>Not yet</Text>
      </TouchableHighlight>
      </View>
    )}
});

var RevealButton = React.createClass({
  render(){
    return (
      <View style={styles.buttonView}>
      <TouchableHighlight style={styles.button}
      underlayColor='#99d9f4'
      onPress={this.props.fun} >
      <Text style={styles.buttonText}>Show English</Text>
      </TouchableHighlight>
      </View>
    )}
});



var styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  container: {
    backgroundColor: '#F5FCFF',
    padding: 20,
    marginTop: 65,
    alignItems: 'center',
    flex: 1
  },
  card: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: "black",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: {
      height: 0,
      width: 0
    },
    width: 290,
    height: 290,
  },
  definition: {
    fontSize: 20,
    textAlign: 'center',
  },

  button: {
    flex: 1,
     padding: 15,
    height:50,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'center',

  },
  buttonView: {
    marginTop: 20,
   // height: 40,
   // width: 80,
    alignItems: 'flex-end',
    justifyContent: 'center'

  },

  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  buttons: {
    flex: 1,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  }
});

module.exports = QuizPage;
