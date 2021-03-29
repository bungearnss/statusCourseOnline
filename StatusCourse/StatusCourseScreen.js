import React, { Component } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StyleSheet, 
  Dimensions, 
  KeyboardAvoidingView, 
  Keyboard, 
  TouchableWithoutFeedback, 
  TouchableOpacity,
  ScrollView,
  Platform
} from 'react-native';
import CustomHeader from '../Header/CustomHeader';
import { Searchbar } from "react-native-paper";
import { FontAwesome5, FontAwesome, MaterialCommunityIcons } from 'react-native-vector-icons';
import { List, ListItem, Picker, Icon } from 'native-base';
import StatusProgress from '../StatusCourse/StatusProgress';
import StatusCourseDetail from '../StatusCourse/StatusCourseDetail';

const {width} = Dimensions.get("window");
const height = width * 0.3;

export default class StatusCourseScreen extends Component {
  constructor(props) {
    super(props);
    this.inputRefs = {};
    this.state = {
      searchQuery:'',
      disable: true,
      Generation: undefined,
    };
  }

  onValueChange2(value) {
    this.setState({
      Generation: value
    });
  }

  _onChangeSearch = query => this.setState({ searchQuery: query});

  handlerClick = () => {
    this.setState({ disable: !this.state.disable })
  }
  
  /* handleTitleChange = event => {
    console.log(event)
    this.props.onTitleChange(event)
  } */
  render() {
    const { searchQuery } = this.state;

    return (
      <SafeAreaView style={styles.SafeContainer}> 
        <ScrollView> 
          <CustomHeader
            title="สถานะการเรียน"
            navigation={this.props.navigation}
            isHome={false}
          /> 
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
          <KeyboardAvoidingView 
                  behavior={Platform.OS == "ios" ? "padding" : "padding"}
                >  
            <View style={{backgroundColor:'#F3F5F9', flex: 5.5, alignItems:'center'}}>
              <View style={{flexDirection:'row', width:width*0.85, backgroundColor:'#55A0D2', padding: 12, borderRadius: 5, borderWidth:1 , borderColor:'#E6E6E6' }}> 
                  <FontAwesome 
                    name="address-book-o"
                    size={23}
                    color='#FFF'
                  />
                  <Text style={{fontFamily:'ThaiSansNeue-Bold', fontSize: 20, marginLeft: 10, color: '#FFF'}}>สถานะของหลักสูตร</Text>
                  <View style={{justifyContent:'center', alignItems:'flex-end', flex: 1}}> 
                    <TouchableOpacity onPress={this.handlerClick}> 
                      <MaterialCommunityIcons
                        name="arrow-down-drop-circle-outline"
                        size={23}
                        color='#FFF'
                      />
                    </TouchableOpacity>
                  </View>
              </View>
                {this.state.disable ? (
                  <View/>
                ): (
                <StatusProgress/>
                )}
            </View>
          <View style={{justifyContent:'center', alignItems:'center', backgroundColor:'#F3F5F9'}}>
            <Text style={[styles.intext, {fontSize:22}, {marginBottom: 10}, {marginTop: 20}]}>
              ผลการเรียน
            </Text>
            <Text style={[styles.intext,{fontSize: 20}]}>ค้นหา | หลักสูตร</Text>
                <View style={{
                  alignItems:'center', 
                  flexDirection:'row', 
                  justifyContent:'flex-start', 
                  width, 
                  marginLeft: Platform.OS ==='ios'? 30 :20
                }}> 
                    <Searchbar
                      placeholder="--หลักสูตรที่ต้องการค้นหา--"
                      onChangeText={this._onChangeSearch}
                      value={searchQuery}
                      style={styles.insearch}
                      inputStyle={{color: '#7D7979',fontFamily: "ThaiSansNeue-Regular"}}
                    />
                    <Text style={[styles.intext, {marginHorizontal: 5}]}>รุ่น</Text>
                    <View style={{
                      elevation:1, 
                      width: Platform.OS ==='ios'? 90 : 73, 
                      height:height*0.35,  
                      backgroundColor:'#FFF', 
                      marginBottom: 5,
                      borderRadius: 2,
                      borderColor: 'rgba(224,224,224,0.8)',
                      borderWidth: 1,
                      justifyContent:'center',
                      }}> 
                      <Picker 
                          mode="dialog"
                          iosIcon={ 
                            <Icon name="arrow-down"/>
                          }
                          placeholder="Select"
                          placeholderStyle={{marginHorizontal: -5}}
                          placeholderIconColor="#6E7FAA"
                          selectedValue={this.state.Generation}
                          onValueChange={this.onValueChange2.bind(this)}
                          style={{color:'black'}}
                          >
                          <Picker.Item label="1" value="key0" />
                          <Picker.Item label="2" value="key1" />
                          </Picker> 
                      </View>
                </View>
            </View>
                <StatusCourseDetail MOVE={() => this.props.navigation.navigate('ExamDetail')}/>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  SafeContainer: {
    flex: 1,
    backgroundColor: "#FFF", 
    flexDirection:'column',
    width, 
    height
  },
  intext: {
    fontFamily:'ThaiSansNeue-Bold', 
    fontSize: 18, 
    color:'#344356'
  },
  insearch: {
    width:Platform.OS ==='ios'? width*0.6 : width*0.65, 
    height:height*0.35, 
    backgroundColor:'rgba(255,255,255,0.7)', 
    borderWidth:2 , 
    borderColor: 'rgba(224,224,224,0.8)', 
    shadowColor:'#FFF', 
    elevation: 0,
    marginBottom: 5,
  },
  textinside: {
    color: '#6E7FAA',
    fontFamily: "ThaiSansNeue-Regular",
    flex: 1,
    fontSize: 20,
    alignItems:'center',
    marginRight: 10,
    marginLeft: 20,
    width: 150
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
      fontSize: 16,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      backgroundColor: 'red',
      color: 'black',
      width: 100,
      height: 100
  },
});