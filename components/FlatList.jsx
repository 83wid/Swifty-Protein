import { View, FlatList, StyleSheet, Text, TextInput, SafeAreaView, StatusBar, Image, Pressable } from 'react-native';
import Material from "react-native-vector-icons/MaterialIcons"
import { useEffect, useState } from 'react';

export default function FlatListComponent({ navigation, DATA }) {
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [flatHeight, setFlatHeight] = useState({
    flatContainer: 0,
    flatList: 0,
  })

  const Item = ({ title }) => (
    <Pressable style={styles.ligand} onPress={() => navigation.navigate('Ligand', {
      name: title
    })}
    >
      <Text style={styles.title}>{title}</Text>
      <Material style={styles.icon} name="arrow-right" size={25} color="white" />
    </Pressable>
  );

  const renderItem = ({ item }) => <Item title={item} />;

  const onLayout = (event) => {
    const height = event.nativeEvent.layout.height;
    setFlatHeight({
      ...flatHeight,
      flatList: height,
    })
  }

  const onLayout1 = (event) => {
    const height = event.nativeEvent.layout.height;
    setFlatHeight({
      ...flatHeight,
      flatContainer: height,
    })
  }

  useEffect(() => {
    if (flatHeight.flatContainer > 75 * DATA.length || DATA.length <= 0) {
      setScrollEnabled(false);
      // console.log("scroll disabled", flatHeight.flatContainer, 75 * DATA.length, flatHeight.flatContainer > 75 * DATA.length);
    }
    else
      setScrollEnabled(true);;
  }, [flatHeight, DATA.length])
  return (
    <View style={styles.ligandsContainer} onLayout={onLayout1}>
      <FlatList
        onLayout={onLayout}
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => DATA.indexOf(item)}
        initialNumToRender={10}
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Image source={require('../assets/nodata.gif')} resizeMode='contain' style={styles.gif} />
            <Text style={styles.emptyText}>No Ligands Found</Text>
          </View>
        )}
        contentContainerStyle={{ flexGrow: 1, }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  ligandsContainer: {
    display: 'flex',
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  ligand: {
    backgroundColor: "#e7eefc",
    padding: 20,
    borderRadius: 18,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  downIcon: {
    paddingBottom: 10,
  },
  emptyContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  gif: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 35,
  },
})