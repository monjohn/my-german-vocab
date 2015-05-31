'use strict';

var React = require('react-native');

var {
  AsyncStorage,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image,
  Component
} = React;



var ReviewPage = React.createClass( {
  getInitialState() {
    return { current: 0};
  },
 
  nextWord() {
   this.setState({ current: this.state.current + 1 }); 
  },
  notYet() {
    this.replaceState({ current: this.state.current + 1, ger: true }); 
  },
  render() {
    var current = this.state.current;

    var card;
      if (this.state.current < this.props.list.length) {
          card = this.props.list[this.state.current];
        } else {
          card = {ger: "Finished", eng: "end of list"}
        }
   
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text numberOfLines={2} ref="definition" style={styles.definition}>{card.ger}</Text>
          <Text numberOfLines={1}>{card.eng}</Text>
        </View>
        <View style={styles.buttons}>
        <TouchableHighlight style={styles.button}
           underlayColor='#99d9f4'
           onPress={this.nextWord}>
        <Text style={styles.buttonText}>next</Text>
        </TouchableHighlight>

      </View>
      </View>
    );
  }
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

module.exports = ReviewPage;
