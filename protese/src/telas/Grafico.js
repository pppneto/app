import React, { Component, } from 'react'
import { StyleSheet, View, Text ,TouchableOpacity, ScrollView, TouchableWithoutFeedback, Dimensions } from 'react-native'
import { AreaChart, Grid, LineChart } from 'react-native-svg-charts'
import Orientation from 'react-native-orientation'
import * as shape from 'd3-shape'
import Scale from 'd3-scale'

 
class Grafico extends React.PureComponent {
 
    componentDidMount() {
        Orientation.lockToLandscape()
    }
state = {
    data: new Array( 50, 10, 40, 95, 4, 24, 85, 91, 35, 53, 53, 24, 50, 20, 80 ),
    ndados: 50
}

addData = () => {
    let data = this.state.data.slice()
    let random = 0
    
    if(data.length<this.state.ndados){
        random = Math.random()*100
        random = parseInt(random)
        data.push(random)
    }
    else{
        data.shift()
        random = Math.random()*100
        random = parseInt(random)
        data.push(random)
    }   

    this.setState({data})
}

    render() {
  
 
        return (
            <View style= {styles.mainView}>
                <ScrollView style={{height: 400}}>
                    <TouchableWithoutFeedback onPress = {() => this.addData()}>
            
                        <View style>    
                            <AreaChart
                                style={styles.area_style}
                                data={ this.state.data }
                                svg={{fill: 'rgba(30,144,255)', fillOpacity: 0.3, fillRule:'evenodd'  }}
                                contentInset={{ top: 20, left: 0, right: 50, bottom: 20 }}
                                //curve = {shape.curveMonotoneX}
                                yMin = {-150}
                                yMax = {150}
                            >       
                                
                                <Grid></Grid>
                            </AreaChart>  
                            <LineChart 
                                style={styles.line_style}
                                data={ this.state.data }
                                svg = {{stroke: '#fff'}}
                                //curve = {shape.curveMonotoneX}
                                contentInset={{ top: 20, left: 0, right: 50, bottom: 20 }}
                                yMin = {-150}
                                yMax = {150}>
                                </LineChart>  
                        </View>
                    </TouchableWithoutFeedback>
    
                </ScrollView>
                
            </View>
            
        )
    }
 
}


const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: '#313131'
        },
    text_style: {
        flexDirection: 'column'
    },
    area_style: {
        height: 800
    },
    line_style: {
        height: 800,
        width: Dimensions.get('window').width,
        position: 'absolute',
        top: 0,
        left: 0
    }    

    
})

Grafico.navigationOptions = {
    title: 'Gráfico'

    
}

export default Grafico