'use strict';

var React = require('react-native');

var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  Component
} = React;

var QuizPage = React.createClass({
  result: [],
   getInitialState() {
    return {current: 0, ger: true};
  },
  saveList() {
    var result = this.result;
    //result = result.filter((x) => (x !== null));
    // console.log("saving: " + JSON.stringify(result));
    this.props.saveList(this.props.listName, result);
    this.props.navigator.pop();
  },
  reveal() {
    this.setState({ger: false})},
  gotIt () {
    var word = this.props.list[this.state.current];
    word.points++
    this.result.push(word);
    this.setState({ current: this.state.current + 1, ger: true});
  },
  notYet() {
    this.setState({ current: this.state.current + 1, ger: true});
    this.result.push(this.props.list[this.state.current]);
  },
  render() {
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
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    flex: 1,
    width: 100,
    padding: 15,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    marginHorizontal: 20,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  buttons: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around'}
});

module.exports = QuizPage;
