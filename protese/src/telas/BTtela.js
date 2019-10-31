import React, { Component } from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, Alert, SafeAreaView, Switch, ScrollView,PermissionsAndroid, Modal, ActivityIndicator } from 'react-native'
import Orientation from 'react-native-orientation'
import DeviceList from "../components/DeviceList"
import Button from "../components/Button"
import Toast from "@remobile/react-native-toast"
import styles from "../styles"
import BluetoothSerial, { withSubscription } from 'react-native-bluetooth-serial-next'

class BTtela extends Component {
    state = {
        isEnabled: false,
        device: null,
        devices: [],
        scanning: false,
        processing: false,
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

    componentWillFocus() {
        Orientation.lockToPortrait()
    }

    componentWillUnmount() {
        willFocus.remove()
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
                this.listDevices()
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
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
            .then(result => {
                if (!result) {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
                }
            });

        try {
            const list = await BluetoothSerial.list()
            for(let i=0; i<list.length; i++){
                if(list[i].id === this.state.device.id){
                    list[i].connected = true
                }
            }

            this.setState({devices : list})
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
              devices: [ ...unpairedDevices]

            });
         }  catch (e) {
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
           connected =  await BluetoothSerial.device(id).connect();
            
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

        const { id, name, connected } = device;

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
    };

    render() {
        const { isEnabled, device, devices, scanning, processing } = this.state
        return (
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



BTtela.navigationOptions = {
    title: 'Bluetooth'
}

export default withSubscription({ subscriptionName: "events" })(BTtela);