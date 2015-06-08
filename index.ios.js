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
  StyleSheet,
  TabBarIOS,
  Text,
  TouchableHighlight,
  View
} = React;


var GermanVocab = React.createClass({

  getInitialState: function() {
    return {
      selectedValue: 'daily',
      selectedTab: 'review',
      notifCount: 0,
      presses: 0,
    };
  },


  saveList(name, list) {
    var key = "@GV:" + name;
    list = JSON.stringify(list);
    AsyncStorage.setItem(name, list)
    .then(() => console.log('Saved selection to disk: ' + list))
    .catch((error) => console.log('AsyncStorage error: ' + error.message))
    .done();
  },


  _removeStorage() {
    AsyncStorage.removeItem(DAILY)
    .then(() => this._appendMessage('Selection removed from disk.'))
    .catch((error) => { this._appendMessage('AsyncStorage error: ' + error.message) })
    .done();
  },

  render() {
      return (
          <TabBarIOS
        tintColor="black"
        barTintColor="#3abeff">
        <TabBarIOS.Item
          title="Search"
          icon={{uri:'search'}}
          selected={this.state.selectedTab === 'search'}
          onPress={() => {
            this.setState({
              selectedTab: 'search',
            });
          }}>
          <SearchPage />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          systemIcon="history"
          badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
          selected={this.state.selectedTab === 'review'}
          onPress={() => {
            this.setState({
              selectedTab: 'review',
              notifCount: this.state.notifCount + 1,
            });
          }}>
          <QuizPage />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          systemIcon="more"
          selected={this.state.selectedTab === 'greenTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'greenTab',
              presses: this.state.presses + 1
            });
          }}>
          <Text>Green Tab</Text>
        </TabBarIOS.Item>
      </TabBarIOS>
    )
  },
});




var styles = StyleSheet.create({
  body: {
    paddingTop: 40,
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
    backgroundColor: '#F5FCFF',
    color: '#656565',
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 2,
    backgroundColor: 'white',
  },
  text: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 30,
    margin: 80
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: 'white',
    margin: 50,
  },

});



AppRegistry.registerComponent('GermanVocab', () => GermanVocab);

