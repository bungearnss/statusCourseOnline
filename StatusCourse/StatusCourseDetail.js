import React, { Component } from 'react';
import { 
View, 
Text, 
StyleSheet, 
Dimensions, 
TouchableOpacity,
Platform,
FlatList,
AsyncStorage
} from 'react-native';
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from 'react-native-vector-icons';
import {Accordion, Button} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {httpClient} from '../core/HttpClient';

const {width} = Dimensions.get("window");
const height = width * 0.3;
const numColumns = 1;

//dummy dataArray
/* const dataArray = [
  { title: "First Element Test Lesson1", pass: "เรียนไม่ผ่าน", prescore: "4/15", postscore: "ทำข้อสอบหลังเรียน"},
  { title: "Second Element Test Lesson2", pass: "เรียนไม่ผ่าน", prescore: "0/5" , postscore: "ทำข้อสอบหลังเรียน"},
  { title: "Third Element Test Lesson3", pass: "เรียนไม่ผ่าน" , prescore: "ยังไม่เรียน", postscore: "ทำข้อสอบหลังเรียน" },
  { title: "Third Element Test Lesson4", pass: "เรียนไม่ผ่าน" , prescore: "ยังไม่เรียน", postscore: "ทำข้อสอบหลังเรียน" }
];
 */
