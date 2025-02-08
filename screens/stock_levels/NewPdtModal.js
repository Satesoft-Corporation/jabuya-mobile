import { Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import MyInput from "@components/MyInput";
import PrimaryButton from "@components/buttons/PrimaryButton";
import { BaseApiService } from "@utils/BaseApiService";
import { QUICK_POST_ENDPOINT } from "@utils/EndPointUtils";
import Colors from "@constants/Colors";
import { INTERNAL_SERVER_ERROR } from "@constants/ErrorMessages";
import Icon from "@components/Icon";

const NewPdtModal = ({ visible, setVisible, setProduct, setShowBarcodeReader, scannedCode }) => {
  const [name, setName] = useState("");
  const [bcode, setBcode] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {
    setBcode(scannedCode);
  }, [scannedCode]);

  const hide = () => {
    if (!loading) {
      setName("");
      setBcode("");
      setSubmitted(false);
      setVisible(false);
      setLoading(false);
    }
  };

  const save = async () => {
    setSubmitted(true);

    if (name && bcode) {
      setLoading(true);
      await new BaseApiService(QUICK_POST_ENDPOINT)
        .postRequestWithJsonResponse({ name, barcode: bcode })
        .then((data) => {
          setSubmitted(false);
          setLoading(false);
          setProduct(data);
          hide();
        })
        .catch((e) => {
          setError(e?.message ?? INTERNAL_SERVER_ERROR);
          setLoading(false);
        });
    }
  };

  return (
    <Modal isVisible={visible} onBackdropPress={hide} onBackButtonPress={hide} animationIn={"fadeIn"} animationOut={"fadeOut"}>
      <View style={{ backgroundColor: "#fff", minHeight: 220, borderRadius: 5, gap: 10, padding: 11, justifyContent: "center" }}>
        {error && (
          <Text style={{ color: Colors.error, textAlign: "center" }} numberOfLines={3}>
            {error}
          </Text>
        )}
        <MyInput label="Product name" required showError value={name} onValueChange={(t) => setName(t)} isSubmitted={submitted} />

        <View style={{ flexDirection: "row", gap: 5, alignItems: "center", justifyContent: "space-between" }}>
          <MyInput
            style={{ flex: 1 }}
            label="Barcode"
            value={bcode}
            onValueChange={(t) => setBcode(t)}
            required
            showError
            isSubmitted={submitted}
            inputMode="numeric"
          />
          <Icon
            name="barcode-scan"
            groupName="MaterialCommunityIcons"
            style={{ alignSelf: "center", marginTop: 15 }}
            size={40}
            onPress={() => setShowBarcodeReader(true)}
          />
        </View>
        <View style={{ flexDirection: "row", gap: 5 }}>
          <PrimaryButton title={"Cancel"} style={{ flex: 0.5 }} onPress={hide} />
          <PrimaryButton title={"Save"} darkMode style={{ flex: 0.5 }} onPress={save} loading={loading} />
        </View>
      </View>
    </Modal>
  );
};

export default NewPdtModal;
