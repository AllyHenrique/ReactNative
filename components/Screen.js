import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Picker, Button, ScrollView } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

const Screen = () => {
  const [moedas, setMoedas] = useState({});
  const [moedaSelecionada, setMoedaSelecionada] = useState('');
  const [valor, setValor] = useState('');
  const [resultado, setResultado] = useState('');

  useEffect(() => {
    obterMoedas();
  }, []);

  const obterMoedas = async () => {
    try {
      const response = await axios.get(
        'https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL,DOGE-BRL'
      );
      const data = response.data;
      const moedasFormatadas = formatarMoedas(data);
      setMoedas(moedasFormatadas);
    } catch (error) {
      console.error('Erro ao obter cotações:', error);
    }
  };

  const formatarMoedas = (data) => {
    const moedasFormatadas = {};
    for (const key in data) {
      const moeda = data[key].name;
      const nomeMoeda = obterNomeMoeda(moeda);
      moedasFormatadas[key] = {
        bid: data[key].bid,
        ask: data[key].ask,
        code: data[key].code,
        name: data[key].name,
      };
    }
    return moedasFormatadas;
  };

  const handleMoedaChange = (moeda) => {
    setMoedaSelecionada(moeda);
  };

  const handleValorChange = (valor) => {
    setValor(valor);
  };

  const handleCalcular = () => {
    if (moedaSelecionada && valor) {
      const taxa = moedas[moedaSelecionada]?.bid || 0;
      const calculo = taxa * parseFloat(valor);
      setResultado(calculo.toFixed(2));
    } else {
      setResultado('');
    }
  };

  const obterNomeMoeda = (moeda) => {
    const codigoMoeda = moeda.split('-')[0];
    switch (codigoMoeda) {
      case 'USD':
        return 'Dólar Americano';
      case 'EUR':
        return 'Euro';
      case 'BTC':
        return 'Bitcoin';
      default:
        return '';
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Icon name="money" size={40} color="black" />
      <Text style={styles.titulo}>Cotações em relação ao Real</Text>
      <View style={styles.resumo}>
        {Object.entries(moedas).map(([moeda, dados]) => (
          <View key={moeda} style={styles.itemMoeda}>
            <Text style={styles.nomeMoeda}>{dados.name}</Text>
            <Text style={styles.taxa}>Compra: {dados.bid}</Text>
            <Text style={styles.taxa}>Venda: {dados.ask}</Text>
          </View>
        ))}
      </View>
      <View style={styles.containerInput}>
        <Text style={styles.simboloMoeda}>R$</Text>
        <TextInput
          style={styles.input}
          placeholder="Valor em Real"
          onChangeText={handleValorChange}
          value={valor}
          keyboardType="numeric"
        />
      </View>
      <Picker
        style={styles.seletor}
        selectedValue={moedaSelecionada}
        onValueChange={handleMoedaChange}
      >
        {Object.entries(moedas).map(([moeda, dados]) => (
          <Picker.Item
            key={moeda}
            label={`${obterNomeMoeda(moeda)} - ${dados.name}`}
            value={moeda}
          />
        ))}
      </Picker>
      <Text style={styles.resultado}>{resultado} {moedaSelecionada}</Text>
      <Button title="Calcular" onPress={handleCalcular} style={styles.botao} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9e9e9',
    paddingVertical: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  resumo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  itemMoeda: {
    width: '45%',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    elevation: 3,
  },
  nomeMoeda: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  taxa: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
  containerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  simboloMoeda: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 10,
  },
  seletor: {
    width: '80%',
    marginBottom: 20,
  },
  resultado: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  botao: {
    backgroundColor: 'black',
    color: 'white',
  },
});

export default Screen;
