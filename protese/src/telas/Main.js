import React, { Component } from 'react'
import { StyleSheet,Button, View, Text, Image, TouchableOpacity , Dimensions} from 'react-native'
import ActionButton from 'react-native-action-button'
import Icon from 'react-native-vector-icons/FontAwesome'
import Orientation from 'react-native-orientation'
import BluetoothSerial from 'react-native-bluetooth-serial-next'
import imagemrobo from '../images/Imagem1.png'
import imagem_dedo5 from '../images/minimo.png'
import imagem_dedo5f from '../images/minimo_fechado.png'
import imagem_dedo4 from '../images/anelar.png'
import imagem_dedo4f from '../images/anelar_fechado.png'
import imagem_dedo3 from '../images/medio.png'
import imagem_dedo3f from '../images/medio_fechado.png'
import imagem_dedo2 from '../images/indicador.png'
import imagem_dedo2f from '../images/indicador_fechado.png'
import imagem_dedo1 from '../images/polegar.png'
import imagem_dedo1f from '../images/polegar_fechado.png'
import imagem_palma from '../images/palma.png'

console.disableYellowBox = true

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
    
    conectaBT(){
        BluetoothSerial.connect("00:18:E4:40:00:06")
       
    }

    le(){
        BluetoothSerial.read((data, subscription) => {
            console.log(data);
           
            if (this.imBoredNow && subscription) {
              BluetoothSerial.removeSubscription(subscription);
            }
          }, "\r\n");
    }

    altera(data){
        this.setState({palavra:data}) 
    }

    clicaDedos(dedo){
        let palavra = this.state.palavra
        let visible = this.state.visible

        if(dedo == 'polegar'){
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
        else if(dedo == 'indicador'){
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
        else if(dedo == 'medio'){
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
        else if(dedo == 'anelar'){

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
        else if(dedo == 'minimo'){
            this.state.visible == 'flex' ? 'none' : 'flex' 
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

                    <Text style = {{color: '#fff'}}>
                            {this.state.palavra}
                    </Text>

                    <TouchableOpacity onPress={() => 
                            this.clicaDedos('minimo')
                            }
                            style = {{
                                position: 'absolute',
                                left:89,
                                top:253}}>
                        <Image 
                        source = {imagem_dedo5}
                        style = {{
                            
                            height: 120,
                            width: 83.9,
                            display: this.state.minimo == true ? 'none' : 'flex'}}
                        >
                        </Image>
                    </TouchableOpacity>

                    

                    <TouchableOpacity onPress={() => 
                            this.clicaDedos('anelar')
                            }
                            style = {{
                                position: 'absolute',
                                left:153,
                                top:178}}>
                        <Image 
                        source = {imagem_dedo4}
                        style = {{
                            height: 149,
                            width: 65.4,
                            display: this.state.anelar == true ? 'none' : 'flex'}}
                        >
                        </Image>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => 
                            this.clicaDedos('medio')
                            }
                            style = {{
                                position: 'absolute',
                                left:218,
                                top:145}}>
                        <Image 
                        source = {imagem_dedo3}
                        style = {{
                            height: 160,
                            width: 53.9,
                            display: this.state.medio == true ? 'none' : 'flex'}}
                        >
                        </Image>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => 
                            this.clicaDedos('indicador')
                            }
                            style = {{
                                position: 'absolute',
                                left:268,
                                top:148}}>
                        <Image 
                        source = {imagem_dedo2}
                        style = {{
                            height: 160,
                            width: 53.9,
                            display: this.state.indicador == true ? 'none' : 'flex'}}
                        >
                        </Image>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => 
                            this.clicaDedos('polegar')
                            }
                            style = {{
                                position: 'absolute',
                                left:334,
                                top:323}}>
                        <Image 
                        source = {imagem_dedo1}
                        style = {{
                            height: 160,
                            width: 103.9,
                            display: this.state.polegar == true ? 'none' : 'flex'}}
                        >
                        </Image>
                    </TouchableOpacity>


                    <Image 
                        source = {imagem_palma}
                        style = {{
                            position: 'absolute',
                            left: 140,
                            top: 300,
                            height: 200,
                            width: 200
                        }}
                    >
                    </Image>

                    <TouchableOpacity onPress={() => 
                            this.clicaDedos('minimo')
                            }
                            style = {{
                                position: 'absolute',
                                left:138,
                                top:336}}>
                        <Image 
                        source = {imagem_dedo5f}
                        style = {{
                            height: 120,
                            width: 83.9,
                            display: this.state.minimo == true ? 'flex' : 'none'}}
                        >
                        </Image>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => 
                            this.clicaDedos('anelar')
                            }
                            style = {{
                                position: 'absolute',
                                left:185,
                                top:304}}>
                        <Image 
                        source = {imagem_dedo4f}
                        style = {{
                            height: 149,
                            width: 65.4,
                            display: this.state.anelar == true ? 'flex' : 'none'}}
                        >
                        </Image>
                    </TouchableOpacity>
                        
                    <TouchableOpacity onPress={() => 
                            this.clicaDedos('medio')
                            }
                            style = {{
                                position: 'absolute',
                                left:226,
                                top:301}}>
                        <Image 
                        source = {imagem_dedo3f}
                        style = {{
                            height: 160,
                            width: 53.9,
                            display: this.state.medio == true ? 'flex' : 'none'}}
                        >
                        </Image>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => 
                            this.clicaDedos('indicador')
                            }
                            style = {{
                                position: 'absolute',
                                left:264,
                                top:301}}>
                        <Image 
                        source = {imagem_dedo2f}
                        style = {{
                            height: 160,
                            width: 53.9,
                            display: this.state.indicador == true ? 'flex' : 'none'}}
                        >
                        </Image>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => 
                            this.clicaDedos('polegar')
                            }
                            style = {{
                                position: 'absolute',
                                left:258,
                                top:340}}>
                        <Image 
                        source = {imagem_dedo1f}
                        style = {{
                            height: 160,
                            width: 103.9,
                            display: this.state.polegar == true ? 'flex' : 'none'}}
                        >
                        </Image>
                    </TouchableOpacity>
                
                <ActionButton>
                    <ActionButton.Item title = "Receber dado" size = {40} onPress= {() => this.le()}>
                        <Icon name = 'bluetooth-b' style = {styles.actionButtonIcon}/>
                    </ActionButton.Item>

                    <ActionButton.Item title = "Conectar à prótese" size = {40} onPress= {() => this.conectaBT()}>
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
        flex: 1,
        backgroundColor: '#313131',
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
})

Main.navigationOptions = {
    title: 'Main'
}

export default Main