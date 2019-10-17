import React, { Component } from 'react'
import { StyleSheet, View, ScrollView, TouchableWithoutFeedback, Dimensions} from 'react-native'
import { AreaChart, Grid, LineChart, YAxis } from 'react-native-svg-charts'
import Orientation from 'react-native-orientation'
import * as shape from 'd3-shape'
import Scale from 'd3-scale'
import BluetoothSerial from 'react-native-bluetooth-serial-next'
import Toast from 'react-native-simple-toast'

const y_min = 0
const y_max = 5
 
class Grafico extends React.PureComponent {
 
    componentDidMount() {
        Orientation.lockToLandscape()
        this.addData()
    }
    state = {
        data: new Array(1,5,27,90,1002),
        y_axis: new Array(y_min, y_max),
        ndados: 50
    }

    addData(){
        let dataArray = this.state.data.slice()
        let aux = ''
        BluetoothSerial.read((data, subscription) => {
            
            Toast.show(Number(aux))
            if(data != '\n'){
                aux = aux+data
            }
            else{
                if(dataArray.length<this.state.ndados){
                    dataArray.push(Number(aux))
                    
                }
                else{
                    dataArray.shift()
                    dataArray.push(Number(aux))
                    
                }
                this.setState({data: dataArray })
                
                aux = ''
            }
            if (this.imBoredNow && subscription) {
            BluetoothSerial.removeSubscription(subscription);
            }
        }, "\n");
        
        // if(data.length<this.state.ndados){
        //     random = Math.random()*2+1
        //     data.push(random)
        // }
        // else{
        //     data.shift()
        //     random = Math.random()*2+1
        //     data.push(random)
        // }   
        
        
    }

getInitialState() {
    return {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        viewHeight: 100
    }
}

measureView(event) {
this.setState({
        x: event.nativeEvent.layout.x,
        y: event.nativeEvent.layout.y,
        width: event.nativeEvent.layout.width,
        height: event.nativeEvent.layout.height
    })
}

    render() {
  
 
        return (
            <View style= {styles.mainView}>
                <View style = {styles.view_eixo}>
                    <YAxis
                        style = {{flex: 1}}
                        data={ this.state.y_axis }
                        contentInset={ {top: 20, left: 0, right: 50, bottom: 20}  }
                        svg={{
                        fill: 'grey',
                        fontSize: 12,
                        stroke: '#fff',
                        strokeWidth: 0.2
                        }}
                        numberOfTicks={ 10 }
                        formatLabel={ value => `${value} V` }
                    />
                </View>
                
                <View style={styles.view_grafico}>
                    <TouchableWithoutFeedback onPress = {() => this.addData()}> 
                        <View onLayout={(event) => this.measureView(event)}>    
                            <AreaChart
                                style={{height: Dimensions.get('window').height}}
                                title = {{text: "Gráfico"}}
                                data={ this.state.data }
                                svg={{fill: '#00BFFF', fillOpacity: 0.3, fillRule:'evenodd'}}
                                contentInset={{ top: 20, left: 0, right: 50, bottom: 20 }}
                                //curve = {shape.curveStepAfter}
                                curve = {shape.curveCardinal.tension(1)}
                                yMin = {y_min}
                                yMax = {y_max}
                            >       
                                
                                
                            </AreaChart> 
                            <LineChart 
                                style={{
                                    height: Dimensions.get('window').height,
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: this.state.width }}
                                title = {{text: "Gráfico"}}
                                data={ this.state.data }
                                svg = {{stroke: '#0098da'}}
                                //curve = {shape.curveStepAfter}
                                curve = {shape.curveCardinal.tension(1)}
                                contentInset={{ top: 20, left: 0, right: 50, bottom: 20 }}
                                yMin = {y_min}
                                yMax = {y_max}
                                
                                >
                                <Grid svg = {{stroke: '#555', strokeOpacity: 0.3}}></Grid>
                            </LineChart>
                              
                        </View>
                    </TouchableWithoutFeedback>
    
                </View>
                
            </View>
            
        )
    }
 
}


const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: '#313131',
        flexDirection: 'row',
        height: 200
        
        },
    view_eixo: {
        flex: 1
    },
    view_grafico: {
        flex: 20
    }
})

Grafico.navigationOptions = {
    title: 'Gráfico'
}

export default Grafico