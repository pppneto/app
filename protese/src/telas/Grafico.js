import React, { Component } from 'react'
import { StyleSheet, View, Text ,TouchableOpacity } from 'react-native'


class Grafico extends Component {

    render() {
        return (
            <View style={styles.mainView}>
                <TouchableOpacity onPress = {() => this.props.navigation.navigate('Main')}>
                <Text>{"GRAFICO AQUI"}</Text>
                </TouchableOpacity>
            </View>
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