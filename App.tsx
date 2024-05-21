import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  Button,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { DataTable } from "react-native-paper";
import Modal from "react-native-modal";

export default function App() {
  const [namaDepan, setNamaDepan] = useState("");
  const [namaBelakang, setNamaBelakang] = useState("");
  const [namaDepanUpdate, setNamaDepanUpdate] = useState("");
  const [namaBelakangUpdate, setNamaBelakangUpdate] = useState("");
  const [indexUpdate, setIndexUpdate] = useState(null);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [update, setUpdate] = useState(false);
  // function get list history
  useEffect(() => {
    getList("history").then((data) => {
      setHistoryData(data);
    });
  }, [update]);

  // function getList
  const getList = async (key: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.log(e.message);
    }
  };

  // function addToList
  const addToList = async (namaDepan: String, namaBelakang: String) => {
    const data = [namaDepan, namaBelakang];
    if (namaDepan === "") {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "WARNING!",
        textBody: "Harap isi Nama Depan!",
        button: "Okay!",
      });
    } else {
      try {
        const oldHistory = await getList("history");
        oldHistory.push(data);
        try {
          const historyString = JSON.stringify(oldHistory);
          await AsyncStorage.setItem("history", historyString);

          Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: "SUCCESS!",
            textBody: "Berhasil menambahkan data!",
          });
          setUpdate(!update);
        } catch (error) {
          console.error(error);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  // function deleteItem
  const deleteItem = async (index: Number) => {
    const history = await getList("history");
    history.splice(index, 1);
    try {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Apakah anda yakin untuk menghapus item ini?",
        textBody: "Anda bisa klik dimana saja untuk batalkan!",
        button: "Delete",
        onPressButton: async () => {
          await AsyncStorage.setItem("history", JSON.stringify(history));
          Dialog.hide();
          setUpdate(!update);
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  // function editListIndex
  const editListIndex = async () => {
    if (namaDepanUpdate === "") {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "WARNING!",
        textBody: "Nama depan tidak boleh kosong!",
        button: "Okay!",
      });
    }
    if (namaBelakangUpdate === "") {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "WARNING!",
        textBody: "Nama belakang tidak boleh kosong!",
        button: "Okay!",
      });
    }

    try {
      const history = await getList("history");
      history[indexUpdate] = [namaDepanUpdate, namaBelakangUpdate];
      await AsyncStorage.setItem("history", JSON.stringify(history));

      toggleModal();
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "UPDATED!",
        textBody: "Berhasil memperbaharui data!",
      });
      setNamaBelakangUpdate("");
      setNamaDepanUpdate("");
      setIndexUpdate(null);
      setUpdate(!update);
    } catch (error) {}
  };

  // function update clicked
  const updateClicked = (index: number) => {
    toggleModal();
    setIndexUpdate(index);
    setNamaDepanUpdate(historyData[index][0]);
    setNamaBelakangUpdate(historyData[index][1]);
  };

  // toggle Modal Update
  const toggleModal = () => {
    setUpdateModalVisible(!updateModalVisible);
  };

  // Function Reset Input
  const resetInput = async () => {
    setNamaDepan("");
    setNamaBelakang("");
  };

  const resetStorageData = async () => {
    try {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Apakah anda yakin untuk menghapus semua data?",
        textBody: "Anda bisa klik dimana saja untuk batalkan!",
        button: "Delete",
        onPressButton: async () => {
          await AsyncStorage.setItem("history", JSON.stringify([]));
          Dialog.hide();
          setUpdate(!update);
        },
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <AlertNotificationRoot theme="dark">
      <SafeAreaView style={{ backgroundColor: "#FFF" }}>
        {/* update modal form */}
        <Modal isVisible={updateModalVisible} animationIn={"bounceInUp"}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={styles.formContainer}>
              <View>
                <Text>Nama Depan :</Text>
                <TextInput
                  style={styles.boxField}
                  placeholder={
                    indexUpdate !== null ? historyData[indexUpdate][0] : "Error"
                  }
                  value={namaDepanUpdate}
                  onChangeText={(text) => {
                    setNamaDepanUpdate(text);
                  }}
                />
              </View>
              <View style={styles.inputFieldContainer}>
                <Text>Nama Belakang :</Text>
                <TextInput
                  placeholder={
                    indexUpdate !== null ? historyData[indexUpdate][1] : "Error"
                  }
                  style={styles.boxField}
                  value={namaBelakangUpdate}
                  onChangeText={(text) => {
                    setNamaBelakangUpdate(text);
                  }}
                />
              </View>
              <View
                style={{
                  borderRadius: 10,
                  alignSelf: "flex-end",
                  gap: 10,
                  marginTop: 20,
                  flexDirection: "row",
                }}
              >
                <TouchableOpacity
                  style={{
                    padding: 10,
                    backgroundColor: "lightblue",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                  }}
                  onPress={() => editListIndex()}
                >
                  <MaterialIcons name="edit" size={16} />
                  <Text>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    padding: 10,
                    backgroundColor: "red",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                  }}
                  onPress={() => toggleModal()}
                >
                  <MaterialIcons name="cancel" size={16} color={"white"} />
                  <Text style={{ color: "white" }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* end update modal form */}

        <View style={styles.container}>
          <View>
            <Text style={styles.previewTitle}>Preview :</Text>
            <Text style={styles.textShow}>
              {namaDepan} {namaBelakang}
            </Text>
          </View>
          <View style={[styles.formContainer, { elevation: 1 }]}>
            <View style={styles.inputFieldContainer}>
              <Text>Nama Depan :</Text>
              <TextInput
                value={namaDepan}
                style={styles.boxField}
                placeholder="masukkan nama depan"
                onChangeText={(text) => {
                  setNamaDepan(text);
                }}
              />
            </View>
            <View style={styles.inputFieldContainer}>
              <Text>Nama Belakang :</Text>
              <TextInput
                value={namaBelakang}
                style={styles.boxField}
                placeholder="masukkan nama belakang"
                onChangeText={(text) => {
                  setNamaBelakang(text);
                }}
              />
            </View>
            {/* Button */}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 10,
              }}
            >
              {/* reset Button */}
              <View
                style={{
                  borderRadius: 10,
                  alignSelf: "flex-end",
                  flex: 1,
                }}
              >
                <TouchableOpacity
                  style={{
                    marginTop: 20,
                    padding: 10,
                    backgroundColor: "red",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                  }}
                  onPress={() => resetInput()}
                >
                  <MaterialIcons name="reset-tv" size={20} color={"white"} />
                  <Text style={{ color: "white" }}>Reset</Text>
                </TouchableOpacity>
              </View>
              {/* add button */}
              <View
                style={{
                  borderRadius: 10,
                  alignSelf: "flex-end",
                  flex: 1,
                }}
              >
                <TouchableOpacity
                  style={{
                    marginTop: 20,
                    padding: 10,
                    backgroundColor: "lightblue",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                  }}
                  onPress={() => addToList(namaDepan, namaBelakang)}
                >
                  <MaterialIcons name="add" size={20} />
                  <Text>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* reset storage button */}
            <TouchableOpacity
              onPress={() => resetStorageData()}
              style={{
                marginTop: 20,
                padding: 10,
                backgroundColor: "crimson",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <MaterialIcons name="delete-sweep" size={20} color={"white"} />
              <Text style={{ color: "white" }}>Delete</Text>
            </TouchableOpacity>
          </View>
          <DataTable>
            <ScrollView style={{ height: 400 }} stickyHeaderIndices={[0]}>
              <DataTable.Header style={{ backgroundColor: "#f7f7f7" }}>
                <DataTable.Title style={{ flex: 1 }}>No</DataTable.Title>
                <DataTable.Title style={{ flex: 3 }}>Nama</DataTable.Title>
                <DataTable.Title style={{ flex: 1 }}>Aksi</DataTable.Title>
              </DataTable.Header>
              {historyData.length === 0 ? (
                <Text style={{ textAlign: "center", marginTop: 20 }}>
                  Tidak ada data
                </Text>
              ) : (
                historyData.map((item, index) => {
                  return (
                    <DataTable.Row key={index}>
                      <DataTable.Cell>{index + 1}</DataTable.Cell>
                      <DataTable.Cell style={{ flex: 3 }}>
                        {item[0] + " " + item[1]}
                      </DataTable.Cell>
                      <DataTable.Cell style={{ flex: 1 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            gap: 10,
                            padding: 10,
                            paddingLeft: 0,
                          }}
                        >
                          <TouchableOpacity
                            style={[
                              styles.buttonStyle,
                              { backgroundColor: "orange" },
                            ]}
                            onPress={() => updateClicked(index)}
                          >
                            <MaterialIcons
                              name="edit"
                              size={20}
                              color={"white"}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.buttonStyle,
                              { backgroundColor: "red" },
                            ]}
                            onPress={() => deleteItem(index)}
                          >
                            <MaterialIcons
                              name="delete-forever"
                              size={20}
                              color={"white"}
                            />
                          </TouchableOpacity>
                        </View>
                      </DataTable.Cell>
                    </DataTable.Row>
                  );
                })
              )}
            </ScrollView>
          </DataTable>
        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    padding: 20,
    gap: 10,
  },
  previewTitle: {
    fontSize: 20,
  },
  inputFieldContainer: {
    gap: 5,
  },
  textShow: {
    fontSize: 20,
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "#f7f7f7",
    gap: 10,
    padding: 20,
  },
  boxField: {
    borderWidth: 1,
    paddingLeft: 10,
  },
  ListBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  buttonStyle: {
    padding: 5,
  },
});
