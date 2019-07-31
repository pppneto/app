import React, { Component } from 'react'
import { StyleSheet, View, Text ,TouchableOpacity } from 'react-native'
import { LineChart, Grid } from 'react-native-svg-charts'
import Orientation from 'react-native-orientation'
 
class Grafico extends React.PureComponent {

    componentDidMount() {
        Orientation.lockToLandscape()
    }
    
   

   
    
   
    render() {
 
        const data = [ 50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80 ]
 
        return (
            <LineChart
                style={{ height: 200 }}
                data={ data }
                svg={{ stroke: 'rgb(134, 65, 244)' }}
                contentInset={{ top: 20, bottom: 20 }}
            >
                <Grid/>
            </LineChart>
        )
    }
 
}


const styles = StyleSheet.create({
    mainView: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

Grafico.navigationOptions = {
    title: 'Gráfico'

    
}

export default Grafico