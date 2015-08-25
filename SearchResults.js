'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  ListView,
  Text,
  Component
} = React;

var SearchResults = React.createClass({
  // get results from parent properties, add 'unselected' to each one,
  // make result the datasource for list
  rowData: [],

  getInitialState: function() {
      this.rowData = this.props.listings.map(function (a) {
      a.push("unselected");
      return a});
  var ds = new ListView.DataSource({rowHasChanged: (r1, r2) =>  true});
  return {
    dataSource: ds.cloneWithRows(this.rowData)
  }},

  rowPressed(rowID) {
    // toggles selected on element in rowData and assigns that data as datasource for list
    var sel = this.rowData[rowID][2];
    var clone = this.rowData.slice(0);
    clone[rowID][2] = sel === "selected" ?  "unselected" : "selected";
    this.props.onResultsToggle(rowID); // sends rowID to SearchPage
    this.setState({dataSource: this.state.dataSource.cloneWithRows(clone)});
  },

  isSelected(s) {
    return s == "selected" ? true : false;
  },

  renderRow(rowData, sectionID, rowID) {
    var rowStyle =  this.isSelected(rowData[2]) ? styles.rowContainerSelected : styles.rowContainer;
    return (
        <TouchableHighlight onPress={() => this.rowPressed(rowID)}
        underlayColor='#dddddd'>
      <View>
        <View style={rowStyle}>
          <View  style={styles.textContainer}>
           <Text style={styles.german}>{rowData[0]} </Text>
            <Text style={styles.english}>{rowData[1]} </Text>
          </View>
        </View>
        <View style={styles.separator}/>
      </View>
    </TouchableHighlight>
    );
  },

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}/>
    );
  }
});

var styles = StyleSheet.create({
  textContainer: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  german: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#48BBEC'
  },
  english: {
    fontSize: 17,
    color: '#656565'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFFFFF'
  },

  rowContainerSelected: {
    backgroundColor: "#333",// '#F5FCFF',
    flexDirection: 'row',
    padding: 10
  }
});

module.exports = SearchResults;
