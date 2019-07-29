import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import ActionButton from 'react-native-action-button'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class Main extends Component {

    render() {
        return (
            <View style={styles.mainView}>
                <ActionButton>
                    <ActionButton.Item title = "Conectar à prótese" size = {40}>
                        <Icon name = 'bluetooth-b' style = {styles.actionButtonIcon}/>
                    </ActionButton.Item>
                    <ActionButton.Item title = "Analisar gráfico" size = {40}>
                        <Icon name = 'area-chart' style = {styles.actionButtonIcon}/>
                    </ActionButton.Item>
                </ActionButton>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    }
})