export default class StatusCourseDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataArray : [],
      lesson : [],
      lesson_score :[],
      lesson_postscore:[],
      course : [],
      currentId:''
    };
  }
  
  async getLesson(id){
    let user_id = await AsyncStorage.getItem('userId');
    //pretest
    await httpClient
    .get(`/CourseOnline/getlesson/${id}`)
    .then(async response => {
      const result = response.data
      for(let i=0;i<result.length;i++){
        httpClient
        .get(`/CourseOnline/getscorebylesson/${result[i].id}/${user_id}`)
        .then(async response =>{
          const result = response.data
          if(result == "no score"){
            var score = this.state.lesson_score.concat({score_num:"ทำข้อสอบก่อนเรียน",score_total:0})
            this.setState({lesson_score:score})
          }
          else{
            var score = this.state.lesson_score.concat
              ({lesson_id:result.lesson_id,
                score_id:result.score_id,
                score_num:result.score_number,
                score_total:result.score_total
              })
            this.setState({lesson_score:score})
          }
        })
        //posttest
        await httpClient
        .get(`/CourseOnline/getpostscorebylesson/${result[i].id}/${user_id}`)
        .then(async response =>{
          const result = response.data
          if(result == "no score"){
            var score = this.state.lesson_postscore.concat({score_num:"ทำข้อสอบหลังเรียน",score_total:0,pass:"เรียนไม่ผ่าน"}) //n
            this.setState({lesson_postscore:score})
          }
          else{
            var score = this.state.lesson_postscore.concat
              ({lesson_id:result.lesson_id,
               score_id:result.score_id,
               score_num:result.score_number,
               score_total:result.score_total,
               pass:"เรียนผ่าน"
              })
            this.setState({lesson_postscore:score})
          }
        })
        var lesson = this.state.lesson.concat
          ({lesson_id:result[i].id,
            title:result[i].title,
            courseID:result[i].course_id
          })
        this.setState({lesson})
      }
    
    })
  }
  async componentDidMount(){
    let user_id = await AsyncStorage.getItem('userId');
    httpClient
    .get('/CourseOnline')
    .then(async response =>{
      const result = response.data;
      if (result != null) {
        this.setState({
          dataArray: result
        });
        for(let i=0;i<result.length;i++){
          this.getLesson(result[i].course_id)
        }
      }
     })
    .catch(error => {
      console.log(error);
    });
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
  _renderHeader = (item, expanded) => {
    return (
        <View
          onPress = {() =>this.handleClick(item)}
          style={styles.container}>
          <View style = {{flex:7}}>
            <Text style={[styles.text_black,{marginLeft: 5}]}>หลักสูตร {item.title}</Text>
            
            <View style={{flexDirection: 'row', marginLeft: 5}}>
             
                <View style={styles.statusid}> 
                    <MaterialCommunityIcons
                        name="pencil-box"
                        color='#FFF'
                        size={18}
                    /> 
                    {item.courseID === null ? (
                       <Text style={[styles.text_white,{marginLeft:5}, {fontFamily:'ThaiSansNeue-Bold'}]}>ยังไม่เรียน</Text>
                    ) : ( 
                      <Text style={[styles.text_white,{marginLeft:5}, {fontFamily:'ThaiSansNeue-Bold'}]}>กำลังเรียน</Text>
                   )} 
                </View>
            </View>
            <Button 
              iconLeft
              style={{ 
                width: 115, 
                height: 38, 
                alignItems:'center',
                justifyContent:'center', 
                borderRadius: 10, 
                paddingHorizontal: 5,
                marginTop: 10,
                backgroundColor:'rgba(255,153,51,1)'
              }}
            >
              <Icon 
                name="print" 
                color='#FFF' 
                size= {18}
                style={{marginRight: 5}}
              />
              <Text style={[styles.text_white, {fontFamily:'ThaiSansNeue-Bold'}]}>พิมพ์ใบประกาศ</Text>
            </Button>
          </View>
          {expanded ? (
          <View style = {{flex:1,alignItems:'flex-end',marginRight:8}}>
            <AntDesign style={{fontSize: 18 ,color:'#FFF'}} name="up" />
          </View>
          ) : (
          <View style = {{flex:1,alignItems:'flex-end',marginRight:8}}>
            <AntDesign style={{fontSize: 18 ,color:'#FFF'}} name="down" />
          </View>
          )}
        </View>
    );
  }

  _ListItem = ({item, index, navigation}) => {
    let {itemStyle, itemInvisible} = styles;
    if (item.empty) {
        return <View style={[itemStyle, itemInvisible]} />;
    }
    return (
      <View style={styles.customview}>
        <View style={{width:width*0.39, flexDirection:'column'}}> 
              <Text style={[styles.text_black,{marginLeft:10}]}>{item.title}</Text>
            {item.pass == 'เรียนผ่าน'?(
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
              <AntDesign
                  name="checkcircle"
                  color="green"
                  size={15}
              />
              <Text style={[styles.statuscourse,{color:'green'}]}>{item.pass}</Text>
            </View>
            ) : (
              <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
              <AntDesign
                  name="closecircle"
                  color="red"
                  size={15}
              />
              <Text style={styles.statuscourse}>{item.pass}</Text>
            </View>
            )}
        </View>

        {item.prescore == 'ทำข้อสอบก่อนเรียน'?(
          <TouchableOpacity onPress={this.props.MOVE}> 
          <View style={styles.pretest}>
              <AntDesign
                  name='form'
                  color='#FFF'
                  size={10}
                  style={{marginTop: 10}}
              />
                  <Text style={[styles.text_white, {marginLeft: 2}]}>{item.prescore}</Text>
          </View>
        </TouchableOpacity>
        ):(
          <View style={{width:width*0.2, alignItems:'center', marginRight: 10}}> 
          <Text style={[styles.text_black,{marginLeft:10}]}>{item.prescore}</Text>
        </View>
        )}
        {item.postscore == 'ทำข้อสอบหลังเรียน'? 
        (<TouchableOpacity onPress={this.props.MOVE}> 
          <View style={styles.posttest}>
              <AntDesign
                  name='form'
                  color='#FFF'
                  size={10}
                  style={{marginTop: 10}}
              />
                  <Text style={[styles.text_white, {marginLeft: 2}]}>{item.postscore}</Text>
          </View>
        </TouchableOpacity>
        ) : (
          <View style={{width:width*0.2, alignItems:'center', marginRight: 10}}>
            <Text style={[styles.text_black, {marginLeft: 2,justifyContent:'center'}]}>{item.postscore}</Text>
          </View>
        )}
        
       </View>
    );
};

  _renderContent = (item)=>{
    var arr = []
    for(let i =0;i<this.state.lesson.length;i++){
      if(this.state.lesson[i].courseID == item.course_id){
        arr.push({
          courseID :this.state.lesson[i].courseID,
          lessonID:this.state.lesson[i].lesson_id,
          title:this.state.lesson[i].title,
          prescore:this.state.lesson_score[i].score_num,prescore_total:this.state.lesson_score[i].score_total,
          postscore:this.state.lesson_postscore[i].score_num,
          postscore_total:this.state.lesson_postscore[i].score_total,
          pass:this.state.lesson_postscore[i].pass
        })
     }
    } 
    return (
      <View style = {{
        flexDirection:'column' , 
        backgroundColor:'#FFF',
        marginLeft:23,
        marginRight:23,
        marginTop : 15,
        justifyContent :'center',
        borderRadius : 10
    }}>
      <View style={[styles.customview, {backgroundColor:'rgba(224,224,224,0.8)'}, {borderBottomLeftRadius:0}, {borderBottomRightRadius:0}]}>
          <Text style={[styles.text_black,{marginLeft:10}]}>บทที่</Text>
          <Text style={[styles.text_black,{marginLeft: width*0.25}]}>สอบก่อนเรียน</Text>
          <Text style={[styles.text_black, {marginLeft: 15}]}>สอบหลังเรียน</Text>
      </View>
         <FlatList
            data={this.formatData(arr, numColumns)} //arr = dataArray
            renderItem={this._ListItem} 
            keyExtractor={(item, index) => index.toString()}
            numColumns={numColumns}
          />
         </View>
    );
  }

  render() {
    var dataArray2 = [] 
   /*  const dataArray2 = [
      { title: "หลักสูตร 1"},
      { title: "หลักสูตร 2" },
      { title: "หลักสูตร 3" },
      { title: "หลักสูตร Test"}
    ];
     */
   for(let i = 0;i<this.state.dataArray.length;i++){
      dataArray2.push({title:this.state.dataArray[i].course_title,course_id:this.state.dataArray[i].course_id})
    } 
    return (
        <View 
          style={{flex: 1,
          backgroundColor: "#F3F5F9", 
          flexDirection:'column'}}>
            <Accordion 
              style={{marginBottom: 30}}
              dataArray={dataArray2}
              animation={true}
              expanded={true}
              renderHeader={this._renderHeader}
              renderContent={this._renderContent}
            />
        </View>
    );
  }
}

