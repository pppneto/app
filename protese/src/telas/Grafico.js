import React, { Component } from 'react'
import { StyleSheet, View, Text ,TouchableOpacity } from 'react-native'
import { AreaChart, Grid } from 'react-native-svg-charts'
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
            <View>
                
            <AreaChart
                style={{ height: 260}}
                data={ this.state.data }
                svg={{stroke: 'rgb(0,0,0)', strokeWidth:3, fill: 'rgba(30,144,255)', fillOpacity: 0.1, fillRule:'evenodd'  }}
                contentInset={{ top: 20, left: 0, right: 50, bottom: 20 }}
                curve = {shape.curveMonotoneX}
                yMin = {0}
                yMax = {150}
                
            >
                <Grid/>
            </AreaChart>    

            <TouchableOpacity onPress = {() => this.addData()}>
            <View style = {styles.b_grafico}>
            
            </View>
            </TouchableOpacity>
            
            </View>
            
        )
    }
 
}


const styles = StyleSheet.create({
    mainView: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',borderRadius: 15
        },
    b_grafico:{
        borderRadius: 20,
        borderWidth: 1,
        height: 40,
        width: 40,
        borderColor: 'red',
        backgroundColor: 'gray'
    },
    back_grafico:{
        backgroundColor:'#000'
    }    

    
})

Grafico.navigationOptions = {
    title: 'Gráfico'

    
}

export default Grafico