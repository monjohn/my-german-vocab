'use strict';

var React = require('react-native');
var SearchResults = require('./SearchResults');

var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image,
  Component
} = React;


var SearchPage = React.createClass({
  getInitialState: function() {
    return {
      searchString: 'ergehen',
      isLoading: false,
      words: [],
      selected: []
    }
  },

  render() {
  var spinner = this.state.isLoading ?
  ( <ActivityIndicatorIOS
  hidden='true'
  size='large'/> ) :( <View/>);
  return (
  <View style={styles.container}>
    <Text style={styles.description}>
      Search Dictionary for German Word
      </Text>
      <View style={styles.flowRight}>
        <TextInput
      style={styles.searchInput}
      value={this.state.searchString}
      onChange={this.onSearchTextChanged}
      placeholder='Enter German Word'/>
        <TouchableHighlight style={styles.button}
        underlayColor='#99d9f4'
        onPress={this.onSearchPressed}>
          <Text style={styles.buttonText}>Go</Text>
          </TouchableHighlight>
          {spinner}</View></View>
            );
},

displayWords(words) {
  this.props.navigator.push({
    title: 'Results',
    component: SearchResults,
    rightButtonTitle: 'Save',
    onRightButtonPress: () => {this.props.navigator.pop();
                              this.saveWords()},
                              passProps: {listings: words, onResultsToggle: this.onResultsToggle}
                            });
  this.setState({isLoading: false , words: words });
},

onResultsToggle(rowID) {
  var selected = this.state.selected.slice(0);
  var found = selected.indexOf(rowID);
  if (found === -1) {
    selected.push(rowID)
    this.setState({selected: selected})
  } else {
    selected.splice(found,1);
    this.setState({selected: selected})
  }
  console.log("selected: " + selected);
},

saveWords() {
  // takes the indexes of selected words uses those to pull words from list,
  // sending that list to the parents save function
  var selectedWords = []
  for (var i = 0; i < this.state.selected.length; i++) {
    var index = this.state.selected[i];
    console.log("index" + this.state.words[index]);
    selectedWords.push(this.state.words[index])
  }
  this.props.save(selectedWords);
},

executeQuery(query) {
  this.setState({ isLoading: true });
  var url = "http://localhost:8080/json/" + query;
  fetch(url)
  .then(response => response.json())
  .then(json => this.displayWords(json))
  .catch(error =>
         this.setState({
           isLoading: false,
           message: 'Something bad happened ' + error
         }));
},

onSearchPressed() {
  var query = this.state.searchString;
  this.executeQuery(query);
},

onSearchTextChanged(event) {
  this.setState({ searchString: event.nativeEvent.text });
  // console.log(this.state.searchString);
}
});

var styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center'
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  searchInput: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC'
  }
});
module.exports = SearchPage;
