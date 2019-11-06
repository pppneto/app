<View styles={{ flex: 1 }}>
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

                                //height: larguraPalma*propMinimo[0]*propMinimo[1],
                                //width: larguraPalma*propMinimo[0],
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

                                //height: larguraPalma*propAnelar[0]*propAnelar[1],
                                //width: larguraPalma*propAnelar[0],
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

                                //height: larguraPalma*propMedio[0]*propMedio[1],
                                //width: larguraPalma*propMedio[0],
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

                                //height: larguraPalma*propIndicador[0]*propIndicador[1],
                                //width: larguraPalma*propIndicador[0],
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

                                //height: larguraPalma*propPolegar[0]*propPolegar[1],
                                //width: larguraPalma*propPolegar[0],
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
                            //left: larguraTela/2 - larguraPalma/2,
                            //top: alturaTela/2 - (larguraPalma*propPalma/2),
                            //height: larguraPalma*propPalma,
                            //width: larguraPalma
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
                                // height: 120,
                                //width: 83.9,
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
