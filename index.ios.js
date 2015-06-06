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



  var DAILY = '@GV:daily';

  var DATA = [{ger: "abgehen", eng: "to depart (by train, bus), leave (the state)", list: 0, points:0},
    {ger:"angehen", eng: "to begin", list: 0, points: 0},
    {ger: "auf-gehen", eng: "to rise (of celestial bodies), to (come) upon", list:0, points:0} ];

//class Main extends React.Component {
class GermanVocab1 extends React.Component {
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


var GermanVocab = React.createClass({


  getInitialState: function() {
    return {
      selectedValue: 'daily',
      selectedTab: 'review',
      notifCount: 0,
      presses: 0,
    };
  },

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




  saveList(name, list) {
    var key = "@GV:" + name;
    list = JSON.stringify(list);
    AsyncStorage.setItem(name, list)
    .then(() => console.log('Saved selection to disk: ' + list))
    .catch((error) => console.log('AsyncStorage error: ' + error.message))
    .done();
  },


    onSelectChange(selectedValue) {
      this.setState({selectedValue});

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
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
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

  }
});



AppRegistry.registerComponent('GermanVocab', () => GermanVocab);

