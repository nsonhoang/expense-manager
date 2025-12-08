import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.text}>{children}</Text>
  </View>
);


const TopBar = () => (
  <View style={styles.topBar}>
    <TouchableOpacity onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={26} color="#333" />
    </TouchableOpacity>

    <Text style={styles.screenTitle}>Thông tin ứng dụng</Text>

    {/* Placeholder để cân giữa title */}
    <View style={{ width: 26 }} />
  </View>
);

export default function AppInfoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <TopBar />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Section title="Giới thiệu">
          Ứng dụng quản lý chi tiêu giúp bạn kiểm soát tài chính cá nhân một cách thông minh,
          trực quan và hiệu quả. Theo dõi thu chi, xem báo cáo, phân tích thói quen tiêu dùng
          và tối ưu dòng tiền của bạn mỗi ngày.
        </Section>

        <Section title="Tính năng chính">
          • Ghi chép thu – chi theo danh mục{"\n"}
          • Báo cáo trực quan bằng biểu đồ{"\n"}
          • Bộ lọc theo tháng, năm, hoặc toàn kỳ{"\n"}
          • Theo dõi tỷ lệ chi tiêu từng danh mục{"\n"}
          • Đồng bộ dữ liệu (tùy phiên bản)
        </Section>

        <Section title="Phiên bản">Expense Manager – v1.0.0</Section>

        <Section title="Nhà phát triển">
          2 anh em siu nhân{"\n"}
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 10 },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    marginBottom: 10,
  },

  screenTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },

  section: {
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
    color: "#222",
  },

  text: {
    fontSize: 15,
    marginTop: 20,
    lineHeight: 22,
    color: "#444",
  },
});
