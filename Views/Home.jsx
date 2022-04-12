import ViewsContainer from '../components/ViewsContainer';
import FlatListComponent from '../components/FlatList';
import { View, StyleSheet, Text, TextInput, SafeAreaView, StatusBar, Keyboard } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home({ navigation }) {
  const [data, setData] = useState([]);
  const [sortData, setSortData] = useState([]);
  const [search, setSearch] = useState('');

  const handleOutsideClick = (e) => {
    Keyboard.dismiss();
    setSearch('');
  }

  useEffect(() => {
    axios.get('https://projects.intra.42.fr/uploads/document/document/3531/ligands.txt')
      .then(res => {
        const data = res.data.split('\n');
        setData(data);
        setSortData(data);
      })
      .catch(err => {
        console.log(err);
      })
  }, []);

  useEffect(() => {
    if (search.length > 0) {
      const newData = data?.filter(item => {
        const itemData = `${item.toUpperCase()}`;
        const textData = search.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setSortData(newData);
    } else {
      setSortData(data);
    }
  }, [search]);

  return (
    <ViewsContainer navigation={navigation} styles={styles.container} >
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <View style={styles.searchBarContainer}>
          <Text style={styles.searchBarText}>Search for{"\n"}a Ligand</Text>
          <TextInput placeholder='Search' style={styles.searchBar}
            onChangeText={(text) => setSearch(text)}
            onOuterFocus={() => handleOutsideClick}
            clearTextOnFocus={true}
          />
        </View>
      </SafeAreaView>
      <FlatListComponent DATA={sortData} navigation={navigation} />
    </ViewsContainer >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  searchBarContainer: {
    // backgroundColor: '#111',
    justifyContent: 'space-evenly',
    height: 120,
    width: '100%',
    marginBottom: 40,
    alignItems: 'center',
  },
  searchBarText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 35,
    marginBottom: 10,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 18,
    height: 50,
    width: '85%',
    paddingHorizontal: 15,
  },
});