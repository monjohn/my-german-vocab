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
        console.log(o);
//        console.log('Data from disk: ' + JSON.stringify(value));
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
//    componentDidMount() {
//     // fetch list from disk, set retrieved data to currentList
//   //  this.saveList("daily", JSON.stringify(DATA));
//     AsyncStorage.getItem(DAILY)
//     .then((value) => {
//       if (value !== null){
//         value = JSON.parse(value);
//         console.log('Data from disk: ' + JSON.stringify(value));
//         this.setState({currentList: value});
//       } else {
//         console.log('No selection found on disk.');
//         this.setState({currentList: DATA});
//       }
//     })
//     .catch((error) => console.log('AsyncStorage error: ' + error.message))
//     .done();

//   },

  result: [],

  getInitialState() {
    return {current: 0,
            ger: true,
            list: [],
           // listName: "daily"
           };
  },


  saveList() {
    var result = this.result;
    //result = result.filter((x) => (x !== null));
    // console.log("saving: " + JSON.stringify(result));
    this.saveList(this.props.listName, result);
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
    this.setState({ current: this.state.current + 1, ger: true});
    this.result.push(this.state.list[this.state.current]);
  },

  render() {
    console.log(this.props.saveList);
    if (this.state.current === this.props.list.length) {
      return (
        <TouchableHighlight style={styles.button}
          underlayColor='#99d9f4'
          onPress={this.saveList} >
        <Text style={styles.buttonText}>Save</Text>
        </TouchableHighlight>
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
      <TouchableHighlight style={styles.button}
      underlayColor='#99d9f4'
      onPress={this.props.fun} >
      <Text style={styles.buttonText}>Show English</Text>
      </TouchableHighlight>
    )}
});



var styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  container: {
    backgroundColor: '#F5FCFF',
    padding: 30,
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
    fontSize: 30,
    textAlign: 'center',
  },

  button: {
    flex: 1,
     padding: 15,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  buttonView: {
    marginTop: 20,
   // height: 40,
   // width: 80,
  //  justifyContent: 'center'

  },

  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
//   button: {
//     height: 36,
//     flex: 1,
//     width: 100,
//     padding: 15,
//     flexDirection: 'row',
//     backgroundColor: '#48BBEC',
//     borderColor: '#48BBEC',
//     borderWidth: 1,
//     borderRadius: 8,
//     marginVertical: 10,
//     marginHorizontal: 20,
//     alignSelf: 'stretch',
//     justifyContent: 'center'
//   },
//   buttons: {
//     marginTop: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-around'}
});

module.exports = QuizPage;
