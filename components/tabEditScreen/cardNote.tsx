import { TextSize } from "@/constants/GlobalValue";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface CardNoteProps {
  note: string;
  updateNote: (note: string) => void;
}

function CardNote({ note, updateNote }: CardNoteProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ghi chú</Text>
      <TextInput
        style={styles.input}
        placeholder="Thêm ghi chú"
        placeholderTextColor="#999"  
        value={note}
        onChangeText={updateNote}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    paddingBottom: 15,
    borderColor: "#e8e8e8",
  },
  label: {
    width: 70, // Cố định chiều rộng nhãn để thẳng hàng
    fontSize: TextSize.TEXT_DEFAULT || 16,
    color: "#555",
    fontWeight: "500",
  },
  input: {
    flex: 1,
    fontSize: TextSize.TEXT_DEFAULT,
    backgroundColor: "#e0f7fa",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
});

export default CardNote;
