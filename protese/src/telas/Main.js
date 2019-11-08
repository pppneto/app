import React, { Component } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, TouchableWithoutFeedback, Alert, SafeAreaView, Switch, ScrollView, Modal, ActivityIndicator, PermissionsAndroid } from 'react-native'
import Orientation from 'react-native-orientation'
import Toast from "@remobile/react-native-toast"
import BluetoothSerial, { withSubscription } from 'react-native-bluetooth-serial-next'
import ActionButton from 'react-native-action-button'
import DeviceList from "../components/DeviceList"
import Button from "../components/Button"
import styles from "../styles"

console.disableYellowBox = true

class Main extends Component {
    state = {
        polegar: false,
        indicador: false,
        medio: false,
        anelar: false,
        minimo: false,
        palavra: 'A000000000000000F000000000000000',
        isEnabled: false,
        device: null,
        devices: [],
        scanning: false,
        processing: false,
        connected: false,
        showBtModal: false
    }

    async componentDidMount() {
        this.events = this.props.events



        const willFocus = this.props.navigation.addListener('willFocus', payload => this.componentWillFocus(payload))
        try {
            const [isEnabled, devices] = await Promise.all([
                BluetoothSerial.isEnabled(),
                BluetoothSerial.list()
            ]);

            this.setState({
                isEnabled,
                devices: devices.map(device => ({
                    ...device,
                    connected: false
                }))
            });
        }
        catch (e) {
            //Toast.showShortBottom(e.message);
        }


        this.events.on("bluetoothEnabled", () => { //Bluetooth ligado
            //Toast.showShortBottom("Bluetooth habilitado");
            this.setState({ isEnabled: true });
        })

        this.events.on("bluetoothDisabled", () => { //Bluetooth desligado
            //Toast.showShortBottom("Bluetooth desadabilitado");
            this.setState({ isEnabled: false });
        })

        this.events.on("Conectado com sucesso", ({ device }) => { //Bluetooth conectado
            if (device) {
                //Toast.showShortBottom(`Dispositivo ${device.name}<${device.id}> foi conectado`);
                this.setState({ connected: true, device: device });

            }
        })

        this.events.on("Falha na conexão", ({ device }) => { //Falha na conexão
            if (device) {
                //Toast.showShortBottom(`Falha ao conectar com o dispositivo ${device.name}<${device.id}>`);
            }
        })

        this.events.on("Conexão perdida", ({ device }) => { //Conexão perdida
            if (device) {
                //Toast.showShortBottom(`Dispositivo ${device.name}<${device.id}> conexão foi perdida`);
                this.setState({ connected: false, device: null })
            }
        })
    }

    componentWillFocus() {
        Orientation.lockToPortrait()
    }

    componentWillUnmount() {
        willFocus.remove()
    }

    altera(data) {
        this.setState({ palavra: data })
    }

    clicaBt = async () => {
        this.toggleBluetooth()
        this.setState({ isEnabled: true, showBtModal: true })

    }

