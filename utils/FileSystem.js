import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
import * as Sharing from "expo-sharing";

const shareFile = async (fileUri) => {
  try {
    // Share the file
    if (fileUri && (await Sharing.isAvailableAsync())) {
      await Sharing.shareAsync(fileUri);
    } else {
      Alert.alert("Error", "Sharing is not available on this device.");
    }
  } catch (error) {
    Alert.alert("Error", `An error occurred while sharing the file: ${error.message}`);
    console.error(error);
  }
};

export const saveExcelSheet = async (sheetName = "ProductList", data) => {
  try {
    console.log("Creating sheet");
    // Create a workbook and a worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Write the workbook to a file
    const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
    const fileName = `${sheetName}.xlsx`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    // Save the file
    await FileSystem.writeAsStringAsync(filePath, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await shareFile(filePath);

    console.log("sheet created", filePath);
  } catch (error) {
    Alert.alert("Error", `An error occurred while creating the Excel file: ${error.message}`);
    console.error(error);
  }
};
