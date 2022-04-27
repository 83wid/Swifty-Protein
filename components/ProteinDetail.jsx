import { View, StyleSheet, SafeAreaView, Text } from 'react-native';
import { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import { LigandContext } from '../context/state';

const Coordinate = ({ coordLabel, coord }) => {
  return (
    <View style={styles.coordinateContainer}>
      <Text style={styles.coordinateLabel}>{coordLabel} :</Text>
      <Text style={styles.coordinate}>{coord}</Text>
    </View>
  )
}

const AtomDetail = ({ DataType, DataValue, AddedStyle }) => {
  return (
    <View>
      <Text style={{ fontSize: 7, color: "#7F7F7F" }}>{DataType}</Text>
      <Text style={{ marginLeft: 4, }}>{DataValue}</Text>
    </View>
  )
}

export const ProteinDetail = ({ atom }) => {
  const [atomDetail, setAtomDetail] = useState([])
  const value =  useContext(LigandContext);

  const atominfo = value.state.selectedAtom;

  useEffect(() => {
    if (atom === "") {
      setAtomDetail([])
      return;
    }
    axios.get(`https://neelpatel05.pythonanywhere.com/element/symbol?symbol=${atom.name.toUpperCase()}`)
      .then(res => {
        setAtomDetail(res.data)
      })
  }, [atom])

  return (
    <>
      {atomDetail.length !== 0 &&
        <SafeAreaView style={styles.DetailContainer}>
          <View style={styles.atomContainer}>
            <Text style={styles.atomLabel}>{atomDetail.symbol}</Text>
            <Text style={{ fontSize: 10, }}>{atomDetail.name}</Text>
            <Text style={{ fontSize: 10, }}>{atomDetail.standardState}</Text>
          </View>
          <View style={styles.atomDetailContainer}>
            <Text style={{ fontSize: 13 }}>Coordinates :</Text>
            <View style={styles.coordinatesContainer}>
              <Coordinate coordLabel="X" coord={atom.x} />
              <Coordinate coordLabel="Y" coord={atom.y} />
              <Coordinate coordLabel="Z" coord={atom.z} />
            </View>
          </View>
          <View style={styles.proteinContainer}>
            <AtomDetail DataType="Density :" DataValue={Number.parseFloat(atomDetail.density).toExponential()} />
            <AtomDetail DataType="Atomic Number :" DataValue={atomDetail.atomicNumber} />
          </View>
        </SafeAreaView>
      }
    </>
  );
}

const styles = StyleSheet.create({
  DetailContainer: {
    position: "absolute",
    width: "90%",
    height: 90,
    backgroundColor: "#fff",
    bottom: 80,
    borderRadius: 18,
    overflow: "hidden",
    flexDirection: 'row',
    zIndex: 2,
  },
  atomContainer: {
    width: "20%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  atomLabel: {
    fontSize: 30,
    color: "#000",
    fontWeight: "bold",
  },
  atomDetailContainer: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    flexDirection: 'column',
    paddingVertical: 15,
  },
  proteinContainer: {
    width: "20%",
    height: "100%",
    justifyContent: "space-around",
    fontWeight: "bold",
    paddingVertical: 10,
  },
  proteinDetail: {
    fontSize: 25,
  },
  atomNameLabel: {
    fontSize: 10,
    color: "#000",
    fontWeight: "bold",
  },
  coordinatesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  coordinateContainer: {
    backgroundColor: "#D8D8D8",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  coordinateLabel: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
  },
  coordinate: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
    paddingLeft: 3,
  },
})


export default ProteinDetail; 