const styles = StyleSheet.create({
container: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#60AFC3',
    marginLeft : 20,
    marginTop : 13,
    marginRight :20,
    borderRadius : 10,
    shadowOpacity: 0.1,
    shadowColor: '#000000',
    shadowRadius: 5,
},
customview:{
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    paddingVertical:10,
    borderRadius: 10,
    justifyContent:'space-between',
    
},
text_white: {
    color: "#FFF",
    marginTop: 5,
    fontFamily: "ThaiSansNeue-Regular",
    fontSize: 18
  },
  text_black:{
    color: "#000",
    marginTop: 5,
    fontFamily: "ThaiSansNeue-Bold",
    fontSize : 18
  },
  statuscourse: {
    color: "red",
    marginTop: 5,
    fontFamily: "ThaiSansNeue-Bold",
    fontSize : 16,
    textAlign:'center', 
    marginLeft: 5
  },
  pretest:{
    width:width*0.2, 
    backgroundColor:'#FF9933',
    paddingHorizontal: 5, 
    borderRadius: 5,
    flexDirection:'row', 
    marginHorizontal: 2
  },
  posttest: {
    width:width*0.2, 
    backgroundColor:'#E44949',
    paddingHorizontal: 5, 
    borderRadius: 5,
    flexDirection:'row', 
    marginHorizontal: 2
  },
  statusid: {
    backgroundColor:'#4178BE', 
    flexDirection:'row',
    marginLeft: 5, 
    width: 105,
    height: Platform.OS === 'ios' ? 42 : 38,
    justifyContent:'center', 
    alignItems:'center', 
    borderRadius: 10, 
    padding: 10
  },
  itemStyle: {
    backgroundColor: '#F3F5F9',
    alignItems: 'center',
    //justifyContent: 'center',
    flex: 1,
    margin: 10,
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
});