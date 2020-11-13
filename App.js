import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  TextInput,
  Button,
  Dimensions,
  ScrollView,
} from 'react-native';
import Todo from './Todo';
import {LineChart} from 'react-native-chart-kit';
import moment from 'moment';

const App = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([
    {date: moment().format('LL'), amount: 2000},
    {date: moment().subtract(1, 'days').format('LL'), amount: 2500},
    {date: moment().subtract(2, 'days').format('LL'), amount: 3500},
    {date: moment().subtract(3, 'days').format('LL'), amount: 4500},
    {date: moment().subtract(1, 'days').format('LL'), amount: 5500},
  ]);
  const [transformedData, setTransformedData] = useState([
    {date: null, amount: 0},
  ]);

  useEffect(() => {
    setTransformedData(transformData(groupBy(data, 'date')));
  }, [data]);

  const groupBy = (array, key) =>
    array.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});

  const [expenses, setExpenses] = useState([
    {
      description: 'Freelance job',
      amount: 499.99,
      timestamp: new Date(),
    },
  ]);

  const getDates = () => transformedData.map((pair) => pair.date);
  const getAmounts = () => transformedData.map((pair) => pair.amount);
  const transformData = (groupedData) => {
    const transformedArray = [];

    Object.entries(groupedData).forEach((entry) => {
      const total = entry[1].reduce((total, pair) => total + pair.amount, 0);
      transformedArray.push({
        date: moment(entry[0]).format('MM/DD'),
        amount: total,
      });
    });

    const sortedArray = transformedArray.sort((a, b) =>
      moment(a.date).diff(moment(b.date)),
    );

    return sortedArray;
  };

  useEffect(() => {
    setTotal(
      expenses.reduce(
        (totalExpense, expense) => totalExpense + Number(expense.amount),
        0,
      ),
    );
  }, [expenses]);

  const addExpense = () => {
    setExpenses([
      ...expenses,
      {
        description: description,
        amount: amount,
      },
    ]);

    setData([...data, {date: moment().format('LL'), amount: Number(amount)}]);

    setDescription('');
    setAmount('');
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <View>
          <Text style={styles.titleText}>Income Tracker</Text>
        </View>
        <View>
          <Text>Bezier Line Chart</Text>
          <LineChart
            data={{
              labels: getDates(),
              datasets: [
                {
                  data: getAmounts(),
                },
              ],
            }}
            width={Dimensions.get('window').width} // from react-native
            height={220}
            yAxisLabel="$"
            // yAxisSuffix="k"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: null, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            bezier
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
        <Text>Total Income: ${total}</Text>
        <TextInput
          style={styles.input}
          value={description}
          placeholder="Enter a Description"
          onChangeText={(text) => setDescription(text)}
        />
        <TextInput
          style={styles.input}
          value={amount}
          placeholder="Enter a Value"
          keyboardType="numeric"
          onChangeText={(text) => setAmount(text)}
        />
        <Button
          disabled={!amount && !description}
          title="Add Expense"
          onPress={addExpense}
        />
        {expenses.map((expense) => (
          <View>
            <Text>{expense.description}</Text>
            <Text>{expense.amount}</Text>
          </View>
        ))}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    marginTop: 20,
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
  },
  titleText: {
    // backgroundColor: 'red',
    textAlign: 'center',
    fontSize: 36,
    fontWeight: 'bold',
  },
});

export default App;
