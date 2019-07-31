import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import ActionButton from 'react-native-action-button'
import Icon from 'react-native-vector-icons/FontAwesome'
import Orientation from 'react-native-orientation'


class Main extends Component  {

    componentDidMount(){
        const willFocus = this.props.navigation.addListener('willFocus', payload => this.componentWillFocus(payload))
    }

    componentWillFocus(){
        Orientation.lockToPortrait()
    }

    componentWillUnmount(){
        willFocus.remove()
    }
    

    render() {

        return (
            <View style={styles.mainView}>

                <ActionButton>

                    <ActionButton.Item title = "Conectar à prótese" size = {40} >
                        <Icon name = 'bluetooth-b' style = {styles.actionButtonIcon}/>
                    </ActionButton.Item>

                    <ActionButton.Item title = "Analisar gráfico" size = {40} onPress={() => this.props.navigation.navigate('Grafico')}>
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

Main.navigationOption = {
    title: 'Main'
}

export default Main