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
        minimo: false,
        palavra: 'A000000000000000F000000000000000'
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
        let palavra = this.state.palavra

        if(dedo == 1){
            if(this.state.polegar){
                palavra = palavra.substr(0,17) + '0' + palavra.substr(18,31)
                palavra = palavra.substr(0,18) + '0' + palavra.substr(19,31)
            }
            else{
                palavra = palavra.substr(0,17) + '1' + palavra.substr(18,31)
                palavra = palavra.substr(0,18) + '8' + palavra.substr(19,31)
                
            }
            this.setState({polegar:!this.state.polegar,texto:"polegar",palavra})
        }
        else if(dedo == 2){
            if(this.state.indicador){
                palavra = palavra.substr(0,20) + '0' + palavra.substr(21,31)
                palavra = palavra.substr(0,21) + '0' + palavra.substr(22,31)
            }
            else{
                palavra = palavra.substr(0,20) + '1' + palavra.substr(21,31)
                palavra = palavra.substr(0,21) + '8' + palavra.substr(22,31)
            }
            this.setState({indicador:!this.state.indicador,texto:"indicador",palavra})
        }
        else if(dedo == 3){
            if(this.state.medio){
                palavra = palavra.substr(0,23) + '0' + palavra.substr(24,31)
                palavra = palavra.substr(0,24) + '0' + palavra.substr(25,31)
            }
            else{
                palavra = palavra.substr(0,23) + '1' + palavra.substr(24,31)
                palavra = palavra.substr(0,24) + '8' + palavra.substr(25,31)
            }
            this.setState({medio:!this.state.medio,texto:"medio",palavra})
        }
        else if(dedo == 4){

            if(this.state.anelar){
                palavra = palavra.substr(0,26) + '0' + palavra.substr(27,31)
                palavra = palavra.substr(0,27) + '0' + palavra.substr(28,31)
            }
            else{
                palavra = palavra.substr(0,26) + '1' + palavra.substr(27,31)
                palavra = palavra.substr(0,27) + '8' + palavra.substr(28,31)

            }
            this.setState({anelar:!this.state.anelar,texto:"anelar",palavra})
        }
        else if(dedo == 5){
            if(this.state.minimo){
                palavra = palavra.substr(0,29) + '0' + '0' 
                palavra = palavra.substr(0,30) + '0' + '0'
            }
            else{
                palavra = palavra.substr(0,29) + '1' + '0' 
                palavra = palavra.substr(0,30) + '8' + '0'
            }
            this.setState({minimo:!this.state.minimo,texto:"minimo",palavra})
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
                        
                    <Text>
                            {this.state.palavra}
                    </Text>

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