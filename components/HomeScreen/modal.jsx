import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react'
import Modal from 'react-native-modal';
import axios from 'axios';
import Ionicons from "react-native-vector-icons/Ionicons";

const Coordinate = ({ coordLabel, coord }) => {
  return (
    <View style={styles.coordinateContainer}>
      <Text style={styles.coordinateLabel}>{coordLabel} :</Text>
      <Text style={styles.coordinate}>{coord.toFixed(2)}</Text>
    </View>
  )
}

const AtomDetail = ({ DataType, DataValue }) => {
  return (
    <View>
      <Text style={{ fontSize: 7, color: "#7F7F7F" }}>{DataType}</Text>
      <Text style={{ marginLeft: 4, }}>{DataValue}</Text>
    </View>
  )
}

export default function BottomHalfModal({ atom }) {
  console.log(atom);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const closeModal = () => setIsModalVisible(false);
  const openModal = () => setIsModalVisible(true);
  const [atomDetail, setAtomDetail] = useState([]);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (atom?.name === "" || atom?.name === undefined) {
      setAtomDetail([])
      setDisabled(true)
      return;
    }
    axios.get(`https://neelpatel05.pythonanywhere.com/element/symbol?symbol=${atom?.name?.toUpperCase()}`)
      .then(res => {
        setAtomDetail(res.data)
        setDisabled(false)
      })
  }, [atom])

  return (
    <>
      <SafeAreaView style={styles.buttonPosition}>
        <View
          style={styles.buttonContainer}
        >
          <TouchableOpacity onPress={openModal} disabled={disabled}>
            <View
              style={styles.upButton}
            >
              <Ionicons name="chevron-up" size={20} color="black" />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {atomDetail.length !== 0 &&
        <Modal
          testID={'modal'}
          isVisible={isModalVisible}
          onSwipeComplete={closeModal}
          hasBackdrop={false}
          coverScreen={false}
          swipeDirection={['left', 'right']}
          style={styles.view}
        >
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
        </Modal>
      }
    </>
  );
}

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
  content: {
    borderRadius: 18,
    backgroundColor: 'white',
    paddingVertical: 12,
  },
  buttonPosition: {
    position: "absolute",
    bottom: 20,
    left: 25,
    zIndex: 2,
  },
  buttonContainer: {
    padding: 4,
    backgroundColor: "white",
    borderRadius: 10,
  },
  upButton: {
    backgroundColor: "#D8D8D8",
    width: 40,
    height: 40,
    fontSize: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  DetailContainer: {
    position: "absolute",
    width: "100%",
    height: 90,
    backgroundColor: "#fff",
    bottom: 0,
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
    paddingVertical: 8,
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
    fontSize: 9,
    color: "#000",
    fontWeight: "bold",
    paddingLeft: 3,
  },
});