    clicaDedos(dedo) {
        let palavra = this.state.palavra
        let visible = this.state.visible

        if (dedo == 'polegar') {
            if (this.state.polegar) {
                palavra = palavra.substr(0, 17) + '0' + palavra.substr(18, 31)
                palavra = palavra.substr(0, 18) + '0' + palavra.substr(19, 31)
            }
            else {
                palavra = palavra.substr(0, 17) + '1' + palavra.substr(18, 31)
                palavra = palavra.substr(0, 18) + '8' + palavra.substr(19, 31)

            }
            this.setState({ polegar: !this.state.polegar, texto: "polegar", palavra })
            this.enviaDedos()
        }
        else if (dedo == 'indicador') {
            if (this.state.indicador) {
                palavra = palavra.substr(0, 20) + '0' + palavra.substr(21, 31)
                palavra = palavra.substr(0, 21) + '0' + palavra.substr(22, 31)
            }
            else {
                palavra = palavra.substr(0, 20) + '1' + palavra.substr(21, 31)
                palavra = palavra.substr(0, 21) + '8' + palavra.substr(22, 31)
            }
            this.setState({ indicador: !this.state.indicador, texto: "indicador", palavra })
            this.enviaDedos()
        }
        else if (dedo == 'medio') {
            if (this.state.medio) {
                palavra = palavra.substr(0, 23) + '0' + palavra.substr(24, 31)
                palavra = palavra.substr(0, 24) + '0' + palavra.substr(25, 31)
            }
            else {
                palavra = palavra.substr(0, 23) + '1' + palavra.substr(24, 31)
                palavra = palavra.substr(0, 24) + '8' + palavra.substr(25, 31)
            }
            this.setState({ medio: !this.state.medio, texto: "medio", palavra })
            this.enviaDedos()
        }
        else if (dedo == 'anelar') {

            if (this.state.anelar) {
                palavra = palavra.substr(0, 26) + '0' + palavra.substr(27, 31)
                palavra = palavra.substr(0, 27) + '0' + palavra.substr(28, 31)
            }
            else {
                palavra = palavra.substr(0, 26) + '1' + palavra.substr(27, 31)
                palavra = palavra.substr(0, 27) + '8' + palavra.substr(28, 31)

            }
            this.setState({ anelar: !this.state.anelar, texto: "anelar", palavra })
            this.enviaDedos()
        }
        else if (dedo == 'minimo') {
            this.state.visible == 'flex' ? 'none' : 'flex'
            if (this.state.minimo) {
                palavra = palavra.substr(0, 29) + '0' + '0'
                palavra = palavra.substr(0, 30) + '0' + '0'
            }
            else {
                palavra = palavra.substr(0, 29) + '1' + '0'
                palavra = palavra.substr(0, 30) + '8' + '0'
            }
            this.setState({ minimo: !this.state.minimo, texto: "minimo", palavra })
            this.enviaDedos()
        }


    }

    enviaDedos = async () => {
        await BluetoothSerial.write(this.state.palavra + "\n")

    }

    toggleBluetooth = async () => {
        try {

            await BluetoothSerial.enable()

        } catch (e) {
            Toast.showShortBottom(e.message)
        }
    };

    listDevices = () => async () => {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
            .then(result => {
                if (!result) {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
                }
            });

        try {
            const list = await BluetoothSerial.list()
            for (let i = 0; i < list.length; i++) {
                if (list[i].id === this.state.device.id) {
                    list[i].connected = true
                }
            }

            this.setState({ devices: list })
        } catch (e) {
            //Toast.showShortBottom(e.message)
        }
    };

    discoverUnpairedDevices = () => async () => {

        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
            .then(result => {
                if (!result) {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
                }
            });

        this.setState({ scanning: true });

        try {
            const unpairedDevices = await BluetoothSerial.listUnpaired();

            this.setState({
                scanning: false,
                devices: [...unpairedDevices]

            });
        } catch (e) {
            this.showShortBottomToast(e.message);

            this.setState(({ devices }) => ({
                scanning: false,
                devices: devices.filter(device => device.connected)
            }));
        }


    };

    cancelDiscovery = () => async () => {
        try {
            await BluetoothSerial.cancelDiscovery();
            this.setState({ scanning: false });
        } catch (e) {
            Toast.showShortBottom(e.message);

        }
    };

    toggleDeviceConnection = async ({ id, connected }) => {
        if (connected) {
            await this.disconnect(id);
        } else {
            await this.connect(id);
        }
    };

