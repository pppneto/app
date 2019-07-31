import React, { Component } from 'react'
import { StyleSheet, View, Text ,TouchableOpacity } from 'react-native'
import { LineChart, Grid } from 'react-native-svg-charts'
import Orientation from 'react-native-orientation'

 
class Grafico extends React.PureComponent {
 
    componentDidMount() {
        Orientation.lockToLandscape()
    }
state = {
    data: new Array( 50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80 )
}

addData = () => {
    let data = this.state.data.slice()
    let random = 0
    
    data.shift()
    random = Math.random()*100
    random = parseInt(random)
    data.push(random)   

    this.setState({data})
}

    render() {
  
 
        return (
            <View>
            <LineChart
                style={{ height: 200 }}
                data={ this.state.data }
                svg={{ stroke: 'rgb(134, 65, 244)' }}
                contentInset={{ top: 20, bottom: 20 }}
            >
                <Grid/>
            </LineChart>    

            <TouchableOpacity onPress = {() => this.addData()}>
            <View style = {styles.b_grafico}>
            
            </View>
            </TouchableOpacity>
            <View>
                <Text>
                    {this.state.data}
                </Text>
            </View>
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
    }    

    
})

Grafico.navigationOptions = {
    title: 'Gráfico'

    
}

export default Grafico