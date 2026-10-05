import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Directory, File, Paths } from 'expo-file-system';
import { useState } from 'react';

const FileSystemComponent = () => {
  const [mathsData, setMathsData] = useState(null);

  const handleFileSystem = async () => {
    try {
      const syllabusDir = new Directory(Paths.document, "Syllabus");
      if (!syllabusDir) {
        await syllabusDir.create({ idempotent: true });
      }

      const mathsFile = new File(syllabusDir, "maths.txt");
      if (!mathsFile) {
        await mathsFile.create({ idempotent: true });
      }

      const mathsSyllabus = {
        "Fundamental_Maths": ["Number System", "Simplification", "Decimals & Fractions", "HCF & LCM"],
        "Core_Arithmetic": ["Percentage", "Profit, Loss & Discount", "Ratio & Proportion", "Average", "Simple & Compound Interest"],
        "Commercial_&_Applied": ["Time & Work", "Time, Speed & Distance", "Partnership", "Mixture & Alligation"],
        "Advanced_&_Analysis": ["Mensuration (2D/3D)", "Data Interpretation (Tables/Graphs)"]
      };

      const mathsJson = JSON.stringify(mathsSyllabus);
      await mathsFile.write(mathsJson);
      console.log("File written successfully!");
    } catch (error) {
      console.error("File system write error:", error);
    }
  };

  const handleGetData = async () => {
    try {
      const syllabusDir = new Directory(Paths.document, "Syllabus");

      const mathsFile = new File(syllabusDir, "maths.txt");

      const mathsRes = await mathsFile.text();
      console.log("File Contents:", mathsRes);

      setMathsData(mathsRes);
    } catch (error) {
      console.error("File system read error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>File System</Text>

      <Pressable style={styles.button} onPress={handleFileSystem}>
        <Text style={styles.buttonText}>Write</Text>
      </Pressable>

      <Pressable style={[styles.button, { marginTop: 12 }]} onPress={handleGetData}>
        <Text style={styles.buttonText}>Read</Text>
      </Pressable>

      {mathsData && (
        <Text style={{ color: '#F8FAFC', marginTop: 20, paddingHorizontal: 16 }}>
          {mathsData}
        </Text>
      )}
    </View>
  );
};

export default FileSystemComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  button: {
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    width: 150,
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