    connect = async id => {
        this.setState({ processing: true });

        try {
            connected = await BluetoothSerial.device(id).connect();

            if (connected) {
                Toast.showShortBottom(
                    `Connected to device ${connected.name}<${connected.id}>`
                );

                this.setState(({ devices, device }) => ({
                    processing: false,
                    device: {
                        ...device,
                        ...connected,
                        connected: true
                    },
                    devices: devices.map(v => {
                        if (v.id === connected.id) {
                            return {
                                ...v,
                                ...connected,
                                connected: true
                            };
                        }

                        return v;
                    })
                }));
            } else {
                Toast.showShortBottom(`Failed to connect to device <${id}>`);
                this.setState({ processing: false });
            }
        } catch (e) {
            Toast.showShortBottom(e.message);
            this.setState({ processing: false });
        }
    };

    disconnect = async id => {
        this.setState({ processing: true });

        try {
            await BluetoothSerial.device(id).disconnect();

            this.setState(({ devices, device }) => ({
                processing: false,
                device: {
                    ...device,
                    connected: false
                },
                devices: devices.map(v => {
                    if (v.id === id) {
                        return {
                            ...v,
                            connected: false
                        };
                    }

                    return v;
                })
            }));
        } catch (e) {
            Toast.showShortBottom(e.message);
            this.setState({ processing: false });
        }
    };

    renderModal = (device, processing) => {
            if (!device) return null;
    
            const { id, name, connected } = device;
    
            if(!processing){
                this.toggleDeviceConnection(device)
            }
            //this.setState({device:null}) 
        }
    

    montaMao() {

        return (
            <View>

                <Image
                    source={require("../images/palma.png")}
                    style={styless.imagem_palma}
                    resizeMode='contain'
                    fadeDuration={0}
                />

                <Image
                    style={styless.imagem_anelar}
                    source={this.state.anelar == true ? null : require('../images/anelar_abre.gif')} fadeDuration={0}
                    resizeMode='contain'

                ></Image>

                <Image
                    style={styless.imagem_minimo}
                    source={this.state.minimo == true ? require('../images/minimo_fecha.gif') : null} fadeDuration={0}
                    resizeMode='contain'

                ></Image>

                <Image
                    style={styless.imagem_anelar}
                    source={this.state.anelar == true ? require('../images/anelar_fecha.gif') : null} fadeDuration={0}
                    resizeMode='contain'

                ></Image>

                <Image
                    style={styless.imagem_minimo}
                    source={this.state.minimo ? null : require('../images/minimo_abre.gif')} fadeDuration={0}
                    resizeMode='contain'
                ></Image>

                <Image
                    style={styless.imagem_medio}
                    source={this.state.medio ? null : require('../images/medio_abre.gif')} fadeDuration={0}
                    resizeMode='contain'
                ></Image>

                <Image
                    style={styless.imagem_medio}
                    source={this.state.medio == true ? require('../images/medio_fecha.gif') : null} fadeDuration={0}
                    resizeMode='contain'

                ></Image>

                <Image
                    style={styless.imagem_polegar}
                    source={this.state.polegar == true ? require('../images/polegar_fecha.gif') : null} fadeDuration={0}
                    resizeMode='contain'

                ></Image>

                <Image
                    style={styless.imagem_polegar}
                    source={this.state.polegar ? null : require('../images/polegar_abre.gif')} fadeDuration={0}
                    resizeMode='contain'
                ></Image>

                <Image
                    style={[styless.imagem_indicador, styless.touchable_indicador]}
                    source={this.state.indicador == true ? require('../images/indicador_fecha.gif') : null} fadeDuration={0}
                    resizeMode='contain'

                ></Image>

                <TouchableOpacity style={styless.touchable_indicador} onPress={() => this.clicaDedos("indicador")}>
                    <Image
                        style={styless.imagem_indicador}
                        source={this.state.indicador ? null : require('../images/indicador_abre.gif')} fadeDuration={0}
                        resizeMode='contain'
                    ></Image>
                </TouchableOpacity>



                <TouchableOpacity style={styless.touchable_minimo} onPress={() => this.clicaDedos("minimo")}></TouchableOpacity>

                <TouchableOpacity style={styless.touchable_anelar} onPress={() => this.clicaDedos("anelar")}></TouchableOpacity>

                <TouchableOpacity style={styless.touchable_medio} onPress={() => this.clicaDedos("medio")}></TouchableOpacity>

                <TouchableOpacity style={styless.touchable_polegar} onPress={() => this.clicaDedos("polegar")}></TouchableOpacity>

            </View>
        )
    }

