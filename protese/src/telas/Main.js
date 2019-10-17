import React, { Component } from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, Alert, SafeAreaView, Switch, ScrollView, Modal, ActivityIndicator } from 'react-native'
import ActionButton from 'react-native-action-button'
import Icon from 'react-native-vector-icons/FontAwesome'
import Orientation from 'react-native-orientation'
import BluetoothSerial, { withSubscription } from 'react-native-bluetooth-serial-next'
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
import DeviceList from "../components/DeviceList"
import Button from "../components/Button"
import Toast from "@remobile/react-native-toast"
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
        paired: false,
        connected: false
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
                    paired: true,
                    connected: false
                }))
            });
        }
        catch (e) {
            //Toast.showShortBottom(e.message);
        }

        if (!this.state.isEnabled) {
            this.alertaBluetooth()
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
            }
        })
    }

    ligaBluetooth = async () => {
        try {
            await BluetoothSerial.enable()

        } catch (e) {
            Toast.showShortBottom(e.message);
        }
    }

    componentWillFocus() {
        Orientation.lockToPortrait()
    }

    componentWillUnmount() {
        willFocus.remove()
    }
    conectaBT() {
        BluetoothSerial.connect("00:18:E4:40:00:06")
    }

    le() {
        BluetoothSerial.read((data, subscription) => {

            console.log(data);
            if (this.imBoredNow && subscription) {
                BluetoothSerial.removeSubscription(subscription);
            }

        }, "\r\n");
    }

    altera(data) {
        this.setState({ palavra: data })
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
        }


    }

    alertaBluetooth() {
        Alert.alert(
            'Aviso',
            'É necessário ligar o bluetooth para prosseguir. Deseja ligar o bluetooth?',
            [
                { text: 'NÃO' },
                { text: 'SIM', onPress: () => this.ligaBluetooth() },
            ]
        )
    }

    requestEnable = () => async () => {
        try {
            await BluetoothSerial.requestEnable();
            this.setState({ isEnabled: true });
        } catch (e) {
            Toast.showShortBottom(e.message);
        }
    };

    toggleBluetooth = async value => {
        try {
            if (value) {
                await BluetoothSerial.enable()
                this.setState({ isEnabled: true })
            } else {
                await BluetoothSerial.disable()
                this.setState({ isEnabled: true })
            }
        } catch (e) {
            Toast.showShortBottom(e.message)
        }
    };

    listDevices = () => async () => {
        try {
            const list = await BluetoothSerial.list();

            this.setState(({ devices }) => ({
                devices: devices.map(device => {
                    const found = list.find(v => v.id === device.id);

                    if (found) {
                        return {
                            ...found,
                            paired: true,
                            connected: false
                        };
                    }

                    return device;
                })
            }));
        } catch (e) {
            Toast.showShortBottom(e.message);
        }
    };

    discoverUnpairedDevices = () => async () => {
        this.setState({ scanning: true });

        try {
            const unpairedDevices = await BluetoothSerial.discoverUnpairedDevices()
            this.setState(({ devices }) => ({
                scanning: false,
                devices: devices
                    .map(device => {
                        const found = unpairedDevices.find(d => d.id === device.id);

                        if (found) {
                            return {
                                ...device,
                                ...found,
                                connected: false,
                                paired: false
                            };
                        }

                        return device.paired || device.connected ? device : null;
                    })
                    .map(v => v)
            }));
        } catch (e) {
            Toast.showShortBottom(e.message);

            this.setState(({ devices }) => ({
                scanning: false,
                devices: devices.filter(device => device.paired || device.connected)
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


    toggleDevicePairing = async ({ id, paired }) => {
        if (paired) {
            await this.unpairDevice(id);
        } else {
            await this.pairDevice(id);
        }
    };

    pairDevice = async id => {
        this.setState({ processing: true });

        try {
            const paired = await BluetoothSerial.pairDevice(id);

            if (paired) {
                Toast.showShortBottom(
                    `Device ${paired.name}<${paired.id}> paired successfully`
                );

                this.setState(({ devices, device }) => ({
                    processing: false,
                    device: {
                        ...device,
                        ...paired,
                        paired: true
                    },
                    devices: devices.map(v => {
                        if (v.id === paired.id) {
                            return {
                                ...v,
                                ...paired,
                                paired: true
                            };
                        }

                        return v;
                    })
                }));
            } else {
                Toast.showShortBottom(`Device <${id}> pairing failed`);
                this.setState({ processing: false });
            }
        } catch (e) {
            Toast.showShortBottom(e.message);
            this.setState({ processing: false });
        }
    };

    unpairDevice = async id => {
        this.setState({ processing: true });

        try {
            const unpaired = await BluetoothSerial.unpairDevice(id);

            if (unpaired) {
                Toast.showShortBottom(
                    `Device ${unpaired.name}<${unpaired.id}> unpaired successfully`
                );

                this.setState(({ devices, device }) => ({
                    processing: false,
                    device: {
                        ...device,
                        ...unpaired,
                        connected: false,
                        paired: false
                    },
                    devices: devices.map(v => {
                        if (v.id === unpaired.id) {
                            return {
                                ...v,
                                ...unpaired,
                                connected: false,
                                paired: false
                            };
                        }

                        return v;
                    })
                }));
            } else {
                Toast.showShortBottom(`Device <${id}> unpairing failed`);
                this.setState({ processing: false });
            }
        } catch (e) {
            Toast.showShortBottom(e.message);
            this.setState({ processing: false });
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
            const connected = await BluetoothSerial.device(id).connect();

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

    write = async (id, message) => {
        try {
            await BluetoothSerial.device(id).write(message);
            Toast.showShortBottom("Successfuly wrote to device");
        } catch (e) {
            Toast.showShortBottom(e.message);
        }
    };

    writePackets = async (id, message, packetSize = 64) => {
        try {
            const device = BluetoothSerial.device(id);
            const toWrite = iconv.encode(message, "cp852");
            const writePromises = [];
            const packetCount = Math.ceil(toWrite.length / packetSize);

            for (var i = 0; i < packetCount; i++) {
                const packet = new Buffer(packetSize);
                packet.fill(" ");
                toWrite.copy(packet, 0, i * packetSize, (i + 1) * packetSize);
                writePromises.push(device.write(packet));
            }

            await Promise.all(writePromises).then(() =>
                Toast.showShortBottom("Writed packets")
            );
        } catch (e) {
            Toast.showShortBottom(e.message);
        }
    };

    renderModal = (device, processing) => {
        if (!device) return null;

        const { id, name, paired, connected } = device;

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
                                {Platform.OS !== "ios" && (
                                    <Button
                                        title={paired ? "Unpair" : "Pair"}
                                        style={{
                                            backgroundColor: "#22509d"
                                        }}
                                        textStyle={{ color: "#fff" }}
                                        onPress={() => this.toggleDevicePairing(device)}
                                    />
                                )}
                                <Button
                                    title={connected ? "Disconnect" : "Connect"}
                                    style={{
                                        backgroundColor: "#22509d"
                                    }}
                                    textStyle={{ color: "#fff" }}
                                    onPress={() => this.toggleDeviceConnection(device)}
                                />
                                {connected && (
                                    <React.Fragment>
                                        <Button
                                            title="Write"
                                            style={{
                                                backgroundColor: "#22509d"
                                            }}
                                            textStyle={{ color: "#fff" }}
                                            onPress={() =>
                                                this.write(
                                                    id,
                                                    "This is the test message\r\nDoes it work?\r\nTell me it works!\r\n"
                                                )
                                            }
                                        />
                                        <Button
                                            title="Write packets"
                                            style={{
                                                backgroundColor: "#22509d"
                                            }}
                                            textStyle={{ color: "#fff" }}
                                            onPress={() =>
                                                this.writePackets(
                                                    id,
                                                    "This is the test message\r\nDoes it work?\r\nTell me it works!\r\n"
                                                )
                                            }
                                        />
                                    </React.Fragment>
                                )}
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
    };

    render() {
        const { isEnabled, device, devices, scanning, processing } = this.state;
        return (
            /*  <View style={styles.mainView}>
  
                  <Text style={{ color: '#fff' }}>
                      {this.state.palavra}
                  </Text>
                  <Text style={{ color: '#fff' }}>
                      {this.state.isEnabled.toString()}
                  </Text>
                  <Text style={{ color: '#fff' }}>
                      {this.state.connected.toString()}
                  </Text>
                  <Text style={{ color: '#fff' }}>
                      {this.state.paired.toString()}
                  </Text>
  
                  <View>
                      <TouchableOpacity onPress={() =>
                          this.clicaDedos('minimo')
                      }
                          style={{
                              position: 'absolute',
                              left: 89,
                              top: 253
                          }}>
                          <Image
                              source={imagem_dedo5}
                              style={{
  
                                  height: 120,
                                  width: 83.9,
                                  display: this.state.minimo == true ? 'none' : 'flex'
                              }}
                          >
                          </Image>
                      </TouchableOpacity>
  
  
  
                      <TouchableOpacity onPress={() =>
                          this.clicaDedos('anelar')
                      }
                          style={{
                              position: 'absolute',
                              left: 153,
                              top: 178
                          }}>
                          <Image
                              source={imagem_dedo4}
                              style={{
                                  height: 149,
                                  width: 65.4,
                                  display: this.state.anelar == true ? 'none' : 'flex'
                              }}
                          >
                          </Image>
                      </TouchableOpacity>
  
                      <TouchableOpacity onPress={() =>
                          this.clicaDedos('medio')
                      }
                          style={{
                              position: 'absolute',
                              left: 218,
                              top: 145
                          }}>
                          <Image
                              source={imagem_dedo3}
                              style={{
                                  height: 160,
                                  width: 53.9,
                                  display: this.state.medio == true ? 'none' : 'flex'
                              }}
                          >
                          </Image>
                      </TouchableOpacity>
  
                      <TouchableOpacity onPress={() =>
                          this.clicaDedos('indicador')
                      }
                          style={{
                              position: 'absolute',
                              left: 268,
                              top: 148
                          }}>
                          <Image
                              source={imagem_dedo2}
                              style={{
                                  height: 160,
                                  width: 53.9,
                                  display: this.state.indicador == true ? 'none' : 'flex'
                              }}
                          >
                          </Image>
                      </TouchableOpacity>
  
                      <TouchableOpacity onPress={() =>
                          this.clicaDedos('polegar')
                      }
                          style={{
                              position: 'absolute',
                              left: 334,
                              top: 323
                          }}>
                          <Image
                              source={imagem_dedo1}
                              style={{
                                  height: 160,
                                  width: 103.9,
                                  display: this.state.polegar == true ? 'none' : 'flex'
                              }}
                          >
                          </Image>
                      </TouchableOpacity>
  
  
                      <Image
                          source={imagem_palma}
                          style={{
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
                          style={{
                              position: 'absolute',
                              left: 138,
                              top: 336
                          }}>
                          <Image
                              source={imagem_dedo5f}
                              style={{
                                  height: 120,
                                  width: 83.9,
                                  display: this.state.minimo == true ? 'flex' : 'none'
                              }}
                          >
                          </Image>
                      </TouchableOpacity>
  
                      <TouchableOpacity onPress={() =>
                          this.clicaDedos('anelar')
                      }
                          style={{
                              position: 'absolute',
                              left: 185,
                              top: 304
                          }}>
                          <Image
                              source={imagem_dedo4f}
                              style={{
                                  height: 149,
                                  width: 65.4,
                                  display: this.state.anelar == true ? 'flex' : 'none'
                              }}
                          >
                          </Image>
                      </TouchableOpacity>
  
                      <TouchableOpacity onPress={() =>
                          this.clicaDedos('medio')
                      }
                          style={{
                              position: 'absolute',
                              left: 226,
                              top: 301
                          }}>
                          <Image
                              source={imagem_dedo3f}
                              style={{
                                  height: 160,
                                  width: 53.9,
                                  display: this.state.medio == true ? 'flex' : 'none'
                              }}
                          >
                          </Image>
                      </TouchableOpacity>
  
                      <TouchableOpacity onPress={() =>
                          this.clicaDedos('indicador')
                      }
                          style={{
                              position: 'absolute',
                              left: 264,
                              top: 301
                          }}>
                          <Image
                              source={imagem_dedo2f}
                              style={{
                                  height: 160,
                                  width: 53.9,
                                  display: this.state.indicador == true ? 'flex' : 'none'
                              }}
                          >
                          </Image>
                      </TouchableOpacity>
  
                      <TouchableOpacity onPress={() =>
                          this.clicaDedos('polegar')
                      }
                          style={{
                              position: 'absolute',
                              left: 258,
                              top: 340
                          }}>
                          <Image
                              source={imagem_dedo1f}
                              style={{
                                  height: 160,
                                  width: 103.9,
                                  display: this.state.polegar == true ? 'flex' : 'none'
                              }}
                          >
                          </Image>
                      </TouchableOpacity>
                  </View>
  
                  <ActionButton>
                      <ActionButton.Item title="Receber dado" size={40} onPress={() => this.le()}>
                          <Icon name='bluetooth-b' style={styles.actionButtonIcon} />
                      </ActionButton.Item>
  
                      <ActionButton.Item title="Conectar à prótese" size={40} onPress={() => this.le()}>
                          <Icon name='bluetooth-b' style={styles.actionButtonIcon} />
                      </ActionButton.Item>
  
                      <ActionButton.Item title="Analisar gráfico" size={40} onPress={() => this.props.navigation.navigate('Grafico')}>
                          <Icon name='area-chart' style={styles.actionButtonIcon} />
                      </ActionButton.Item>
  
                  </ActionButton>
  
              </View>*/
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.topBar}>
                    <Text style={styles.heading}>Bluetooth Example</Text>
                    <View style={styles.enableInfoWrapper}>
                        <Text style={{ fontSize: 14, color: "#fff", paddingRight: 10 }}>
                            {isEnabled ? "ON" : "OFF"}
                        </Text>
                        <Switch onValueChange={this.toggleBluetooth} value={isEnabled} />
                    </View>
                </View>


                {scanning ? (
                    isEnabled && (
                        <View
                            style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <ActivityIndicator
                                style={{ marginBottom: 15 }}
                                size={Platform.OS === "ios" ? 1 : 60}
                            />
                            <Button
                                textStyle={{ color: "#fff" }}
                                style={styles.buttonRaised}
                                title="Cancel Discovery"
                                onPress={this.cancelDiscovery()}
                            />
                        </View>
                    )
                ) : (
                        <React.Fragment>
                            {this.renderModal(device, processing)}
                            <DeviceList
                                devices={devices}
                                onDevicePressed={device => this.setState({ device })}
                                onRefresh={this.listDevices()}
                            />
                        </React.Fragment>
                    )}
                <View style={styles.footer}>
                    <ScrollView horizontal contentContainerStyle={styles.fixedFooter}>
                        {isEnabled && (
                            <Button
                                title="Discover more"
                                onPress={this.discoverUnpairedDevices()}
                            />
                        )}
                        {!isEnabled && (
                            <Button title="Request enable" onPress={this.requestEnable} />
                        )}
                    </ScrollView>
                </View>
            </SafeAreaView>
        )
    }
}

/*
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
*/
Main.navigationOptions = {
    title: 'Main'
}

export default withSubscription({ subscriptionName: "events" })(Main);