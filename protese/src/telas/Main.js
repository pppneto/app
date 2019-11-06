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
            Toast.show(Dimensions.get("window").width.toString())
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

        if (!processing) {
            this.toggleDeviceConnection(device)
        }
        this.setState({ device: null })
        return (
            <Modal
                animationType="fade"
                transparent={false}
                visible={true}
                onRequestClose={() => { }}
            >
                {device ? (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{name}</Text>
                        <Text style={{ fontSize: 14 }}>{`<${id}>`}</Text>

                        {processing && (
                            <ActivityIndicator
                                style={{ marginTop: 15 }}
                                size={Platform.OS === "ios" ? 1 : 60}
                            />
                        )}

                        {!processing && (
                            <View style={{ marginTop: 20, width: "50%" }}>
                                <Button
                                    title={connected ? "Disconnect" : "Connect"}
                                    style={{
                                        backgroundColor: "#22509d"
                                    }}
                                    textStyle={{ color: "#fff" }}
                                    onPress={() => this.toggleDeviceConnection(device)}
                                />
                                <Button
                                    title="Close"
                                    onPress={() => this.setState({ device: null })}
                                />
                            </View>
                        )}
                    </View>
                ) : null}
            </Modal>
        );
    }

    montaMao() {

        return (
            <View>

                <Image
                    source={require("../images/palma.png")}
                    style={styless.imagem_palma}
                    resizeMode='contain'
                />





                <Image
                    style={[styless.imagem_anelar, styless.touchable_anelar]}
                    source={this.state.anelar == true ? null : require('../images/anelar_abre.gif')} fadeDuration={0}
                    resizeMode='contain'

                ></Image>






                <Image
                    style={[styless.imagem_minimo, styless.touchable_minimo]}
                    source={this.state.minimo == true ? require('../images/minimo_fecha.gif') : null} fadeDuration={0}
                    resizeMode='contain'

                ></Image>




                <TouchableOpacity onPress={() => this.clicaDedos('anelar')}
                    style={styless.touchable_anelar}
                >
                    <Image
                        style={styless.imagem_anelar}
                        source={this.state.anelar == true ? require('../images/anelar_fecha.gif') : null} fadeDuration={0}
                        resizeMode='contain'

                    ></Image>

                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.clicaDedos('minimo')}
                    style={styless.touchable_minimo}
                >


                    <Image
                        style={styless.imagem_minimo}
                        source={this.state.minimo ? null : require('../images/minimo_abre.gif')} fadeDuration={0}
                        resizeMode='contain'
                    ></Image>
                </TouchableOpacity>


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

//larguta da tela do Pedro = 423.5294
const largura_tela = Dimensions.get("window").width
const largura_palma = largura_tela * 0.6
const largura_minimo = 119
const largura_anelar = 0.417 * largura_palma
const largura_medio = 118
const largura_indicador = 118
const largura_polegar = 118

const proporcao_minimo = 708 / 401
const proporcao_anelar = 664 / 282
const proporcao_medio = 2
const proporcao_indicador = 2
const proporcao_polegar = 2
const proporcao_palma = 522 / 466

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
        width: largura_minimo,
        height: (largura_minimo) * proporcao_minimo,
        borderWidth: 5,
        borderColor: '#fff'
    },
    touchable_minimo: {
        position: "absolute",
        left: 28,
        top: 59,
    },
    imagem_anelar: {
        width: largura_anelar,
        height: (largura_anelar) * proporcao_anelar,
        borderWidth: 0,
        borderColor: '#fff'
    },
    touchable_anelar: {
        position: "absolute",
        left: 95,
        top: 16,
    },
    imagem_palma: {
        width: largura_palma,
        height: largura_palma * proporcao_palma,
        position: "absolute",
        left: "15%",
        top: 160,
        borderColor: '#fff',
        borderWidth: 5

    }

})

Main.navigationOptions = {
    title: 'Main'
}

export default withSubscription({ subscriptionName: "events" })(Main);