    render() {
        const { isEnabled, device, devices, scanning, processing } = this.state
        return (
            <View style={styless.mainView}>

                <Modal
                    animationType="slide"
                    visible={this.state.showBtModal}
                    transparent={true}
                    style={{ borderRadius: 1 }}
                    onShow={this.discoverUnpairedDevices()}
                >
                    <TouchableWithoutFeedback onPress={() => this.setState({ showBtModal: false })}>
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' }}></View>
                    </TouchableWithoutFeedback>

                    <View style={{ flex: 1 }}>

                        <View style={styles.topBar}>
                            <Text style={styles.heading}>Bluetooth Example</Text>
                            <View style={styles.enableInfoWrapper}>
                                {
                                    scanning ? (
                                        isEnabled && (

                                            <ActivityIndicator
                                                size={Platform.OS === "ios" ? 1 : 40}
                                            />
                                        )
                                    ) : (isEnabled && (
                                        <TouchableOpacity onPress={this.discoverUnpairedDevices()}>
                                            <Icon name="autorenew"></Icon>
                                        </TouchableOpacity>
                                    ))}
                            </View>
                        </View>

                        <React.Fragment>
                            {this.renderModal(device, processing)}
                            <DeviceList
                                devices={devices}
                                onDevicePressed={device => this.setState({ device })}
                                onRefresh={this.listDevices()}
                                processing={processing}
                            />
                        </React.Fragment>
                    </View>

                </Modal>

                {
                    this.montaMao()
                }


                <View style={{ flex: 1 }}>
                    <ActionButton renderIcon={active => active ? (<Icon name="apple-keyboard-control" style={styless.actionButtonIcon} />) : (<Icon name="apple-keyboard-control" style={styless.actionButtonIcon} />)}
                        degrees={180}
                        buttonColor={'#2EABFF'}

                    >
                        <ActionButton.Item title="Conectar à prótese" size={40} buttonColor={this.state.isEnabled ? '#2EABFF' : '#808080'} onPress={() => { this.clicaBt() }}>
                            <Icon name={this.state.isEnabled ? 'bluetooth-connect' : 'bluetooth-off'} style={styless.actionButtonIcon} />

                        </ActionButton.Item>
                        <ActionButton.Item title="Analisar gráfico" size={40} buttonColor={'#808080'} onPress={() => this.props.navigation.navigate('Grafico')}>
                            <Icon name='chart-areaspline' style={styless.actionButtonIcon} />

                        </ActionButton.Item>
                    </ActionButton>
                </View>

            </View >
        )
    }
}

//largura da tela do Pedro = 423.5294
//altura da tela do Pedro = 752.9412
const largura_tela = Dimensions.get("window").width
const altura_tela = Dimensions.get("window").height
const largura_palma = largura_tela * 0.6
const largura_minimo = 0.468 * largura_palma
const largura_anelar = 0.393 * largura_palma
const largura_medio = 0.3738 * largura_palma
const largura_indicador = 0.2 * largura_palma
const largura_polegar = 0.743 * largura_palma

const proporcao_minimo = 708 / 401
const proporcao_anelar = 611 / 236
const proporcao_medio = 636 / 223
const proporcao_indicador = 739 / 143
const proporcao_polegar = 600 / 400
const proporcao_palma = 522 / 466

//conta top
//top_dedo = top_palma - (((top_palma(0) - top_dedo(0)) / largura_palma(0) )*largura_palma)
const top_palma = 0.35*Dimensions.get("window").height
const top_minimo = top_palma - 0.3974 *largura_palma
const top_anelar = top_palma - 0.6138 *largura_palma
const top_medio = top_palma - 0.6689 *largura_palma
const top_indicador = top_palma - 0.6847 *largura_palma
const top_polegar = top_palma - 0.03148 *largura_palma

