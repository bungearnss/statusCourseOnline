import React, { Component } from 'react';
import { 
View, 
Text,
StyleSheet, 
Animated, 
Dimensions,
FlatList 
} from 'react-native';
import {FontAwesome5} from 'react-native-vector-icons';

const {width} = Dimensions.get("window");
const height = width * 0.3;
const numColumns = 1;
const WIDTH = Dimensions.get("window").width;

const dataArray = [
    {title: 'หลักสูตร 1', values: 20},
    {title: 'หลักสูตร 2', values: 50},
    {title: 'หลักสูตร 3', values: 10},
    {title: 'หลักสูตร Test', values: 0}
  ];

export default class StatusProgress extends Component {
  constructor(props) {
    super(props);
    this.state = {
        percent: 0
    };
  }

  formatData = (dataArray, numColumns) => {
    const totalRows = Math.floor(dataArray.length / numColumns);
    let totalLastRow = dataArray.length - totalRows * numColumns;

    while (totalLastRow !== 0 && totalLastRow !== numColumns) {
      dataArray.push({key: 'blank', empty: true});
      totalLastRow++;
    }
    return dataArray;
  };

  _ProgressItem = ({item, index, navigation}) => {
    let {itemStyle, itemInvisible} = styles;
    if (item.empty) {
        return <View style={[itemStyle, itemInvisible]} />;
    }
    return (
    <View style={styles.coursebox}> 
        <View style={{flexDirection:'row'}}> 
            <FontAwesome5 name="book" color='#344356' size={20} style={styles.bookicon}/>
            <Text style={[styles.content, {marginTop: 10}]}>หลักสูตร {item.title}</Text>
        </View>
        <View style={styles.container}>
            <Animated.View 
                style={[
                    styles.inner,
                    {width: `${this.state.percent}%`}
                ]}/>
            <Animated.Text style={styles.label}>
                {`${this.state.percent}%`}
            </Animated.Text>
        </View>
    </View>
    );
};

  anim = new Animated.Value(0);
  componentDidMount(){
      var test = 0;
      this.onAnimate(test);
  }

  onAnimate = (test) => {
      console.log(test);
      this.anim.addListener(({value}) => {
          this.setState({percent: parseInt(value, 10)});
      })
      Animated.timing(this.anim, {
          toValue: test,
          duration: 500,
      }). start();
  }

  render() {
    return (
    <View style={{alignItems:'center', justifyContent:'center'}}>
            <FlatList
                data={this.formatData(dataArray, numColumns)}
                renderItem={this._ProgressItem} 
                keyExtractor={(item, index) => index.toString()}
                numColumns={numColumns}
              />
    </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('screen').width -130,
        height: 17,
        backgroundColor:'rgba(224, 224, 224, 1)',
        marginVertical: 15,
      },
      inner: {
        width: '100%',
        height: 17,
        borderRadius: 5,
        backgroundColor: 'rgba(102,204,0,1.0)',
    },
    label: {
        fontSize: 16,
        color: '#7D7D7D',
        position: 'absolute',
        zIndex: 1,
        alignSelf: 'flex-end',
        fontFamily:'ThaiSansNeue-Bold',
        right: 10,
    },
  coursebox: {
    width: Platform.OS === 'ios'? width*0.83 : width*0.83, 
    backgroundColor: '#FFF', 
    alignItems:'center',
    flexDirection:'column',
    borderColor:'rgba(195,195,195,1)',
    borderWidth: 1,
    marginBottom: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  itemStyle: {
    backgroundColor: '#fff',
    alignItems: 'center',
    //justifyContent: 'center',
    flex: 1,
    margin: 10,
    height: 170,
    borderRadius: 5,
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  content:{
    color:'#344356', 
    fontFamily:'ThaiSansNeue-Bold', 
    fontSize: 18, 
    width:width*0.8
  },
  bookicon:{
    marginLeft: width*0.08, 
    marginRight: 8, 
    alignSelf: 'center', 
    marginTop: 8
  }
});