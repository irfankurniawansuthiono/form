import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
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
  const [history, setHistory] = useState([]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);

  // function delete
  const deleteItem = (index: number) => {
    const newWithDeleteHistory = history.filter(
      (item: String, idx: number) => idx !== index
    );
    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title: "Apakah anda yakin untuk menghapus item ini?",
      textBody: "Anda bisa klik dimana saja untuk batalkan!",
      button: "Delete",
      onPressButton: () => {
        setHistory(newWithDeleteHistory);
        Dialog.hide();
      },
    });
  };

  // function update clicked
  const updateClicked = (index: number) => {
    toggleModal();
    setIndexUpdate(index);
    setNamaDepanUpdate(history[index][0]);
    setNamaBelakangUpdate(history[index][1]);
  };

  // edit button function
  const editListIndex = () => {
    if (namaDepanUpdate === "") {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "WARNING!",
        textBody:
          "jika mengosongkan nama depan, maka nama depan lama akan digunakan kembali!",
        button: "Okay!",
      });
    }

    if (namaDepanUpdate !== "") {
      history[indexUpdate][0] = namaDepanUpdate;
    }
    history[indexUpdate][1] = namaBelakangUpdate;

    toggleModal();

    Toast.show({
      type: ALERT_TYPE.SUCCESS,
      title: "UPDATED!",
      textBody: "Berhasil memperbaharui data!",
    });

    setNamaBelakangUpdate("");
    setNamaDepanUpdate("");
    setIndexUpdate(null);
  };

  // toggle Modal Update
  const toggleModal = () => {
    setUpdateModalVisible(!updateModalVisible);
  };

  // function add
  const addToList = (namaDepan: String, namaBelakang: String) => {
    const oldHistory: Array<String> = history;
    const newHistory = [...oldHistory, [namaDepan, namaBelakang]];
    if (namaDepan !== "") {
      setHistory(newHistory);
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Success",
        textBody: "Berhasil ditambahkan ke list!",
      });
    } else {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Warning!",
        textBody: "Mohon Inputkan setidaknya nama depan!",
        button: "Close",
        onPressButton: () => {
          Dialog.hide();
        },
      });
    }

    Keyboard.dismiss();

    setNamaDepan("");
    setNamaBelakang("");
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
                    indexUpdate !== null ? history[indexUpdate][0] : "Error"
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
                    indexUpdate !== null ? history[indexUpdate][1] : "Error"
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
                  <MaterialIcons name="cancel" size={16} />
                  <Text>Cancel</Text>
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
            <View
              style={{
                borderRadius: 10,
                width: 100,
                alignSelf: "flex-end",
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
          <DataTable>
            <ScrollView style={{ height: 400 }} stickyHeaderIndices={[0]}>
              <DataTable.Header style={{ backgroundColor: "#f7f7f7" }}>
                <DataTable.Title style={{ flex: 1 }}>No</DataTable.Title>
                <DataTable.Title style={{ flex: 3 }}>Nama</DataTable.Title>
                <DataTable.Title style={{ flex: 1 }}>Aksi</DataTable.Title>
              </DataTable.Header>
              {history.map((item, index) => {
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
              })}
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
