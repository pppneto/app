import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'


class Grafico extends Component {

    render() {
        return (
            <View style={styles.mainView}>

                <Text>{"GRAFICO AQUI"}</Text>

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