import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";

const shareFile = async (fileUri) => {
  try {
    // Share the file
    if (fileUri && (await Sharing.isAvailableAsync())) {
      await Sharing.shareAsync(fileUri);
    } else {
      Alert.alert("Error", "Sharing is not available on this device.");
    }
  } catch (error) {
    Alert.alert(
      "Error",
      `An error occurred while sharing the file: ${error.message}`
    );
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
    Alert.alert(
      "Error",
      `An error occurred while creating the Excel file: ${error.message}`
    );
    console.error(error);
  }
};

export const generatePDF = async () => {
  try {
    // HTML content for the PDF
    const fileName = "sample_data.pdf";
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    const html = `
        <html>
          <body>
            <h1>Sample PDF</h1>
            <p>This is a sample PDF document created using Expo Print.</p>
          </body>
        </html>
      `;

    // Create the PDF file
    const { uri } = await Print.printToFileAsync({ html });

    // Save the PDF file to the file system
    await FileSystem.copyAsync({
      from: uri,
      to: filePath,
    });

    // Request permission to access media library
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Permission to access media library is required."
      );
      return;
    }

    // Save the file to the media library
    const asset = await MediaLibrary.createAssetAsync(filePath);
    await MediaLibrary.createAlbumAsync("Documents", asset, false);

    // Show success alert with share option
    Alert.alert("Success", "PDF file has been created and saved.", [
      {
        text: "Share",
        onPress: () => shareFile(filePath),
      },
      { text: "OK" },
    ]);
  } catch (error) {
    Alert.alert(
      "Error",
      `An error occurred while creating the PDF file: ${error.message}`
    );
    console.error(error);
  }
};
