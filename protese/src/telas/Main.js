import React, { Component } from 'react'
import { StyleSheet,Button, View, Text } from 'react-native'
import ActionButton from 'react-native-action-button'
import Icon from 'react-native-vector-icons/FontAwesome'
import Orientation from 'react-native-orientation'


class Main extends Component  {
    state={
        polegar: false,
        indicador: false,
        medio: false,
        anelar: false,
        minimo: false
    }
    componentDidMount(){
        const willFocus = this.props.navigation.addListener('willFocus', payload => this.componentWillFocus(payload))
    }

    componentWillFocus(){
        Orientation.lockToPortrait()
    }

    componentWillUnmount(){
        willFocus.remove()
    }
    
    clicaDedos(dedo){

        if(dedo == 1){
            this.setState({polegar:!this.state.polegar,texto:"polegar"})
        }
        else if(dedo == 2){
            this.setState({indicador:!this.state.indicador,texto:"indicador"})

        }
        else if(dedo == 3){
            this.setState({medio:!this.state.medio,texto:"medio"})

        }
        else if(dedo == 4){
            this.setState({anelar:!this.state.anelar,texto:"anelar"})
        if(this.state.anelar){
            palavra[26] = '0'
            palavra[27] = '0'
        }
        else {
            palavra[26] = '1'
            palavra[27] = '8'
        }


        }
        else if(dedo == 5){
            this.setState({minimo:!this.state.minimo,texto:"minimo"})
            if(this.state.anelar){
                palavra[29] = '0'
                palavra[30] = '0'
            }
            else {
                palavra[29] = '1'
                palavra[30] = '8'
            }

        }

    
    }
    render() {

        return (
            <View style={styles.mainView}>
                    <View style={styles.viewBotoes}>
                        <Button
                        onPress={() => 
                        this.clicaDedos(1)
                        }
                        title="Polegar"
                        color={this.state.polegar == true ? "#0000ff" : "#000000"}
                        />
                        <Button
                         onPress={() => 
                            this.clicaDedos(2)
                            }
                        title="Indicador"
                        color={this.state.indicador == true ? "#0000ff" : "#000000"}
                        />
                        <Button 
                         onPress={() => 
                            this.clicaDedos(3)
                            }
                        title="Médio"
                        color={this.state.medio == true ? "#0000ff" : "#000000"}
                        />
                        <Button
                         onPress={() => 
                            this.clicaDedos(4)
                            }
                        title="Anelar"
                        color={this.state.anelar == true ? "#0000ff" : "#000000"}
                        />
                        <Button
                         onPress={() => 
                            this.clicaDedos(5)
                            }
                        title="Mínimo"
                        color={this.state.minimo == true ? "#0000ff" : "#000000"}
                        />
                    </View>

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
    },
    viewBotoes:{
        flexDirection:'row',
    
    }    
})

Main.navigationOption = {
    title: 'Main'
}

export default Main