//63.52941 left
//254.11764 largura
//conta left
//left_dedo = left_palma - (((left_palma(0) - lef_dedo(0)) / largura_palma(0))*largura_palma)
const left_palma = largura_tela * 0.15
const left_minimo = left_palma - 0.1398* largura_palma
const left_t_minimo =  left_palma + 0.005787 * largura_palma
const left_anelar =  left_palma + 0.0963 * largura_palma
const left_t_anelar =  left_palma + 0.2222 * largura_palma
const left_medio =  left_palma + 0.3363* largura_palma
const left_t_medio =  left_palma + 0.4386 * largura_palma
const left_indicador =  left_palma + 0.6944 * largura_palma
const left_polegar =  left_palma + 0.6747 * largura_palma
const left_t_polegar =  left_palma + 0.8321 * largura_palma

const styless = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: '#030B1A',
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    imagem_minimo: {
        position: "absolute",
        left: left_minimo,
        top: top_minimo,
        width: largura_minimo,
        height: (largura_minimo) * proporcao_minimo,
        borderColor: '#fff'
    },
    touchable_minimo: {
        position: "absolute",
        left: left_t_minimo,
        top: top_minimo,
        borderRadius: 200,
        height: (largura_minimo) * proporcao_minimo,
        width: (largura_minimo) / 3,
        borderWidth: 0,
        rotation: -20,
        borderColor: "#fff"
    },
    imagem_anelar: {
        position: "absolute",
        left: left_anelar,
        top: top_anelar,
        width: largura_anelar,
        height: (largura_anelar) * proporcao_anelar,
        borderWidth: 0,
        borderColor: '#fff'
    },
    touchable_anelar: {
        position: "absolute",
        left: left_t_anelar,
        top: top_anelar,
        borderRadius: 200,
        height: (largura_anelar) * proporcao_anelar,
        width: (largura_anelar) / 2.5,
        borderWidth: 0,
        rotation: -13,
        borderColor: "#fff"
    },
    imagem_medio: {
        position: "absolute",
        left: left_medio,
        top: top_medio,
        width: largura_medio,
        height: (largura_medio) * proporcao_medio,
        borderWidth: 0,
        borderColor: '#fff'
    },
    touchable_medio: {
        position: "absolute",
        left: left_t_medio,
        top: top_medio,
        borderRadius: 200,
        height: (largura_medio) * proporcao_medio,
        width: (largura_medio) / 2.3,
        borderWidth: 0,
        rotation: -13,
        borderColor: "#fff"
    },
    imagem_indicador: {
        width: largura_indicador,
        height: (largura_indicador) * proporcao_indicador,
        borderWidth: 0,
        borderColor: '#fff'
    },
    touchable_indicador: {
        position: "absolute",
        left: left_indicador,
        top: top_indicador,
        borderWidth: 0,
        borderColor: "#fff"
    },
    imagem_polegar: {
        position: "absolute",
        left: left_polegar,
        top: top_polegar,
        width: largura_polegar,
        height: (largura_polegar) * proporcao_polegar,
        borderWidth: 0,
        borderColor: '#fff'
    },
    touchable_polegar: {
        position: "absolute",
        left: left_t_polegar,
        top: top_polegar,
        borderRadius: 200,
        height: (largura_polegar) * proporcao_polegar,
        width: (largura_polegar) / 2,
        borderWidth: 0,
        rotation: 15,
        borderColor: "#fff"
    },
    imagem_palma: {
        width: largura_palma,
        height: largura_palma * proporcao_palma,
        position: "absolute",
        left: left_palma,
        top: top_palma,
        borderColor: '#fff',
        borderWidth: 0

    }

})

Main.navigationOptions = {
    title: 'Main',
}

export default withSubscription({ subscriptionName: "events" })(Main);